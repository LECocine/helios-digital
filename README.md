# Helios · Landing page

Landing de Servicios Helios SpA, hecha con React + Vite + Tailwind CSS v4 + lucide-react.
Los contactos van a WhatsApp con un mensaje prellenado. El checkout (`/checkout`) cobra con Mercado Pago a través de un
Cloudflare Worker (`worker/index.js`) que registra los pedidos en D1 y envía el correo de confirmación con Resend.

## 1. Instalar y correr en local

```bash
cd ~/Projects/helios-digital
npm install
npm run dev
```

Se abre en http://localhost:5173

## 2. Completar tus datos

Edita `src/data.js`:

- `whatsapp`: tu número sin "+" ni espacios (ej. `56912345678`)
- `whatsappVisible`: como quieres que se vea (ej. `+56 9 1234 5678`)
- `correo`: tu correo de contacto
- `PLANES`: precios, textos y el mensaje que llega por WhatsApp en cada plan

## 3. Subir a GitHub

```bash
git init
git add .
git commit -m "Landing Helios"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/helios-digital.git
git push -u origin main
```

## 4. Publicar en Cloudflare Pages

1. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → elige el repo.
2. Framework preset: **React (Vite)**
   - Build command: `npm run build`
   - Build output directory: `dist`
3. Deploy. Después puedes conectar tu dominio .cl en Custom domains.

## Estructura

```
src/
  data.js              ← datos del negocio y planes
  index.css            ← colores (paleta desierto) y fuentes
  App.jsx              ← orden de las secciones
  components/
    Header, Hero, Sectores, Servicios, Tarjeta, Catalogo,
    Complementos, Proceso, Planes, Contacto, Footer, WhatsAppFlotante,
    Logo, SectionHeading
  pages/Checkout.jsx, pages/CheckoutResultado.jsx ← checkout y resultado del pago
worker/index.js        ← servidor: /api/checkout, /api/webhook-mp, /api/pedido
worker/schema.sql      ← tabla de pedidos (D1)
public/favicon.svg     ← ícono con el logo Helios
```

## Paleta

| Nombre    | Hex       | Uso                 |
|-----------|-----------|---------------------|
| Arena     | `#F6EEE3` | fondo               |
| Duna      | `#EADBC6` | secciones           |
| Sol       | `#E8A33D` | acento              |
| Cobre     | `#C97C46` | ilustración         |
| Terracota | `#B8492A` | botones             |
| Noche     | `#241510` | texto oscuro/fondos |

Fuentes: Space Grotesk (títulos) e Inter (texto), desde Google Fonts en `index.html`.

## Checkout con Mercado Pago

Flujo: `/checkout` → `POST /api/checkout` (guarda el pedido en D1 y crea la preferencia) → el cliente paga en
Mercado Pago → Mercado Pago avisa a `POST /api/webhook-mp` → el worker consulta el pago, marca el pedido como
`pagado` y envía el correo al cliente y a `EMAIL_ADMIN` → el cliente vuelve a `/checkout/resultado`.

Los montos se calculan en el servidor con `calcularPedido()` de `src/data.js`; el navegador no puede cambiarlos.

### 1. Mercado Pago
1. Entra a https://www.mercadopago.cl/developers → **Tus integraciones** → **Crear aplicación**
   (producto: *Checkout Pro*, pagos online).
2. Copia el **Access Token** de *Credenciales de prueba* (para probar) y después el de *Credenciales de producción*.
   Para producción, Mercado Pago pide completar los datos de la cuenta y activar las credenciales.
3. En la aplicación → **Webhooks** → URL de producción `https://helioswebs.site/api/webhook-mp`, evento **Pagos**.
   Guarda y copia la **clave secreta**.

### 2. Base de datos (Cloudflare D1)
```bash
npm i -D wrangler
npx wrangler login
npx wrangler d1 create helios-pedidos        # copia el database_id en wrangler.jsonc
npx wrangler d1 execute helios-pedidos --remote --file=worker/schema.sql
```

### 3. Correo (Resend)
1. Crea cuenta en https://resend.com → **Domains** → agrega `helioswebs.site` y crea en Cloudflare DNS los
   registros que te indique (SPF/DKIM). Espera a que quede *Verified*.
2. **API Keys** → crea una con permiso de envío.
3. Ajusta `EMAIL_FROM` y `EMAIL_ADMIN` en `wrangler.jsonc` si quieres otros correos.

### 4. Secretos y publicación
```bash
npx wrangler secret put MP_ACCESS_TOKEN
npx wrangler secret put MP_WEBHOOK_SECRET
npx wrangler secret put RESEND_API_KEY
npm run build && npx wrangler deploy
```

### 5. Probar
- Usa primero el Access Token de prueba y paga con las tarjetas de prueba de Mercado Pago Chile, desde un
  usuario comprador de prueba (no con tu propia cuenta).
- Ver pedidos:
  `npx wrangler d1 execute helios-pedidos --remote --command "SELECT id,creado,plan_nombre,monto_hoy,estado,correo FROM pedidos ORDER BY creado DESC LIMIT 20"`
- Logs en vivo: `npx wrangler tail`
- Estados: `creado` (no pagó aún), `pendiente`, `pagado`, `rechazado`, `reembolsado`, `revisar` (el monto pagado
  no coincide: revisar a mano).

### En local
Crea `.dev.vars` (no se sube a git) con `MP_ACCESS_TOKEN=...`, `MP_WEBHOOK_SECRET=...`, `RESEND_API_KEY=...` y:
```bash
npx wrangler d1 execute helios-pedidos --local --file=worker/schema.sql
npm run build && npx wrangler dev
```

## Cobrar el saldo (50% restante)

Para landing y corporativa el cliente paga el 50% al comprar. Cuando el proyecto está listo, cobras el resto con un
link de Mercado Pago atado al mismo pedido: al pagar, el pedido queda con `saldo_estado = pagado` y llegan los correos.
(Las tarjetas se pagan completas, no tienen saldo.)

### Una sola vez
```bash
# 1. Agrega las columnas del saldo a la base ya creada
npx wrangler d1 execute helios-pedidos --remote --file=worker/migracion-saldo.sql

# 2. Crea una clave tuya (no la compartas) y guárdala en Cloudflare
openssl rand -hex 24
npx wrangler secret put ADMIN_TOKEN        # pega esa clave
# 3. Pega la MISMA clave en .dev.vars (archivo local que no se sube a git), en una línea nueva:
#    ADMIN_TOKEN=la-clave-que-generaste
npm run build && npx wrangler deploy
```

### Cada vez que termines un proyecto
```bash
npm run pedidos:saldo                  # lista pedidos pagados con saldo pendiente
npm run saldo -- H-XXXXXXXX            # crea el link y se lo envía al cliente por correo
npm run saldo -- H-XXXXXXXX --sin-correo   # solo muestra el link (para mandarlo por WhatsApp)
npm run saldo -- H-XXXXXXXX --regenerar    # link nuevo si el anterior se perdió
```
Estados de `saldo_estado`: `ninguno` (aún sin link), `link_enviado`, `pagado`, `revisar` (monto distinto: mirar a mano),
`reembolsado`. Si el cliente paga dos veces con el mismo link, el segundo pago no se registra y queda en los logs
(`wrangler tail`) para devolverlo a mano desde el panel de Mercado Pago.
