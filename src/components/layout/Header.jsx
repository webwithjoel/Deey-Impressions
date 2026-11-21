import { Menu, Phone, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export default function Header({ onMenu, onCart }) {
  const { cart } = useCart()
  return <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-soft">
    <div className="page-shell h-[72px] flex items-center justify-between">
      <button className="icon-btn" onClick={onMenu} aria-label="Open menu"><Menu /></button>
      <a href="#home" className="flex items-center gap-2" aria-label="Deey Catering home">
        <img src="/images/logo.png" alt="" className="w-12 h-12 object-contain" />
        <span className="hidden sm:block font-heading text-xl font-bold text-purple">Deey Catering</span>
      </a>
      <div className="flex items-center gap-1">
        <a className="icon-btn" href="tel:+2348039188195" aria-label="Call Deey Catering"><Phone /></a>
        <button className="icon-btn relative" onClick={onCart} aria-label={`Cart with ${cart.length} items`}>
          <ShoppingBag />
          {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </button>
      </div>
    </div>
  </header>
}
