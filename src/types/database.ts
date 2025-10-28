export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  email_verified: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  total_amount: number
  pickup_date: string
  pickup_time: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  payment_intent_id: string
  items: OrderItem[]
  source?: string
  note?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
}

export interface Table {
  id: string
  name: string
  capacity: number
  room_id: string
  status: 'available' | 'occupied' | 'reserved'
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  name: string
  description: string
  tables: Table[]
  created_at: string
  updated_at: string
}

export interface Reservation {
  id: string
  date: string
  time: string
  guest_name: string
  guests: number
  phone: string | null
  email: string | null
  tables: string | null
  note: string | null
  comment: string | null
  source: string
  status: string
  duration: number
  type: string
  created_at: string
}
