import {
  Banknote,
  ScanQrCode,
  Bike,
  ShoppingBag,
  UtensilsCrossed,
} from 'lucide-react'
import { useState } from 'react'
import type { CartItem, CheckoutData } from '@/types'

interface CheckoutFormProps {
  cart: CartItem[]
  total: number
  deliveryEnabled: boolean
  dineinEnabled: boolean
  takeawayEnabled: boolean
  paymentMethods: {
    cashEnabled: boolean
    danaEnabled: boolean
    gopayEnabled: boolean
    ovoEnabled: boolean
    qrisEnabled: boolean
    shopeepayEnabled: boolean
    transferBankEnabled: boolean
  }
  onClose: () => void
  onSubmit: (data: CheckoutData) => void
}

export default function CheckoutForm({
  cart,
  total,
  deliveryEnabled,
  dineinEnabled,
  takeawayEnabled,
  paymentMethods,
  onClose,
  onSubmit,
}: CheckoutFormProps) {
  const [data, setData] = useState<CheckoutData>({
    name: '',
    pickupMethod: 'takeaway',
    address: '',
    paymentMethod: 'cash',
    note: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutData, string>>>({})

  const DELIVERY_FEE = 3000

  function validate(): boolean {
    const newErrors: typeof errors = {}
    if (!data.name.trim()) newErrors.name = 'Nama wajib diisi'
    if (data.pickupMethod === 'delivery' && !data.address.trim()) {
      newErrors.address = 'Alamat wajib diisi untuk Delivery'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const finalTotal =
    total + (data.pickupMethod === 'delivery' ? DELIVERY_FEE : 0)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) onSubmit(data)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-brand-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-warm-100 w-full md:max-w-lg rounded-t-3xl md:rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-5 py-4 bg-brand-900 rounded-t-3xl md:rounded-t-2xl">
          <div>
            <h2 className="font-heading font-bold text-warm-200 text-base">Detail Pemesanan</h2>
            <p className="font-body text-warm-200/60 text-xs">Lengkapi data untuk melanjutkan</p>
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

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
          {/* Ringkasan pesanan */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="font-heading font-semibold text-brand-900 text-sm mb-3">Ringkasan Pesanan</p>
            {cart.map((item) => {
              const addTotal = item.additions.reduce((s, a) => s + a.price, 0)
              return (
                <div key={item.cartId} className="flex justify-between items-center py-1.5 border-b border-warm-200 last:border-0">
                  <div>
                    <span className="font-body text-sm text-neutral-900">{item.name} ×{item.quantity}</span>
                    {item.mieTypes && item.mieTypes.length > 0 && (
                      <p className="font-body text-xs text-neutral-900/50">
                        Mie: {item.mieTypes.join(' + ')}
                      </p>
                    )}
                    {item.additions.length > 0 && (
                      <p className="font-body text-xs text-neutral-900/50">
                        {item.additions.map((a) => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-body text-sm font-medium text-brand-600">
                    Rp {((item.basePrice + addTotal) * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              )
            })}
            <div className="mt-2 pt-2 border-t border-warm-200">

              {data.pickupMethod === 'delivery' && (
                <>
                  <div className="flex gap-3 items-center py-2">
                    <div className="flex-1">
                      <p className="font-body text-sm text-neutral-900">
                        Ongkos Kirim
                      </p>
                      <p className="font-body text-xs text-neutral-900/50">
                        Lokasi di luar jangkauan akan dikenakan biaya
                        tambahan yang akan dikonfirmasi melalui WhatsApp.
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span className="font-body text-sm font-medium text-brand-600">
                        Rp {DELIVERY_FEE.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-warm-200">
                <span className="font-heading font-bold text-brand-900 text-sm">
                  Total
                </span>

                <span className="font-heading font-bold text-brand-900 text-base">
                  Rp {finalTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Nama pemesan */}
          <div>
            <label className="font-heading font-semibold text-brand-900 text-sm block mb-1.5">
              Nama Pemesan *
            </label>
            <input
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className={`w-full bg-white border rounded-xl px-4 py-2.5 font-body text-sm text-neutral-900 placeholder:text-neutral-900/40 outline-none focus:ring-2 focus:ring-brand-300 transition-all ${errors.name ? 'border-red-400' : 'border-warm-200'
                }`}
            />
            {errors.name && <p className="font-body text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Metode pengambilan */}
          <div>
            <label className="font-heading font-semibold text-brand-900 text-sm block mb-2">
              Metode Pengambilan *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  value: 'delivery',
                  label: 'Delivery',
                  icon: Bike,
                  desc: 'Kirim ke Rumah',
                  enabled: deliveryEnabled,
                },
                {
                  value: 'takeaway',
                  label: 'Take Away',
                  icon: ShoppingBag,
                  desc: 'Bawa Pulang',
                  enabled: takeawayEnabled,
                },
                {
                  value: 'dinein',
                  label: 'Dine In',
                  icon: UtensilsCrossed,
                  desc: 'Makan di Sini',
                  enabled: dineinEnabled,
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  disabled={!opt.enabled}
                  onClick={() => {
                    if (!opt.enabled) return

                    setData({
                      ...data,
                      pickupMethod: opt.value as CheckoutData['pickupMethod'],
                    })
                  }}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all duration-200 ${!opt.enabled
                    ? 'border-neutral-300 bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    : data.pickupMethod === opt.value
                      ? 'border-brand-900 bg-brand-900 text-warm-200'
                      : 'border-warm-200 bg-white text-neutral-900 hover:border-brand-300'
                    }`}
                >
                  <opt.icon className="w-6 h-6" strokeWidth={2} />

                  <p className="font-heading font-medium text-xs">
                    {opt.label}
                  </p>

                  <p
                    className={`font-body text-xs ${data.pickupMethod === opt.value
                      ? 'text-warm-200/70'
                      : 'text-neutral-900/50'
                      }`}
                  >
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Alamat pengiriman (hanya untuk delivery) */}
          {
            data.pickupMethod === 'delivery' && (
              <div>
                <label className="font-heading font-semibold text-brand-900 text-sm block mb-1.5">
                  Alamat Pengiriman *
                </label>
                <textarea
                  placeholder="Masukkan alamat lengkap termasuk RT/RW, nama jalan, nomor rumah..."
                  value={data.address}
                  onChange={(e) => setData({ ...data, address: e.target.value })}
                  rows={3}
                  className={`w-full bg-white border rounded-xl px-4 py-2.5 font-body text-sm text-neutral-900 placeholder:text-neutral-900/40 outline-none focus:ring-2 focus:ring-brand-300 transition-all resize-none ${errors.address ? 'border-red-400' : 'border-warm-200'
                    }`}
                />
                {errors.address && <p className="font-body text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
            )
          }

          {/* Metode pembayaran */}
          <div>
            <label className="font-heading font-semibold text-brand-900 text-sm block mb-2">
              Metode Pembayaran *
            </label>

            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  value: 'cash',
                  label: 'Tunai',
                  icon: Banknote,
                  desc: 'Bayar dengan uang tunai',
                  enabled: paymentMethods.cashEnabled,
                },
                {
                  value: 'qris',
                  label: 'QRIS',
                  icon: ScanQrCode,
                  desc: 'Bayar dengan QRIS',
                  enabled: paymentMethods.qrisEnabled,
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  disabled={!opt.enabled}
                  onClick={() => {
                    if (!opt.enabled) return

                    setData({
                      ...data,
                      paymentMethod:
                        opt.value as CheckoutData['paymentMethod'],
                    })
                  }}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all duration-200 ${!opt.enabled
                      ? 'border-neutral-300 bg-neutral-100 text-neutral-400 cursor-not-allowed'
                      : data.paymentMethod === opt.value
                        ? 'border-brand-900 bg-brand-900 text-warm-200'
                        : 'border-warm-200 bg-white text-neutral-900 hover:border-brand-300'
                    }`}
                >
                  <opt.icon
                    className="w-6 h-6"
                    strokeWidth={2}
                  />

                  <p className="font-heading font-medium text-xs">
                    {opt.label}
                  </p>

                  <p
                    className={`semibold text-xs ${data.paymentMethod === opt.value
                        ? 'text-warm-200/70'
                      : 'text-neutral-900/50'
                      }`}
                  >
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Catatan pesanan */}
          <div>
            <label className="font-heading font-semibold text-brand-900 text-sm block mb-1.5">
              Catatan Pesanan
              <span className="font-body font-normal text-neutral-900/40 text-xs ml-1">(opsional)</span>
            </label>
            <textarea
              placeholder="Contoh: jangan terlalu pedas, sambal terpisah, dll..."
              value={data.note}
              onChange={(e) => setData({ ...data, note: e.target.value })}
              rows={2}
              className="w-full bg-white border border-warm-200 rounded-xl px-4 py-2.5 font-body text-sm text-neutral-900 placeholder:text-neutral-900/40 outline-none focus:ring-2 focus:ring-brand-300 transition-all resize-none"
            />
          </div>

          {/* Kirim pesanan */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1eb857] text-white font-heading font-bold text-base py-4 rounded-2xl transition-all duration-200 hover:scale-[1.01] shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Pesan via WhatsApp
          </button>
        </form >
      </div >
    </div >
  )
}
