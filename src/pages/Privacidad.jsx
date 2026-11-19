import LegalLayout, { Identificacion } from '../components/LegalLayout'
import { NEGOCIO } from '../data'

export default function Privacidad() {
  return (
    <LegalLayout titulo="Política de privacidad">
      <section>
        <p>
          En {NEGOCIO.marca} cuidamos tus datos personales. Esta política explica qué datos tratamos, para qué y cómo
          puedes ejercer tus derechos, conforme a la Ley N° 19.628 sobre Protección de la Vida Privada y sus
          modificaciones, incluida la Ley N° 21.719.
        </p>
      </section>

      <section>
        <h2>1. Responsable de los datos</h2>
        <Identificacion />
        <p>
          Contacto para temas de datos personales: <a href={`mailto:${NEGOCIO.correo}`}>{NEGOCIO.correo}</a>
        </p>
      </section>

      <section>
        <h2>2. Qué datos tratamos</h2>
        <ul>
          <li>
            Los que tú nos envías por WhatsApp o correo: nombre, teléfono, correo, nombre de tu empresa y la información de
            tu proyecto.
          </li>
          <li>
            Los datos que nos pidas publicar en tu sitio o tarjeta NFC (por ejemplo, nombre, cargo, teléfono y redes de los
            ejecutivos de tu empresa).
          </li>
          <li>Los datos necesarios para emitir facturas o boletas (razón social, RUT, giro y dirección).</li>
          <li>
            Los que ingresas al pagar en línea en nuestro checkout: nombre, correo, teléfono, empresa, RUT (opcional), el
            plan que compras y el estado del pago. Los datos de tu tarjeta los ingresa y procesa Mercado Pago; nosotros
            no los vemos ni los guardamos.
          </li>
        </ul>
        <p>
          Los datos del checkout se guardan en una base de datos de Cloudflare para registrar tu pedido y enviarte la
          confirmación. Este sitio no usa cookies publicitarias ni herramientas de seguimiento.
        </p>
      </section>

      <section>
        <h2>3. Para qué los usamos</h2>
        <ul>
          <li>Responder tus consultas y enviarte cotizaciones.</li>
          <li>Desarrollar, publicar y dar soporte a tu proyecto.</li>
          <li>Emitir documentos tributarios y cumplir obligaciones legales.</li>
        </ul>
        <p>
          La base para tratarlos es tu consentimiento al contactarnos, la ejecución del servicio que contratas y el
          cumplimiento de obligaciones legales. No vendemos ni arrendamos tus datos.
        </p>
      </section>

      <section>
        <h2>4. Servicios de terceros</h2>
        <p>Para operar usamos proveedores que pueden tratar algunos datos técnicos o de contacto:</p>
        <ul>
          <li>Cloudflare: alojamiento del sitio y seguridad (registra datos técnicos como la dirección IP).</li>
          <li>Google Fonts: tipografías del sitio (tu navegador se conecta a servidores de Google).</li>
          <li>WhatsApp (Meta): cuando nos escribes por ese medio.</li>
          <li>Mercado Pago: procesa los pagos en línea.</li>
          <li>Resend: envía los correos de confirmación de pago.</li>
          <li>Proveedor de correo electrónico, para recibir y responder correos.</li>
        </ul>
        <p>Algunos de estos proveedores pueden almacenar datos fuera de Chile.</p>
      </section>

      <section>
        <h2>5. Cuánto tiempo los guardamos</h2>
        <p>
          Guardamos tus datos mientras dure la relación comercial y luego solo el tiempo que exijan las normas tributarias
          y legales. Después los eliminamos.
        </p>
      </section>

      <section>
        <h2>6. Tus derechos</h2>
        <p>Puedes pedirnos en cualquier momento:</p>
        <ul>
          <li>Acceso: saber qué datos tuyos tenemos.</li>
          <li>Rectificación: corregir datos inexactos o incompletos.</li>
          <li>Supresión: eliminar tus datos cuando ya no sean necesarios.</li>
          <li>Oposición: oponerte a un tratamiento determinado.</li>
          <li>Portabilidad: recibir tus datos en un formato de uso común.</li>
          <li>Bloqueo: suspender temporalmente su tratamiento.</li>
        </ul>
        <p>
          Escríbenos a <a href={`mailto:${NEGOCIO.correo}`}>{NEGOCIO.correo}</a> indicando tu nombre y lo que solicitas.
          Te responderemos dentro de los plazos legales. Si no quedas conforme, puedes reclamar ante la autoridad de
          protección de datos personales que corresponda.
        </p>
      </section>

      <section>
        <h2>7. Seguridad</h2>
        <p>
          Aplicamos medidas razonables para proteger tus datos: conexiones cifradas (HTTPS), acceso restringido y sin
          compartir claves de clientes por canales abiertos.
        </p>
      </section>

      <section>
        <h2>8. Cambios a esta política</h2>
        <p>Si actualizamos esta política, publicaremos la nueva versión en esta página con su fecha.</p>
      </section>
    </LegalLayout>
  )
}
