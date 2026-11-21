import { useState } from 'react'
import { Trash2, CalendarDays, MapPin, Users } from 'lucide-react'
import { useEvents } from '../../context/EventsContext'
import { useCart } from '../../context/CartContext'
import { eventDelivery } from '../../utils/pricing'
import { formatNaira } from '../../utils/formatNaira'
import { copy } from '../../data/copy'

const types = ['Wedding', 'Burial', 'Birthday', 'Naming Ceremony', 'Convocation', 'Corporate / Dinner', 'Office / Lunch Order', 'After-Party', 'Other']
const empty = { name: '', type: 'Wedding', date: '', time: '', city: 'Ile-Ife', venue: '', guests: '', notes: '' }

function dateMinimum(type) {
  const date = new Date()
  date.setDate(date.getDate() + (type === 'Office / Lunch Order' || type === 'After-Party' ? 1 : 5))
  return date.toISOString().split('T')[0]
}

export default function EventSection() {
  const { events, activeEventId, setActiveEventId, addEvent, deleteEvent } = useEvents()
  const { removeByEvent } = useCart()
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const set = (key, value) => setForm(current => ({ ...current, [key]: value }))
  const submit = e => {
    e.prevent?.(e)
    if (!form.name || !form.date || !form.time || !form.venue || !form.guests) return alert('Please complete all required event fields.')
    addEvent(editing ? { ...form, id: editing } : form)
    setForm(empty)
    setEditing(null)
    window.dispatchEvent(new CustomEvent('deey-toast', { detail: 'Event saved' }))
  }
  const editEvent = event => { setEditing(event.id); setForm(event); document.getElementById('event-form')?.scrollIntoView({ behavior: 'smooth' }) }
  const removeEvent = event => {
    if (!confirm(`Delete "${event.name}"? This also removes its cart items.`)) return
    deleteEvent(event.id)
    removeByEvent(event.id)
  }
  return <section id="event" className="scroll-mt-24 mb-12">
    <div className="rounded-card bg-white border border-soft shadow-soft p-4 sm:p-6">
      <h2 className="font-heading text-3xl text-purple">{copy.featured.eventHeading}</h2>
      <p className="mt-2 text-sm text-charcoal/70">{copy.featured.eventHelper}</p>
      <form id="event-form" onSubmit={submit} className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <label className="field">Event name<input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Tunde and Bisi's Wedding" required /><small>e.g. Tunde and Bisi's Wedding</small></label>
        <label className="field">Event type<select value={form.type} onChange={e => set('type', e.target.value)}>{types.map(type => <option key={type}>{type}</option>)}</select><small>Choose the event category</small></label>
        <label className="field">Event date<input type="date" min={dateMinimum(form.type)} value={form.date} onChange={e => set('date', e.target.value)} required /><small>Based on our lead time</small></label>
        <label className="field">Time food is needed<input type="time" value={form.time} onChange={e => set('time', e.target.value)} required /><small>When service should begin</small></label>
        <label className="field">City<select value={form.city} onChange={e => set('city', e.target.value)}>{['Ile-Ife', 'Ilesha', 'Osogbo'].map(city => <option key={city}>{city}</option>)}</select><small>Delivery: {formatNaira(eventDelivery({ ...form, guests: form.guests || 0 }))}</small></label>
        <label className="field">Venue or address<input value={form.venue} onChange={e => set('venue', e.target.value)} required /><small>Where we should deliver</small></label>
        <label className="field">Number of guests<input type="number" min="1" value={form.guests} onChange={e => set('guests', e.target.value)} required /><small>Estimated guest count</small></label>
        <label className="field">Notes<textarea value={form.notes} onChange={e => set('notes', e.target.value)} /><small>Optional instructions</small></label>
        <button type="submit" className="primary-button sm:col-span-2 lg:col-span-1">{editing ? 'Update Event' : 'Save Event'}</button>
      </form>
    </div>
    {events.length === 0 ? <p className="mt-4 rounded-card border border-dashed border-purple/30 p-5 text-center text-sm text-charcoal/70">Save your first event to start ordering</p> :
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {events.map(event => <article key={event.id} className={`event-card min-w-[280px] ${activeEventId === event.id ? 'ring-2 ring-gold' : ''}`}>
          <button className="text-left flex-1" onClick={() => setActiveEventId(event.id)}>
            <strong className="block text-purple">{event.name}</strong>
            <span className="text-xs text-charcoal/70">{event.type}</span>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs"><span className="flex gap-1"><CalendarDays size={14} />{event.date}</span><span className="flex gap-1"><MapPin size={14} />{event.city}</span><span className="flex gap-1"><Users size={14} />{event.guests} guests</span><span>{activeEventId === event.id ? '● Active event' : 'Use this event'}</span></div>
          </button>
          <div className="flex flex-col gap-2"><button onClick={() => editEvent(event)} className="text-xs underline">Edit</button><button onClick={() => removeEvent(event)} aria-label={`Delete ${event.name}`}><Trash2 size={16} /></button></div>
        </article>)}
      </div>}
  </section>
}
