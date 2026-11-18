const SECTORES = [
  'Talleres y lubricentros',
  'Contratistas mineros',
  'Arriendo de maquinaria',
  'Transporte y logística',
  'Clínicas y consultas',
  'Inmobiliarias',
  'Comercio local',
]

export default function Sectores() {
  return (
    <section aria-label="Rubros que atendemos" className="mx-auto max-w-[1240px] px-4 pt-14 pb-4 sm:px-6">
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <span className="mr-2 w-full text-sm text-cafe sm:w-auto">Trabajamos con:</span>
        {SECTORES.map((s) => (
          <span key={s} className="rounded-full bg-duna px-4 py-2 text-sm font-medium">
            {s}
          </span>
        ))}
      </div>
    </section>
  )
}
