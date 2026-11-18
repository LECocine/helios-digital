import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Logo } from './Logo'
import { LEGAL } from '../data'

export default function LegalLayout({ titulo, children }) {
  useEffect(() => {
    document.title = `${titulo} · Helios Digital`
    window.scrollTo(0, 0)
  }, [titulo])

  return (
    <>
      <header className="border-b border-borde bg-arena">
        <div className="mx-auto flex max-w-[860px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href="/" aria-label="Helios Digital, volver al inicio" className="text-tierra">
            <Logo />
          </a>
          <a href="/" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-terracota-osc hover:text-tierra">
            <ArrowLeft size={18} aria-hidden="true" /> Volver
          </a>
        </div>
      </header>
      <main id="contenido" className="mx-auto max-w-[860px] px-4 py-12 sm:px-6 md:py-16">
        <h1 className="font-display text-[34px] leading-tight font-bold tracking-tight sm:text-5xl">{titulo}</h1>
        <p className="mt-3 text-sm text-cafe">Última actualización: {LEGAL.actualizado}</p>
        <div className="mt-10 flex flex-col gap-8 text-[16px] leading-relaxed [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_section]:flex [&_section]:flex-col [&_section]:gap-3 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5">
          {children}
        </div>
      </main>
    </>
  )
}

export function Identificacion() {
  const ubicacion = [LEGAL.domicilio, LEGAL.comuna, LEGAL.region].filter(Boolean).join(', ')
  return (
    <ul>
      <li>
        <strong>Razón social:</strong> {LEGAL.razonSocial}
      </li>
      {LEGAL.rut && (
        <li>
          <strong>RUT:</strong> {LEGAL.rut}
        </li>
      )}
      {LEGAL.giro && (
        <li>
          <strong>Giro:</strong> {LEGAL.giro}
        </li>
      )}
      <li>
        <strong>Domicilio:</strong> {ubicacion}, Chile
      </li>
    </ul>
  )
}
