import { useEffect, useMemo, useState } from 'react'
import { X, ChevronLeft, Check } from 'lucide-react'
import { useEvents } from '../../context/EventsContext'
import { useCart } from '../../context/CartContext'
import { productPrice, eventDelivery } from '../../utils/pricing'
import { formatNaira } from '../../utils/formatNaira'

const stepCounts = { rice: 5, grills: 4, bowls: 4, gizzard: 3, chops: 4, bar: 4, packs: 4, station: 5 }
const types = ['Wedding', 'Burial', 'Birthday', 'Naming Ceremony', 'Convocation', 'Corporate / Dinner', 'Office / Lunch Order', 'After-Party', 'Other']
const eventEmpty = { name: '', type: 'Wedding', date: '', time: '', city: 'Ile-Ife', venue: '', guests: '', notes: '' }
const serviceOptions = [
  ['Plates / packs delivered', '/images/lunch-packs.jpg', '₦0'],
  ['Buffet on chafing dishes', '/images/buffet-stations.jpg', 'Per 25 plates'],
  ['Live food station', '/images/live-station-counter.jpg', '₦80,000 per station'],
  ['Plated and served by waiters', '/images/stew-bowls-trolley.jpg', '+₦500 per plate'],
]

function dateMinimum(type) {
  const date = new Date()
  date.setDate(date.getDate() + (type === 'Office / Lunch Order' || type === 'After-Party' ? 1 : 5))
  return date.toISOString().split('T')[0]
}

function Stepper({ value, setValue, min = 0, max = 1000 }) {
  return <div className="stepper">
    <button type="button" onClick={() => setValue(Math.max(min, value - 1))} aria-label="Decrease">−</button>
    <span>{value}</span>
    <button type="button" onClick={() => setValue(Math.min(max, value + 1))} aria-label="Increase">+</button>
  </div>
}

function Choice({ selected, onClick, title, image, detail }) {
  return <button type="button" onClick={onClick} className={`choice-card ${selected ? 'selected' : ''}`}>
    {image && <img src={image} alt="" loading="lazy" />}
    <span className="mt-2 flex items-center justify-between gap-2"><strong className="text-sm text-purple">{title}</strong>{selected && <Check size={16} className="text-gold shrink-0" />}</span>
    {detail && <small className="block mt-1 text-charcoal/60">{detail}</small>}
  </button>
}

