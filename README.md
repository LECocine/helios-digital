# Helios Digital · Landing page

Landing de Servicios Helios SpA, hecha con React + Vite + Tailwind CSS v4 + lucide-react.
No usa backend: todos los contactos van a WhatsApp con un mensaje prellenado.

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
git commit -m "Landing Helios Digital"
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
