import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Check, Lock, MessageCircle } from 'lucide-react'
import { Logo } from '../components/Logo'
import { PLANES, MANTENCION_ANUAL, MAX_TARJETAS, calcularPedido, clp, waLink } from '../data'

export function CheckoutHeader() {
  return (
    <header className="border-b border-borde bg-arena">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a href="/" aria-label="Helios Digital, volver al inicio" className="text-tierra">
          <Logo />
        </a>
        <a href="/#planes" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-terracota-osc hover:text-tierra">
          <ArrowLeft size={18} aria-hidden="true" /> Volver
        </a>
      </div>
    </header>
  )
}

const tituloPaso = 'text-[13px] font-semibold tracking-[0.08em] text-terracota-osc uppercase'
const tarjetaPaso = 'flex flex-col gap-4 rounded-3xl border border-borde bg-crema p-6 sm:p-7'
const opcion = (activa) =>
  `flex cursor-pointer items-start gap-4 rounded-2xl p-4 sm:p-5 ${
    activa ? 'border-2 border-terracota bg-arena' : 'border border-borde hover:bg-arena/60'
  }`
const campo =
  'min-h-12 w-full rounded-xl border border-borde bg-white px-4 py-3 text-[16px] text-tierra placeholder:text-[#8A7465] focus:border-terracota'

