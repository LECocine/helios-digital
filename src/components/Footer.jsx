import { NEGOCIO, LEGAL } from '../data'

export default function Footer() {
  const ubicacion = [LEGAL.domicilio, LEGAL.comuna, LEGAL.region].filter(Boolean).join(', ')

  return (
    <footer className="bg-noche text-humo">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-4 pt-12 pb-28 text-sm sm:px-6 md:pb-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2">
            <a href="/" className="font-display text-lg font-bold tracking-[0.18em] text-sol">
              HELIOS
            </a>
            <p className="max-w-[320px]">Páginas web, tarjetas NFC y catálogos con WhatsApp para pymes del norte de Chile.</p>
          </div>

          <dl className="grid gap-x-8 gap-y-1.5 sm:grid-cols-[auto_1fr]">
            <dt className="text-[#A8917A]">Razón social</dt>
            <dd className="text-arena">{LEGAL.razonSocial}</dd>
            {LEGAL.rut && (
              <>
                <dt className="text-[#A8917A]">RUT</dt>
                <dd className="text-arena">{LEGAL.rut}</dd>
              </>
            )}
            {LEGAL.giro && (
              <>
                <dt className="text-[#A8917A]">Giro</dt>
                <dd className="text-arena">{LEGAL.giro}</dd>
              </>
            )}
            <dt className="text-[#A8917A]">Domicilio</dt>
            <dd className="text-arena">{ubicacion}, Chile</dd>
            <dt className="text-[#A8917A]">Contacto</dt>
            <dd className="text-arena">
              <a href={`mailto:${NEGOCIO.correo}`} className="text-arena hover:text-sol">
                {NEGOCIO.correo}
              </a>{' '}
              · {NEGOCIO.whatsappVisible}
            </dd>
          </dl>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/terminos" className="text-humo hover:text-sol">
              Términos y condiciones
            </a>
            <a href="/privacidad" className="text-humo hover:text-sol">
              Política de privacidad
            </a>
            <a href="https://www.sernac.cl" target="_blank" rel="noopener noreferrer" className="text-humo hover:text-sol">
              SERNAC
            </a>
          </nav>
          <span>
            © {new Date().getFullYear()} {LEGAL.razonSocial}. Precios en CLP, IVA incluido.
          </span>
        </div>
      </div>
    </footer>
  )
}
