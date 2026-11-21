import { useEffect, useState } from 'react'
import { formatNaira } from '../../utils/formatNaira'
import { products } from '../../data/products'
import { copy } from '../../data/copy'
import EventSection from './EventSection'

export default function Featured({ onCustomize }) {
  const [filter, setFilter] = useState('All')
  useEffect(() => {
    const listener = e => { setFilter(e.detail); document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' }) }
    window.addEventListener('deey-filter', listener)
    return () => window.removeEventListener('deey-filter', listener)
  }, [])
  const visible = filter === 'All' ? products : products.filter(product => product.category === filter)
  return <section id="featured" className="section scroll-mt-20 bg-[#FDF9F2]">
    <div className="page-shell">
      <EventSection />
      <h2 className="section-title mt-12">{copy.featured.heading}</h2>
      <p className="section-subtitle">{copy.featured.sub}</p>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {['All', 'Catering', 'Meals', 'Grills', 'Snacks', 'Bar', 'Packs'].map(chip => <button key={chip} onClick={() => setFilter(chip)} className={`filter-chip ${filter === chip ? 'active' : ''}`}>{chip}</button>)}
      </div>
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {visible.map(product => <article key={product.id} className="product-card">
          <img src={product.image} alt={product.name} loading="lazy" className="w-full aspect-[4/3] object-cover" />
          <div className="p-3 sm:p-4">
            <h3 className="font-heading text-purple text-base sm:text-xl">{product.name}</h3>
            <p className="mt-1 text-[11px] sm:text-sm text-charcoal/65 min-h-10">{product.description}</p>
            <p className="mt-3 text-sm font-semibold text-charcoal">From {formatNaira(product.from)}</p>
            <button onClick={() => onCustomize(product)} className="primary-button mt-3 w-full">Customize</button>
          </div>
        </article>)}
      </div>
    </div>
  </section>
}
