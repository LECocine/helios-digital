import { NEGOCIO } from '../data'

export default function Footer() {
  return (
    <footer className="bg-noche text-humo">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-4 py-10 pb-28 text-sm sm:px-6 md:flex-row md:items-center md:justify-between md:pb-10">
        <span className="font-display text-lg font-bold tracking-[0.18em] text-sol">HELIOS</span>
        <span>
          {NEGOCIO.razonSocial} · {NEGOCIO.ciudad}, Chile
        </span>
        <span>© {new Date().getFullYear()} {NEGOCIO.marca}</span>
      </div>
    </footer>
  )
}