export default function ProductModal({ product, editItem, onClose }) {
  const { events, activeEventId, setActiveEventId, addEvent } = useEvents()
  const { addItem } = useCart()
  const [step, setStep] = useState(1)
  const [eventMode, setEventMode] = useState(activeEventId ? 'saved' : 'create')
  const [eventForm, setEventForm] = useState(eventEmpty)
  const [choices, setChoices] = useState(() => editItem?.choices || defaults(product.id))
  const [eventId, setEventId] = useState(editItem?.eventId || activeEventId || '')
  const [notes, setNotes] = useState(editItem?.notes || '')
  const totalSteps = stepCounts[product.id]
  const selectedEvent = events.find(event => event.id === eventId)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const setChoice = (key, value) => setChoices(current => ({ ...current, [key]: value }))
  const liveTotal = useMemo(() => productPrice(product.id, choices), [product.id, choices])

  const saveInlineEvent = () => {
    if (!eventForm.name || !eventForm.date || !eventForm.time || !eventForm.venue || !eventForm.guests) return false
    const saved = addEvent(eventForm)
    setEventId(saved.id)
    setActiveEventId(saved.id)
    setEventMode('saved')
    return true
  }

  const next = () => {
    if (step === 1) {
      if (eventMode === 'create' && !saveInlineEvent()) return alert('Please complete all required event fields.')
      if (!eventId && eventMode === 'saved') return alert('Please choose an event.')
    }
    if (product.id === 'rice' && step === 3 && !(choices.plates >= 10)) return alert('A minimum of 10 plates is required.')
    if (product.id === 'grills' && step === 2) {
      const count = (choices.chicken || 0) + (choices.fish || 0) + (choices.beef || 0) + (choices.gizzard || 0)
      if (count < 20) return alert('Choose at least 20 pieces in total.')
    }
    if (product.id === 'bowls' && step === 2 && (choices.bowls || 0) < 10) return alert('A minimum of 10 bowls is required.')
    if (product.id === 'gizzard' && step === 2 && !(choices.small + choices.medium + choices.large)) return alert('Choose at least one gizzard item.')
    if (product.id === 'bar' && step === 2 && (choices.mocktails || 0) + (choices.cocktails || 0) < 30) return alert('A minimum of 30 glasses is required.')
    if (product.id === 'packs' && step === 3 && (choices.quantity || 0) < 10) return alert('A minimum of 10 packs is required.')
    if (product.id === 'station' && step === 4 && (choices.guests || 0) < 50) return alert('A minimum of 50 guests is required.')
    if (step < totalSteps) setStep(step + 1)
  }

  const addToCart = () => {
    const effectiveEventId = eventMode === 'create' ? eventId : eventId
    if (!effectiveEventId) return alert('Please choose an event.')
    const summary = makeSummary(product.id, choices)
    addItem({ id: editItem?.id, editId: editItem?.id, eventId: effectiveEventId, productId: product.id, name: product.name, image: product.image, choices, notes, summary, total: liveTotal })
    window.dispatchEvent(new CustomEvent('deey-toast', { detail: 'Added to your cart' }))
    onClose()
  }

  return <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-purple-dark/60">
    <div className="modal-mobile w-full sm:max-w-3xl sm:h-[88vh] sm:rounded-card bg-cream shadow-2xl flex flex-col">
      <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-soft bg-white rounded-t-card">
        <div className="flex items-center justify-between"><div><p className="text-xs text-charcoal/60">Customize</p><h2 className="font-heading text-xl text-purple">{product.name}</h2></div><button className="icon-btn" onClick={onClose} aria-label="Close customize modal"><X /></button></div>
        <div className="mt-3 h-1.5 rounded-full bg-soft"><div className="h-full rounded-full bg-gold transition-all" style={{ width: `${(step / totalSteps) * 100}%` }} /></div>
        <p className="mt-2 text-xs text-charcoal/60">Step {step} of {totalSteps}</p>
      </div>
      <div className="modal-scroll flex-1 overflow-y-auto p-4 sm:p-6">
        {step === 1 ? <EventStep eventMode={eventMode} setEventMode={setEventMode} events={events} eventId={eventId} setEventId={setEventId} eventForm={eventForm} setEventForm={setEventForm} selectedEvent={selectedEvent} /> :
          renderStep(product.id, step, choices, setChoice)}
        {step === totalSteps && <label className="field mt-5">Review notes<textarea value={notes} onChange={e => setNotes(e.target.value)} /><small>Optional notes for Deey Catering</small></label>}
        {step === totalSteps && <div className="mt-5 rounded-card border border-gold/40 bg-white p-4">
          <h3 className="font-heading text-xl text-purple">Estimated Total</h3>
          <p className="mt-1 text-2xl font-bold text-charcoal">{formatNaira(liveTotal)}</p>
          <p className="mt-2 text-xs text-charcoal/60">Final amount is confirmed with you on WhatsApp.</p>
          <PriceLines productId={product.id} choices={choices} total={liveTotal} event={selectedEvent} />
        </div>}
      </div>
      <div className="min-h-[76px] border-t border-soft bg-white px-4 sm:px-6 py-3 flex items-center gap-3">
        <button disabled={step === 1} onClick={() => setStep(step - 1)} className="icon-btn disabled:opacity-30" aria-label="Previous step"><ChevronLeft /></button>
        <div className="flex-1"><p className="text-[11px] text-charcoal/60">Live total</p><strong className="text-lg text-purple">{formatNaira(liveTotal)}</strong></div>
        {step < totalSteps ? <button onClick={next} className="primary-button px-7">{step === 1 && eventMode === 'saved' && selectedEvent ? 'Looks good, next' : 'Next'}</button> :
          <button onClick={addToCart} className="primary-button px-5">Add to Cart</button>}
      </div>
    </div>
  </div>
}

