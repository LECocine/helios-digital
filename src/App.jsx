import Header from './components/Header'
import Hero from './components/Hero'
import Sectores from './components/Sectores'
import Servicios from './components/Servicios'
import Tarjeta from './components/Tarjeta'
import Catalogo from './components/Catalogo'
import Complementos from './components/Complementos'
import Proceso from './components/Proceso'
import Planes from './components/Planes'
import Contacto from './components/Contacto'
import Footer from './components/Footer'
import WhatsAppFlotante from './components/WhatsAppFlotante'
import Terminos from './pages/Terminos'
import Privacidad from './pages/Privacidad'

function SaltarContenido() {
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-noche focus:px-4 focus:py-2 focus:text-arena"
    >
      Saltar al contenido
    </a>
  )
}

function Inicio() {
  return (
    <>
      <Header />
      <main id="contenido">
        <Hero />
        <Sectores />
        <Servicios />
        <Tarjeta />
        <Catalogo />
        <Complementos />
        <Proceso />
        <Planes />
        <Contacto />
      </main>
    </>
  )
}

const RUTAS = {
  '/terminos': Terminos,
  '/privacidad': Privacidad,
}

export default function App() {
  const ruta = window.location.pathname.replace(/\/+$/, '') || '/'
  const Pagina = RUTAS[ruta] ?? Inicio

  return (
    <>
      <SaltarContenido />
      <Pagina />
      <Footer />
      <WhatsAppFlotante />
    </>
  )
}
