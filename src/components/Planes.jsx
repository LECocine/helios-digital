import { Check } from 'lucide-react'
import { PLANES, clp, waLink, desgloseIVA } from '../data'
import { SectionHeading } from './SectionHeading'

export default function Planes() {
  return (
    <section id="planes" className="mx-auto flex max-w-[1240px] scroll-mt-20 flex-col gap-10 px-4 pb-20 sm:px-6 md:pb-24">
      <SectionHeading
        eyebrow="Planes"
        titulo="Precios claros, sin sorpresas"
        bajada="Todos los precios están en pesos chilenos e incluyen IVA. Pago único: 50% de anticipo y 50% cuando tu proyecto está listo. Sin mensualidades."
      />
      <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
        {PLANES.map((p) => {
          const osc = p.destacado
          const { neto, iva } = desgloseIVA(p.precio)
          return (
            <article
              key={p.id}
              className={`relative flex flex-col gap-4 rounded-3xl p-7 sm:p-8 ${
                osc ? 'bg-noche text-arena' : 'border border-borde bg-crema'
              }`}
            >
              {osc && (
                <span className="absolute -top-3 right-6 rounded-full bg-sol px-3 py-1 text-xs font-semibold text-noche">
                  Más pedido
                </span>
              )}
              <h3 className={`text-lg font-semibold ${osc ? 'text-sol' : ''}`}>{p.nombre}</h3>
              <div>
                <p className="font-display text-[40px] leading-none font-bold">{clp(p.precio)}</p>
                <p className={`mt-2 text-sm ${osc ? 'text-humo' : 'text-cafe'}`}>
                  IVA incluido · {p.unidad}
                </p>
                <p className={`mt-1 text-xs ${osc ? 'text-humo' : 'text-cafe'}`}>
                  Neto {clp(neto)} + IVA {clp(iva)}
                </p>
              </div>
              <p className={osc ? 'text-[#D9C4AC]' : 'text-cafe'}>{p.descripcion}</p>
              <p className={`text-sm font-semibold ${osc ? 'text-sol' : 'text-terracota-osc'}`}>{p.nota}</p>
              <ul className="flex flex-col gap-2.5">
                {p.incluye.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[15px]">
                    <Check size={18} className={`mt-0.5 shrink-0 ${osc ? 'text-sol' : 'text-terracota'}`} aria-hidden="true" />
                    {i}
                  </li>
                ))}
              </ul>
              <a
                href={waLink(p.mensaje)}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-auto rounded-full py-3.5 text-center font-semibold ${
                  osc
                    ? 'bg-sol text-noche hover:bg-sol-claro'
                    : 'border-[1.5px] border-tierra text-tierra hover:bg-duna'
                }`}
              >
                Cotizar por WhatsApp
              </a>
            </article>
          )
        })}
      </div>
      <p className="text-sm text-cafe">
        Emitimos factura electrónica. El detalle y precio final de tu proyecto quedan en la cotización escrita que te
        enviamos antes de partir. Revisa los{' '}
        <a href="/terminos" className="font-semibold underline underline-offset-2">
          términos y condiciones
        </a>
        .
      </p>
    </section>
  )
}
