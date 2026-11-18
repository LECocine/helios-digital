import { MessageCircle, Mail } from 'lucide-react'
import { NEGOCIO, waLink } from '../data'

export default function Contacto() {
  return (
    <section id="contacto" className="relative scroll-mt-20 overflow-hidden bg-terracota text-crema">
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[160px] w-full"
        aria-hidden="true"
      >
        <path d="M0 120 C 240 60, 480 140, 720 100 S 1200 60, 1440 110 L1440 200 L0 200 Z" fill="#9E3D21" />
        <path d="M0 160 C 300 120, 600 190, 900 150 S 1300 140, 1440 160 L1440 200 L0 200 Z" fill="#7F2F18" />
      </svg>
      <div className="relative mx-auto flex max-w-[1240px] flex-col items-start gap-6 px-4 pt-20 pb-40 sm:px-6 md:pt-24">
        <h2 className="max-w-[760px] font-display text-[34px] leading-[1.05] font-bold sm:text-5xl lg:text-[56px]">
          ¿Listo para que tu negocio brille en internet?
        </h2>
        <p className="max-w-[600px] text-lg text-[#FBE3CC] sm:text-[19px]">
          Escríbenos y te respondemos hoy mismo con una propuesta a tu medida. Sin compromiso.
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href={waLink('Hola, quiero cotizar una página web para mi negocio.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-crema px-7 py-4 font-semibold text-tierra hover:bg-arena"
          >
            <MessageCircle size={20} aria-hidden="true" /> WhatsApp {NEGOCIO.whatsappVisible}
          </a>
          <a
            href={`mailto:${NEGOCIO.correo}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-crema px-7 py-[15px] font-semibold text-crema hover:bg-white/10"
          >
            <Mail size={20} aria-hidden="true" /> {NEGOCIO.correo}
          </a>
        </div>
      </div>
    </section>
  )
}
