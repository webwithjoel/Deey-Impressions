import { ArrowRight } from 'lucide-react'
import { categories } from '../../data/categories'
import { copy } from '../../data/copy'

export default function CategoryCards() {
  const selectCategory = filter => {
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })
    window.dispatchEvent(new CustomEvent('deey-filter', { detail: filter }))
  }
  return <section className="section bg-cream">
    <div className="page-shell">
      <h2 className="section-title">{copy.categoriesHeading}</h2>
      <p className="section-subtitle">{copy.categoriesSub}</p>
      {/* Later, each card will link to its own category page. */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {categories.map(category => <button key={category.name} onClick={() => selectCategory(category.filter)} className="category-card group text-left" aria-label={`View ${category.name}`}>
          <img src={category.image} alt={category.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-dark via-purple-dark/30 to-transparent" />
          <div className="absolute left-3 right-3 bottom-3 sm:left-5 sm:right-5 sm:bottom-5 text-cream">
            <h3 className="font-heading text-base sm:text-xl pr-10">{category.name}</h3>
            <p className="hidden sm:block mt-2 text-xs text-cream/85 leading-5 pr-12">{category.description}</p>
            <span className="absolute right-0 bottom-0 w-11 h-11 rounded-full bg-gold text-purple-dark flex items-center justify-center group-hover:bg-gold-light"><ArrowRight /></span>
          </div>
        </button>)}
      </div>
    </div>
  </section>
}
