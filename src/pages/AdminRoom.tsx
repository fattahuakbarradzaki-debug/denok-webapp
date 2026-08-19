import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore'
import {
  Store,
  Clock,
  Truck,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Bike,
  ShoppingBag,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Banknote
} from 'lucide-react'

import { db } from '@/firebase'
import AdminNavbar from '@/components/AdminNavbar'
import type {
  StoreSettings,
  MenuItem,
  Addition,
} from '@/types'
import { DEFAULT_STORE_SETTINGS } from '@/types'

// --- Helpers ---

function isCurrentlyOpen(settings: StoreSettings): boolean {
  if (!settings.schedule.auto) {
    return settings.shop.open
  }

  const now = new Date()

  const [openH, openM] = settings.schedule.openHour
    .split(':')
    .map(Number)

  const [closeH, closeM] = settings.schedule.closeHour
    .split(':')
    .map(Number)

  const nowMins = now.getHours() * 60 + now.getMinutes()
  const openMins = openH * 60 + openM
  const closeMins = closeH * 60 + closeM

  // Jadwal normal, misalnya 10:00 - 21.30
  if (openMins < closeMins) {
    return nowMins >= openMins && nowMins < closeMins
  }

  // Jadwal melewati tengah malam, misalnya 18:00 - 02:00
  if (openMins > closeMins) {
    return nowMins >= openMins || nowMins < closeMins
  }

  // Jika jam buka dan tutup sama
  return false
}

function countActivePickupMethods(
  pm: StoreSettings['pickupMethod'],
): number {
  return [
    pm.deliveryEnabled,
    pm.takeawayEnabled,
    pm.dineinEnabled,
  ].filter(Boolean).length
}

