'use client'

import { useState, useEffect } from 'react'
import { Order, User } from '@/types/database'
import AdminLayout from '@/components/AdminLayout'

interface OrderWithUser extends Order {
  profiles: User
}

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<OrderWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    loadOrders()
  }, [selectedDate])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders?date=${selectedDate}`)
      
      if (!response.ok) {
        throw new Error('Failed to load orders')
      }
      
      const data = await response.json()
      setOrders(data || [])
    } catch (error) {
      console.error('Error loading orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status })
      })

      if (!response.ok) {
        throw new Error('Failed to update order')
      }
      
      loadOrders() // Reload orders
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
             {/* Date Filter */}
             <div className="rounded-2xl p-6" style={{ backgroundColor: '#1A1A1A', borderWidth: '1px', borderColor: '#242424' }}>
               <div className="flex items-center gap-4">
                 <label className="text-sm font-medium" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Datum:</label>
                 <input
                   type="date"
                   value={selectedDate}
                   onChange={(e) => setSelectedDate(e.target.value)}
                   className="border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                   style={{ backgroundColor: '#242424' }}
                 />
                 <button
                   onClick={loadOrders}
                   className="px-6 py-3 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                   style={{ backgroundColor: '#FF6B00', fontSize: '16px', fontWeight: '600' }}
                 >
                   Aktualisieren
                 </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-gray-400">Lade Bestellungen...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Keine Bestellungen für diesen Tag</p>
            </div>
          ) : (
                 orders.map((order) => (
                   <div key={order.id} className="rounded-2xl p-6" style={{ backgroundColor: '#1A1A1A', borderWidth: '1px', borderColor: '#242424' }}>
                     <div className="flex justify-between items-start mb-4">
                       <div>
                         <h3 className="text-xl font-semibold mb-1" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                           Bestellung #{order.order_number}
                         </h3>
                         <p className="text-gray-400" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                           {order.profiles?.first_name} {order.profiles?.last_name}
                         </p>
                         <p className="text-sm text-gray-500" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>{order.customer_email}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-2xl font-bold text-orange-500" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                           {formatPrice(order.total_amount)}
                         </p>
                         <p className="text-sm text-gray-400" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                           {formatTime(order.created_at)}
                         </p>
                       </div>
                     </div>

                     {/* Order Items */}
                     <div className="mb-4">
                       <h4 className="font-medium mb-2" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Bestellte Artikel:</h4>
                       <div className="space-y-1">
                         {order.items?.map((item: any, index: number) => (
                           <div key={index} className="flex justify-between text-sm">
                             <span style={{ fontFamily: 'Georgia', fontWeight: '300' }}>{item.quantity}x {item.name}</span>
                             <span style={{ fontFamily: 'Georgia', fontWeight: '300' }}>{formatPrice(item.price * item.quantity)}</span>
                           </div>
                         ))}
                       </div>
                     </div>

                     {/* Pickup Info */}
                     <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor: '#242424' }}>
                       <p className="text-sm" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                         <strong>Abholung:</strong> {new Date(order.pickup_date).toLocaleDateString('de-DE')} um {order.pickup_time}
                       </p>
                     </div>

                     {/* Status Controls */}
                     <div className="flex gap-2">
                       <select
                         value={order.status}
                         onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                         className="border border-gray-500 rounded-xl px-3 py-2 text-white"
                         style={{ backgroundColor: '#242424' }}
                       >
                    <option value="pending">Ausstehend</option>
                    <option value="confirmed">Bestätigt</option>
                    <option value="preparing">In Vorbereitung</option>
                    <option value="ready">Fertig</option>
                    <option value="completed">Abgeholt</option>
                    <option value="cancelled">Storniert</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
