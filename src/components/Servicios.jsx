import { IdCard, PanelsTopLeft, MessageCircle, ArrowRight } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

const SERVICIOS = [
  {
    n: '01',
    Icon: IdCard,
    titulo: 'Tarjeta ejecutiva con NFC y QR',
    texto:
      'Un perfil digital para cada persona de tu equipo. Se comparte acercando la tarjeta al celular o escaneando el QR, y queda guardado como contacto al tiro.',
    href: '#tarjeta',
    cta: 'Ver la tarjeta',
  },
  {
    n: '02',
    Icon: PanelsTopLeft,
    titulo: 'Landing pages y webs corporativas',
    texto:
      'Una página clara y rápida que explica qué haces y cómo contactarte. Le sumas lo que necesites: Google Maps, cotizador, brochure en PDF y más.',
    href: '#complementos',
    cta: 'Ver complementos',
  },
  {
    n: '03',
    Icon: MessageCircle,
    titulo: 'Catálogo con pedidos por WhatsApp',
    texto:
      'Muestra tus productos con fotos y precios. Tus clientes eligen y el pedido te llega armado al WhatsApp. Sin servidores ni sistemas que mantener.',
    href: '#catalogo',
    cta: 'Cómo funciona',
  },
]

export default function Servicios() {
  return (
    <section id="servicios" className="mx-auto flex max-w-[1240px] scroll-mt-20 flex-col gap-10 px-4 py-16 sm:px-6 md:py-20">
      <SectionHeading eyebrow="Servicios" titulo="Tres formas de llevar tu negocio a internet" />
      <div className="grid gap-5 md:grid-cols-3 md:gap-6">
        {SERVICIOS.map(({ n, Icon, titulo, texto, href, cta }) => (
          <article key={n} className="flex flex-col gap-4 rounded-3xl border border-borde bg-crema p-7 sm:p-8">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-noche">
              <Icon size={26} className="text-sol" aria-hidden="true" />
            </div>
            <p className="text-[13px] font-semibold text-terracota-osc">{n}</p>
            <h3 className="font-display text-2xl leading-tight font-semibold">{titulo}</h3>
            <p className="text-cafe">{texto}</p>
            <a href={href} className="mt-auto inline-flex items-center gap-1.5 py-2 font-semibold text-terracota-osc hover:text-tierra">
              {cta} <ArrowRight size={18} aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
