import { copy } from '../../data/copy'

export default function Hero() {
  return <section id="home" className="relative min-h-[560px] flex items-end bg-cover bg-center" style={{ backgroundImage: "linear-gradient(110deg, rgba(46,8,51,.92), rgba(75,15,85,.48)), url('/images/live-station-counter.jpg')" }}>
    <div className="page-shell py-16 text-cream">
      <p className="text-gold-light text-xs sm:text-sm font-semibold uppercase tracking-[.18em]">{copy.hero.eyebrow}</p>
      <h1 className="font-heading text-4xl sm:text-6xl max-w-3xl mt-4 leading-tight">{copy.hero.headline}</h1>
      <p className="mt-5 max-w-2xl text-cream/90 text-sm sm:text-base leading-7">{copy.hero.subtext}</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <a href="#event" className="primary-button">Plan My Event</a>
        <a href="#featured" className="secondary-button">See the Menu</a>
      </div>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {copy.hero.pills.map(pill => <span key={pill} className="shrink-0 rounded-full border border-gold/70 px-4 py-2 text-xs text-gold-light">{pill}</span>)}
      </div>
    </div>
  </section>
}