function defaults(id) {
  const base = { guests: 50, servers: 0, disposable: 0, chafing: 0, coolers: 0, goldSetup: false, crates: 0 }
  if (id === 'rice') return { ...base, base: 'Party Jollof Rice', moiMoi: 0, plantain: 0, coleslaw: 0, beef: 0, fish: 0, chicken: 0, gizzard: 0, egg: 0, plates: 10, serving: 'Plates / packs delivered' }
  if (id === 'grills') return { ...base, chicken: 10, fish: 5, beef: 5, gizzard: 0, spice: 'Medium', serving: 'Plates / packs delivered' }
  if (id === 'bowls') return { ...base, bowl: 'Chicken stew bowl', rice: false, plantain: false, bowls: 10, serving: 'Plates / packs delivered' }
  if (id === 'gizzard') return { small: 1, medium: 0, large: 0, spice: 'Medium' }
  if (id === 'chops') return { ...base, cups: 10, platters: 0, trays: 0, puffPuff: 0, samosa: 0, springRolls: 0, gizzardCups: 0, display: 'Standard plates', serving: 'Plates / packs delivered' }
  if (id === 'bar') return { mocktails: 30, cocktails: 0, flavours: ['Sunrise Orange'], labels: false, liveBar: false, bars: 1 }
  if (id === 'packs') return { pack: 'Office Lunch Pack', rice: 'Party Jollof', protein: 'Beef', quantity: 10, labels: false, slot: 'Early morning' }
  if (id === 'station') return { ...base, dishes: ['Party Jollof', 'Fried Rice', 'White Rice & Stew', 'Stir-Fry Spaghetti'], protein: 'Beef / assorted meat', extraProteins: 0, guests: 50, stations: 1 }
  return base
}

function EventStep({ eventMode, setEventMode, events, eventId, setEventId, eventForm, setEventForm, selectedEvent }) {
  const set = (key, value) => setEventForm(current => ({ ...current, [key]: value }))
  return <div>
    <h3 className="font-heading text-2xl text-purple">Event</h3>
    <p className="text-sm text-charcoal/65 mt-1">Choose where this order belongs.</p>
    {events.length > 0 && <label className="field mt-5">Saved event<select value={eventMode === 'saved' ? eventId : 'create'} onChange={e => { if (e.target.value === 'create') setEventMode('create'); else { setEventMode('saved'); setEventId(e.target.value) } }}><option value="">Choose an event</option>{events.map(event => <option value={event.id} key={event.id}>{event.name}</option>)}<option value="create">Create a new event</option></select><small>Event details are used once for this order</small></label>}
    {events.length === 0 && <button type="button" onClick={() => setEventMode('create')} className="choice-card mt-5 w-full text-left"><strong>Create a new event</strong></button>}
    {eventMode === 'saved' && selectedEvent && <div className="mt-4 rounded-card bg-white border border-soft p-4 text-sm"><strong className="text-purple">{selectedEvent.name}</strong><p className="mt-1 text-charcoal/70">{selectedEvent.date} • {selectedEvent.time} • {selectedEvent.venue}, {selectedEvent.city} • {selectedEvent.guests} guests</p></div>}
    {eventMode === 'create' && <div className="mt-5 grid sm:grid-cols-2 gap-4">
      <label className="field">Event name<input value={eventForm.name} onChange={e => set('name', e.target.value)} required /><small>e.g. Tunde and Bisi's Wedding</small></label>
      <label className="field">Event type<select value={eventForm.type} onChange={e => set('type', e.target.value)}>{types.map(type => <option key={type}>{type}</option>)}</select><small>Choose the event category</small></label>
      <label className="field">Event date<input type="date" min={dateMinimum(eventForm.type)} value={eventForm.date} onChange={e => set('date', e.target.value)} required /><small>Based on our lead time</small></label>
      <label className="field">Time food is needed<input type="time" value={eventForm.time} onChange={e => set('time', e.target.value)} required /><small>When service should begin</small></label>
      <label className="field">City<select value={eventForm.city} onChange={e => set('city', e.target.value)}>{['Ile-Ife', 'Ilesha', 'Osogbo'].map(city => <option key={city}>{city}</option>)}</select><small>Sets this event's delivery fee</small></label>
      <label className="field">Venue or address<input value={eventForm.venue} onChange={e => set('venue', e.target.value)} required /><small>Where we should deliver</small></label>
      <label className="field">Number of guests<input type="number" min="1" value={eventForm.guests} onChange={e => set('guests', e.target.value)} required /><small>Estimated guest count</small></label>
      <label className="field">Notes<textarea value={eventForm.notes} onChange={e => set('notes', e.target.value)} /><small>Optional instructions</small></label>
    </div>}
  </div>
}