function countActivePaymentMethods(
  pm: StoreSettings['paymentMethods'],
): number {
  return [
    pm.cashEnabled,
    pm.qrisEnabled,
    pm.danaEnabled,
    pm.gopayEnabled,
    pm.ovoEnabled,
    pm.shopeepayEnabled,
    pm.transferBankEnabled,
  ].filter(Boolean).length
}

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
  accent?: boolean
  className?: string
  large?: boolean
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent = false,
  className = '',
  large = false,
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl p-5 flex items-center gap-4 shadow-sm h-full ${accent
        ? 'bg-brand-900 text-warm-200'
        : 'bg-white'
        } ${className}`}
    >
      <div
        className={`${large ? 'w-24 h-24' : 'w-12 h-12'} rounded-xl flex items-center justify-center flex-shrink-0 ${accent
          ? 'bg-brand-800'
          : 'bg-warm-200'
          }`}
      >
        {icon}
      </div>

      <div>
        <p
          className={`font-body ${large ? 'text-lg lg:text-xl' : 'text-xs'} ${accent
            ? 'text-warm-200/60'
            : 'text-neutral-900/50'
            }`}
        >
          {label}
        </p>

        <p
          className={`font-heading font-bold ${large ? 'text-5xl lg:text-7xl' : 'text-2xl'} ${accent
            ? 'text-brand-300'
            : 'text-brand-900'
            }`}
        >
          {value}
        </p>

        {sub !== undefined && (
          <p
            className={`font-body ${large ? 'text-lg lg:text-xl' : 'text-xs'} ${accent
              ? 'text-warm-200/50'
              : 'text-neutral-900/40'
              }`}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// SECTION CARD
// ─────────────────────────────────────────────

interface SectionCardProps {
  id: string
  icon: React.ReactNode
  title: string
  subtitle?: string
  children: React.ReactNode
}

function SectionCard({
  id,
  icon,
  title,
  subtitle,
  children,
}: SectionCardProps) {
  return (
    <div
      id={id}
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 bg-brand-900">
        <div className="w-8 h-8 rounded-lg bg-brand-800 flex items-center justify-center text-brand-300">
          {icon}
        </div>

        <div>
          <h3 className="font-heading font-semibold text-warm-200 text-sm">
            {title}
          </h3>

          {subtitle !== undefined && (
            <p className="font-body text-warm-200/50 text-xs">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="p-5">
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// TOGGLE ROW
// ─────────────────────────────────────────────

interface ToggleRowProps {
  label: string
  description?: string
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p
          className={`font-heading font-medium text-sm ${disabled
            ? 'text-neutral-900/40'
            : 'text-brand-900'
            }`}
        >
          {label}
        </p>

        {description !== undefined && (
          <p className="font-body text-neutral-900/50 text-xs mt-0.5">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          if (!disabled) {
            onChange(!checked)
          }
        }}
        disabled={disabled}
        className={`transition-colors duration-200 ${disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'cursor-pointer'
          }`}
        aria-label={`Toggle ${label}`}
      >
        {checked ? (
          <ToggleRight
            size={36}
            className="text-brand-900"
          />
        ) : (
          <ToggleLeft
            size={36}
            className="text-neutral-900/30"
          />
        )}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function AdminRoom() {
  const [settings, setSettings] =
    useState<StoreSettings>(DEFAULT_STORE_SETTINGS)

  const [menuItems, setMenuItems] =
    useState<MenuItem[]>([])

  const [additions, setAdditions] =
    useState<Addition[]>([])

  const [editingMenuId, setEditingMenuId] =
    useState<string | null>(null)

  const [showAddMenuForm, setShowAddMenuForm] =
    useState(false)

  const [deleteMenuConfirm, setDeleteMenuConfirm] =
    useState<string | null>(null)

  const [menuFilter, setMenuFilter] =
    useState<'semua' | 'makanan' | 'minuman-dingin' | 'minuman-hangat'>('semua')

  const [menuForm, setMenuForm] = useState<MenuItem>({
    id: '',
    name: '',
    description: '',
    price: 0,
    category: 'makanan',
    image: '',
    active: true,
    hasAddOns: false,
    hasBroth: false,
    hasMieChoice: false,
    isFavorite: false,
    badge: '',
  })

  function openEditMenu(menu: MenuItem) {
    setMenuForm({
      ...menu,
      badge: menu.badge ?? '',
    })

    setEditingMenuId(menu.id)
    setShowAddMenuForm(false)
  }

  function openAddMenu() {
    setMenuForm({
      id: '',
      name: '',
      description: '',
      price: 0,
      category: 'makanan',
      image: '',
      active: true,
      hasAddOns: false,
      hasBroth: false,
      hasMieChoice: false,
      isFavorite: false,
      badge: '',
    })

    setEditingMenuId(null)
    setShowAddMenuForm(true)
  }

  const [editingAdditionId, setEditingAdditionId] =
    useState<string | null>(null)

  const [showAddAdditionForm, setShowAddAdditionForm] =
    useState(false)

  const [deleteAdditionConfirm, setDeleteAdditionConfirm] =
    useState<string | null>(null)

  const [additionForm, setAdditionForm] = useState<Addition>({
    id: '',
    name: '',
    price: 0,
    active: true,
  })

  const [saving, setSaving] = useState(false)

  const [firestoreAvailable, setFirestoreAvailable] =
    useState(false)

  const [activeSection, setActiveSection] = useState<
    'dashboard' | 'menu' | 'pengaturan'
  >('dashboard')

  const [openHour, setOpenHour] = useState(
    DEFAULT_STORE_SETTINGS.schedule.openHour,
  )

  const [closeHour, setCloseHour] = useState(
    DEFAULT_STORE_SETTINGS.schedule.closeHour,
  )

  const [closeReason, setCloseReason] = useState('')

// --- Firestore listener ---

  useEffect(() => {
    const ref = doc(db, 'settings', 'global')

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        setFirestoreAvailable(true)

        if (!snapshot.exists()) {
          return
        }

        const data =
          snapshot.data() as StoreSettings

        setSettings(data)

        setOpenHour(
          data.schedule.openHour,
        )

        setCloseHour(
          data.schedule.closeHour,
        )

        setCloseReason(
          data.shop.closeReason ?? '',
        )
      },
      () => {
        setFirestoreAvailable(false)
      },
    )

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    const menuRef = collection(db, 'menus')

    const unsubscribe = onSnapshot(
      menuRef,
      (snapshot) => {
        const menus = snapshot.docs.map(
          (document) =>
            document.data() as MenuItem,
        )

        setMenuItems(menus)
      },
      (error) => {
        console.error(
          'Gagal mengambil data menu:',
          error,
        )
      },
    )

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    const additionsRef = collection(
      db,
      'additions',
    )

    const unsubscribe = onSnapshot(
      additionsRef,
      (snapshot) => {
        const items = snapshot.docs.map(
          (document) =>
            document.data() as Addition,
        )

        setAdditions(items)
      },
      (error) => {
        console.error(
          'Gagal mengambil data tambahan:',
          error,
        )
      },
    )

    return () => {
      unsubscribe()
    }
  }, [])

// --- Firestore write ---

  const write = useCallback(
    async (data: Record<string, any>) => {
      if (!firestoreAvailable) {
        return
      }

      setSaving(true)

      try {
        await updateDoc(
          doc(db, 'settings', 'global'),
          data,
        )
      } catch (error) {
        console.error(
          'Gagal menyimpan pengaturan Firebase:',
          error,
        )
      } finally {
        setSaving(false)
      }
    },
    [firestoreAvailable],
  )

  async function saveMenu(menu: MenuItem) {
    if (!firestoreAvailable) return

    setSaving(true)

    try {
      await setDoc(
        doc(db, 'menus', menu.id),
        menu,
      )

      setEditingMenuId(null)
      setShowAddMenuForm(false)
    } catch (error) {
      console.error('Gagal menyimpan menu:', error)
    } finally {
      setSaving(false)
    }
  }

  async function deleteMenu(id: string) {
    if (!firestoreAvailable) return

    setSaving(true)

    try {
      await deleteDoc(
        doc(db, 'menus', id),
      )

      setDeleteMenuConfirm(null)
    } catch (error) {
      console.error('Gagal menghapus menu:', error)
    } finally {
      setSaving(false)
    }
  }

  async function toggleMenuActive(menu: MenuItem) {
    await saveMenu({
      ...menu,
      active: !menu.active,
    })
  }

  async function saveAddition(addition: Addition) {
    if (!firestoreAvailable) return

    setSaving(true)

    try {
      await setDoc(
        doc(db, 'additions', addition.id),
        addition,
      )

      setEditingAdditionId(null)
      setShowAddAdditionForm(false)
    } catch (error) {
      console.error('Gagal menyimpan tambahan:', error)
    } finally {
      setSaving(false)
    }
  }

  async function deleteAddition(id: string) {
    if (!firestoreAvailable) return

    setSaving(true)

    try {
      await deleteDoc(
        doc(db, 'additions', id),
      )

      setDeleteAdditionConfirm(null)
    } catch (error) {
      console.error('Gagal menghapus tambahan:', error)
    } finally {
      setSaving(false)
    }
  }

  async function toggleAdditionActive(addition: Addition) {
    await saveAddition({
      ...addition,
      active: !addition.active,
    })
  }

  function openAddAddition() {
    setAdditionForm({
      id: `addition-${Date.now()}`,
      name: '',
      price: 0,
      active: true,
    })

    setEditingAdditionId(null)
    setShowAddAdditionForm(true)
  }

  function openEditAddition(addition: Addition) {
    setAdditionForm({
      ...addition,
    })

    setEditingAdditionId(addition.id)
    setShowAddAdditionForm(false)
  }

// --- Shop status ---

  function toggleShopOpen() {
    const next = !settings.shop.open

    setSettings((current) => ({
      ...current,
      shop: {
        ...current.shop,
        open: next,
      },
    }))

    void write({
      'shop.open': next,
    })
  }

  async function saveCloseReason() {
    setSettings((current) => ({
      ...current,
      shop: {
        ...current.shop,
        closeReason,
      },
    }))

    await write({
      'shop.closeReason': closeReason,
    })
  }

// --- Schedule ---

  function toggleAuto() {
    const next = !settings.schedule.auto

    setSettings((current) => ({
      ...current,
      schedule: {
        ...current.schedule,
        auto: next,
      },
    }))

    void write({
      'schedule.auto': next,
    })
  }

  async function saveSchedule() {
    setSettings((current) => ({
      ...current,
      schedule: {
        ...current.schedule,
        openHour,
        closeHour,
      },
    }))

    await write({
      'schedule.openHour': openHour,
      'schedule.closeHour': closeHour,
    })
  }

// --- Pickup methods ---

  function togglePickupMethod(
    key: keyof StoreSettings['pickupMethod'],
    value: boolean,
  ) {
    setSettings((current) => ({
      ...current,
      pickupMethod: {
        ...current.pickupMethod,
        [key]: value,
      },
    }))

    void write({
      [`pickupMethod.${key}`]: value,
    })
  }

  async function togglePaymentMethod(
    key: keyof StoreSettings['paymentMethods'],
    value: boolean,
  ) {
    if (!firestoreAvailable) return

    setSaving(true)

    try {
      await updateDoc(
        doc(db, 'settings', 'global'),
        {
          [`paymentMethods.${key}`]: value,
        },
      )
    } catch (error) {
      console.error(
        'Gagal mengubah metode pembayaran:',
        error,
      )
    } finally {
      setSaving(false)
    }
  }

// --- Computed values ---

  const storeCurrentlyOpen =
    isCurrentlyOpen(settings)

  const activeMethodCount =
    countActivePickupMethods(
      settings.pickupMethod,
    )

  const totalMenuCount = menuItems.filter(
    (item) => item.active,
  ).length

  const totalAdditionCount = additions.filter(
    (item) => item.active,
  ).length

  const activePaymentCount =
    countActivePaymentMethods(
      settings.paymentMethods,
    )

// --- Render ---

  const filteredMenus =
    menuFilter === 'semua'
      ? menuItems
      : menuItems.filter(
        (menu) => menu.category === menuFilter,
      )

  return (
    <div className="min-h-screen bg-warm-100">
      <AdminNavbar />

      <main className="max-w-6xl mx-auto px-4 pt-24 pb-16">

        {/* HEADER */}
        <div className="mb-8">

          <div className="inline-flex items-center gap-2 bg-brand-300/15 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />

            <span className="font-body text-brand-900 text-sm font-medium">
              Admin Room
            </span>
          </div>

          <h1 className="font-heading font-bold text-5xl text-brand-900">
            ADMIN ROOM DENOK
          </h1>

          <p className="font-body text-2xl text-neutral-900/60">
            Kelola operasional kedai secara real-time
          </p>

          {/* ADMIN ROOM NAVIGATION */}
          <div className="mt-6 flex items-center gap-2 border-b border-warm-200">

            <button
              type="button"
              onClick={() => setActiveSection('dashboard')}
              className={`px-4 py-3 font-heading font-semibold text-sm border-b-2 transition-all ${activeSection === 'dashboard'
                ? 'border-brand-900 text-brand-900'
                : 'border-transparent text-neutral-900/50 hover:text-brand-900'
                }`}
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('menu')}
              className={`px-4 py-3 font-heading font-semibold text-sm border-b-2 transition-all ${activeSection === 'menu'
                ? 'border-brand-900 text-brand-900'
                : 'border-transparent text-neutral-900/50 hover:text-brand-900'
                }`}
            >
              Menu
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('pengaturan')}
              className={`px-4 py-3 font-heading font-semibold text-sm border-b-2 transition-all ${activeSection === 'pengaturan'
                ? 'border-brand-900 text-brand-900'
                : 'border-transparent text-neutral-900/50 hover:text-brand-900'
                }`}
            >
              Pengaturan
            </button>

          </div>

          {/* FIREBASE STATUS */}
          {!firestoreAvailable && (
            <div className="mt-3 flex items-center gap-2 bg-warm-400/60 border border-brand-300/40 rounded-xl px-4 py-2.5">

              <AlertCircle
                size={15}
                className="text-brand-600 flex-shrink-0"
              />

              <p className="font-body text-brand-900 text-xs">
                Firebase belum terhubung. Tambahkan
                variabel{' '}
                <code className="font-mono text-brand-600">
                  VITE_FIREBASE_*
                </code>{' '}
                untuk mengaktifkan sinkronisasi
                real-time.
              </p>

            </div>
          )}

          {/* SAVING */}
          {saving && (
            <div className="mt-2 flex items-center gap-2">

              <div className="w-3 h-3 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />

              <span className="font-body text-brand-600 text-xs">
                Menyimpan...
              </span>

            </div>
          )}

        </div>

        {/* ═══════════════════════════════════════
            DASHBOARD
        ═══════════════════════════════════════ */}

        {activeSection === 'dashboard' && (
          <div>

            {/* STATISTICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 items-stretch">

              <StatCard
                icon={
                  storeCurrentlyOpen ? (
                    <CheckCircle2
                      size={64}
                      className="text-brand-300"
                    />
                  ) : (
                    <XCircle
                      size={64}
                      className="text-brand-600"
                    />
                  )
                }
                label="Status Kedai"
                value={
                  storeCurrentlyOpen
                    ? 'Buka'
                    : 'Tutup'
                }
                sub={
                  settings.schedule.auto
                    ? 'Mode otomatis'
                    : 'Mode manual'
                }
                className="sm:row-span-2"
                large
                accent
              />

              <StatCard
                icon={
                  <UtensilsCrossed
                    size={22}
                    className="text-brand-600"
                  />
                }
                label="Total Menu Utama"
                value={totalMenuCount}
                sub="item tersedia"
              />

              <StatCard
                icon={
                  <Plus
                    size={22}
                    className="text-brand-600"
                  />
                }
                label="Total Menu Tambahan"
                value={totalAdditionCount}
                sub="item tersedia"
              />

              <StatCard
                icon={
                  <Truck
                    size={22}
                    className="text-brand-600"
                  />
                }
                label="Metode Pengambilan"
                value={activeMethodCount}
                sub="dari 3 metode"
              />

              <StatCard
                icon={
                  <Banknote
                    size={22}
                    className="text-brand-600"
                  />
                }
                label="Metode Pembayaran"
                value={activePaymentCount}
                sub="dari 7 metode"
              />

            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            MENU
        ═══════════════════════════════════════ */}

        {activeSection === 'menu' && (
          <div className="space-y-5">

            {/* FORM TAMBAH / EDIT MENU */}
            {(showAddMenuForm || editingMenuId) && (
              <SectionCard
                id="menu-form"
                icon={<Pencil size={16} />}
                title={editingMenuId ? 'Edit Menu' : 'Tambah Menu'}
                subtitle="Data akan disimpan langsung ke Firestore"
              >
                <div className="space-y-4">

                  <div>
                    <label className="font-heading font-medium text-brand-900 text-sm block mb-1.5">
                      ID Menu
                    </label>

                    <input
                      type="text"
                      value={menuForm.id}
                      disabled={!!editingMenuId}
                      onChange={(event) =>
                        setMenuForm((current) => ({
                          ...current,
                          id: event.target.value
                            .toLowerCase()
                            .replace(/\s+/g, '-'),
                        }))
                      }
                      placeholder="contoh: mie-ayam-original"
                      className="w-full bg-warm-100 border border-warm-200 rounded-xl px-3 py-2.5 font-body text-sm text-brand-900 outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-50"
                    />

                    <p className="font-body text-neutral-900/40 text-xs mt-1">
                      ID digunakan sebagai ID dokumen menu di Firestore.
                    </p>
                  </div>

                  <div>
                    <label className="font-heading font-medium text-brand-900 text-sm block mb-1.5">
                      Nama Menu
                    </label>

                    <input
                      type="text"
                      value={menuForm.name}
                      onChange={(event) =>
                        setMenuForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Nama menu"
                      className="w-full bg-warm-100 border border-warm-200 rounded-xl px-3 py-2.5 font-body text-sm text-brand-900 outline-none focus:ring-2 focus:ring-brand-300"
                    />
                  </div>

                  <div>
                    <label className="font-heading font-medium text-brand-900 text-sm block mb-1.5">
                      Deskripsi
                    </label>

                    <textarea
                      value={menuForm.description}
                      onChange={(event) =>
                        setMenuForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Deskripsi menu"
                      className="w-full bg-warm-100 border border-warm-200 rounded-xl px-3 py-2.5 font-body text-sm text-brand-900 outline-none focus:ring-2 focus:ring-brand-300 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <div>
                      <label className="font-heading font-medium text-brand-900 text-sm block mb-1.5">
                        Harga
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={menuForm.price}
                        onChange={(event) =>
                          setMenuForm((current) => ({
                            ...current,
                            price: Number(event.target.value),
                          }))
                        }
                        className="w-full bg-warm-100 border border-warm-200 rounded-xl px-3 py-2.5 font-body text-sm text-brand-900 outline-none focus:ring-2 focus:ring-brand-300"
                      />
                    </div>

                    <div>
                      <label className="font-heading font-medium text-brand-900 text-sm block mb-1.5">
                        Kategori
                      </label>

                      <select
                        value={menuForm.category}
                        onChange={(event) =>
                          setMenuForm((current) => ({
                            ...current,
                            category: event.target.value as MenuItem['category'],
                          }))
                        }
                        className="w-full bg-warm-100 border border-warm-200 rounded-xl px-3 py-2.5 font-body text-sm text-brand-900 outline-none focus:ring-2 focus:ring-brand-300"
                      >
                        <option value="makanan">Makanan</option>
                        <option value="minuman-dingin">Minuman Dingin</option>
                        <option value="minuman-hangat">Minuman Hangat</option>
                      </select>
                    </div>

                  </div>

                  <div>
                    <label className="font-heading font-medium text-brand-900 text-sm block mb-1.5">
                      URL Gambar
                    </label>

                    <input
                      type="url"
                      value={menuForm.image}
                      onChange={(event) =>
                        setMenuForm((current) => ({
                          ...current,
                          image: event.target.value,
                        }))
                      }
                      placeholder="https://..."
                      className="w-full bg-warm-100 border border-warm-200 rounded-xl px-3 py-2.5 font-body text-sm text-brand-900 outline-none focus:ring-2 focus:ring-brand-300"
                    />
                  </div>

                  <div>
                    <label className="font-heading font-medium text-brand-900 text-sm block mb-1.5">
                      Badge
                    </label>

                    <input
                      type="text"
                      value={menuForm.badge ?? ''}
                      onChange={(event) =>
                        setMenuForm((current) => ({
                          ...current,
                          badge: event.target.value || null,
                        }))
                      }
                      placeholder="Contoh: Best Seller"
                      className="w-full bg-warm-100 border border-warm-200 rounded-xl px-3 py-2.5 font-body text-sm text-brand-900 outline-none focus:ring-2 focus:ring-brand-300"
                    />
                  </div>

                  <div className="border-t border-warm-200 pt-4">

                    <p className="font-heading font-semibold text-brand-900 text-sm mb-2">
                      Fitur Menu
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">

                      <ToggleRow
                        label="Menu Aktif"
                        description="Tampilkan menu kepada pelanggan"
                        checked={menuForm.active}
                        onChange={(value) =>
                          setMenuForm((current) => ({
                            ...current,
                            active: value,
                          }))
                        }
                      />

                      <ToggleRow
                        label="Tambahan"
                        description="Menu dapat menggunakan tambahan"
                        checked={menuForm.hasAddOns ?? false}
                        onChange={(value) =>
                          setMenuForm((current) => ({
                            ...current,
                            hasAddOns: value,
                          }))
                        }
                      />

                      <ToggleRow
                        label="Pilihan Kuah"
                        description="Tampilkan pilihan level kuah"
                        checked={menuForm.hasBroth}
                        onChange={(value) =>
                          setMenuForm((current) => ({
                            ...current,
                            hasBroth: value,
                          }))
                        }
                      />

                      <ToggleRow
                        label="Pilihan Mie"
                        description="Tampilkan pilihan jenis mie"
                        checked={menuForm.hasMieChoice ?? false}
                        onChange={(value) =>
                          setMenuForm((current) => ({
                            ...current,
                            hasMieChoice: value,
                          }))
                        }
                      />

                      <ToggleRow
                        label="Favorit"
                        description="Tandai sebagai menu favorit"
                        checked={menuForm.isFavorite ?? false}
                        onChange={(value) =>
                          setMenuForm((current) => ({
                            ...current,
                            isFavorite: value,
                          }))
                        }
                      />

                    </div>

                  </div>

                  <div className="flex gap-2 pt-2">

                    <button
                      type="button"
                      onClick={() => {
                        setShowAddMenuForm(false)
                        setEditingMenuId(null)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-warm-200 hover:bg-warm-300 text-brand-900 font-heading font-semibold text-sm py-3 rounded-xl transition-colors"
                    >
                      <X size={16} />
                      Batal
                    </button>

                    <button
                      type="button"
                      disabled={
                        saving ||
                        !menuForm.id.trim() ||
                        !menuForm.name.trim() ||
                        menuForm.price < 0
                      }
                      onClick={() => void saveMenu(menuForm)}
                      className="flex-1 flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 disabled:opacity-40 disabled:cursor-not-allowed text-warm-200 font-heading font-semibold text-sm py-3 rounded-xl transition-colors"
                    >
                      <Check size={16} />
                      {saving ? 'Menyimpan...' : 'Simpan Menu'}
                    </button>

                  </div>

                </div>
              </SectionCard>
            )}

            {/* MENU UTAMA */}
            <SectionCard
              id="menu-admin"
              icon={<UtensilsCrossed size={16} />}
              title="Menu Utama"
              subtitle={`${menuItems.length} menu tersimpan di Firestore`}
            >

              {/* HEADER ACTION */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

                <div className="flex flex-wrap gap-2">

                  {[
                    { value: 'semua', label: 'Semua' },
                    { value: 'makanan', label: 'Makanan' },
                    { value: 'minuman-dingin', label: 'Minuman Dingin' },
                    { value: 'minuman-hangat', label: 'Minuman Hangat' },
                  ].map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() =>
                        setMenuFilter(
                          category.value as typeof menuFilter,
                        )
                      }
                      className={`px-3 py-2 rounded-xl text-xs font-heading font-semibold transition-all ${menuFilter === category.value
                        ? 'bg-brand-900 text-warm-200'
                        : 'bg-warm-100 text-brand-900 hover:bg-warm-200'
                        }`}
                    >
                      {category.label}
                    </button>
                  ))}

                </div>

                <button
                  type="button"
                  onClick={openAddMenu}
                  className="flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 text-warm-200 font-heading font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
                >
                  <Plus size={16} />
                  Tambah Menu Utama
                </button>

              </div>

              {/* LIST MENU */}
              <div className="space-y-2">

                {filteredMenus.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="font-heading font-semibold text-brand-900">
                      Belum ada menu
                    </p>

                    <p className="font-body text-neutral-900/50 text-sm mt-1">
                      Tambahkan menu baru untuk memulai.
                    </p>
                  </div>
                ) : (
                  filteredMenus.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${item.active
                        ? 'bg-warm-100 border-warm-200'
                        : 'bg-neutral-100 border-neutral-200 opacity-60'
                        }`}
                    >

                      {/* IMAGE */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-warm-200">

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <UtensilsCrossed
                              size={20}
                              className="text-brand-600"
                            />
                          </div>
                        )}

                      </div>

                      {/* INFO */}
                      <div className="flex-1 min-w-0">

                        <div className="flex items-center gap-2">

                          <p className="font-heading font-semibold text-brand-900 text-sm truncate">
                            {item.name}
                          </p>

                          {!item.active && (
                            <span className="text-[10px] font-heading font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                              Nonaktif
                            </span>
                          )}

                          {item.badge && (
                            <span className="text-[10px] font-heading font-semibold bg-brand-300/20 text-brand-900 px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}

                        </div>

                        <p className="font-body text-neutral-900/50 text-xs mt-1">
                          {item.category}
                        </p>

                        <p className="font-heading font-semibold text-brand-600 text-sm mt-1">
                          Rp {item.price.toLocaleString('id-ID')}
                        </p>

                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center gap-1">

                        <button
                          type="button"
                          onClick={() => openEditMenu(item)}
                          className="w-9 h-9 rounded-lg bg-warm-200 hover:bg-warm-300 flex items-center justify-center transition-colors"
                          title="Edit menu"
                        >
                          <Pencil
                            size={15}
                            className="text-brand-900"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void toggleMenuActive(item)
                          }
                          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${item.active
                            ? 'bg-green-100 hover:bg-green-200'
                            : 'bg-neutral-100 hover:bg-neutral-200'
                            }`}
                          title={
                            item.active
                              ? 'Nonaktifkan'
                              : 'Aktifkan'
                          }
                        >
                          {item.active ? (
                            <Check
                              size={15}
                              className="text-green-600"
                            />
                          ) : (
                            <X
                              size={15}
                              className="text-neutral-500"
                            />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteMenuConfirm(item.id)
                          }
                          className="w-9 h-9 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                          title="Hapus menu"
                        >
                          <Trash2
                            size={15}
                            className="text-red-500"
                          />
                        </button>

                      </div>

                    </div>
                  ))
                )}

              </div>

            </SectionCard>

            {/* MENU TAMBAHAN */}
            <SectionCard
              id="addition-admin"
              icon={<Plus size={16} />}
              title="Menu Tambahan"
              subtitle={`${additions.length} menu tambahan tersimpan di Firestore`}
            >

              {/* HEADER ACTION */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

                <div>
                  <p className="font-body text-neutral-900/50 text-xs">
                    Tambahan yang dapat dipilih pelanggan saat memesan menu.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openAddAddition}
                  className="flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 text-warm-200 font-heading font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
                >
                  <Plus size={16} />
                  Tambah Menu Tambahan
                </button>

              </div>

              {/* FORM TAMBAH / EDIT */}
              {(showAddAdditionForm || editingAdditionId) && (
                <div className="bg-warm-100 border border-warm-200 rounded-xl p-4 mb-5">

                  <h4 className="font-heading font-semibold text-brand-900 text-sm mb-4">
                    {editingAdditionId
                      ? 'Edit Menu Tambahan'
                      : 'Tambah Menu Tambahan'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* NAMA */}
                    <div>
                      <label className="font-heading font-medium text-brand-900 text-sm block mb-1.5">
                        Nama Menu Tambahan
                      </label>

                      <input
                        type="text"
                        value={additionForm.name}
                        onChange={(event) =>
                          setAdditionForm((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        placeholder="Contoh: Bakso, Keju, Telur"
                        className="w-full px-3 py-2.5 rounded-xl border border-warm-200 bg-white text-sm outline-none focus:border-brand-600"
                      />
                    </div>

                    {/* HARGA */}
                    <div>
                      <label className="font-heading font-medium text-brand-900 text-sm block mb-1.5">
                        Harga
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={additionForm.price}
                        onChange={(event) =>
                          setAdditionForm((current) => ({
                            ...current,
                            price: Number(event.target.value),
                          }))
                        }
                        placeholder="3000"
                        className="w-full px-3 py-2.5 rounded-xl border border-warm-200 bg-white text-sm outline-none focus:border-brand-600"
                      />
                    </div>

                  </div>

                  {/* BUTTON */}
                  <div className="flex gap-2 pt-4">

                    <button
                      type="button"
                      onClick={() => {
                        setShowAddAdditionForm(false)
                        setEditingAdditionId(null)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-warm-200 hover:bg-warm-300 text-brand-900 font-heading font-semibold text-sm py-3 rounded-xl transition-colors"
                    >
                      <X size={16} />
                      Batal
                    </button>

                    <button
                      type="button"
                      disabled={
                        saving ||
                        !additionForm.name.trim() ||
                        additionForm.price < 0
                      }
                      onClick={() =>
                        void saveAddition(additionForm)
                      }
                      className="flex-1 flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 disabled:opacity-40 disabled:cursor-not-allowed text-warm-200 font-heading font-semibold text-sm py-3 rounded-xl transition-colors"
                    >
                      <Check size={16} />
                      {saving
                        ? 'Menyimpan...'
                        : 'Simpan Menu Tambahan'}
                    </button>

                  </div>

                </div>
              )}

              {/* LIST MENU TAMBAHAN */}
              <div className="space-y-2">

                {additions.length === 0 ? (
                  <div className="text-center py-10">

                    <p className="font-heading font-semibold text-brand-900">
                      Belum ada menu tambahan
                    </p>

                    <p className="font-body text-neutral-900/50 text-sm mt-1">
                      Tambahkan menu tambahan untuk pelanggan.
                    </p>

                  </div>
                ) : (
                  additions.map((addition) => (
                    <div
                      key={addition.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${addition.active
                        ? 'bg-warm-100 border-warm-200'
                        : 'bg-neutral-100 border-neutral-200 opacity-60'
                        }`}
                    >

                      {/* ICON */}
                      <div className="w-11 h-11 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                        <Plus
                          size={18}
                          className="text-brand-600"
                        />
                      </div>

                      {/* INFO */}
                      <div className="flex-1 min-w-0">

                        <div className="flex items-center gap-2">

                          <p className="font-heading font-semibold text-brand-900 text-sm truncate">
                            {addition.name}
                          </p>

                          {!addition.active && (
                            <span className="text-[10px] font-heading font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                              Nonaktif
                            </span>
                          )}

                        </div>

                        <p className="font-heading font-semibold text-brand-600 text-sm mt-1">
                          Rp {addition.price.toLocaleString('id-ID')}
                        </p>

                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center gap-1">

                        <button
                          type="button"
                          onClick={() =>
                            openEditAddition(addition)
                          }
                          className="w-9 h-9 rounded-lg bg-warm-200 hover:bg-warm-300 flex items-center justify-center transition-colors"
                          title="Edit menu tambahan"
                        >
                          <Pencil
                            size={15}
                            className="text-brand-900"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void toggleAdditionActive(addition)
                          }
                          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${addition.active
                            ? 'bg-green-100 hover:bg-green-200'
                            : 'bg-neutral-100 hover:bg-neutral-200'
                            }`}
                          title={
                            addition.active
                              ? 'Nonaktifkan'
                              : 'Aktifkan'
                          }
                        >
                          {addition.active ? (
                            <Check
                              size={15}
                              className="text-green-600"
                            />
                          ) : (
                            <X
                              size={15}
                              className="text-neutral-500"
                            />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteAdditionConfirm(addition.id)
                          }
                          className="w-9 h-9 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                          title="Hapus menu tambahan"
                        >
                          <Trash2
                            size={15}
                            className="text-red-500"
                          />
                        </button>

                      </div>

                    </div>
                  ))
                )}

              </div>

            </SectionCard>

          </div>
        )}

        {/* ═══════════════════════════════════════
            PENGATURAN
        ═══════════════════════════════════════ */}

        {activeSection === 'pengaturan' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

              {/* STATUS KEDAI */}
              <SectionCard
                id="status-kedai"
                icon={<Store size={16} />}
                title="Status Kedai"
                subtitle="Kontrol buka/tutup kedai secara manual"
              >

                <div
                  className={`rounded-xl px-4 py-3 mb-4 flex items-center gap-3 ${storeCurrentlyOpen
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                    }`}
                >

                  {storeCurrentlyOpen ? (
                    <CheckCircle2
                      size={18}
                      className="text-green-600 flex-shrink-0"
                    />
                  ) : (
                    <XCircle
                      size={18}
                      className="text-red-500 flex-shrink-0"
                    />
                  )}

                  <div>

                    <p
                      className={`font-heading font-semibold text-sm ${storeCurrentlyOpen
                        ? 'text-green-700'
                        : 'text-red-600'
                        }`}
                    >
                      kedai sedang{' '}
                      {storeCurrentlyOpen
                        ? 'BUKA'
                        : 'TUTUP'}
                    </p>

                    <p className="font-body text-xs text-neutral-900/50">
                      {settings.schedule.auto
                        ? `Otomatis — ${settings.schedule.openHour} s/d ${settings.schedule.closeHour}`
                        : 'Mode manual aktif'}
                    </p>

                  </div>

                </div>

                {/* MANUAL TOGGLE */}
                {!settings.schedule.auto && (
                  <div className="border-t border-warm-200">

                    <ToggleRow
                      label="Kedai Buka"
                      description="Aktifkan untuk membuka kedai secara manual"
                      checked={settings.shop.open}
                      onChange={toggleShopOpen}
                    />

                  </div>
                )}

                {/* AUTO MODE MESSAGE */}
                {settings.schedule.auto && (
                  <p className="font-body text-neutral-900/50 text-xs italic border-t border-warm-200 pt-3">
                    Status kedai dikendalikan oleh
                    jadwal otomatis. Matikan mode
                    otomatis di bagian Jadwal untuk
                    mengontrol secara manual.
                  </p>
                )}

                {/* CLOSE REASON */}
                <div className="mt-4">

                  <label className="font-heading font-medium text-brand-900 text-sm block mb-1.5">
                    Alasan Tutup

                    <span className="font-body font-normal text-neutral-900/40 text-xs ml-1">
                      (opsional — tampil ke pelanggan)
                    </span>
                  </label>

                  <div className="flex gap-2">

                    <input
                      type="text"
                      placeholder="Misal: Libur Hari Raya, Stok habis..."
                      value={closeReason}
                      onChange={(event) =>
                        setCloseReason(
                          event.target.value,
                        )
                      }
                      className="flex-1 bg-warm-100 border border-warm-200 rounded-xl px-3 py-2 font-body text-sm text-neutral-900 placeholder:text-neutral-900/40 outline-none focus:ring-2 focus:ring-brand-300 transition-all"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        void saveCloseReason()
                      }
                      className="bg-brand-900 hover:bg-brand-800 text-warm-200 font-heading font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
                    >
                      Simpan
                    </button>

                  </div>

                </div>

              </SectionCard>

              {/* JADWAL */}
              <SectionCard
                id="jadwal"
                icon={<Clock size={16} />}
                title="Jadwal Operasional"
                subtitle="Atur jam buka dan mode otomatis"
              >

                <ToggleRow
                  label="Mode Otomatis"
                  description={
                    settings.schedule.auto
                      ? 'Status kedai mengikuti jadwal jam buka/tutup'
                      : 'Status kedai dikontrol manual di bagian Status Kedai'
                  }
                  checked={settings.schedule.auto}
                  onChange={toggleAuto}
                />

                <div
                  className={`border-t border-warm-200 pt-4 transition-opacity duration-200 ${!settings.schedule.auto
                    ? 'opacity-40 pointer-events-none'
                    : ''
                    }`}
                >

                  <p className="font-heading font-medium text-brand-900 text-sm mb-3">
                    Jam Operasional
                  </p>

                  <div className="grid grid-cols-2 gap-3">

                    <div>

                      <label className="font-body text-neutral-900/60 text-xs block mb-1">
                        Jam Buka
                      </label>

                      <input
                        type="time"
                        value={openHour}
                        onChange={(event) =>
                          setOpenHour(
                            event.target.value,
                          )
                        }
                        className="w-full bg-warm-100 border border-warm-200 rounded-xl px-3 py-2 font-body text-sm text-brand-900 outline-none focus:ring-2 focus:ring-brand-300 transition-all"
                      />

                    </div>

                    <div>

                      <label className="font-body text-neutral-900/60 text-xs block mb-1">
                        Jam Tutup
                      </label>

                      <input
                        type="time"
                        value={closeHour}
                        onChange={(event) =>
                          setCloseHour(
                            event.target.value,
                          )
                        }
                        className="w-full bg-warm-100 border border-warm-200 rounded-xl px-3 py-2 font-body text-sm text-brand-900 outline-none focus:ring-2 focus:ring-brand-300 transition-all"
                      />

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      void saveSchedule()
                    }
                    className="mt-3 w-full bg-brand-900 hover:bg-brand-800 text-warm-200 font-heading font-semibold text-sm py-2.5 rounded-xl transition-colors"
                  >
                    Simpan Jadwal
                  </button>

                </div>

              </SectionCard>

            </div>

            <div className="mb-5">

              <SectionCard
                id="metode"
                icon={<Truck size={16} />}
                title="Metode Pengambilan"
                subtitle="Kelola metode yang tersedia untuk pelanggan"
              >

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                  {[
                    {
                      key: 'deliveryEnabled' as const,
                      label: 'Delivery',
                      description:
                        'Antar ke alamat pelanggan',
                      icon: (
                        <Bike
                          size={20}
                          className="text-brand-600"
                        />
                      ),
                    },
                    {
                      key: 'takeawayEnabled' as const,
                      label: 'Take Away',
                      description:
                        'Ambil sendiri di kedai',
                      icon: (
                        <ShoppingBag
                          size={20}
                          className="text-brand-600"
                        />
                      ),
                    },
                    {
                      key: 'dineinEnabled' as const,
                      label: 'Dine In',
                      description:
                        'Makan di tempat',
                      icon: (
                        <UtensilsCrossed
                          size={20}
                          className="text-brand-600"
                        />
                      ),
                    },
                  ].map(
                    ({
                      key,
                      label,
                      description,
                      icon,
                    }) => {
                      const enabled =
                        settings.pickupMethod[key]

                      return (
                        <button
                          type="button"
                          key={key}
                          onClick={() =>
                            togglePickupMethod(
                              key,
                              !enabled,
                            )
                          }
                          className={`relative flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${enabled
                            ? 'border-brand-900 bg-brand-900/5'
                            : 'border-warm-200 bg-warm-100 opacity-60'
                            }`}
                        >

                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${enabled
                              ? 'bg-warm-200'
                              : 'bg-warm-200/50'
                              }`}
                          >
                            {icon}
                          </div>

                          <div className="flex-1 min-w-0">

                            <p
                              className={`font-heading font-semibold text-sm ${enabled
                                ? 'text-brand-900'
                                : 'text-neutral-900/50'
                                }`}
                            >
                              {label}
                            </p>

                            <p className="font-body text-neutral-900/50 text-xs mt-0.5">
                              {description}
                            </p>

                          </div>

                          <span
                            className={`absolute top-3 right-3 text-xs font-heading font-semibold px-2 py-0.5 rounded-full ${enabled
                              ? 'bg-brand-300/30 text-brand-900'
                              : 'bg-neutral-900/10 text-neutral-900/40'
                              }`}
                          >
                            {enabled
                              ? 'Aktif'
                              : 'Nonaktif'}
                          </span>

                        </button>
                      )
                    },
                  )}

                </div>

                <p className="font-body text-neutral-900/40 text-xs mt-3">
                  Metode yang dinonaktifkan tetap terlihat
                  oleh pelanggan namun tidak dapat dipilih.
                </p>

              </SectionCard>

              {/* METODE PEMBAYARAN */}
              <SectionCard
                id="pembayaran"
                icon={<Banknote size={16} />}
                title="Metode Pembayaran"
                subtitle="Kelola metode pembayaran yang tersedia untuk pelanggan"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {[
                    {
                      key: 'cashEnabled' as const,
                      label: 'Tunai',
                      description:
                        'Pembayaran langsung dengan uang tunai',
                    },
                    {
                      key: 'qrisEnabled' as const,
                      label: 'QRIS',
                      description:
                        'Pembayaran melalui QRIS',
                    },
                    {
                      key: 'danaEnabled' as const,
                      label: 'DANA',
                      description:
                        'Simulasi pembayaran melalui DANA',
                    },
                    {
                      key: 'gopayEnabled' as const,
                      label: 'GoPay',
                      description:
                        'Simulasi pembayaran melalui GoPay',
                    },
                    {
                      key: 'ovoEnabled' as const,
                      label: 'OVO',
                      description:
                        'Simulasi pembayaran melalui OVO',
                    },
                    {
                      key: 'shopeepayEnabled' as const,
                      label: 'ShopeePay',
                      description:
                        'Simulasi pembayaran melalui ShopeePay',
                    },
                    {
                      key: 'transferBankEnabled' as const,
                      label: 'Transfer Bank',
                      description:
                        'Simulasi pembayaran melalui transfer bank',
                    },
                  ].map(
                    ({
                      key,
                      label,
                      description,
                    }) => {
                      const enabled =
                        settings.paymentMethods[key]

                      return (
                        <button
                          type="button"
                          key={key}
                          onClick={() =>
                            togglePaymentMethod(
                              key,
                              !enabled,
                            )
                          }
                          className={`relative flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${enabled
                              ? 'border-brand-900 bg-brand-900/5'
                              : 'border-warm-200 bg-warm-100 opacity-60'
                            }`}
                        >

                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${enabled
                                ? 'bg-warm-200'
                                : 'bg-warm-200/50'
                              }`}
                          >
                            <Banknote
                              size={20}
                              className="text-brand-600"
                            />
                          </div>

                          <div className="flex-1 min-w-0">

                            <p
                              className={`font-heading font-semibold text-sm ${enabled
                                  ? 'text-brand-900'
                                  : 'text-neutral-900/50'
                                }`}
                            >
                              {label}
                            </p>

                            <p className="font-body text-neutral-900/50 text-xs mt-0.5">
                              {description}
                            </p>

                          </div>

                          <span
                            className={`absolute top-3 right-3 text-xs font-heading font-semibold px-2 py-0.5 rounded-full ${enabled
                                ? 'bg-brand-300/30 text-brand-900'
                                : 'bg-neutral-900/10 text-neutral-900/40'
                              }`}
                          >
                            {enabled
                              ? 'Aktif'
                              : 'Nonaktif'}
                          </span>

                        </button>
                      )
                    },
                  )}

                </div>

                <p className="font-body text-neutral-900/40 text-xs mt-3">
                  Metode yang dinonaktifkan tidak akan
                  tersedia untuk dipilih oleh pelanggan.
                </p>

              </SectionCard>

            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            DELETE CONFIRMATION MODAL
        ═══════════════════════════════════════ */}

        {(deleteMenuConfirm || deleteAdditionConfirm) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

            {/* BACKDROP */}
            <button
              type="button"
              aria-label="Tutup dialog"
              onClick={() => {
                setDeleteMenuConfirm(null)
                setDeleteAdditionConfirm(null)
              }}
              className="absolute inset-0 bg-brand-900/50 backdrop-blur-sm"
            />

            {/* MODAL */}
            <div className="relative w-full max-w-md bg-warm-100 rounded-2xl shadow-2xl p-6">

              {/* ICON */}
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2
                  size={22}
                  className="text-red-600"
                />
              </div>

              {/* TITLE */}
              <h3 className="font-heading font-bold text-brand-900 text-lg">
                Hapus {deleteMenuConfirm ? 'Menu' : 'Menu Tambahan'}?
              </h3>

              {/* DESCRIPTION */}
              <p className="font-body text-neutral-900/60 text-sm mt-2 leading-relaxed">
                {deleteMenuConfirm
                  ? 'Menu ini akan dihapus secara permanen dari database. Tindakan ini tidak dapat dibatalkan.'
                  : 'Menu tambahan ini akan dihapus secara permanen dari database. Tindakan ini tidak dapat dibatalkan.'}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-6">

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setDeleteMenuConfirm(null)
                    setDeleteAdditionConfirm(null)
                  }}
                  className="flex-1 bg-warm-200 hover:bg-warm-300 disabled:opacity-50 text-brand-900 font-heading font-semibold text-sm py-3 rounded-xl transition-colors"
                >
                  Batal
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    if (deleteMenuConfirm) {
                      void deleteMenu(deleteMenuConfirm)
                    }

                    if (deleteAdditionConfirm) {
                      void deleteAddition(
                        deleteAdditionConfirm,
                      )
                    }
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-heading font-semibold text-sm py-3 rounded-xl transition-colors"
                >
                  {saving ? 'Menghapus...' : 'Hapus'}
                </button>

              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  )
}

