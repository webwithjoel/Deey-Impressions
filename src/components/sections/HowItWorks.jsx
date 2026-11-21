import { CalendarCheck, SlidersHorizontal, MessageCircle, CookingPot } from 'lucide-react'
import { copy } from '../../data/copy'

export default function HowItWorks() {
  const icons = [CalendarCheck, SlidersHorizontal, MessageCircle, CookingPot]
  return <section id="how-it-works" className="section bg-cream">
    <div className="page-shell">
      <h2 className="section-title">How It Works</h2>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {copy.howItWorks.map(([title, text], index) => { const Icon = icons[index]; return <article key={title} className="rounded-card border border-soft bg-white p-5">
          <div className="flex items-center justify-between"><span className="w-10 h-10 rounded-full bg-purple text-gold-light flex items-center justify-center font-heading">{index + 1}</span><Icon className="text-gold" /></div>
          <h3 className="font-heading text-xl text-purple mt-5">{title}</h3><p className="mt-2 text-sm text-charcoal/70">{text}</p>
        </article> })}
      </div>
    </div>
  </section>
}