function renderStep(id, step, choices, setChoice) {
  if (id === 'rice') {
    if (step === 2) return <div>
      <h3 className="font-heading text-2xl text-purple">Choose Your Rice and Add-ons</h3>
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">{Object.entries({ 'Party Jollof Rice': 2200, 'Fried Rice': 2500, 'White Rice & Stew': 2500, 'Stir-Fry Spaghetti': 2500 }).map(([name, price]) => <Choice key={name} selected={choices.base === name} onClick={() => setChoice('base', name)} title={name} image="/images/jollof-tray.jpg" detail={formatNaira(price)} />)}</div>
      <h4 className="font-heading text-lg text-purple mt-6">Add-ons per plate</h4>
      <div className="mt-3 grid sm:grid-cols-3 gap-3">
        <CounterChoice title="Moi moi" detail="+₦700 per wrap" image="/images/buffet-chafing-dishes.jpg" value={choices.moiMoi} max={2} set={v => setChoice('moiMoi', v)} />
        <CounterChoice title="Fried plantain" detail="+₦500 per portion" image="/images/stew-bowls-trolley.jpg" value={choices.plantain} max={2} set={v => setChoice('plantain', v)} />
        <CounterChoice title="Coleslaw" detail="+₦400 per portion" image="/images/equipment-crates.jpg" value={choices.coleslaw} max={1} set={v => setChoice('coleslaw', v)} />
      </div>
    </div>
    if (step === 3) return <div>
      <h3 className="font-heading text-2xl text-purple">Quantity and Proteins</h3>
      <label className="field mt-5">Number of plates<Stepper value={choices.plates} setValue={v => setChoice('plates', v)} min={10} max={1000} /><small>Minimum 10, maximum 1000</small></label>
      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          ['beef', 'Beef / assorted meat', 800, '/images/fish-and-meat-trays.jpg'], ['fish', 'Fried fish', 1800, '/images/fish-and-meat-trays.jpg'],
          ['chicken', 'Chicken', 2000, '/images/fish-and-meat-trays.jpg'], ['gizzard', 'Peppered gizzard', 500, '/images/peppered-gizzard.jpg'], ['egg', 'Boiled egg', 300, '/images/equipment-crates.jpg'],
        ].map(([key, title, price, image]) => <CounterChoice key={key} title={title} detail={formatNaira(price)} image={image} value={choices[key]} max={3} set={v => setChoice(key, v)} />)}
      </div>
    </div>
    if (step === 4) return <ServingAndExtras choices={choices} setChoice={setChoice} />
  }
  if (id === 'grills') {
    if (step === 2) return <div>
      <h3 className="font-heading text-2xl text-purple">Choose Proteins and Quantity</h3>
      <p className="mt-1 text-sm text-charcoal/60">Minimum 20 pieces in total.</p>
      <div className="mt-5 grid sm:grid-cols-2 gap-3">
        <CounterChoice title="Chicken" detail="₦2,000 each" image="/images/fish-and-meat-trays.jpg" value={choices.chicken} set={v => setChoice('chicken', v)} />
        <CounterChoice title="Fried fish" detail="₦1,800 each" image="/images/fish-and-meat-trays.jpg" value={choices.fish} set={v => setChoice('fish', v)} />
        <CounterChoice title="Beef / assorted meat" detail="₦800 each" image="/images/fish-and-meat-trays.jpg" value={choices.beef} set={v => setChoice('beef', v)} />
        <CounterChoice title="Peppered gizzard skewer" detail="₦500 each" image="/images/peppered-gizzard.jpg" value={choices.gizzard} set={v => setChoice('gizzard', v)} />
      </div>
      <label className="field mt-5">Peppered style<select value={choices.spice} onChange={e => setChoice('spice', e.target.value)}>{['Mild', 'Medium', 'Hot'].map(v => <option key={v}>{v}</option>)}</select><small>Free</small></label>
    </div>
    if (step === 3) return <ServingAndExtras choices={choices} setChoice={setChoice} />
  }
  if (id === 'bowls') {
    if (step === 2) return <div><h3 className="font-heading text-2xl text-purple">Choose Bowls and Sides</h3>
      <div className="mt-5 grid sm:grid-cols-3 gap-3">{Object.entries({ 'Chicken stew bowl': 3200, 'Assorted meat stew bowl': 2800, 'Fish stew bowl': 3000 }).map(([name, price]) => <Choice key={name} selected={choices.bowl === name} onClick={() => setChoice('bowl', name)} title={name} image="/images/stew-bowls-trolley.jpg" detail={formatNaira(price)} />)}</div>
      <label className="field mt-5">Number of bowls<Stepper value={choices.bowls} setValue={v => setChoice('bowls', v)} min={10} max={1000} /><small>Minimum 10 bowls</small></label>
      <div className="mt-4 grid sm:grid-cols-2 gap-3"><Choice selected={choices.rice} onClick={() => setChoice('rice', !choices.rice)} title="White rice portion" image="/images/jollof-tray.jpg" detail="+₦900 per bowl" /><Choice selected={choices.plantain} onClick={() => setChoice('plantain', !choices.plantain)} title="Fried plantain" image="/images/stew-bowls-trolley.jpg" detail="+₦500 per bowl" /></div>
    </div>
    if (step === 3) return <ServingAndExtras choices={choices} setChoice={setChoice} />
  }
  if (id === 'gizzard' && step === 2) return <div><h3 className="font-heading text-2xl text-purple">Size, Spice and Quantity</h3>
    <div className="mt-5 grid sm:grid-cols-3 gap-3">
      <CounterChoice title="Small cup" detail="10 skewers • ₦5,000" image="/images/peppered-gizzard.jpg" value={choices.small} max={20} set={v => setChoice('small', v)} />
      <CounterChoice title="Medium tray" detail="30 skewers • ₦13,500" image="/images/peppered-gizzard.jpg" value={choices.medium} max={20} set={v => setChoice('medium', v)} />
      <CounterChoice title="Large tray" detail="60 skewers • ₦26,000" image="/images/peppered-gizzard.jpg" value={choices.large} max={20} set={v => setChoice('large', v)} />
    </div>
    <label className="field mt-5">Spice<select value={choices.spice} onChange={e => setChoice('spice', e.target.value)}>{['Mild', 'Medium', 'Hot'].map(v => <option key={v}>{v}</option>)}</select><small>Free choice</small></label>
  </div>
  if (id === 'chops') {
    if (step === 2) return <div><h3 className="font-heading text-2xl text-purple">Format and Quantity</h3><div className="mt-5 grid sm:grid-cols-3 gap-3">
      <CounterChoice title="Small chops cup" detail="₦3,500 each" image="/images/small-chops-tray.jpg" value={choices.cups} max={1000} set={v => setChoice('cups', v)} />
      <CounterChoice title="Small chops platter" detail="Serves about 10 • ₦28,000" image="/images/small-chops-tray.jpg" value={choices.platters} max={100} set={v => setChoice('platters', v)} />
      <CounterChoice title="Small chops tray" detail="Serves about 20 • ₦52,000" image="/images/small-chops-tray.jpg" value={choices.trays} max={100} set={v => setChoice('trays', v)} />
    </div></div>
    if (step === 3) return <div><h3 className="font-heading text-2xl text-purple">Add-ons and Display Style</h3>
      <div className="mt-5 grid sm:grid-cols-2 gap-3">
        <CounterChoice title="Extra puff puff pack" detail="Pack of 20 • ₦2,400" image="/images/small-chops-tray.jpg" value={choices.puffPuff} max={20} set={v => setChoice('puffPuff', v)} />
        <CounterChoice title="Extra samosa pack" detail="Pack of 10 • ₦4,000" image="/images/small-chops-tray.jpg" value={choices.samosa} max={20} set={v => setChoice('samosa', v)} />
        <CounterChoice title="Extra spring rolls pack" detail="Pack of 10 • ₦4,000" image="/images/small-chops-tray.jpg" value={choices.springRolls} max={20} set={v => setChoice('springRolls', v)} />
        <CounterChoice title="Peppered gizzard cup" detail="₦2,000" image="/images/peppered-gizzard.jpg" value={choices.gizzardCups} max={20} set={v => setChoice('gizzardCups', v)} />
      </div>
      <div className="mt-5 grid sm:grid-cols-2 gap-3"><Choice selected={choices.display === 'Standard plates'} onClick={() => setChoice('display', 'Standard plates')} title="Standard plates" image="/images/equipment-crates.jpg" detail="₦0" /><Choice selected={choices.display === 'Gold plates and bowls on a trolley'} onClick={() => setChoice('display', 'Gold plates and bowls on a trolley')} title="Gold plates and bowls on a trolley" image="/images/stew-bowls-trolley.jpg" detail="+₦250 cup / +₦3,000 platter / +₦5,000 tray" /></div>
      <div className="mt-5"><ServingOptions choices={choices} setChoice={setChoice} /></div>
    </div>
  }
  if (id === 'bar' && step === 2) return <div><h3 className="font-heading text-2xl text-purple">Mocktails and Cocktails</h3><p className="mt-1 text-sm text-charcoal/60">Minimum 30 glasses in total.</p>
    <div className="mt-5 grid sm:grid-cols-2 gap-3"><CounterChoice title="Mocktails" detail="₦1,500 per glass" image="/images/mocktail-glasses.jpg" value={choices.mocktails} max={1000} set={v => setChoice('mocktails', v)} /><CounterChoice title="Cocktails" detail="₦2,500 per glass" image="/images/deeymix-bar.jpg" value={choices.cocktails} max={1000} set={v => setChoice('cocktails', v)} /></div>
    <p className="mt-3 text-xs text-purple bg-gold/10 p-3 rounded-lg">Cocktails are served to guests 18 and above only</p>
    <h4 className="font-heading text-lg text-purple mt-6">Flavours</h4><div className="mt-3 flex flex-wrap gap-2">{['Sunrise Orange', 'Mint Cooler', 'Blue Lagoon', 'Strawberry Punch', 'Citrus Spritz'].map(flavour => <button type="button" key={flavour} onClick={() => setChoice('flavours', choices.flavours.includes(flavour) ? choices.flavours.filter(v => v !== flavour) : [...choices.flavours, flavour])} className={`choice-card min-h-11 px-3 ${choices.flavours.includes(flavour) ? 'selected' : ''}`}><strong className="text-xs">{flavour}</strong></button>)}</div>
  </div>
  if (id === 'bar' && step === 3) return <div><h3 className="font-heading text-2xl text-purple">Labels and Bar Service</h3><div className="mt-5 grid sm:grid-cols-2 gap-3">
    <Choice selected={choices.labels} onClick={() => setChoice('labels', !choices.labels)} title="Custom printed glass labels" image="/images/mocktail-glasses.jpg" detail="+₦150 per glass" />
    <Choice selected={!choices.liveBar} onClick={() => setChoice('liveBar', false)} title="Delivered ready-mixed" image="/images/deeymix-bar.jpg" detail="₦0" />
  </div><div className="mt-3"><Choice selected={choices.liveBar} onClick={() => setChoice('liveBar', true)} title="Live bar with counter and 2 bartenders" image="/images/deeymix-bar.jpg" detail="+₦60,000 per bar" /></div>
  {choices.liveBar && <label className="field mt-4">Number of bars<Stepper value={choices.bars} setValue={v => setChoice('bars', v)} min={1} max={4} /><small>1 to 4 bars</small></label>}
  </div>
  if (id === 'packs') {
    if (step === 2) return <div><h3 className="font-heading text-2xl text-purple">Pack Type, Rice and Protein</h3><div className="mt-5 grid sm:grid-cols-3 gap-3">{[['Office Lunch Pack', 3500], ['Premium Lunch Pack', 5000], ['After-Party Eats Pack', 3000]].map(([name, price]) => <Choice key={name} selected={choices.pack === name} onClick={() => setChoice('pack', name)} title={name} image="/images/lunch-packs.jpg" detail={formatNaira(price)} />)}</div>
      {choices.pack !== 'After-Party Eats Pack' && <><label className="field mt-5">Rice choice<select value={choices.rice} onChange={e => setChoice('rice', e.target.value)}>{['Party Jollof', 'Fried Rice', 'White Rice & Stew'].map(v => <option key={v}>{v}</option>)}</select><small>Free choice</small></label><label className="field mt-4">Protein choice<select value={choices.protein} onChange={e => setChoice('protein', e.target.value)}>{['Beef', 'Chicken', 'Fish'].map(v => <option key={v}>{v}</option>)}</select><small>Chicken +₦1,500 • Fish +₦1,000 • Beef included</small></label></>}
    </div>
    if (step === 3) return <div><h3 className="font-heading text-2xl text-purple">Quantity, Labels and Delivery Slot</h3><label className="field mt-5">Number of packs<Stepper value={choices.quantity} setValue={v => setChoice('quantity', v)} min={10} max={1000} /><small>Minimum 10 packs</small></label>
      <div className="mt-5 grid sm:grid-cols-2 gap-3"><Choice selected={choices.labels} onClick={() => setChoice('labels', !choices.labels)} title="Branded sticker label" image="/images/lunch-packs.jpg" detail="+₦100 per pack" /></div>
      <label className="field mt-5">Delivery slot<select value={choices.slot} onChange={e => setChoice('slot', e.target.value)}>{['Early morning', 'Midday', 'Evening', 'Late night'].map(v => <option key={v}>{v}</option>)}</select><small>{choices.slot === 'Early morning' ? '7 to 9am' : choices.slot === 'Midday' ? '11am to 1pm' : 'Free'}</small></label>
    </div>
  }
  if (id === 'station') {
    if (step === 2) return <div><h3 className="font-heading text-2xl text-purple">Choose Your Dishes</h3><p className="text-sm text-charcoal/60 mt-1">Any 4 dishes are included. Select beyond 4 for +₦300 per guest per extra dish.</p><div className="mt-5 flex flex-wrap gap-2">{['Party Jollof', 'Fried Rice', 'White Rice & Stew', 'Stir-Fry Spaghetti', 'Fried Plantain', 'Moi Moi', 'Coleslaw'].map(dish => <button type="button" key={dish} onClick={() => setChoice('dishes', choices.dishes.includes(dish) ? choices.dishes.filter(v => v !== dish) : [...choices.dishes, dish])} className={`choice-card min-h-11 px-3 ${choices.dishes.includes(dish) ? 'selected' : ''}`}><strong className="text-xs">{dish}</strong></button>)}</div></div>
    if (step === 3) return <div><h3 className="font-heading text-2xl text-purple">Proteins and Upgrades</h3><div className="mt-5 grid sm:grid-cols-3 gap-3">{[['Beef / assorted meat', 'Included', '/images/fish-and-meat-trays.jpg'], ['Fried fish', '+₦900 per guest', '/images/fish-and-meat-trays.jpg'], ['Chicken', '+₦1,200 per guest', '/images/fish-and-meat-trays.jpg']].map(([name, detail, image]) => <Choice key={name} selected={choices.protein === name} onClick={() => setChoice('protein', name)} title={name} image={image} detail={detail} />)}</div><label className="field mt-5">Extra proteins per guest<Stepper value={choices.extraProteins} setValue={v => setChoice('extraProteins', v)} min={0} max={5} /><small>+₦800 per guest for each extra protein</small></label></div>
    if (step === 4) return <div><h3 className="font-heading text-2xl text-purple">Stations, Guests and Extras</h3><label className="field mt-5">Number of guests<Stepper value={choices.guests} setValue={v => setChoice('guests', v)} min={50} max={5000} /><small>Minimum 50 guests</small></label><label className="field mt-5">Live stations<Stepper value={choices.stations} setValue={v => setChoice('stations', v)} min={1} max={5} /><small>Suggestion: 1 station per 150 guests</small></label><div className="mt-5"><Extras choices={choices} setChoice={setChoice} /></div></div>
  }
  if (step === totalReviewStep(id)) return <div><h3 className="font-heading text-2xl text-purple">Review Your Choices</h3><p className="mt-2 text-sm text-charcoal/65">{makeSummary(id, choices)}</p></div>
  return null
}

