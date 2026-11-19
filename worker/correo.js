// Plantillas de los correos del checkout (se envían con Resend).
// Para cambiar textos o colores edita este archivo. Vista previa sin pagar: npm run preview:correo
// Está hecho con tablas y estilos en línea porque Gmail y Outlook ignoran casi todo el CSS moderno.
import { NEGOCIO, LEGAL, clp } from '../src/data.js'

const C = {
  arena: '#F6EEE3',
  crema: '#FFF9F1',
  borde: '#E6D3BA',
  noche: '#241510',
  tierra: '#2A1A12',
  cafe: '#5E4637',
  terracota: '#B8492A',
  sol: '#E8A33D',
  humo: '#CDB59C',
}
const FUENTE = "'Helvetica Neue',Helvetica,Arial,sans-serif"

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch])
}

// Teléfono chileno -> formato wa.me (56912345678)
export function telefonoWa(tel) {
  const d = String(tel ?? '').replace(/\D/g, '')
  if (d.startsWith('56')) return d
  if (d.length === 9) return `56${d}`
  return d
}

const wa = (numero, mensaje) => `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`

function marco({ preheader, titulo, contenido }) {
  return `<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(titulo)}</title>
</head>
<body style="margin:0;padding:0;background:${C.arena};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.arena};">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.arena}" style="background:${C.arena};">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td bgcolor="${C.noche}" style="background:${C.noche};border-radius:20px 20px 0 0;padding:22px 32px;font-family:${FUENTE};">
        <span style="font-size:22px;font-weight:700;letter-spacing:-0.3px;color:${C.crema};"><span style="color:${C.sol};">&#9679;</span>&nbsp;${esc(NEGOCIO.marca)}</span>
      </td></tr>
      <tr><td bgcolor="${C.crema}" style="background:${C.crema};border:1px solid ${C.borde};border-top:0;border-radius:0 0 20px 20px;padding:32px;font-family:${FUENTE};color:${C.tierra};font-size:16px;line-height:1.55;">
        ${contenido}
      </td></tr>
      <tr><td style="padding:20px 32px;font-family:${FUENTE};font-size:12px;line-height:1.5;color:${C.cafe};text-align:center;">
        ${esc(LEGAL.razonSocial)} · RUT ${esc(LEGAL.rut)}<br>
        ${esc(LEGAL.domicilio)}, ${esc(LEGAL.comuna)}<br>
        ${esc(NEGOCIO.correo)} · ${esc(NEGOCIO.whatsappVisible)}
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}

function filas(pares) {
  return pares
    .filter(Boolean)
    .map(
      ([k, v, destacar]) => `<tr>
        <td style="padding:10px 12px 10px 0;border-bottom:1px solid ${C.borde};font-size:14px;color:${C.cafe};vertical-align:top;">${esc(k)}</td>
        <td align="right" style="padding:10px 0;border-bottom:1px solid ${C.borde};font-size:${destacar ? '18px' : '15px'};font-weight:${destacar ? '700' : '600'};color:${C.tierra};">${esc(v)}</td>
      </tr>`,
    )
    .join('')
}

function boton(href, texto) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 0;"><tr>
    <td bgcolor="${C.terracota}" style="background:${C.terracota};border-radius:999px;">
      <a href="${esc(href)}" style="display:inline-block;padding:14px 28px;font-family:${FUENTE};font-size:16px;font-weight:700;color:#FFFFFF;text-decoration:none;">${esc(texto)}</a>
    </td></tr></table>`
}

function paso(n, texto) {
  return `<tr>
    <td width="40" valign="top" style="padding:0 0 14px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="28" height="28" align="center" bgcolor="${C.sol}" style="background:${C.sol};border-radius:14px;font-family:${FUENTE};font-size:14px;font-weight:700;color:${C.noche};">${n}</td>
    </tr></table></td>
    <td valign="top" style="padding:3px 0 14px;font-size:15px;color:${C.tierra};">${texto}</td>
  </tr>`
}

