// Servidor del checkout de Helios Digital (Cloudflare Worker).
// Rutas:
//   POST /api/checkout     crea el pedido en D1 y la preferencia de pago en Mercado Pago
//   POST /api/webhook-mp   aviso de Mercado Pago: confirma el pago, actualiza el pedido y envía correos
//   GET  /api/pedido?id=   estado del pedido para la página de resultado (sin datos personales)
// Todo lo demás lo sirve la web estática (dist/).
import { NEGOCIO, calcularPedido, clp } from '../src/data.js'

const MP_API = 'https://api.mercadopago.com'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    try {
      if (url.pathname === '/api/checkout' && request.method === 'POST') return await crearCheckout(request, env)
      if (url.pathname === '/api/webhook-mp' && request.method === 'POST') return await webhookMP(request, url, env)
      if (url.pathname === '/api/pedido' && request.method === 'GET') return await verPedido(url, env)
      if (url.pathname.startsWith('/api/')) return json({ error: 'No encontrado' }, 404)
    } catch (err) {
      console.error('Error en', url.pathname, err)
      return json({ error: 'Error interno. Escríbenos por WhatsApp y lo resolvemos.' }, 500)
    }
    return env.ASSETS.fetch(request)
  },
}

// ---------- 1. Crear checkout ----------
async function crearCheckout(request, env) {
  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Solicitud inválida' }, 400)
  }

  const c = body.cliente ?? {}
  const cliente = {
    nombre: limpiar(c.nombre, 100),
    correo: limpiar(c.correo, 120).toLowerCase(),
    telefono: limpiar(c.telefono, 20),
    empresa: limpiar(c.empresa, 120),
    rut: limpiar(c.rut, 15),
  }
  if (cliente.nombre.length < 2) return json({ error: 'Ingresa tu nombre.' }, 400)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cliente.correo)) return json({ error: 'Ingresa un correo válido.' }, 400)
  if (cliente.telefono.replace(/\D/g, '').length < 8) return json({ error: 'Ingresa un teléfono válido.' }, 400)
  if (body.aceptaTerminos !== true) return json({ error: 'Debes aceptar los términos y condiciones.' }, 400)

  // El monto SIEMPRE se calcula aquí, nunca se toma del navegador
  const pedido = calcularPedido({
    planId: body.planId,
    cantidad: body.cantidad,
    mantencion: body.mantencion === true,
    modalidad: body.modalidad,
  })
  if (!pedido) return json({ error: 'Plan no válido.' }, 400)

  const id = nuevoId()
  await env.DB.prepare(
    `INSERT INTO pedidos (id, plan_id, plan_nombre, cantidad, mantencion, modalidad, total, monto_hoy, saldo,
       nombre, correo, telefono, empresa, rut, estado)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, 'creado')`,
  )
    .bind(
      id, pedido.plan.id, pedido.plan.nombre, pedido.cantidad, pedido.mantencion, pedido.modalidad,
      pedido.total, pedido.hoy, pedido.saldo,
      cliente.nombre, cliente.correo, cliente.telefono, cliente.empresa || null, cliente.rut || null,
    )
    .run()

  const items = [
    {
      id: pedido.plan.id,
      title: `${pedido.plan.nombre}${pedido.cantidad > 1 ? ` x${pedido.cantidad}` : ''} · ${
        pedido.modalidad === 'anticipo' ? 'Anticipo 50%' : 'Pago total'
      }`,
      quantity: 1,
      currency_id: 'CLP',
      unit_price: pedido.proyectoHoy,
    },
  ]
  if (pedido.mantencion > 0) {
    items.push({
      id: 'mantencion-anual',
      title: 'Mantención anual (primer año)',
      quantity: 1,
      currency_id: 'CLP',
      unit_price: pedido.mantencion,
    })
  }

  const site = env.SITE_URL.replace(/\/+$/, '')
  const res = await fetch(`${MP_API}/checkout/preferences`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.MP_ACCESS_TOKEN}`,
      'X-Idempotency-Key': id,
    },
    body: JSON.stringify({
      items,
      payer: { name: cliente.nombre, email: cliente.correo },
      external_reference: id,
      back_urls: {
        success: `${site}/checkout/resultado`,
        pending: `${site}/checkout/resultado`,
        failure: `${site}/checkout/resultado`,
      },
      auto_return: 'approved',
      notification_url: `${site}/api/webhook-mp?source_news=webhooks`,
      statement_descriptor: 'HELIOS DIGITAL',
      metadata: { pedido_id: id },
    }),
  })
  const pref = await res.json()
  if (!res.ok || !pref.init_point) {
    console.error('Mercado Pago rechazó la preferencia', res.status, JSON.stringify(pref))
    return json({ error: 'No pudimos iniciar el pago. Intenta de nuevo o escríbenos por WhatsApp.' }, 502)
  }

  await env.DB.prepare(`UPDATE pedidos SET mp_preference_id = ?1, actualizado = datetime('now') WHERE id = ?2`)
    .bind(pref.id, id)
    .run()

  return json({ pedido: id, url: pref.init_point })
}

// ---------- 2. Aviso (webhook) de Mercado Pago ----------
async function webhookMP(request, url, env) {
  const cuerpo = await request.json().catch(() => ({}))
  const tipo = url.searchParams.get('type') || cuerpo.type || url.searchParams.get('topic')
  const dataId = url.searchParams.get('data.id') || cuerpo?.data?.id || url.searchParams.get('id')

  // Si Mercado Pago manda firma, se valida. De todas formas el pago se vuelve a consultar
  // a la API de Mercado Pago con nuestro token, así que un aviso falso no puede marcar nada como pagado.
  const firma = request.headers.get('x-signature')
  if (firma && env.MP_WEBHOOK_SECRET) {
    const valida = await firmaValida(firma, request.headers.get('x-request-id'), dataId, env.MP_WEBHOOK_SECRET)
    if (!valida) return json({ error: 'Firma inválida' }, 401)
  }

  if (tipo === 'payment' && dataId) await procesarPago(String(dataId), env)
  // Responder 200 rápido para que Mercado Pago no reintente
  return json({ ok: true })
}

async function procesarPago(paymentId, env) {
  const res = await fetch(`${MP_API}/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${env.MP_ACCESS_TOKEN}` },
  })
  if (!res.ok) {
    console.error('No se pudo leer el pago', paymentId, res.status)
    return null
  }
  const pago = await res.json()
  const pedidoId = pago.external_reference
  if (!pedidoId) return null

  const pedido = await env.DB.prepare('SELECT * FROM pedidos WHERE id = ?1').bind(pedidoId).first()
  if (!pedido) return null

  let estado = {
    approved: 'pagado',
    authorized: 'pendiente',
    pending: 'pendiente',
    in_process: 'pendiente',
    in_mediation: 'pendiente',
    rejected: 'rechazado',
    cancelled: 'rechazado',
    refunded: 'reembolsado',
    charged_back: 'reembolsado',
  }[pago.status] ?? 'pendiente'

  // Control: el monto pagado debe coincidir con lo que calculamos
  if (estado === 'pagado' && Math.round(Number(pago.transaction_amount)) !== pedido.monto_hoy) {
    console.error('Monto no coincide', pedidoId, pago.transaction_amount, pedido.monto_hoy)
    estado = 'revisar'
  }

  // Un pedido ya pagado no vuelve a "pendiente" por un aviso atrasado
  if (pedido.estado === 'pagado' && (estado === 'pendiente' || estado === 'rechazado')) estado = 'pagado'

  await env.DB.prepare(
    `UPDATE pedidos SET estado = ?1, mp_payment_id = ?2, mp_status = ?3, actualizado = datetime('now') WHERE id = ?4`,
  )
    .bind(estado, String(pago.id), pago.status, pedidoId)
    .run()

  if (estado === 'pagado') {
    // Marca el correo como enviado de forma atómica para no mandarlo dos veces
    const marca = await env.DB.prepare('UPDATE pedidos SET correo_enviado = 1 WHERE id = ?1 AND correo_enviado = 0')
      .bind(pedidoId)
      .run()
    if (marca.meta.changes === 1) {
      const ok = await enviarCorreos({ ...pedido, estado, mp_payment_id: String(pago.id) }, env)
      if (!ok) {
        await env.DB.prepare('UPDATE pedidos SET correo_enviado = 0 WHERE id = ?1').bind(pedidoId).run()
      }
    }
  }
  return { pedidoId, estado, pago }
}

// ---------- 3. Estado del pedido para la página de resultado ----------
async function verPedido(url, env) {
  const id = limpiar(url.searchParams.get('id'), 40)
  if (!id) return json({ error: 'Falta el pedido' }, 400)

  // Si vuelve desde Mercado Pago con payment_id, sincronizamos por si el aviso aún no llega
  const paymentId = url.searchParams.get('payment_id')
  if (paymentId && /^\d+$/.test(paymentId)) {
    const r = await procesarPago(paymentId, env)
    if (r && r.pedidoId !== id) return json({ error: 'Pedido no encontrado' }, 404)
  }

  const p = await env.DB.prepare(
    'SELECT id, estado, plan_nombre, cantidad, mantencion, modalidad, total, monto_hoy, saldo FROM pedidos WHERE id = ?1',
  )
    .bind(id)
    .first()
  if (!p) return json({ error: 'Pedido no encontrado' }, 404)
  return json(p)
}

// ---------- Correos (Resend) ----------
async function enviarCorreos(p, env) {
  if (!env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY no configurada: no se envían correos')
    return true
  }
  const filas = [
    ['Pedido', p.id],
    ['Plan', `${p.plan_nombre}${p.cantidad > 1 ? ` x${p.cantidad}` : ''}`],
    ['Mantención anual', p.mantencion > 0 ? clp(p.mantencion) : 'No'],
    ['Dominio', '$0'],
    ['Modalidad', p.modalidad === 'anticipo' ? 'Anticipo 50%' : 'Pago total'],
    ['Pagado hoy', clp(p.monto_hoy)],
    ['Saldo contra entrega', clp(p.saldo)],
    ['Total del proyecto', `${clp(p.total)} (IVA incluido)`],
    ['N° de pago Mercado Pago', p.mp_payment_id],
  ]
  const tabla = filas
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#5E4637">${esc(k)}</td><td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`,
    )
    .join('')

  const htmlCliente = `
  <div style="font-family:Inter,Arial,sans-serif;color:#2A1A12;max-width:560px">
    <h1 style="font-size:22px">¡Gracias, ${esc(p.nombre.split(' ')[0])}! Recibimos tu pago.</h1>
    <p>Tu pedido en ${esc(NEGOCIO.marca)} quedó confirmado. Te escribiremos por WhatsApp para pedirte el material
    (logo, textos, fotos y datos de contacto) y partir. El plazo de 48 a 72 horas hábiles corre desde que lo recibimos.</p>
    <table style="border-collapse:collapse;font-size:15px">${tabla}</table>
    ${p.saldo > 0 ? `<p>El saldo de ${esc(clp(p.saldo))} se paga cuando tu proyecto esté listo.</p>` : ''}
    <p>¿Dudas? Responde este correo o escríbenos al WhatsApp ${esc(NEGOCIO.whatsappVisible)}.</p>
    <p style="color:#5E4637;font-size:13px">${esc(NEGOCIO.razonSocial)} · ${esc(NEGOCIO.dominio)}</p>
  </div>`

  const htmlAdmin = `
  <div style="font-family:Inter,Arial,sans-serif;color:#2A1A12">
    <h1 style="font-size:20px">Nuevo pago: ${esc(p.plan_nombre)} · ${esc(clp(p.monto_hoy))}</h1>
    <table style="border-collapse:collapse;font-size:15px">${tabla}
      <tr><td style="padding:6px 12px 6px 0">Cliente</td><td>${esc(p.nombre)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0">Correo</td><td>${esc(p.correo)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0">Teléfono</td><td>${esc(p.telefono)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0">Empresa</td><td>${esc(p.empresa || '-')}</td></tr>
      <tr><td style="padding:6px 12px 6px 0">RUT</td><td>${esc(p.rut || '-')}</td></tr>
    </table>
  </div>`

  const enviar = (to, subject, html, replyTo) =>
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({ from: env.EMAIL_FROM, to: [to], subject, html, reply_to: replyTo }),
    })

  const [r1, r2] = await Promise.all([
    enviar(p.correo, `Pago confirmado · Pedido ${p.id} · ${NEGOCIO.marca}`, htmlCliente, env.EMAIL_ADMIN),
    enviar(env.EMAIL_ADMIN, `Nuevo pago ${p.id}: ${p.plan_nombre} ${clp(p.monto_hoy)}`, htmlAdmin, p.correo),
  ])
  if (!r1.ok) console.error('Resend (cliente)', r1.status, await r1.text())
  if (!r2.ok) console.error('Resend (admin)', r2.status, await r2.text())
  return r1.ok
}

// ---------- Utilidades ----------
async function firmaValida(xSignature, xRequestId, dataId, secret) {
  const partes = Object.fromEntries(
    xSignature.split(',').map((s) => {
      const [k, ...v] = s.trim().split('=')
      return [k, v.join('=')]
    }),
  )
  if (!partes.ts || !partes.v1) return false
  let manifest = ''
  if (dataId) manifest += `id:${/^[a-z0-9]+$/i.test(dataId) ? String(dataId).toLowerCase() : dataId};`
  if (xRequestId) manifest += `request-id:${xRequestId};`
  manifest += `ts:${partes.ts};`

  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ])
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(manifest))
  const hex = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
  return hex === partes.v1
}

function nuevoId() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return 'H-' + [...bytes].map((b) => abc[b % abc.length]).join('')
}

function limpiar(v, max) {
  return String(v ?? '').trim().slice(0, max)
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch])
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
