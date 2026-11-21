import { useEffect, useMemo, useState } from 'react'
import { X, Trash2, Pencil, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useEvents } from '../../context/EventsContext'
import { eventDelivery } from '../../utils/pricing'
import { formatNaira } from '../../utils/formatNaira'
import { buildWhatsAppMessage } from '../../utils/whatsapp'
import { business } from '../../data/business'

export default function CartDrawer({ onClose, onEdit }) {
  const { cart, removeItem, clearCart } = useCart()
  const { events } = useEvents()
  const [checkout, setCheckout] = useState(false)
  const [thanks, setThanks] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', notes: '' })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const groups = useMemo(() => events.map(event => {
    const items = cart.filter(item => item.eventId === event.id)
    if (!items.length) return null
    const itemsTotal = items.reduce((sum, item) => sum + item.total, 0)
    const delivery = eventDelivery(event)
    return { event, items, delivery, subtotal: itemsTotal + delivery }
  }).filter(Boolean), [cart, events])
  const grandTotal = groups.reduce((sum, group) => sum + group.subtotal, 0)

  const placeOrder = () => {
    if (!form.name || !form.phone) return alert('Please enter your name and phone number.')
    const message = buildWhatsAppMessage({ ...form, groups, grandTotal })
    window.open(`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    setThanks(true)
  }
  const startNew = () => { clearCart(); setThanks(false); setCheckout(false); setForm({ name: '', phone: '', notes: '' }); onClose() }

  return <div className="fixed inset-0 z-[80] flex justify-end bg-purple-dark/60">
    <aside className="w-full sm:max-w-md h-full bg-cream shadow-2xl flex flex-col">
      <div className="h-[72px] px-4 border-b border-soft bg-white flex items-center justify-between">
        <div><p className="text-xs text-charcoal/60">Item count: {cart.length}</p><h2 className="font-heading text-2xl text-purple">{thanks ? 'Thank You' : checkout ? 'Checkout' : 'Your Cart'}</h2></div>
        <button className="icon-btn" onClick={onClose} aria-label="Close cart"><X /></button>
      </div>
      <div className="modal-scroll flex-1 overflow-y-auto p-4">
        {thanks ? <div className="h-full flex flex-col items-center justify-center text-center px-5">
          <div className="w-16 h-16 rounded-full bg-whatsapp text-white flex items-center justify-center"><ShoppingBag /></div>
          <h3 className="font-heading text-2xl text-purple mt-5">Your order is ready on WhatsApp.</h3>
          <p className="mt-3 text-sm text-charcoal/70">Send the message to confirm with us.</p>
          <button onClick={startNew} className="primary-button mt-6">Start a new order</button>
        </div> : checkout ? <div>
          <h3 className="font-heading text-xl text-purple">Checkout details</h3>
          <div className="mt-4 space-y-4">
            <label className="field">Full name<input value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} required /><small>Who should we ask for?</small></label>
            <label className="field">Phone number<input type="tel" value={form.phone} onChange={e => setForm(v => ({ ...v, phone: e.target.value }))} required /><small>For confirmation on WhatsApp</small></label>
            <label className="field">Order notes<textarea value={form.notes} onChange={e => setForm(v => ({ ...v, notes: e.target.value }))} /><small>Optional order instructions</small></label>
          </div>
          <div className="mt-6 rounded-card bg-white border border-soft p-4 flex justify-between"><span className="text-sm">Estimated total</span><strong className="text-purple">{formatNaira(grandTotal)}</strong></div>
        </div> : cart.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-center px-6">
          <ShoppingBag size={48} className="text-gold" /><h3 className="font-heading text-2xl text-purple mt-4">Your cart is empty</h3><p className="mt-2 text-sm text-charcoal/65">Choose a favourite and customize it for your event.</p><button onClick={() => { onClose(); document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' }) }} className="primary-button mt-5">Browse the menu</button>
        </div> : groups.map(group => <section key={group.event.id} className="mb-5 rounded-card bg-white border border-soft overflow-hidden">
          <header className="bg-purple text-cream p-4"><h3 className="font-heading text-lg">{group.event.name}</h3><p className="mt-1 text-xs text-cream/75">{group.event.type} • {group.event.date} • {group.event.time}</p><p className="mt-1 text-xs text-cream/75">{group.event.venue}, {group.event.city} • {group.event.guests} guests</p><p className="mt-3 text-sm text-gold-light">Delivery: {formatNaira(group.delivery)}</p></header>
          <div className="divide-y divide-soft">{group.items.map(item => <article key={item.id} className="p-3">
            <div className="flex gap-3"><img src={item.image} alt={item.name} loading="lazy" className="w-16 h-16 rounded-lg object-cover" /><div className="flex-1 min-w-0"><h4 className="font-heading text-purple">{item.name}</h4><p className="text-[11px] text-charcoal/60 line-clamp-2">{item.summary}</p><strong className="block mt-2 text-sm">{formatNaira(item.total)}</strong></div></div>
            <div className="mt-3 flex justify-end gap-2"><button onClick={() => { onClose(); onEdit(item) }} className="min-h-11 px-3 text-sm flex items-center gap-1 text-purple"><Pencil size={15} />Edit</button><button onClick={() => removeItem(item.id)} className="min-h-11 px-3 text-sm flex items-center gap-1 text-red-700"><Trash2 size={15} />Remove</button></div>
          </article>)}</div>
          <footer className="p-4 flex justify-between border-t border-soft text-sm"><span>Event subtotal</span><strong>{formatNaira(group.subtotal)}</strong></footer>
        </section>)}
      </div>
      {!thanks && cart.length > 0 && <div className="border-t border-soft bg-white p-4">
        <div className="flex justify-between mb-3"><span className="text-sm">Estimated total</span><strong className="text-xl text-purple">{formatNaira(grandTotal)}</strong></div>
        {checkout ? <div className="flex gap-2"><button onClick={() => setCheckout(false)} className="secondary-button border-purple text-purple flex-1">Back</button><button onClick={placeOrder} className="primary-button flex-1">Place Order on WhatsApp</button></div> :
          <button onClick={() => setCheckout(true)} className="primary-button w-full">Checkout on WhatsApp</button>}
      </div>}
    </aside>
  </div>
}