function detalle(p) {
  const esTarjeta = p.plan_id === 'tarjeta'
  return [
    ['Pedido', p.id],
    ['Producto', `${p.plan_nombre}${p.cantidad > 1 ? ` x${p.cantidad}` : ''}`],
    !esTarjeta && ['Mantención anual', p.mantencion > 0 ? `${clp(p.mantencion)} (primer año)` : 'No incluida'],
    !esTarjeta && ['Dominio', '$0'],
    ['Modalidad', p.modalidad === 'anticipo' ? 'Anticipo 50%' : 'Pago total'],
    ['Total del proyecto', `${clp(p.total)} IVA incluido`],
    p.saldo > 0 && ['Saldo contra entrega', clp(p.saldo)],
    p.rut && ['RUT para factura', p.rut],
    ['N° de pago Mercado Pago', p.mp_payment_id],
    ['Pagado hoy', clp(p.monto_hoy), true],
  ]
}

// ---------- Correo al cliente ----------
export function correoCliente(p) {
  const esTarjeta = p.plan_id === 'tarjeta'
  const nombre = p.nombre.split(' ')[0]
  const asunto = `Pago confirmado · Pedido ${p.id} · ${NEGOCIO.marca}`

  const material = esTarjeta
    ? 'los datos que irán en tu tarjeta (nombre, cargo, teléfono, correo y redes) y tu logo'
    : 'tu logo, textos, fotos y datos de contacto'
  const extraLanding =
    p.plan_id === 'landing' ? ' Tu plan incluye la tarjeta NFC con tu página personal, así que también te pediremos esos datos.' : ''
  const plazo = esTarjeta
    ? 'El plazo depende de la impresión y el despacho de las tarjetas. Te avisamos la fecha apenas la tengamos.'
    : 'Entregamos en 48 a 72 horas hábiles desde que recibimos todo el material.'
  const saldo = p.saldo > 0 ? `El saldo de <strong>${esc(clp(p.saldo))}</strong> se paga contra entrega, cuando tu proyecto esté listo.` : 'No tienes saldo pendiente.'

  const html = marco({
    titulo: asunto,
    preheader: `Recibimos tu pago de ${clp(p.monto_hoy)}. Estos son los siguientes pasos.`,
    contenido: `
      <h1 style="margin:0 0 12px;font-size:26px;line-height:1.2;letter-spacing:-0.4px;color:${C.tierra};">¡Gracias, ${esc(nombre)}! Recibimos tu pago.</h1>
      <p style="margin:0 0 24px;color:${C.cafe};">Tu pedido en ${esc(NEGOCIO.marca)} quedó confirmado. Aquí está el resumen.</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">${filas(detalle(p))}</table>

      <h2 style="margin:0 0 14px;font-size:18px;color:${C.tierra};">Qué sigue</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px;">
        ${paso(1, `Te escribiremos por WhatsApp para pedirte ${material}.${esc(extraLanding)}`)}
        ${paso(2, esc(plazo))}
        ${paso(3, saldo)}
      </table>

      <p style="margin:12px 0 4px;color:${C.cafe};">¿Tienes dudas o quieres enviarnos el material ahora?</p>
      ${boton(wa(NEGOCIO.whatsapp, `Hola, soy ${p.nombre}. Mi pedido es ${p.id}.`), 'Escribirnos por WhatsApp')}

      <p style="margin:28px 0 0;font-size:13px;color:${C.cafe};">Por este pago emitiremos el documento tributario electrónico que corresponda. También puedes responder este correo.</p>`,
  })

  const text = [
    `¡Gracias, ${nombre}! Recibimos tu pago.`,
    '',
    ...detalle(p).filter(Boolean).map(([k, v]) => `${k}: ${v}`),
    '',
    'Qué sigue:',
    `1. Te escribiremos por WhatsApp para pedirte ${material}.${extraLanding}`,
    `2. ${plazo}`,
    `3. ${p.saldo > 0 ? `El saldo de ${clp(p.saldo)} se paga contra entrega.` : 'No tienes saldo pendiente.'}`,
    '',
    `¿Dudas? WhatsApp ${NEGOCIO.whatsappVisible} o responde este correo.`,
    '',
    `${LEGAL.razonSocial} · RUT ${LEGAL.rut}`,
  ].join('\n')

  return { asunto, html, text }
}

