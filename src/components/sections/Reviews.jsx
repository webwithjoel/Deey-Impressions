import { useEffect, useRef, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { reviews } from '../../data/reviews'
import { copy } from '../../data/copy'

export default function Reviews() {
  const [index, setIndex] = useState(0)
  const touch = useRef(false)
  useEffect(() => {
    if (touch.current) return
    const timer = setInterval(() => setIndex(current => (current + 1) % reviews.length), 5000)
    return () => clearInterval(timer)
  }, [index])
  return <section id="reviews" className="section bg-purple-dark text-cream" onTouchStart={() => { touch.current = true }} onTouchEnd={() => { touch.current = false }}>
    <div className="page-shell">
      <h2 className="section-title text-cream">What Our Clients Say</h2>
      <div className="mt-8 max-w-2xl mx-auto">
        <article className="rounded-3xl bg-white text-charcoal p-5 sm:p-7 shadow-lg">
          <div className="flex items-center gap-2 pb-4 border-b border-soft text-sm font-semibold"><MessageCircle size={18} className="text-whatsapp" /><span>Client chat</span></div>
          <p className="mt-5 bg-[#E7F7E9] rounded-2xl rounded-tl-sm p-4 leading-7">{reviews[index]}</p>
          <div className="mt-4 flex justify-end gap-1">{[0, 1, 2].map(dot => <span key={dot} className="w-1 h-1 rounded-full bg-charcoal/30" />)}</div>
        </article>
        <div className="mt-5 flex justify-center gap-2">{reviews.map((_, dot) => <button key={dot} onClick={() => setIndex(dot)} aria-label={`View review ${dot + 1}`} className={`h-2 rounded-full transition-all ${index === dot ? 'w-6 bg-gold' : 'w-2 bg-white/40'}`} />)}</div>
        <p className="mt-4 text-center text-xs text-cream/70">{copy.reviewsCaption}</p>
      </div>
    </div>
  </section>
}
