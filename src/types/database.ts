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
  customer_name: string
  customer_email: string
  customer_phone: string
  table_id: string
  reservation_date: string
  reservation_time: string
  party_size: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  special_requests?: string
  created_at: string
  updated_at: string
}
