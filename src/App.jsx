import { useEffect, useState } from 'react'
import { EventsProvider } from './context/EventsContext'
import { CartProvider } from './context/CartContext'
import AnnouncementBar from './components/layout/AnnouncementBar'
import Header from './components/layout/Header'
import MenuDrawer from './components/layout/MenuDrawer'
import Hero from './components/sections/Hero'
import StatStrip from './components/sections/StatStrip'
import CategoryCards from './components/sections/CategoryCards'
import CateringBand from './components/sections/CateringBand'
import Featured from './components/sections/Featured'
import HowItWorks from './components/sections/HowItWorks'
import Reviews from './components/sections/Reviews'
import About from './components/sections/About'
import Footer from './components/layout/Footer'
import FloatingWhatsApp from './components/layout/FloatingWhatsApp'
import ProductModal from './components/modal/ProductModal'
import CartDrawer from './components/cart/CartDrawer'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [modalProduct, setModalProduct] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const listener = e => {
      setToast(e.detail)
      window.clearTimeout(window.deeyToastTimer)
      window.deeyToastTimer = window.setTimeout(() => setToast(''), 2500)
    }
    window.addEventListener('deey-toast', listener)
    return () => window.removeEventListener('deey-toast', listener)
  }, [])

  const openCustomize = product => { setEditItem(null); setModalProduct(product) }
  const openEdit = item => { setEditItem(item); setModalProduct({ id: item.productId, name: item.name, image: item.image }) }

  return (
    <EventsProvider>
      <CartProvider>
        <AnnouncementBar />
        <Header onMenu={() => setMenuOpen(true)} onCart={() => setCartOpen(true)} />
        <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main>
          <Hero />
          <StatStrip />
          <CategoryCards />
          <CateringBand />
          <Featured onCustomize={openCustomize} />
          <HowItWorks />
          <Reviews />
          <About />
        </main>
        <Footer />
        <FloatingWhatsApp hidden={menuOpen || cartOpen || Boolean(modalProduct)} />
        {toast && <div className="fixed z-[100] left-1/2 -translate-x-1/2 bottom-24 rounded-full bg-purple-dark text-cream px-5 py-3 text-sm shadow-lg">{toast}</div>}
        {modalProduct && <ProductModal product={modalProduct} editItem={editItem} onClose={() => { setModalProduct(null); setEditItem(null) }} />}
        {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} onEdit={openEdit} />}
      </CartProvider>
    </EventsProvider>
  )
}