// ---------- Aviso interno (a ti) ----------
export function correoAdmin(p) {
  const asunto = `Nuevo pago ${p.id}: ${p.plan_nombre} ${clp(p.monto_hoy)}`
  const cliente = [
    ['Cliente', p.nombre],
    ['Correo', p.correo],
    ['Teléfono', p.telefono],
    ['Empresa', p.empresa || '-'],
    ['RUT', p.rut || '-'],
  ]
  const html = marco({
    titulo: asunto,
    preheader: `${p.nombre} pagó ${clp(p.monto_hoy)} por ${p.plan_nombre}.`,
    contenido: `
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${C.terracota};">Nuevo pago</p>
      <h1 style="margin:0 0 20px;font-size:26px;line-height:1.2;letter-spacing:-0.4px;color:${C.tierra};">${esc(clp(p.monto_hoy))} · ${esc(p.plan_nombre)}</h1>

      <h2 style="margin:0 0 6px;font-size:16px;color:${C.tierra};">Cliente</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">${filas(cliente)}</table>

      <h2 style="margin:0 0 6px;font-size:16px;color:${C.tierra};">Pedido</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">${filas(detalle(p))}</table>

      ${boton(wa(telefonoWa(p.telefono), `Hola ${p.nombre.split(' ')[0]}, te escribo de ${NEGOCIO.marca} por tu pedido ${p.id}. ¡Gracias por tu pago!`), 'Escribirle por WhatsApp')}`,
  })
  const text = [
    `Nuevo pago ${p.id}: ${p.plan_nombre} ${clp(p.monto_hoy)}`,
    '',
    ...cliente.map(([k, v]) => `${k}: ${v}`),
    '',
    ...detalle(p).filter(Boolean).map(([k, v]) => `${k}: ${v}`),
  ].join('\n')
  return { asunto, html, text }
}

// ---------- Cobro del saldo (50% restante) ----------
function detalleSaldo(p, pagado) {
  return [
    ['Pedido', p.id],
    ['Producto', `${p.plan_nombre}${p.cantidad > 1 ? ` x${p.cantidad}` : ''}`],
    ['Total del proyecto', `${clp(p.total)} IVA incluido`],
    ['Ya pagado', clp(p.monto_hoy)],
    pagado && p.saldo_payment_id && ['N° de pago Mercado Pago', p.saldo_payment_id],
    [pagado ? 'Saldo pagado hoy' : 'Saldo a pagar', clp(p.saldo), true],
  ]
}

// Link de pago del saldo, para el cliente
export function correoSaldoLink(p) {
  const nombre = p.nombre.split(' ')[0]
  const asunto = `Saldo de ${clp(p.saldo)} · Pedido ${p.id} · ${NEGOCIO.marca}`
  const html = marco({
    titulo: asunto,
    preheader: `Tu proyecto está listo. Paga el saldo de ${clp(p.saldo)} para coordinar la entrega.`,
    contenido: `
      <h1 style="margin:0 0 12px;font-size:26px;line-height:1.2;letter-spacing:-0.4px;color:${C.tierra};">${esc(nombre)}, tu proyecto está listo</h1>
      <p style="margin:0 0 24px;color:${C.cafe};">Para coordinar la entrega, paga el saldo (el 50% restante). Es un pago seguro con Mercado Pago.</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">${filas(detalleSaldo(p, false))}</table>

      ${boton(p.saldo_link, `Pagar ${clp(p.saldo)} con Mercado Pago`)}

      <p style="margin:24px 0 0;font-size:14px;color:${C.cafe};">Apenas se confirme el pago coordinamos la entrega. Si prefieres pagar por transferencia, <a href="${esc(wa(NEGOCIO.whatsapp, `Hola, soy ${p.nombre}. Quiero pagar el saldo del pedido ${p.id} por transferencia.`))}" style="color:${C.terracota};font-weight:700;">escríbenos por WhatsApp</a>.</p>`,
  })
  const text = [
    `${nombre}, tu proyecto está listo.`,
    '',
    'Para coordinar la entrega, paga el saldo (el 50% restante):',
    ...detalleSaldo(p, false).filter(Boolean).map(([k, v]) => `${k}: ${v}`),
    '',
    `Pagar con Mercado Pago: ${p.saldo_link}`,
    '',
    `¿Prefieres transferencia? WhatsApp ${NEGOCIO.whatsappVisible} o responde este correo.`,
    '',
    `${LEGAL.razonSocial} · RUT ${LEGAL.rut}`,
  ].join('\n')
  return { asunto, html, text }
}

