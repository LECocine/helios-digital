import { MessageCircle } from 'lucide-react'
import { waLink } from '../data'

export default function WhatsAppFlotante() {
  return (
    <a
      href={waLink('Hola, vi su página y quiero cotizar.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <MessageCircle size={28} aria-hidden="true" />
    </a>
  )
}
