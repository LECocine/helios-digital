// Genera una vista previa de los correos en .preview/ (no envía nada). Uso: npm run preview:correo
import { mkdirSync, writeFileSync } from 'node:fs'
import { correoCliente, correoAdmin, correoSaldoLink, correoSaldoPagado, correoAdminSaldo } from './correo.js'

const base = {
  id: 'H-EJEMPLO1', plan_id: 'landing', plan_nombre: 'Landing Express', cantidad: 1, mantencion: 20000,
  modalidad: 'anticipo', total: 370000, monto_hoy: 195000, saldo: 175000,
  nombre: 'Juan Pérez', correo: 'juan@ejemplo.cl', telefono: '+56 9 1234 5678', empresa: 'Taller Juan', rut: '12.345.678-9',
  mp_payment_id: '189463774087',
}
const casos = {
  'cliente-landing': correoCliente(base),
  'cliente-tarjetas': correoCliente({ ...base, plan_id: 'tarjeta', plan_nombre: 'Tarjeta Ejecutiva NFC', cantidad: 3, mantencion: 0, modalidad: 'total', total: 195000, monto_hoy: 195000, saldo: 0 }),
  // Otro cliente con otros montos, para comprobar que nombre y valores cambian solos
  'cliente-corporativa-total': correoCliente({
    ...base, id: 'H-EJEMPLO2', plan_id: 'corporativa', plan_nombre: 'Web Corporativa + Cotizador', mantencion: 0,
    modalidad: 'total', total: 490000, monto_hoy: 490000, saldo: 0, nombre: 'María Soto', rut: '', mp_payment_id: '189500000001',
  }),
  admin: correoAdmin(base),
  'saldo-link': correoSaldoLink({ ...base, saldo_link: 'https://www.mercadopago.cl/checkout/v1/redirect?pref_id=EJEMPLO' }),
  'saldo-pagado': correoSaldoPagado({ ...base, saldo_payment_id: '189500000777' }),
  'saldo-admin': correoAdminSaldo({ ...base, saldo_payment_id: '189500000777' }),
}
mkdirSync('.preview', { recursive: true })
for (const [nombre, c] of Object.entries(casos)) {
  writeFileSync(`.preview/${nombre}.html`, c.html)
  writeFileSync(`.preview/${nombre}.txt`, `Asunto: ${c.asunto}\n\n${c.text}\n`)
  console.log(`.preview/${nombre}.html  ·  ${c.asunto}`)
}
