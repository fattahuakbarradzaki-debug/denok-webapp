export interface Addition {
  id: string
  name: string
  price: number
  active: boolean
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: 'makanan' | 'minuman-dingin' | 'minuman-hangat'
  image: string
  hasAddOns?: boolean
  hasBroth: boolean
  hasMieChoice?: boolean
  isFavorite?: boolean
  badge?: string | null
  active: boolean
}

export interface CartItem {
  cartId: string
  menuId: string
  name: string
  basePrice: number
  additions: Addition[]
  brothLevel: string
  mieTypes: string[]
  hasMieChoice: boolean
  quantity: number
  image: string
}

export interface CheckoutData {
  name: string
  pickupMethod: 'delivery' | 'takeaway' | 'dinein'
  address: string
  paymentMethod:
  | 'cash'
  | 'qris'
  | 'dana'
  | 'gopay'
  | 'ovo'
  | 'shopeepay'
  | 'transferBank'
  note: string
}

export type MenuCategory = 'all' | 'makanan' | 'minuman-dingin' | 'minuman-hangat'

export const MIE_TYPES = [
  'Mie Kuning',
  'Mie Bihun',
]

export interface StoreSettings {
  shop: {
    open: boolean
    closeReason: string
  }
  pickupMethod: {
    deliveryEnabled: boolean
    takeawayEnabled: boolean
    dineinEnabled: boolean
  }
  paymentMethods: {
    cashEnabled: boolean
    danaEnabled: boolean
    gopayEnabled: boolean
    ovoEnabled: boolean
    qrisEnabled: boolean
    shopeepayEnabled: boolean
    transferBankEnabled: boolean
  }
  schedule: {
    auto: boolean
    openHour: string
    closeHour: string
  }
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  shop: {
    open: true,
    closeReason: '',
  },
  pickupMethod: {
    deliveryEnabled: true,
    takeawayEnabled: true,
    dineinEnabled: true,
  },
  paymentMethods: {
    cashEnabled: true,
    danaEnabled: true,
    gopayEnabled: true,
    ovoEnabled: true,
    qrisEnabled: true,
    shopeepayEnabled: true,
    transferBankEnabled: true,
  },
  schedule: {
    auto: false,
    openHour: '07:00',
    closeHour: '20:00',
  },
}
