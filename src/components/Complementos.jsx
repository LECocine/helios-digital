import { MapPin, MessageCircle, Mail, Calculator, FileDown, AtSign, Search, Images } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

const ITEMS = [
  { Icon: MapPin, t: 'Google Maps', d: 'Tu ubicación con indicaciones para llegar.' },
  { Icon: MessageCircle, t: 'WhatsApp con mensaje listo', d: 'El cliente te escribe en un toque, sin tipear.' },
  { Icon: Calculator, t: 'Cotizador', d: 'Tu cliente elige el servicio y te llega la solicitud ordenada.' },
  { Icon: FileDown, t: 'Brochure en PDF', d: 'Tu carpeta corporativa lista para descargar.' },
  { Icon: AtSign, t: 'Correo corporativo', d: 'nombre@tuempresa.cl configurado y funcionando.' },
  { Icon: Mail, t: 'Formulario de contacto', d: 'Las consultas te llegan directo al correo.' },
  { Icon: Search, t: 'SEO local', d: 'Para que te encuentren en Google en tu ciudad.' },
  { Icon: Images, t: 'Galería de fotos', d: 'Muestra trabajos, equipos o instalaciones.' },
]

export default function Complementos() {
  return (
    <section id="complementos" className="scroll-mt-20 bg-duna">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-10 px-4 py-20 sm:px-6 md:py-24">
        <SectionHeading
          eyebrow="Complementos"
          titulo="Arma tu página a la medida"
          bajada="Partes con lo esencial y le sumas solo lo que tu negocio necesita."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ Icon, t, d }) => (
            <div key={t} className="flex items-start gap-3.5 rounded-[18px] bg-crema p-5 sm:p-[22px]">
              <Icon size={24} className="shrink-0 text-terracota" aria-hidden="true" />
              <div>
                <p className="font-semibold">{t}</p>
                <p className="mt-1 text-sm text-cafe">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