function totalReviewStep(id) { return stepCounts[id] }

function ServingAndExtras({ choices, setChoice }) {
  return <div><h3 className="font-heading text-2xl text-purple">Serving Style and Extras</h3><ServingOptions choices={choices} setChoice={setChoice} /><div className="mt-5"><Extras choices={choices} setChoice={setChoice} /></div></div>
}

function ServingOptions({ choices, setChoice }) {
  return <div className="mt-5 grid sm:grid-cols-2 gap-3">{serviceOptions.map(([title, image, detail]) => <Choice key={title} selected={choices.serving === title} onClick={() => setChoice('serving', title)} title={title} image={image} detail={detail} />)}</div>
}

function Extras({ choices, setChoice }) {
  return <div><h3 className="font-heading text-lg text-purple">Extras</h3><div className="mt-3 grid sm:grid-cols-2 gap-3">
    <CounterChoice title="Servers and waiters" detail="₦8,000 per server" image="/images/equipment-crates.jpg" value={choices.servers} max={30} set={v => setChoice('servers', v)} />
    <Choice selected={choices.disposable} onClick={() => setChoice('disposable', !choices.disposable)} title="Disposable plates and cutlery" image="/images/equipment-crates.jpg" detail={`₦300 × ${choices.guests || choices.cups || 50} guests`} />
    <CounterChoice title="Chafing dish hire" detail="₦15,000 each" image="/images/equipment-crates.jpg" value={choices.chafing} max={20} set={v => setChoice('chafing', v)} />
    <CounterChoice title="Coolers" detail="₦5,000 each" image="/images/equipment-crates.jpg" value={choices.coolers} max={20} set={v => setChoice('coolers', v)} />
    <Choice selected={choices.goldSetup} onClick={() => setChoice('goldSetup', !choices.goldSetup)} title="Gold buffet table set-up" image="/images/buffet-stations.jpg" detail="₦25,000" />
    <CounterChoice title="Crates of plates and serving ware" detail="₦10,000 per crate set" image="/images/equipment-crates.jpg" value={choices.crates} max={20} set={v => setChoice('crates', v)} />
  </div></div>
}

