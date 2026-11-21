import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('deey-cart') || '[]') } catch { return [] }
  })
  useEffect(() => {
    try { localStorage.setItem('deey-cart', JSON.stringify(cart)) } catch {}
  }, [cart])

  const addItem = item => setCart(current => item.editId
    ? current.map(existing => existing.id === item.editId ? { ...item, id: item.editId } : existing)
    : [...current, { ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` }])
  const removeItem = id => setCart(current => current.filter(item => item.id !== id))
  const removeByEvent = eventId => setCart(current => current.filter(item => item.eventId !== eventId))
  const clearCart = () => setCart([])

  return <CartContext.Provider value={{ cart, addItem, removeItem, removeByEvent, clearCart }}>
    {children}
  </CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
