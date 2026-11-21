import { business } from '../../data/business'
import { copy } from '../../data/copy'

export default function Footer() {
  return <footer id="contact" className="bg-purple-dark text-cream py-12">
    <div className="page-shell grid md:grid-cols-3 gap-8">
      <div><img src="/images/logo.png" alt="Deey Catering" className="w-20 h-20" /><p className="font-heading text-xl mt-3">{business.tagline}</p></div>
      <div><h3 className="font-heading text-xl text-gold-light">Quick links</h3><div className="mt-3 grid gap-2 text-sm">
        <a href="#home">Home</a><a href="#featured">Our Menu</a><a href="#event">Plan My Event</a><a href="#how-it-works">How It Works</a><a href="#about">About Us</a>
      </div></div>
      <div><h3 className="font-heading text-xl text-gold-light">Contact</h3><div className="mt-3 text-sm space-y-2">
        <a className="block" href={`https://wa.me/${business.whatsappNumber}`}>WhatsApp: {business.whatsapp}</a>
        <a className="block" href={`tel:${business.phoneNumber}`}>Call: {business.phone}</a>
        <a className="block" href={business.instagramUrl} target="_blank" rel="noreferrer">Instagram: {business.instagram}</a>
        <p>Serving Ile-Ife, Ilesha and Osogbo, Osun State</p>
      </div></div>
    </div>
    <p className="page-shell mt-10 pt-6 border-t border-white/10 text-xs text-cream/70">© 2026 Deey Catering (Dee.Y Impressions). All rights reserved.</p>
  </footer>
}
