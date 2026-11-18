export function SectionHeading({ eyebrow, titulo, bajada, oscuro = false, id }) {
  return (
    <div className="flex max-w-[680px] flex-col gap-3">
      {eyebrow && (
        <p
          className={`text-sm font-semibold uppercase tracking-[0.14em] ${oscuro ? 'text-sol' : 'text-terracota-osc'}`}
        >
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="font-display text-[32px] leading-[1.08] font-bold tracking-tight sm:text-[42px] lg:text-5xl">
        {titulo}
      </h2>
      {bajada && <p className={`text-lg ${oscuro ? 'text-[#D9C4AC]' : 'text-cafe'}`}>{bajada}</p>}
    </div>
  )
}
