import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { CheckoutHeader } from './Checkout'
import { NEGOCIO, clp, waLink } from '../data'

const TEXTOS = {
  pagado: {
    Icon: CheckCircle2,
    color: 'text-whatsapp',
    titulo: '¡Pago recibido!',
    bajada: 'Te enviamos un correo con la confirmación. Te escribiremos por WhatsApp para pedirte el material y partir.',
  },
  pendiente: {
    Icon: Clock,
    color: 'text-sol',
    titulo: 'Tu pago está en proceso',
    bajada: 'Mercado Pago aún está procesando el pago. Apenas se confirme te llega el correo de confirmación.',
  },
  rechazado: {
    Icon: XCircle,
    color: 'text-terracota',
    titulo: 'El pago no se completó',
    bajada: 'No se hizo ningún cargo. Puedes intentarlo de nuevo con otro medio de pago o escribirnos por WhatsApp.',
  },
}

// Mismo resultado, pero para el pago del saldo (50% restante)
const TEXTOS_SALDO = {
  ...TEXTOS,
  pagado: {
    ...TEXTOS.pagado,
    titulo: '¡Saldo pagado!',
    bajada: 'Te enviamos un correo con la confirmación. Te contactaremos por WhatsApp para coordinar la entrega.',
  },
  rechazado: {
    ...TEXTOS.rechazado,
    bajada: 'No se hizo ningún cargo. Abre de nuevo el link del correo para reintentar, o escríbenos por WhatsApp.',
  },
}

export default function CheckoutResultado() {
  const q = new URLSearchParams(window.location.search)
  const ref = q.get('external_reference') || ''
  // El pago del saldo vuelve con la referencia "<pedido>-saldo"
  const esSaldo = ref.endsWith('-saldo')
  const pedidoId = esSaldo ? ref.slice(0, -'-saldo'.length) : ref
  const paymentId = q.get('payment_id')
  const estadoMP = q.get('status') || q.get('collection_status')
  const [pedido, setPedido] = useState(null)

  useEffect(() => {
    document.title = 'Resultado del pago · Helios'
    if (!pedidoId) return
    const params = new URLSearchParams({ id: pedidoId })
    if (paymentId && paymentId !== 'null') params.set('payment_id', paymentId)
    fetch(`/api/pedido?${params}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setPedido)
      .catch(() => {})
  }, [pedidoId, paymentId])

  const estadoPedido = esSaldo ? pedido?.saldo_estado : pedido?.estado
  const estado =
    estadoPedido === 'pagado'
      ? 'pagado'
      : estadoPedido === 'rechazado' || estadoMP === 'rejected' || estadoMP === 'null'
        ? 'rechazado'
        : 'pendiente'
  const { Icon, color, titulo, bajada } = (esSaldo ? TEXTOS_SALDO : TEXTOS)[estado]

  return (
    <>
      <CheckoutHeader />
      <main id="contenido" className="mx-auto flex max-w-[640px] flex-col items-center gap-5 px-4 py-16 text-center sm:px-6">
        <Icon size={56} className={color} aria-hidden="true" />
        <h1 className="font-display text-[34px] leading-tight font-bold tracking-tight">{titulo}</h1>
        <p className="text-lg text-cafe">{bajada}</p>
        {pedido && (
          <div className="w-full rounded-3xl border border-borde bg-crema p-6 text-left">
            <p className="text-sm text-cafe">Pedido {pedido.id}</p>
            <p className="mt-1 text-lg font-semibold">
              {pedido.plan_nombre}
              {pedido.cantidad > 1 ? ` x${pedido.cantidad}` : ''}
            </p>
            {esSaldo ? (
              <p className="mt-2">Saldo: {clp(pedido.saldo)}</p>
            ) : (
              <>
                <p className="mt-2">Pagado hoy: {clp(pedido.monto_hoy)}</p>
                {pedido.saldo > 0 && <p>Saldo contra entrega: {clp(pedido.saldo)}</p>}
              </>
            )}
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          {estado === 'rechazado' && !esSaldo && (
            <a href="/checkout" className="rounded-full bg-noche px-6 py-3.5 font-semibold text-arena hover:bg-terracota">
              Intentar de nuevo
            </a>
          )}
          <a
            href={waLink(`Hola, tengo una consulta sobre mi pedido ${pedidoId ?? ''}`.trim())}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-[1.5px] border-tierra px-6 py-3.5 font-semibold text-tierra hover:bg-duna"
          >
            Escribir al {NEGOCIO.whatsappVisible}
          </a>
        </div>
      </main>
    </>
  )
}
