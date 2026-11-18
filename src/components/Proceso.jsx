const PASOS = [
  { n: '01', t: 'Conversamos', d: 'Por WhatsApp o en persona. Entendemos tu negocio y qué necesitas lograr.', borde: 'border-terracota', num: 'text-terracota' },
  { n: '02', t: 'Anticipo del 50%', d: 'Confirmas el plan y partimos de inmediato con tu proyecto.', borde: 'border-cobre', num: 'text-oxido' },
  { n: '03', t: 'Web lista en 48–72 h', d: 'Te mostramos la página, ajustamos detalles y la publicamos.', borde: 'border-[#DDA36A]', num: 'text-[#8A5A2B]' },
  { n: '04', t: '50% contra entrega', d: 'Pagas el resto cuando tu página está en línea. Sin mensualidades.', borde: 'border-sol', num: 'text-[#8A5A2B]' },
]

export default function Proceso() {
  return (
    <section aria-labelledby="proceso-t" className="mx-auto flex max-w-[1240px] flex-col gap-10 px-4 py-20 sm:px-6 md:py-24">
      <h2 id="proceso-t" className="font-display text-[32px] leading-[1.08] font-bold tracking-tight sm:text-[42px] lg:text-5xl">
        Cómo trabajamos
      </h2>
      <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {PASOS.map((p) => (
          <li key={p.n} className={`flex flex-col gap-2 border-t-[3px] pt-5 ${p.borde}`}>
            <span className={`font-display text-[32px] font-bold ${p.num}`}>{p.n}</span>
            <p className="text-[19px] font-semibold">{p.t}</p>
            <p className="text-cafe">{p.d}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
