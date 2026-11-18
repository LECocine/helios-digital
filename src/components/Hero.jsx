import { Nfc, Clock, BadgeCheck, MapPin } from 'lucide-react'
import { waLink } from '../data'

function QRDecorativo() {
  return (
    <svg width="56" height="56" viewBox="0 0 7 7" shapeRendering="crispEdges" aria-hidden="true">
      <rect width="7" height="7" fill="#F6EEE3" />
      <g fill="#241510">
        <rect x="0" y="0" width="3" height="3" />
        <rect x="4" y="0" width="3" height="3" />
        <rect x="0" y="4" width="3" height="3" />
        <rect x="4" y="4" width="1" height="1" />
        <rect x="6" y="5" width="1" height="2" />
        <rect x="4" y="6" width="1" height="1" />
        <rect x="3" y="3" width="1" height="1" />
      </g>
      <g fill="#F6EEE3">
        <rect x="1" y="1" width="1" height="1" />
        <rect x="5" y="1" width="1" height="1" />
        <rect x="1" y="5" width="1" height="1" />
      </g>
    </svg>
  )
}

export default function Hero() {
  return (
    <section id="inicio" className="mx-auto grid max-w-[1240px] items-center gap-10 px-4 pt-10 sm:px-6 md:pt-14 lg:grid-cols-2 lg:gap-12">
      <div className="flex flex-col gap-6">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-terracota-osc">
          Páginas web para pymes · Calama y el norte
        </p>
        <h1 className="font-display text-[40px] font-bold leading-[1.03] tracking-tight sm:text-6xl lg:text-[68px]">
          Tu negocio, visible bajo el mismo sol que lo mueve.
        </h1>
        <p className="max-w-[540px] text-lg text-cafe sm:text-[19px]">
          Te armamos una página web que trae clientes por WhatsApp, lista en 48 a 72 horas. Pago único, sin
          mensualidades y sin enredos técnicos.
        </p>
        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          <a
            href={waLink('Hola, quiero conversar sobre una página web para mi negocio.')}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-terracota px-7 py-4 text-center font-semibold text-crema hover:bg-terracota-osc"
          >
            Conversemos por WhatsApp
          </a>
          <a
            href="#planes"
            className="rounded-full border-[1.5px] border-tierra px-7 py-[15px] text-center font-semibold text-tierra hover:bg-duna"
          >
            Ver planes y precios
          </a>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm font-medium text-cafe">
          <li className="flex items-center gap-2">
            <Clock size={18} className="text-terracota" aria-hidden="true" /> Entrega en 48–72 h
          </li>
          <li className="flex items-center gap-2">
            <BadgeCheck size={18} className="text-terracota" aria-hidden="true" /> Pago único
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={18} className="text-terracota" aria-hidden="true" /> Desde Calama
          </li>
        </ul>
      </div>

      <div className="relative h-[380px] overflow-hidden rounded-[28px] bg-sol-claro sm:h-[460px]">
        <svg
          viewBox="0 0 600 460"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <rect width="600" height="460" fill="#F4D3A0" />
          <circle cx="390" cy="200" r="92" fill="#E8A33D" />
          <circle cx="390" cy="200" r="130" fill="none" stroke="#E8A33D" strokeOpacity="0.35" strokeWidth="2" />
          <path d="M0 270 C 120 220, 210 250, 300 235 S 480 200, 600 240 L600 460 L0 460 Z" fill="#DDA36A" />
          <path d="M0 320 C 140 280, 260 330, 380 300 S 540 280, 600 300 L600 460 L0 460 Z" fill="#C97C46" />
          <path d="M0 380 C 160 350, 300 400, 440 370 S 560 360, 600 372 L600 460 L0 460 Z" fill="#9E4F2A" />
          <g stroke="#6E3219" strokeWidth="3" strokeLinecap="round" opacity="0.55">
            <line x1="70" y1="420" x2="250" y2="420" />
            <line x1="100" y1="436" x2="220" y2="436" />
          </g>
        </svg>

        <div className="absolute bottom-6 left-6 flex h-[184px] w-[min(300px,calc(100%-48px))] flex-col justify-between rounded-[18px] bg-noche p-[22px] text-arena shadow-[0_24px_48px_rgba(36,21,16,0.35)] sm:bottom-9 sm:left-9">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-lg font-semibold">Tu nombre aquí</p>
              <p className="mt-0.5 text-[13px] text-humo">Gerente de Operaciones</p>
            </div>
            <Nfc size={26} className="text-sol" aria-hidden="true" />
          </div>
          <div className="flex items-end justify-between">
            <span className="font-display text-[13px] font-bold tracking-[0.18em] text-sol">HELIOS</span>
            <QRDecorativo />
          </div>
        </div>
      </div>
    </section>
  )
}
