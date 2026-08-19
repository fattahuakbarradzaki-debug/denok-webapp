import { useState } from 'react'
import type { MenuItem, MenuCategory } from '@/types'

interface MenuSectionProps {
  items: MenuItem[]
  onAddToCart: (menu: MenuItem) => void
  storeOpen: boolean
  closeReason: string
}

const categories: { value: MenuCategory; label: string; icon: string }[] = [
  { value: 'all', label: 'Semua', icon: '' },
  { value: 'makanan', label: 'Makanan', icon: '' },
  { value: 'minuman-dingin', label: 'Minuman Dingin', icon: '' },
  { value: 'minuman-hangat', label: 'Minuman Hangat', icon: '' },
]

function MenuCard({
  item,
  onAdd,
  storeOpen,
  closeReason,
}: {
  item: MenuItem
  onAdd: () => void
  storeOpen: boolean
  closeReason: string
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col">
      <div className="relative h-44 overflow-hidden bg-warm-200">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.badge && (
          <span
            className="absolute top-2.5 left-2.5 font-heading font-semibold text-xs px-2.5 py-1 rounded-full"
            style={{
              background: '#FFBF15',
              color: '#271C00',
            }}
          >
            {item.badge}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-heading font-semibold text-brand-900 text-sm mb-1">{item.name}</h3>
        <p className="font-body text-neutral-900/60 text-xs leading-relaxed mb-3 flex-1 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-heading font-bold text-brand-600 text-base">
            Rp {item.price.toLocaleString('id-ID')}
          </span>
          <button
            onClick={() => {
              if (!storeOpen) {
                alert(
                  `Maaf, kami sedang tutup.\n\nDikarenakan:\n${closeReason || 'Tidak ada informasi'}`
                )
                return
              }

              onAdd()
            }}
            className={`flex items-center gap-1.5 font-heading font-semibold text-xs px-3 py-2 rounded-xl transition-all duration-200 ${storeOpen
              ? 'bg-brand-900 hover:bg-brand-800 text-warm-200 hover:scale-105'
              : 'bg-neutral-400 text-white cursor-not-allowed'
              }`}
          >
            {storeOpen ? (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Tambah
              </>
            ) : (
              'Kedai Tutup'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MenuSection({
  items,
  onAddToCart,
  storeOpen,
  closeReason,
}: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all')

  const filtered = activeCategory === 'all' ? items : items.filter((i) => i.category === activeCategory)

  return (
    <>
      {/* Menu favorit */}
      <section className="py-20 bg-warm-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-300/20 rounded-full px-4 py-1.5 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                <span className="font-body text-brand-900 text-sm font-medium">Menu Favorit</span>
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-900 leading-tight">
                Pilihan <span className="text-brand-600">Terpopuler</span>
              </h2>
              <p className="font-body text-neutral-900/60 text-base mt-2">
                Menu andalan yang paling banyak dipesan pelanggan DENOK.
              </p>
            </div>
            <a
              href="#menu"
              className="font-heading font-medium text-sm text-brand-600 hover:text-brand-800 underline underline-offset-2 flex-shrink-0"
            >
              Lihat Semua Menu →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items
              .filter((item) => item.active && item.isFavorite === true)
              .slice(0, 6)
              .map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAdd={() => onAddToCart(item)}
                  storeOpen={storeOpen}
                  closeReason={closeReason}
                />
              ))}
          </div>
        </div>
      </section>

      {/* Semua menu */}
      <section id="menu" className="py-20 bg-warm-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-brand-900/10 rounded-full px-4 py-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
              <span className="font-body text-brand-900 text-sm font-medium">Menu Lengkap</span>
            </div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-900 leading-tight">
              Semua Menu <span className="text-brand-600">DENOK</span>
            </h2>
          </div>

          {/* Kategori menu */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full font-heading font-medium text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 ${activeCategory === cat.value
                  ? 'bg-brand-900 text-warm-200 shadow-md'
                  : 'bg-white text-neutral-900 hover:bg-warm-100'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onAdd={() => onAddToCart(item)}
                storeOpen={storeOpen}
                closeReason={closeReason}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="font-heading text-brand-900/50 text-lg">Tidak ada menu di kategori ini</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