export default function Checkout() {
  const inicial = new URLSearchParams(window.location.search).get('plan')
  const [planId, setPlanId] = useState(PLANES.some((p) => p.id === inicial) ? inicial : 'landing')
  const [cantidad, setCantidad] = useState(1)
  const [mantencion, setMantencion] = useState(false)
  const [modalidad, setModalidad] = useState('anticipo')
  const [cliente, setCliente] = useState({ nombre: '', correo: '', telefono: '', empresa: '', rut: '' })
  const [acepta, setAcepta] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Checkout · Helios Digital'
  }, [])

  const pedido = useMemo(
    () => calcularPedido({ planId, cantidad, mantencion, modalidad }),
    [planId, cantidad, mantencion, modalidad],
  )
  const esTarjeta = planId === 'tarjeta'
  const set = (k) => (e) => setCliente((c) => ({ ...c, [k]: e.target.value }))

  async function pagar(e) {
    e.preventDefault()
    setError('')
    if (!acepta) {
      setError('Debes aceptar los términos y condiciones.')
      return
    }
    setEnviando(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, cantidad, mantencion, modalidad, cliente, aceptaTerminos: acepta }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) throw new Error(data.error || 'No pudimos iniciar el pago.')
      window.location.href = data.url
    } catch (err) {
      setError(err.message)
      setEnviando(false)
    }
  }

  return (
    <>
      <CheckoutHeader />
      <main id="contenido" className="mx-auto max-w-[1140px] px-4 py-10 sm:px-6 md:py-14">
        <h1 className="font-display text-[34px] leading-tight font-bold tracking-tight sm:text-[44px]">Checkout</h1>
        <p className="mt-2 text-cafe">Pago único, sin mensualidades. Precios en CLP con IVA incluido.</p>

        <form onSubmit={pagar} className="mt-8 grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col gap-6">
            <fieldset className={tarjetaPaso}>
              <legend className="sr-only">Paso 1: elige tu producto</legend>
              <p className={tituloPaso} aria-hidden="true">Paso 1 · Elige tu producto</p>
              {PLANES.map((p) => (
                <label key={p.id} className={opcion(planId === p.id)}>
                  <input
                    type="radio"
                    name="plan"
                    value={p.id}
                    checked={planId === p.id}
                    onChange={() => setPlanId(p.id)}
                    className="mt-1 h-5 w-5 shrink-0 accent-terracota"
                  />
                  <span className="flex flex-1 flex-col gap-1.5">
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-lg font-semibold">{p.nombre}</span>
                      <span className="text-lg font-bold">{clp(p.precio)}</span>
                    </span>
                    <span className="text-[15px] text-cafe">{p.descripcion}</span>
                    {p.id === 'landing' && (
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracota-osc">
                        <Check size={16} aria-hidden="true" /> Incluye tarjeta NFC + página personal del dueño
                      </span>
                    )}
                  </span>
                </label>
              ))}
              {esTarjeta && (
                <label className="flex items-center justify-between gap-4 rounded-2xl bg-arena p-4">
                  <span className="font-semibold">Cantidad de tarjetas</span>
                  <input
                    type="number"
                    min="1"
                    max={MAX_TARJETAS}
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className={`${campo} w-24 text-center`}
                  />
                </label>
              )}
            </fieldset>

            {!esTarjeta && (
              <fieldset className={tarjetaPaso}>
                <legend className="sr-only">Paso 2: extras</legend>
                <p className={tituloPaso} aria-hidden="true">Paso 2 · Extras</p>
                <label className={opcion(mantencion)}>
                  <input
                    type="checkbox"
                    checked={mantencion}
                    onChange={(e) => setMantencion(e.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 accent-terracota"
                  />
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-semibold">Mantención anual (opcional)</span>
                      <span className="font-bold">+{clp(MANTENCION_ANUAL)} / año</span>
                    </span>
                    <span className="text-[15px] text-cafe">Renovación del dominio y mantención del sitio. Hoy pagas el primer año.</span>
                  </span>
                </label>
                <div className="flex items-center justify-between rounded-2xl bg-arena p-4">
                  <span className="font-semibold">Dominio</span>
                  <span className="font-bold text-whatsapp">$0 · incluido</span>
                </div>
              </fieldset>
            )}

            <fieldset className={tarjetaPaso}>
              <legend className="sr-only">Forma de pago</legend>
              <p className={tituloPaso} aria-hidden="true">{esTarjeta ? 'Paso 2' : 'Paso 3'} · Forma de pago</p>
              <label className={opcion(modalidad === 'anticipo')}>
                <input
                  type="radio"
                  name="modalidad"
                  checked={modalidad === 'anticipo'}
                  onChange={() => setModalidad('anticipo')}
                  className="mt-1 h-5 w-5 shrink-0 accent-terracota"
                />
                <span className="flex flex-col gap-1">
                  <span className="font-semibold">Anticipo 50% ahora</span>
                  <span className="text-[15px] text-cafe">El otro 50% lo pagas contra entrega.</span>
                </span>
              </label>
              <label className={opcion(modalidad === 'total')}>
                <input
                  type="radio"
                  name="modalidad"
                  checked={modalidad === 'total'}
                  onChange={() => setModalidad('total')}
                  className="mt-1 h-5 w-5 shrink-0 accent-terracota"
                />
                <span className="font-semibold">Pagar el total ahora</span>
              </label>
            </fieldset>

            <fieldset className={tarjetaPaso}>
              <legend className="sr-only">Tus datos</legend>
              <p className={tituloPaso} aria-hidden="true">{esTarjeta ? 'Paso 3' : 'Paso 4'} · Tus datos</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-sm font-semibold">Nombre y apellido</span>
                  <input required autoComplete="name" value={cliente.nombre} onChange={set('nombre')} className={campo} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold">Correo (aquí te llega la confirmación)</span>
                  <input required type="email" autoComplete="email" value={cliente.correo} onChange={set('correo')} className={campo} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold">WhatsApp</span>
                  <input
                    required
                    type="tel"
                    autoComplete="tel"
                    placeholder="+56 9 1234 5678"
                    value={cliente.telefono}
                    onChange={set('telefono')}
                    className={campo}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold">Empresa (opcional)</span>
                  <input autoComplete="organization" value={cliente.empresa} onChange={set('empresa')} className={campo} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold">RUT para factura (opcional)</span>
                  <input placeholder="12.345.678-9" value={cliente.rut} onChange={set('rut')} className={campo} />
                </label>
              </div>
            </fieldset>
          </div>

          <aside className="flex flex-col gap-3.5 rounded-3xl bg-noche p-6 text-arena sm:p-7 lg:sticky lg:top-6">
            <h2 className="text-[13px] font-semibold tracking-[0.08em] text-sol uppercase">Resumen</h2>
            <Fila t={`${pedido.plan.nombre}${pedido.cantidad > 1 ? ` x${pedido.cantidad}` : ''}`} v={clp(pedido.subtotal)} />
            {!esTarjeta && <Fila t="Mantención anual" v={clp(pedido.mantencion)} tenue />}
            {!esTarjeta && <Fila t="Dominio" v={clp(pedido.dominio)} tenue />}
            <hr className="my-1 border-white/15" />
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-semibold">Pagas hoy{pedido.modalidad === 'anticipo' ? ' (50%)' : ''}</span>
              <span className="font-display text-[30px] font-bold">{clp(pedido.hoy)}</span>
            </div>
            {pedido.saldo > 0 && <Fila t="Saldo contra entrega" v={clp(pedido.saldo)} tenue />}
            <p className="text-xs text-humo">Precios en CLP, IVA incluido.</p>

            <label className="mt-1 flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={acepta}
                onChange={(e) => setAcepta(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-sol"
              />
              <span>
                Acepto los{' '}
                <a href="/terminos" target="_blank" className="font-semibold text-sol underline underline-offset-2">
                  términos y condiciones
                </a>{' '}
                y la{' '}
                <a href="/privacidad" target="_blank" className="font-semibold text-sol underline underline-offset-2">
                  política de privacidad
                </a>
                .
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-xl bg-[#5A1E12] px-4 py-3 text-sm text-crema">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="mt-1 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#009EE3] px-6 text-[17px] font-bold text-white hover:bg-[#0089C6] disabled:opacity-60"
            >
              <Lock size={18} aria-hidden="true" />
              {enviando ? 'Conectando con Mercado Pago…' : 'Pagar con Mercado Pago'}
            </button>
            <p className="text-center text-xs text-humo">
              Te llevamos a Mercado Pago para pagar de forma segura. No vemos ni guardamos los datos de tu tarjeta.
            </p>

            <hr className="my-1 border-white/15" />
            <a
              href={waLink('Hola, quiero cotizar una página con backend a medida.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2 text-sm text-crema"
            >
              <MessageCircle size={18} className="mt-0.5 shrink-0 text-sol" aria-hidden="true" />
              <span>
                ¿Necesitas una página con backend a medida? <span className="font-semibold text-sol underline">Cotízala por WhatsApp</span>{' '}
                (1 a 2 semanas, precio según alcance).
              </span>
            </a>
          </aside>
        </form>
      </main>
    </>
  )
}

function Fila({ t, v, tenue }) {
  return (
    <div className={`flex justify-between gap-3 text-[15px] ${tenue ? 'text-humo' : ''}`}>
      <span>{t}</span>
      <span>{v}</span>
    </div>
  )
}
