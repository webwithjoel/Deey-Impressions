import { createContext, useContext, useEffect, useState } from 'react'

const EventsContext = createContext(null)

export function EventsProvider({ children }) {
  const [events, setEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem('deey-events') || '[]') } catch { return [] }
  })
  const [activeEventId, setActiveEventId] = useState(() => {
    try { return localStorage.getItem('deey-active-event') || null } catch { return null }
  })

  useEffect(() => {
    try { localStorage.setItem('deey-events', JSON.stringify(events)) } catch {}
  }, [events])
  useEffect(() => {
    try { localStorage.setItem('deey-active-event', activeEventId || '') } catch {}
  }, [activeEventId])

  const addEvent = event => {
    const saved = { ...event, id: event.id || `${Date.now()}-${Math.random().toString(36).slice(2)}` }
    setEvents(current => event.id ? current.map(item => item.id === event.id ? saved : item) : [...current, saved])
    setActiveEventId(saved.id)
    return saved
  }
  const deleteEvent = id => {
    setEvents(current => current.filter(event => event.id !== id))
    setActiveEventId(current => current === id ? null : current)
  }

  return <EventsContext.Provider value={{ events, activeEventId, setActiveEventId, addEvent, deleteEvent }}>
    {children}
  </EventsContext.Provider>
}

export const useEvents = () => useContext(EventsContext)
