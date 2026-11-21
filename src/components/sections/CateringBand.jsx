import { copy } from '../../data/copy'

export default function CateringBand() {
  return <section className="bg-purple text-cream">
    <div className="grid lg:grid-cols-2">
      <img src="/images/buffet-chafing-dishes.jpg" alt="Deey Catering buffet with gold chafing dishes" loading="lazy" className="w-full h-72 lg:h-[420px] object-cover" />
      <div className="page-pad flex flex-col justify-center py-12 lg:py-16 lg:px-14">
        <h2 className="font-heading text-3xl sm:text-4xl">{copy.cateringBand.heading}</h2>
        <p className="mt-5 text-cream/85 leading-7">{copy.cateringBand.text}</p>
        <a href="#event" className="primary-button mt-7 self-start">Plan My Event</a>
      </div>
    </div>
  </section>
}
