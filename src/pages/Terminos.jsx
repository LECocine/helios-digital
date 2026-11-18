import LegalLayout, { Identificacion } from '../components/LegalLayout'
import { NEGOCIO, PLANES, clp, desgloseIVA } from '../data'

export default function Terminos() {
  return (
    <LegalLayout titulo="Términos y condiciones">
      <section>
        <p>
          Estos términos regulan la contratación de los servicios de {NEGOCIO.marca}, marca comercial de la empresa que se
          identifica abajo. Al aceptar una cotización o pagar el anticipo, declaras que leíste y aceptas estos términos.
        </p>
      </section>

      <section>
        <h2>1. Quiénes somos</h2>
        <Identificacion />
        <p>
          Contacto: <a href={`mailto:${NEGOCIO.correo}`}>{NEGOCIO.correo}</a> · WhatsApp {NEGOCIO.whatsappVisible}
        </p>
      </section>

      <section>
        <h2>2. Servicios</h2>
        <p>
          Diseñamos y publicamos landing pages, sitios web corporativos, catálogos con pedidos por WhatsApp y tarjetas de
          presentación con NFC y código QR. El alcance exacto de cada proyecto queda en la cotización escrita que te
          enviamos antes de partir.
        </p>
      </section>

      <section>
        <h2>3. Precios e impuestos</h2>
        <p>
          Todos los precios publicados están en pesos chilenos (CLP) e <strong>incluyen IVA (19%)</strong>. Por cada pago
          emitimos el documento tributario electrónico que corresponda.
        </p>
        <ul>
          {PLANES.map((p) => {
            const { neto, iva } = desgloseIVA(p.precio)
            return (
              <li key={p.id}>
                {p.nombre}: {clp(p.precio)} IVA incluido (neto {clp(neto)} + IVA {clp(iva)}), {p.unidad}.
              </li>
            )
          })}
        </ul>
        <p>
          La Tarjeta Ejecutiva NFC se descuenta del valor de la Landing Express cuando se contratan juntas. Si
          actualizamos los precios publicados, el cambio no afecta las cotizaciones que ya aceptaste.
        </p>
      </section>

      <section>
        <h2>4. Forma de pago</h2>
        <p>
          Pagas el <strong>50% de anticipo</strong> para iniciar el proyecto y el <strong>50% restante contra entrega</strong>,
          cuando el sitio está listo para publicarse o las tarjetas están listas para retirar. El pago es único: no hay
          mensualidades de mantención.
        </p>
      </section>

      <section>
        <h2>5. Plazos de entrega</h2>
        <p>
          El plazo de 48 a 72 horas hábiles corre desde que recibimos el anticipo y todo el material necesario (textos,
          logo, fotos, datos de contacto). Si el material llega incompleto o pides cambios de alcance, el plazo se ajusta y
          te avisamos la nueva fecha. Las tarjetas NFC dependen además del tiempo de impresión y despacho.
        </p>
      </section>

      <section>
        <h2>6. Revisiones y cambios</h2>
        <p>
          Cada proyecto incluye una ronda de ajustes antes de la publicación. Cambios posteriores o funciones que no
          estaban en la cotización se cotizan por separado.
        </p>
      </section>

      <section>
        <h2>7. Dominio, hosting y servicios de terceros</h2>
        <p>
          Publicamos los sitios en servicios de terceros como Cloudflare y GitHub, que hoy no tienen costo para este tipo
          de proyectos. El dominio (por ejemplo, tuempresa.cl) se registra a nombre del cliente y su renovación anual es de
          cargo del cliente. No somos responsables de cambios de precio, condiciones o interrupciones de esos servicios de
          terceros, aunque te ayudaremos a resolver cualquier problema.
        </p>
      </section>

      <section>
        <h2>8. Propiedad del trabajo</h2>
        <p>
          Una vez pagado el total, el sitio, sus textos y diseños hechos para ti son tuyos. El material que nos entregues
          (logo, fotos, textos) debe ser tuyo o debes tener permiso para usarlo. Podemos mostrar el proyecto terminado en
          nuestro portafolio, salvo que nos pidas lo contrario.
        </p>
      </section>

      <section>
        <h2>9. Tus derechos como consumidor</h2>
        <p>
          Si contratas como consumidor final, tienes todos los derechos que te otorga la Ley N° 19.496 sobre Protección de
          los Derechos de los Consumidores, incluida la garantía legal y el derecho a retracto cuando corresponda. Nada en
          estos términos limita esos derechos. Puedes hacer cualquier reclamo escribiendo a{' '}
          <a href={`mailto:${NEGOCIO.correo}`}>{NEGOCIO.correo}</a> o ante el{' '}
          <a href="https://www.sernac.cl" target="_blank" rel="noopener noreferrer">
            SERNAC
          </a>
          .
        </p>
      </section>

      <section>
        <h2>10. Datos personales</h2>
        <p>
          Tratamos tus datos según nuestra <a href="/privacidad">Política de privacidad</a>.
        </p>
      </section>

      <section>
        <h2>11. Ley aplicable</h2>
        <p>
          Estos términos se rigen por las leyes de la República de Chile. Para efectos legales, fijamos domicilio en la
          comuna de {NEGOCIO.ciudad}, sin perjuicio de los derechos que la ley otorga al consumidor para reclamar en su
          propio domicilio.
        </p>
      </section>
    </LegalLayout>
  )
}
