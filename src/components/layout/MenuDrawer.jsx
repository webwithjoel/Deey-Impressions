import { useEffect } from 'react'
import { X } from 'lucide-react'
import { business } from '../../data/business'

const links = ['Home', 'Event Catering', 'Rice & Main Meals', 'Grills & Proteins', 'Small Chops & Snacks', 'DeeY Mix Bar', 'Lunch & After-Party Packs', 'Plan My Event', 'How It Works', 'About Us', 'Reviews', 'Contact']
export default function MenuDrawer({ open, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  if (!open) return null
  const scrollTo = label => {
    const ids = { Home: 'home', 'Plan My Event': 'event', 'How It Works': 'how-it-works', 'About Us': 'about', Reviews: 'reviews', Contact: 'contact' }
    document.getElementById(ids[label] || 'featured')?.scrollIntoView({ behavior: 'smooth' })
    onClose()
  }
  return <div className="fixed inset-0 z-[70]">
    <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close menu" />
    <aside className="absolute left-0 top-0 bottom-0 w-[86%] max-w-sm bg-purple-dark text-cream p-5 overflow-y-auto animate-slide-in">
      <div className="flex items-center justify-between">
        <img src="/images/logo.png" alt="Deey Catering" className="w-14 h-14" />
        <button className="icon-btn text-cream" onClick={onClose} aria-label="Close menu"><X /></button>
      </div>
      <nav className="mt-6 grid">
        {links.map(link => <button key={link} onClick={() => scrollTo(link)} className="text-left py-3 border-b border-white/10 hover:text-gold-light">{link}</button>)}
      </nav>
      <a className="mt-6 flex items-center justify-center rounded-full bg-whatsapp text-white font-semibold h-12" target="_blank" rel="noreferrer" href={`https://wa.me/${business.whatsappNumber}?text=Hello%20Deey%20Catering`}>Chat on WhatsApp</a>
      <div className="mt-5 text-sm space-y-2 text-cream/80">
        <a href={`tel:${business.phoneNumber}`} className="block">{business.phone}</a>
        <a href={business.instagramUrl} target="_blank" rel="noreferrer" className="block">{business.instagram}</a>
        <p>Serving Ile-Ife, Ilesha and Osogbo</p>
      </div>
    </aside>
  </div>
}