function CounterChoice({ title, detail, image, value = 0, max = 100, set }) {
  return <div className="choice-card"><img src={image} alt="" loading="lazy" /><strong className="block mt-2 text-sm text-purple">{title}</strong><small className="block text-charcoal/60">{detail}</small><div className="mt-3"><Stepper value={value} setValue={set} min={0} max={max} /></div></div>
}

function makeSummary(id, c) {
  if (id === 'rice') return `${c.base}, ${c.plates} plates, ${c.serving}`
  if (id === 'grills') return `${(c.chicken || 0) + (c.fish || 0) + (c.beef || 0) + (c.gizzard || 0)} pieces, ${c.spice}, ${c.serving}`
  if (id === 'bowls') return `${c.bowls} ${c.bowl}s, ${c.serving}`
  if (id === 'gizzard') return `${c.small} small, ${c.medium} medium, ${c.large} large trays, ${c.spice}`
  if (id === 'chops') return `${c.cups} cups, ${c.platters} platters, ${c.trays} trays, ${c.display}`
  if (id === 'bar') return `${c.mocktails} mocktails, ${c.cocktails} cocktails, ${c.liveBar ? 'live bar' : 'ready-mixed'}`
  if (id === 'packs') return `${c.quantity} ${c.pack}s, ${c.rice}, ${c.protein}, ${c.slot}`
  if (id === 'station') return `${c.guests} guests, ${c.dishes.length} dishes, ${c.protein}, ${c.stations} station(s)`
  return productName(id)
}

function productName(id) { return id }

function PriceLines({ productId, choices, total, event }) {
  return <div className="mt-3 text-xs text-charcoal/70 space-y-1">
    <div className="flex justify-between"><span>Product total</span><strong>{formatNaira(total)}</strong></div>
    {event && <div className="flex justify-between"><span>Delivery (event)</span><strong>{formatNaira(eventDelivery(event))}</strong></div>}
  </div>
}
