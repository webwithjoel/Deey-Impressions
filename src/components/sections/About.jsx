import { ShieldCheck, Sparkles, Briefcase } from 'lucide-react'
import { copy } from '../../data/copy'

export default function About() {
  const values = [
    ['Reliable', 'On time, every time.', ShieldCheck],
    ['Fresh', 'Cooked for your event, not reheated.', Sparkles],
    ['Professional', 'Uniformed, trained, and ready to serve.', Briefcase],
  ]
  return <section id="about" className="section bg-cream">
    <div className="page-shell grid md:grid-cols-2 gap-8 items-center">
      <img src="/images/buffet-stations.jpg" alt="Deey Catering servers at a full buffet" loading="lazy" className="w-full h-[380px] rounded-card object-cover" />
      <div>
        <h2 className="section-title text-left">{copy.about.heading}</h2>
        <p className="mt-5 text-sm sm:text-base text-charcoal/75 leading-7">{copy.about.story}</p>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {values.map(([title, text, Icon]) => <article key={title} className="rounded-card bg-white border border-soft p-3 sm:p-4 text-center">
            <Icon className="mx-auto text-gold" size={24} /><h3 className="font-heading text-purple mt-2">{title}</h3><p className="mt-1 text-[10px] sm:text-xs text-charcoal/65">{text}</p>
          </article>)}
        </div>
      </div>
    </div>
  </section>
}
