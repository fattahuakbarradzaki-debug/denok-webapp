import { useState, useEffect } from 'react'
import { db } from '@/firebase'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import type {
  CartItem,
  MenuItem,
  CheckoutData,
  Addition,
} from '@/types'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Features from '@/components/Features'
import MenuSection from '@/components/MenuSection'
import HowToOrder from '@/components/HowToOrder'
import Gallery from '@/components/Gallery'
import Testimonials from '@/components/Testimonials'
import Location from '@/components/Location'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import MenuPopup from '@/components/MenuPopup'
import CheckoutForm from '@/components/CheckoutForm'
import FloatingButtons from '@/components/FloatingButtons'

export default function HomePage() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('denok-cart')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null)

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [additions, setAdditions] = useState<Addition[]>([])
  const [mieTypes, setMieTypes] = useState<string[]>([])
  const [brothLevels, setBrothLevels] = useState<string[]>([])
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [paymentMethods, setPaymentMethods] = useState({
    cashEnabled: true,
    danaEnabled: true,
    gopayEnabled: true,
    ovoEnabled: true,
    qrisEnabled: true,
    shopeepayEnabled: true,
    transferBankEnabled: true,
  })

  const [storeOpen, setStoreOpen] = useState(true)
  const [closeReason, setCloseReason] = useState('')
  const [deliveryEnabled, setDeliveryEnabled] = useState(true)
  const [dineinEnabled, setDineinEnabled] = useState(true)
  const [takeawayEnabled, setTakeawayEnabled] = useState(true)
  const [autoSchedule, setAutoSchedule] = useState(true)
  const [openHour, setOpenHour] = useState('09:30')
  const [closeHourSetting, setCloseHourSetting] = useState('21:00')
  const [manualStoreOpen, setManualStoreOpen] = useState(true)

  useEffect(() => {
    const menuRef = collection(db, 'menus')

    const unsubscribe = onSnapshot(menuRef, (snapshot) => {
      const menus = snapshot.docs
        .map((doc) => doc.data() as MenuItem)
        .filter((menu) => menu.active !== false)

      setMenuItems(menus)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const additionsRef = collection(db, 'additions')

    const unsubscribe = onSnapshot(additionsRef, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => doc.data() as Addition & { active?: boolean })
        .filter((addition) => addition.active !== false)

      setAdditions(data)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const docRef = doc(db, 'settings', 'global')

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()

        setMieTypes(
          data.mieTypes ?? []
        )

        setBrothLevels(
          data.brothLevels ?? []
        )

        setWhatsappNumber(
          data.whatsappNumber ?? ''
        )

        setManualStoreOpen(
          data.shop?.open ?? true
        )

        setCloseReason(
          data.shop?.closeReason ?? ''
        )

        setDeliveryEnabled(
          data.pickupMethod?.deliveryEnabled ?? true
        )

        setDineinEnabled(
          data.pickupMethod?.dineinEnabled ?? true
        )

        setTakeawayEnabled(
          data.pickupMethod?.takeawayEnabled ?? true
        )

        setPaymentMethods({
          cashEnabled: data.paymentMethods?.cashEnabled ?? true,
          danaEnabled: data.paymentMethods?.danaEnabled ?? true,
          gopayEnabled: data.paymentMethods?.gopayEnabled ?? true,
          ovoEnabled: data.paymentMethods?.ovoEnabled ?? true,
          qrisEnabled: data.paymentMethods?.qrisEnabled ?? true,
          shopeepayEnabled: data.paymentMethods?.shopeepayEnabled ?? true,
          transferBankEnabled:
            data.paymentMethods?.transferBankEnabled ?? true,
        })

        setAutoSchedule(
          data.schedule?.auto ?? true
        )

        setOpenHour(
          data.schedule?.openHour ?? '09:30'
        )

        setCloseHourSetting(
          data.schedule?.closeHour ?? '21:00'
        )

      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!autoSchedule) {
      setStoreOpen(manualStoreOpen)
      return
    }

    const checkStoreStatus = () => {
      const now = new Date()

      const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes()

      const [openH, openM] = openHour.split(':').map(Number)
      const [closeH, closeM] = closeHourSetting.split(':').map(Number)

      const openMinutes = openH * 60 + openM
      const closeMinutes = closeH * 60 + closeM

      setStoreOpen(
        currentMinutes >= openMinutes &&
        currentMinutes < closeMinutes
      )
    }

    checkStoreStatus()

    const interval = setInterval(
      checkStoreStatus,
      60000
    )

    return () => clearInterval(interval)
  }, [
    autoSchedule,
    manualStoreOpen,
    openHour,
    closeHourSetting,
  ])

  useEffect(() => {
    if (!storeOpen) {
      setCart([])
      setSelectedMenu(null)
      setIsCheckoutOpen(false)
    }
  }, [storeOpen])

  useEffect(() => {
    localStorage.setItem('denok-cart', JSON.stringify(cart))
  }, [cart])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => {
    const addTotal = item.additions.reduce((a, b) => a + b.price, 0)
    return sum + (item.basePrice + addTotal) * item.quantity
  }, 0)
  const DELIVERY_FEE = 3000

  function addToCart(
    menu: MenuItem,
    quantity: number,
    additions: Addition[],
    brothLevel: string,
    mieTypes: string[],
  ) {
    const cartId = `${menu.id}-${Date.now()}`
    setCart((prev) => [
      ...prev,
      {
        cartId,
        menuId: menu.id,
        name: menu.name,
        basePrice: menu.price,
        additions,
        brothLevel,
        mieTypes,
        hasMieChoice: menu.hasMieChoice ?? false,
        quantity,
        image: menu.image,
      },
    ])
    setSelectedMenu(null)
  }

  function updateQty(cartId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartId === cartId ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function removeItem(cartId: string) {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId))
  }

  function sendWhatsApp(data: CheckoutData) {
    if (!storeOpen) {
      return
    }
    const deliveryFee =
      data.pickupMethod === 'delivery'
        ? DELIVERY_FEE
        : 0

    const finalTotal = cartTotal + deliveryFee

    const lines: string[] = []
    lines.push('*PESANAN MIE AYAM & BAKSO DENOK*')
    lines.push('*━━━━━━━━━━━━━━━━━━━━━━━━━━*')
    lines.push('*Detail Pesanan:*')
    lines.push('')
    cart.forEach((item, i) => {
      const addTotal = item.additions.reduce((a, b) => a + b.price, 0)
      const itemTotal = (item.basePrice + addTotal) * item.quantity
      lines.push(`${i + 1}. *${item.name}* x${item.quantity}`)

      const menu = menuItems.find(
        (menu) => menu.id === item.menuId
      )

      if (menu?.hasMieChoice) {
        lines.push(
          `        Mie: ${item.mieTypes && item.mieTypes.length > 0
            ? item.mieTypes.join(' + ')
            : 'Tanpa Mie'
          }`
        )
      }
      if (item.brothLevel) {
        lines.push(`        Kuah: ${item.brothLevel}`)
      }
      if (item.additions.length > 0) {
        item.additions.forEach((additions) => {
          lines.push(`        ${additions.name}`)
        })
      }
      lines.push(`        Rp ${itemTotal.toLocaleString('id-ID')}`)
    })
    if (data.pickupMethod === 'delivery') {
      lines.push(`${cart.length + 1}. *Ongkos Kirim (Delivery)*`)
      lines.push('        *Anda telah memilih opsi delivery')
      lines.push('         _Lokasi di luar jangkauan akan_')
      lines.push('         _dikenakan biaya tambahan yang_')
      lines.push('         _akan dikonfirmasi secepatnya._')
      lines.push(`        Rp ${DELIVERY_FEE.toLocaleString('id-ID')}`)
    }

    lines.push('')
    lines.push(`*Total: Rp ${finalTotal.toLocaleString('id-ID')}*`)
    lines.push('*━━━━━━━━━━━━━━━━━━━━━━━━━━*')
    lines.push(`- Nama: ${data.name}`)
    const methodMap = { delivery: 'Delivery', takeaway: 'Take Away', dinein: 'Dine In' }
    lines.push(`- Pengambilan: ${methodMap[data.pickupMethod]}`)
    if (data.pickupMethod === 'delivery' && data.address) {
      lines.push(`- Alamat: ${data.address}`)
    }
    const payMap: Record<CheckoutData['paymentMethod'], string> = {
      cash: 'Tunai',
      qris: 'QRIS',
      dana: 'DANA',
      gopay: 'GoPay',
      ovo: 'OVO',
      shopeepay: 'ShopeePay',
      transferBank: 'Transfer Bank',
    }
    lines.push(`- Pembayaran: ${payMap[data.paymentMethod]}`)
    if (data.note) {
      lines.push(`- Catatan: ${data.note}`)
    }
    lines.push('*━━━━━━━━━━━━━━━━━━━━━━━━━━*')
    lines.push('_Terima kasih telah memesan di DENOK!_')

    const msg = encodeURIComponent(lines.join('\n'))
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank')
    setCart([])
    setIsCheckoutOpen(false)
    setIsCartOpen(false)
  }

  return (
    <div className="min-h-screen bg-warm-100">
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      <Hero
        onOrderClick={() => setIsCartOpen(true)}
        storeOpen={storeOpen}
        closeReason={closeReason}
      />
      <About />
      <Features />
      <MenuSection
        items={menuItems}
        onAddToCart={(menu) => setSelectedMenu(menu)}
        storeOpen={storeOpen}
        closeReason={closeReason}
      />
      <HowToOrder />
      <Gallery />
      <Testimonials />
      <Location />
      <Footer />
      <FloatingButtons
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onOrderClick={() => setIsCartOpen(true)}
      />

      {selectedMenu && (
        <MenuPopup
          menu={selectedMenu}
          additions={additions}
          brothLevels={brothLevels}
          mieTypes={mieTypes}
          onClose={() => setSelectedMenu(null)}
          onConfirm={addToCart}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        total={cartTotal}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={updateQty}
        onRemove={removeItem}
        onCheckout={() => {
          setIsCartOpen(false)
          setIsCheckoutOpen(true)
        }}
      />

      {isCheckoutOpen && (
        <CheckoutForm
          cart={cart}
          total={cartTotal}
          deliveryEnabled={deliveryEnabled}
          dineinEnabled={dineinEnabled}
          takeawayEnabled={takeawayEnabled}
          paymentMethods={paymentMethods}
          onClose={() => setIsCheckoutOpen(false)}
          onSubmit={sendWhatsApp}
        />
      )}
    </div>
  )
}
