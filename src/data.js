// Datos del negocio: edita aquí número, correo y precios.
export const NEGOCIO = {
  marca: 'Helios Digital',
  razonSocial: 'Servicios Helios SpA',
  ciudad: 'Calama',
  // Número en formato internacional sin "+" ni espacios. Ej: 56912345678
  whatsapp: '56942084242',
  whatsappVisible: '+56 9 4208 4242',
  correo: 'contacto@helioswebs.site',
  dominio: 'helioswebs.site',
}

// Datos legales (SII). Completa estos campos: si quedan vacíos, no se muestran en la web.
export const LEGAL = {
  razonSocial: 'Servicios Helios SpA',
  rut: '77.988.388-4',
  giro: 'Actividades de programación informática',
  domicilio: 'Eleuterio Ramírez 2116, piso 2, oficina 2, Centro',
  comuna: 'Calama',
  region: 'Región de Antofagasta',
  // Fecha de la última actualización de términos y privacidad
  actualizado: '18 de noviembre de 2026',
}

// Precios publicados en CLP con IVA incluido (19%).
export const IVA = 0.19
export const desgloseIVA = (total) => {
  const neto = Math.round(total / (1 + IVA))
  return { neto, iva: total - neto, total }
}

export const waLink = (mensaje) =>
  `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(mensaje)}`

export const clp = (n) => `$${n.toLocaleString('es-CL')}`

export const PLANES = [
  {
    id: 'tarjeta',
    nombre: 'Tarjeta Ejecutiva NFC',
    precio: 65000,
    unidad: 'por tarjeta',
    nota: 'Incluida en la Landing Express',
    descripcion: 'Tarjeta física con NFC y QR, perfil digital y botón para guardar contacto.',
    incluye: ['Chip NFC + código QR', 'Perfil digital con tus datos', 'Botón “Guardar contacto”', 'Diseño con tu marca'],
    destacado: false,
    mensaje: 'Hola, quiero cotizar tarjetas ejecutivas NFC para mi equipo.',
  },
  {
    id: 'landing',
    nombre: 'Landing Express',
    precio: 350000,
    unidad: 'pago único',
    nota: 'Lista en 48 a 72 horas',
    descripcion: 'Sitio de una página pensado para que te contacten, impecable en el celular.',
    incluye: [
      'Tarjeta NFC + página personal del dueño',
      'Adaptada a celular',
      'Botones a WhatsApp con mensaje listo',
      'Google Maps integrado',
      'SEO local básico',
      'Hosting sin costo y SSL',
      'Dominio: $0',
    ],
    destacado: true,
    mensaje: 'Hola, me interesa el plan Landing Express de $350.000.',
  },
  {
    id: 'corporativa',
    nombre: 'Web Corporativa + Cotizador',
    precio: 490000,
    unidad: 'pago único',
    nota: 'Todo lo de Landing Express, más:',
    descripcion: 'Para empresas que necesitan recibir cotizaciones ordenadas y verse sólidas.',
    incluye: [
      'Cotizador interactivo por servicio',
      'Descarga de brochure en PDF',
      'Correos corporativos configurados',
      'Formulario de contacto',
    ],
    destacado: false,
    mensaje: 'Hola, me interesa el plan Web Corporativa + Cotizador de $490.000.',
  },
]

// ---------- Checkout (Mercado Pago) ----------
// Este cálculo lo usa la web y también el servidor (worker/index.js):
// el monto que se cobra siempre se recalcula en el servidor.
export const MANTENCION_ANUAL = 20000
export const DOMINIO = 0
export const MAX_TARJETAS = 50

export function calcularPedido({ planId, cantidad = 1, mantencion = false, modalidad = 'anticipo' }) {
  const plan = PLANES.find((p) => p.id === planId)
  if (!plan) return null
  const esTarjeta = plan.id === 'tarjeta'
  const cant = esTarjeta ? Math.min(Math.max(parseInt(cantidad, 10) || 1, 1), MAX_TARJETAS) : 1
  const subtotal = plan.precio * cant
  // La mantención anual solo aplica a sitios web (no a tarjetas sueltas)
  const mant = mantencion && !esTarjeta ? MANTENCION_ANUAL : 0
  const esAnticipo = modalidad !== 'total'
  // El 50% aplica al proyecto; la mantención del primer año se paga completa
  const proyectoHoy = esAnticipo ? Math.round(subtotal / 2) : subtotal
  const total = subtotal + mant + DOMINIO
  const hoy = proyectoHoy + mant
  return {
    plan,
    cantidad: cant,
    subtotal,
    mantencion: mant,
    dominio: DOMINIO,
    modalidad: esAnticipo ? 'anticipo' : 'total',
    proyectoHoy,
    total,
    hoy,
    saldo: total - hoy,
  }
}
