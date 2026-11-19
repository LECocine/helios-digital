// Genera el link de pago del saldo (50% restante) y se lo envía al cliente por correo.
// Uso:  npm run saldo -- H-XXXXXXXX [--sin-correo] [--regenerar]
//   --sin-correo   solo muestra el link (por ejemplo para mandarlo tú por WhatsApp)
//   --regenerar    crea un link nuevo en vez de reutilizar el anterior
// Necesita ADMIN_TOKEN: en .dev.vars (archivo local, no se sube a git) o como variable de entorno.
import { readFileSync } from 'node:fs'

const [id, ...banderas] = process.argv.slice(2)
if (!id || id.startsWith('--')) {
  console.error('Uso: npm run saldo -- H-XXXXXXXX [--sin-correo] [--regenerar]')
  process.exit(1)
}

function leerToken() {
  if (process.env.ADMIN_TOKEN) return process.env.ADMIN_TOKEN
  try {
    const m = readFileSync('.dev.vars', 'utf8').match(/^ADMIN_TOKEN=(.+)$/m)
    return m?.[1]?.trim().replace(/^["']|["']$/g, '') || null
  } catch {
    return null
  }
}

const token = leerToken()
if (!token) {
  console.error('Falta ADMIN_TOKEN. Agrega una línea ADMIN_TOKEN=... en el archivo .dev.vars (el mismo valor que guardaste en Cloudflare).')
  process.exit(1)
}

const sitio = (process.env.SITE_URL || 'https://helioswebs.site').replace(/\/+$/, '')
const res = await fetch(`${sitio}/api/admin/saldo`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({
    pedido: id,
    enviarCorreo: !banderas.includes('--sin-correo'),
    regenerar: banderas.includes('--regenerar'),
  }),
})
const data = await res.json().catch(() => ({}))
if (!res.ok) {
  console.error(`Error ${res.status}: ${data.error ?? 'respuesta inesperada'}`)
  process.exit(1)
}

console.log(`Pedido ${data.pedido} · ${data.cliente} · saldo $${data.saldo.toLocaleString('es-CL')}`)
console.log(data.reutilizado ? 'Se reutilizó el link que ya existía.' : 'Link nuevo creado.')
console.log(
  banderas.includes('--sin-correo')
    ? 'No se envió correo (--sin-correo).'
    : data.correoEnviado
      ? `Correo enviado a ${data.correo}.`
      : `El correo NO se pudo enviar a ${data.correo}. Revisa Resend y manda el link tú.`,
)
console.log(`Link: ${data.link}`)
