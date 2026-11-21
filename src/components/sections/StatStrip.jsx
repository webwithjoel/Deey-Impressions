import { copy } from '../../data/copy'

export default function StatStrip() {
  return <section className="bg-purple-dark text-cream">
    <div className="page-shell grid grid-cols-2 md:grid-cols-4 py-7">
      {copy.stats.map(([value, label], index) => <div key={value} className={`px-3 py-3 text-center ${index % 2 ? '' : 'md:border-r'} ${index > 1 ? 'border-t md:border-t-0' : ''} ${index === 1 ? 'border-l md:border-l-0 md:border-r' : ''} ${index === 3 ? 'border-l' : ''} border-gold/50`}>
        <strong className="block font-heading text-gold-light text-lg sm:text-xl">{value}</strong>
        <span className="text-[11px] sm:text-xs text-cream/75">{label}</span>
      </div>)}
    </div>
  </section>
}
