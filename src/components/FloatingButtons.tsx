import {
  ShoppingCart,
} from "lucide-react";

interface FloatingButtonsProps {
  cartCount: number
  onCartClick: () => void
  onOrderClick: () => void
}

export default function FloatingButtons({ cartCount, onCartClick, onOrderClick }: FloatingButtonsProps) {
  return (
    <div className="fixed bottom-6 right-4 z-30 flex flex-col gap-3 items-end">
      {/* Tombol pesan */}
      <button
        onClick={onOrderClick}
        className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-heading font-semibold text-sm px-4 py-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
      >
        <span>Pesan Sekarang</span>
      </button>

      {/* Tombol keranjang*/}
      <button
        onClick={onCartClick}
        className="relative w-14 h-14 bg-brand-900 hover:bg-brand-800 text-warm-200 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
      >
        <ShoppingCart
          className="w-6 h-6"
          strokeWidth={2.2}
        />
        {cartCount > 0 && (
          <>
            {/* Efek pulse */}
            <span className="absolute inset-0 rounded-full border-2 border-brand-300 animate-ping opacity-50" />
            <span className="absolute -top-1 -right-1 bg-brand-300 text-brand-900 font-heading font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center z-10">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          </>
        )}
      </button>
    </div>
  )
}
