import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo'
import { waLink } from '../data'

const LINKS = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#tarjeta', label: 'Tarjeta NFC' },
  { href: '#complementos', label: 'Complementos' },
  { href: '#planes', label: 'Planes' },
  { href: '/checkout', label: 'Pagar en línea' },
]

export default function Header() {
  const [abierto, setAbierto] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-borde/70 bg-arena/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 py-3 sm:px-6 md:py-4">
        <a href="#inicio" aria-label="Helios Digital, ir al inicio" className="text-tierra no-underline">
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-7 text-[15px] font-medium md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-tierra hover:text-terracota-osc">
              {l.label}
            </a>
          ))}
          <a
            href={waLink('Hola, quiero cotizar una página web para mi negocio.')}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-noche px-5 py-3 text-arena hover:bg-terracota"
          >
            Cotizar por WhatsApp
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          className="flex h-11 w-11 items-center justify-center rounded-full text-tierra hover:bg-duna md:hidden"
        >
          {abierto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {abierto && (
        <nav id="menu-movil" aria-label="Menú móvil" className="border-t border-borde bg-arena px-4 pb-5 md:hidden">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setAbierto(false)}
                  className="block py-3.5 text-lg font-medium text-tierra"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={waLink('Hola, quiero cotizar una página web para mi negocio.')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block rounded-full bg-noche px-5 py-3.5 text-center font-semibold text-arena"
          >
            Cotizar por WhatsApp
          </a>
        </nav>
      )}
    </header>
  )
}
