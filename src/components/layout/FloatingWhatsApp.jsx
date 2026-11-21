import { MessageCircle } from 'lucide-react'
import { business } from '../../data/business'

export default function FloatingWhatsApp({ hidden }) {
  if (hidden) return null
  return <a aria-label="Chat on WhatsApp" className="fixed z-40 bottom-5 right-5 w-14 h-14 rounded-full bg-whatsapp text-white shadow-lg flex items-center justify-center" target="_blank" rel="noreferrer" href={`https://wa.me/${business.whatsappNumber}?text=Hello%20Deey%20Catering%2C%20I%20would%20like%20to%20make%20an%20enquiry.`}>
    <MessageCircle />
  </a>
}
