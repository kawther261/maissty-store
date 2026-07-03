export interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  description: string
  longDescription?: string
  images: string[]
  stock: number
  brand?: string
  isNew: boolean
  isBestSeller: boolean
  isFeatured: boolean
  category: Category
  categoryId: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image?: string
  description?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  phone: string
  wilaya: string
  address: string
  deliveryNote?: string
  status: 'EN_ATTENTE' | 'CONFIRMEE' | 'EXPEDIEE' | 'LIVREE' | 'ANNULEE'
  total: number
  items: OrderItem[]
  createdAt: string
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  product: Product
}

export interface CheckoutForm {
  customerName: string
  phone: string
  wilaya: string
  address: string
  deliveryNote: string
}

export const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra',
  'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret',
  'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda',
  'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem',
  'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj',
  'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
  'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal',
  'Béni Abbès', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El M\'Ghair',
  'El Meniaa'
]