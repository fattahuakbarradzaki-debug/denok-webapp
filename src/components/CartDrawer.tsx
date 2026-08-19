import { ShoppingCart } from "lucide-react";
import type { CartItem } from '@/types'

interface CartDrawerProps {
  isOpen: boolean
  cart: CartItem[]
  total: number
  onClose: () => void
  onUpdateQty: (cartId: string, delta: number) => void
  onRemove: (cartId: string) => void
  onCheckout: () => void
}

export default function CartDrawer({ isOpen, cart, total, onClose, onUpdateQty, onRemove, onCheckout }: CartDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand-900/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Keranjang */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-warm-100 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-brand-900">
          <div className="flex items-center gap-2">
            <ShoppingCart
              className="w-6 h-5 text-brand-300"
              strokeWidth={2.2}
            />
            <h2 className="font-heading font-bold text-warm-200 text-base">Keranjang Pesanan</h2>
            {cart.length > 0 && (
              <span className="bg-brand-300 text-brand-900 text-xs font-heading font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center hover:bg-brand-600 transition-colors"
          >
            <svg className="w-4 h-4 text-warm-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Daftar pesanan */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <div className="w-20 h-20 rounded-full bg-warm-200 flex items-center justify-center text-4xl">
                <ShoppingCart
                  className="w-10 h-10 text-brand-900"
                  strokeWidth={2.2}
                />
              </div>
              <div className="text-center">
                <p className="font-heading font-semibold text-brand-900 text-base mb-1">Keranjang Kosong</p>
                <p className="font-body text-neutral-900/50 text-sm">Yuk tambahkan menu favoritmu!</p>
              </div>
              <button
                onClick={() => {
                  onClose()

                  setTimeout(() => {
                    document.getElementById('menu')?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }, 300)
                }}
                className="bg-brand-900 text-warm-200 font-heading font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-brand-800 transition-colors"
              >
                Lihat Menu
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cart.map((item) => {
                const addTotal = item.additions.reduce((s, a) => s + a.price, 0)
                const itemTotal = (item.basePrice + addTotal) * item.quantity
                return (
                  <div key={item.cartId} className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm">
                    {/* Gambara pesanan */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Detail pesanan */}
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-brand-900 text-sm truncate">{item.name}</p>
                      {item.hasMieChoice && (
                        <p className="font-body text-neutral-900/50 text-xs truncate">
                          Mie: {item.mieTypes && item.mieTypes.length > 0
                            ? item.mieTypes.join(' + ')
                            : 'Tanpa Mie'}
                        </p>
                      )}
                      {item.additions.length > 0 && (
                        <p className="font-body text-neutral-900/50 text-xs truncate">
                          {item.additions.map((a) => a.name).join(', ')}
                        </p>
                      )}
                      {item.brothLevel && (
                        <p className="font-body text-neutral-900/50 text-xs">
                          Kuah: {item.brothLevel}
                        </p>
                      )}
                      <p className="font-heading font-semibold text-brand-600 text-sm mt-1">
                        Rp {itemTotal.toLocaleString('id-ID')}
                      </p>

                      {/* Kontrol jumlah */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQty(item.cartId, -1)}
                            className="w-6 h-6 rounded-full bg-warm-200 hover:bg-warm-400 flex items-center justify-center transition-colors"
                          >
                            <svg className="w-3 h-3 text-brand-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="font-heading font-bold text-brand-900 text-sm w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.cartId, 1)}
                            className="w-6 h-6 rounded-full bg-brand-900 flex items-center justify-center hover:bg-brand-800 transition-colors"
                          >
                            <svg className="w-3 h-3 text-warm-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={() => onRemove(item.cartId)}
                          className="text-neutral-900/30 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-warm-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-neutral-900/60 text-sm">Total Pesanan</span>
              <span className="font-heading font-bold text-brand-900 text-lg">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 text-warm-200 font-heading font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.01]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Lanjut ke Checkout
            </button>
          </div>
        )}
      </div>
    </>
  )
}