// Confirmación del saldo, para el cliente
export function correoSaldoPagado(p) {
  const nombre = p.nombre.split(' ')[0]
  const asunto = `Saldo pagado · Pedido ${p.id} · ${NEGOCIO.marca}`
  const html = marco({
    titulo: asunto,
    preheader: `Recibimos el saldo de ${clp(p.saldo)}. Tu proyecto está pagado por completo.`,
    contenido: `
      <h1 style="margin:0 0 12px;font-size:26px;line-height:1.2;letter-spacing:-0.4px;color:${C.tierra};">¡Gracias, ${esc(nombre)}! Recibimos el saldo.</h1>
      <p style="margin:0 0 24px;color:${C.cafe};">Tu proyecto quedó pagado por completo. Te contactamos por WhatsApp para coordinar la entrega.</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">${filas(detalleSaldo(p, true))}</table>

      ${boton(wa(NEGOCIO.whatsapp, `Hola, soy ${p.nombre}. Mi pedido es ${p.id}.`), 'Escribirnos por WhatsApp')}

      <p style="margin:28px 0 0;font-size:13px;color:${C.cafe};">Por este pago emitiremos el documento tributario electrónico que corresponda. También puedes responder este correo.</p>`,
  })
  const text = [
    `¡Gracias, ${nombre}! Recibimos el saldo.`,
    '',
    ...detalleSaldo(p, true).filter(Boolean).map(([k, v]) => `${k}: ${v}`),
    '',
    'Tu proyecto quedó pagado por completo. Te contactamos por WhatsApp para coordinar la entrega.',
    `¿Dudas? WhatsApp ${NEGOCIO.whatsappVisible} o responde este correo.`,
    '',
    `${LEGAL.razonSocial} · RUT ${LEGAL.rut}`,
  ].join('\n')
  return { asunto, html, text }
}

// Aviso interno: el saldo se pagó
export function correoAdminSaldo(p) {
  const asunto = `Saldo pagado ${p.id}: ${clp(p.saldo)} (${p.plan_nombre})`
  const cliente = [
    ['Cliente', p.nombre],
    ['Correo', p.correo],
    ['Teléfono', p.telefono],
    ['Empresa', p.empresa || '-'],
    ['RUT', p.rut || '-'],
  ]
  const html = marco({
    titulo: asunto,
    preheader: `${p.nombre} pagó el saldo de ${clp(p.saldo)}. Ya puedes entregar.`,
    contenido: `
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${C.terracota};">Saldo pagado</p>
      <h1 style="margin:0 0 20px;font-size:26px;line-height:1.2;letter-spacing:-0.4px;color:${C.tierra};">${esc(clp(p.saldo))} · ${esc(p.plan_nombre)}</h1>

      <h2 style="margin:0 0 6px;font-size:16px;color:${C.tierra};">Cliente</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">${filas(cliente)}</table>

      <h2 style="margin:0 0 6px;font-size:16px;color:${C.tierra};">Pedido</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">${filas(detalleSaldo(p, true))}</table>

      ${boton(wa(telefonoWa(p.telefono), `Hola ${p.nombre.split(' ')[0]}, te escribo de ${NEGOCIO.marca}: recibimos el saldo de tu pedido ${p.id}. Coordinemos la entrega.`), 'Escribirle por WhatsApp')}`,
  })
  const text = [
    `Saldo pagado ${p.id}: ${clp(p.saldo)} (${p.plan_nombre})`,
    '',
    ...cliente.map(([k, v]) => `${k}: ${v}`),
    '',
    ...detalleSaldo(p, true).filter(Boolean).map(([k, v]) => `${k}: ${v}`),
  ].join('\n')
  return { asunto, html, text }
}
