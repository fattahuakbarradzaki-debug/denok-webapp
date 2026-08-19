import { useState, useEffect } from 'react'
import type { MenuItem, Addition } from '@/types'

interface MenuPopupProps {
  menu: MenuItem
  additions: Addition[]
  brothLevels: string[]
  mieTypes: string[]
  onClose: () => void
  onConfirm: (menu: MenuItem, qty: number, additions: Addition[], brothLevel: string, mieTypes: string[]) => void
}

export default function MenuPopup({ menu, additions, brothLevels, mieTypes, onClose, onConfirm }: MenuPopupProps) {
  const [qty, setQty] = useState(1)
  const [selectedAdditions, setSelectedAdditions] = useState<Addition[]>([])
  const [brothLevel, setBrothLevel] = useState('Normal')
  const [selectedMieTypes, setSelectedMieTypes] = useState<string[]>([])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  function toggleAddition(addition: Addition) {
    setSelectedAdditions((prev) =>
      prev.some((a) => a.name === addition.name)
        ? prev.filter((a) => a.name !== addition.name)
        : [...prev, addition],
    )
  }

  function toggleMieType(type: string) {
    setSelectedMieTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  const addTotal = selectedAdditions.reduce((sum, a) => sum + a.price, 0)
  const total = (menu.price + addTotal) * qty

  function handleConfirm() {
    onConfirm(menu, qty, selectedAdditions, menu.hasBroth ? brothLevel : '', selectedMieTypes)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-brand-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-warm-100 w-full md:max-w-md rounded-t-3xl md:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="relative h-44 rounded-t-3xl md:rounded-t-2xl overflow-hidden">
          <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-warm-100/90 flex items-center justify-center hover:bg-warm-100 transition-colors"
          >
            <svg className="w-4 h-4 text-brand-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {menu.badge && (
            <span className="absolute top-3 left-3 font-heading font-semibold text-xs px-2.5 py-1 rounded-full"
              style={{
                background: menu.badge === 'Pedas' ? '#E75304' : menu.badge === 'Terlaris' || menu.badge === 'Favorit' ? '#621905' : '#FFBF15',
                color: menu.badge === 'Spesial' || menu.badge === 'Favorit2' ? '#271C00' : '#FEE9CE',
              }}
            >
              {menu.badge}
            </span>
          )}
          <div className="absolute bottom-3 left-4">
            <h3 className="font-heading font-bold text-lg text-warm-100">{menu.name}</h3>
            <p className="font-body text-brand-300 font-semibold text-sm">
              Rp {menu.price.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        <div className="p-5">
          {/* Deskripsi */}
          <p className="font-body text-neutral-900/70 text-sm leading-relaxed mb-5">
            {menu.description}
          </p>

          {/* Jumlah */}
          <div className="flex items-center justify-between mb-5">
            <p className="font-heading font-semibold text-brand-900 text-sm">Jumlah</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 rounded-full border-2 border-brand-900/20 flex items-center justify-center hover:border-brand-600 hover:text-brand-600 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                </svg>
              </button>
              <span className="font-heading font-bold text-brand-900 text-lg w-6 text-center">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 rounded-full bg-brand-900 text-warm-200 flex items-center justify-center hover:bg-brand-800 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu tambahan (hanya untuk hasAddOns: true) */}
          {menu.hasAddOns && (
            <div className="mb-5">
              <p className="font-heading font-semibold text-brand-900 text-sm mb-3">Tambahan</p>
              <div className="flex flex-col gap-2">
                {additions.map((addition) => {
                  const checked = selectedAdditions.some((a) => a.name === addition.name)
                  return (
                    <label key={addition.name} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <div
                          onClick={() => toggleAddition(addition)}
                          className={`rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${checked ? 'bg-brand-900 border-brand-900' : 'border-neutral-900/30 group-hover:border-brand-900'
                            }`}
                          style={{ width: '18px', height: '18px', minWidth: '18px' }}
                        >
                          {checked && (
                            <svg className="w-2.5 h-2.5 text-warm-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="font-body text-neutral-900 text-sm">{addition.name}</span>
                      </div>
                      <span className="font-body text-brand-600 text-sm font-medium">
                        +Rp {addition.price.toLocaleString('id-ID')}
                      </span>
                      <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleAddition(addition)} />
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          {/* Pilihan jenis mie (hanya untuk hasMieChoice: true) */}
          {menu.hasMieChoice && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-heading font-semibold text-brand-900 text-sm">Pilihan Mie</p>
                <span className="font-body text-xs text-brand-600 bg-brand-300/20 px-2 py-0.5 rounded-full">
                  Gratis • Opsional
                </span>
              </div>
              <div className="flex gap-2">
                {mieTypes.map((type) => {
                  const selected = selectedMieTypes.includes(type)
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleMieType(type)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-heading font-semibold transition-all duration-200 ${selected
                        ? 'bg-brand-900 text-warm-200'
                        : 'bg-warm-200 text-neutral-900 hover:bg-warm-400'
                        }`}
                    >
                      {type}
                    </button>
                  )
                })}
              </div>
              {selectedMieTypes.length === 0 && (
                <p className="font-body text-neutral-900/40 text-xs mt-1.5">
                  Belum dipilih — default: Tanpa Mie
                </p>
              )}
            </div>
          )}

          {/* Pilihan level kuah (hanya untuk hasBroth: true) */}
          {menu.hasBroth && (
            <div className="mb-5">
              <p className="font-heading font-semibold text-brand-900 text-sm mb-3">Level Kuah</p>
              <div className="flex gap-2">
                {brothLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setBrothLevel(level)}
                    className={`flex-1 py-2 rounded-xl text-sm font-heading font-medium transition-all duration-200 ${brothLevel === level
                      ? 'bg-brand-900 text-warm-200'
                      : 'bg-warm-200 text-neutral-900 hover:bg-warm-400'
                      }`}
                  >
                    {level === 'Sedikit'}
                    {level === 'Normal'}
                    {level === 'Banyak'}
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Total dan tambah ke keranjang */}
          <div className="flex items-center gap-3 pt-4 border-t border-warm-200">
            <div className="flex-1">
              <p className="font-body text-neutral-900/50 text-xs">Total</p>
              <p className="font-heading font-bold text-brand-900 text-lg">
                Rp {total.toLocaleString('id-ID')}
              </p>
            </div>
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 bg-brand-900 hover:bg-brand-800 text-warm-200 font-heading font-semibold text-sm px-5 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
