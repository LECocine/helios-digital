import { Check } from 'lucide-react'
import { LogoMark } from './Logo'
import { SectionHeading } from './SectionHeading'

const PUNTOS = [
  ['NFC:', 'acercas la tarjeta al celular y se abre tu perfil.'],
  ['QR:', 'funciona con cualquier cámara, aunque el teléfono no tenga NFC.'],
  ['Guardar contacto:', 'nombre, cargo, teléfono, correo y LinkedIn en un toque.'],
  ['Para todo el equipo:', 'mismo diseño con la marca de tu empresa.'],
]

export default function Tarjeta() {
  return (
    <section id="tarjeta" className="scroll-mt-20 bg-noche text-arena">
      <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-4 py-20 sm:px-6 md:py-24 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <SectionHeading
            oscuro
            eyebrow="Tarjeta ejecutiva"
            titulo="Una tarjeta. Todos tus datos. Siempre al día."
            bajada="Se acabó reimprimir tarjetas cada vez que cambia un cargo o un número. El perfil se actualiza en línea y la tarjeta sigue funcionando."
          />
          <ul className="flex flex-col gap-3.5">
            {PUNTOS.map(([b, t]) => (
              <li key={b} className="flex items-start gap-3">
                <Check size={22} className="mt-0.5 shrink-0 text-sol" aria-hidden="true" />
                <span>
                  <strong className="text-crema">{b}</strong> {t}
                </span>
              </li>
            ))}
          </ul>
          <p className="rounded-2xl bg-white/5 px-5 py-4 text-[15px] text-[#D9C4AC]">
            <strong className="text-sol">$65.000 por tarjeta.</strong> La Landing Express ya incluye tu tarjeta NFC con tu
            página personal de dueño.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex h-[200px] w-[320px] max-w-full flex-col justify-between rounded-[18px] bg-terracota p-6 shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
            <LogoMark size={40} sol="#F4D3A0" terrazas="#FFF8EF" />
            <div>
              <p className="font-display text-xl font-semibold text-crema">Tu nombre aquí</p>
              <p className="mt-0.5 text-[13px] text-[#FBE3CC]">Cargo · Empresa</p>
            </div>
          </div>

          <div className="w-[220px] rounded-[32px] bg-arena p-3.5 text-tierra shadow-[0_24px_48px_rgba(0,0,0,0.4)]" aria-hidden="true">
            <div className="flex flex-col overflow-hidden rounded-[22px] bg-crema">
              <div className="h-[72px] bg-sol" />
              <div className="mx-auto -mt-8 h-16 w-16 rounded-full border-4 border-crema bg-cobre" />
              <div className="flex flex-col gap-2 px-4 pt-2.5 pb-[18px] text-center">
                <p className="font-display text-[15px] font-semibold">Tu nombre aquí</p>
                <p className="text-[11px] text-cafe">Cargo · Empresa</p>
                <span className="mt-1.5 rounded-full bg-tierra p-2.5 text-xs font-semibold text-arena">Guardar contacto</span>
                <span className="rounded-full bg-duna p-2.5 text-xs font-medium">WhatsApp</span>
                <span className="rounded-full bg-duna p-2.5 text-xs font-medium">LinkedIn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
