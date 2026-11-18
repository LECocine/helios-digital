import { Layers, FlaskConical, HardHat, Truck } from 'lucide-react'
import { waLink } from '../data'
import { SectionHeading } from './SectionHeading'

// Productos de ejemplo con guiño a la industria de la Región de Antofagasta.
const DEMO = [
  {
    nombre: 'Cátodo de cobre grado A',
    detalle: 'Pureza 99,99% Cu',
    precio: 'Precio ref. LME / ton',
    Icon: Layers,
    fondo: 'bg-[#B87333]',
    icono: 'text-[#FBE3CC]',
  },
  {
    nombre: 'Carbonato de litio',
    detalle: 'Grado batería · Salar de Atacama',
    precio: 'Cotizar por tonelada',
    Icon: FlaskConical,
    fondo: 'bg-[#E9E4DA]',
    icono: 'text-[#5E4637]',
  },
  {
    nombre: 'Kit EPP para faena',
    detalle: 'Casco, lentes, guantes y chaleco',
    precio: '$49.990',
    Icon: HardHat,
    fondo: 'bg-sol',
    icono: 'text-noche',
  },
  {
    nombre: 'Arriendo camioneta 4x4',
    detalle: 'Equipada para faena minera',
    precio: '$89.000 / día',
    Icon: Truck,
    fondo: 'bg-oxido',
    icono: 'text-[#FBE3CC]',
  },
]

const PASOS = [
  'Tu cliente revisa el catálogo y elige productos.',
  'Toca “Enviar pedido” y se abre WhatsApp con el detalle listo.',
  'Tú confirmas, cobras y despachas como siempre.',
]

export default function Catalogo() {
  return (
    <section id="catalogo" className="mx-auto grid max-w-[1240px] scroll-mt-20 items-center gap-12 px-4 py-20 sm:px-6 md:py-24 lg:grid-cols-2 lg:gap-14">
      <div className="order-2 flex flex-col gap-3.5 rounded-[28px] bg-duna p-5 sm:p-8 lg:order-1" aria-label="Ejemplo de catálogo">
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-lg font-semibold">Proveedor Industrial Antofagasta</p>
          <span className="rounded-full bg-crema px-3 py-1 text-xs font-medium text-cafe">Ejemplo</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
          {DEMO.map(({ nombre, detalle, precio, Icon, fondo, icono }) => (
            <div key={nombre} className="flex flex-col gap-1.5 rounded-2xl bg-crema p-3">
              <div className={`mb-1 flex h-24 items-center justify-center rounded-[10px] ${fondo}`} aria-hidden="true">
                <Icon size={36} strokeWidth={1.6} className={icono} />
              </div>
              <span className="text-sm leading-snug font-semibold">{nombre}</span>
              <span className="text-xs leading-snug text-cafe">{detalle}</span>
              <span className="mt-auto pt-1 text-[13px] font-semibold text-terracota-osc">{precio}</span>
            </div>
          ))}
        </div>
        <span className="rounded-full bg-whatsapp p-3.5 text-center font-semibold text-white">Enviar pedido por WhatsApp</span>
      </div>

      <div className="order-1 flex flex-col gap-5 lg:order-2">
        <SectionHeading
          eyebrow="Catálogo + WhatsApp"
          titulo="Vende desde tu página, atiende desde tu celular."
          bajada="Del cátodo de cobre al arriendo de camionetas: tu catálogo vive en una página liviana y el pedido te llega armado al WhatsApp. Sin plataformas complicadas ni mensualidades de servidor."
        />
        <ol className="flex flex-col gap-3.5">
          {PASOS.map((p, i) => (
            <li key={p} className="flex items-baseline gap-3.5">
              <span className="font-display font-bold text-terracota">{i + 1}</span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
        <a
          href={waLink('Hola, quiero un catálogo con pedidos por WhatsApp para mi negocio.')}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start rounded-full border-[1.5px] border-tierra px-6 py-3.5 font-semibold text-tierra hover:bg-duna"
        >
          Cotizar mi catálogo
        </a>
      </div>
    </section>
  )
}
