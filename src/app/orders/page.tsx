'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Calendar, AlertCircle, CheckCircle, X as XCircle, Mail, Send, X, Smartphone, Globe, Edit } from 'lucide-react'

interface Order {
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

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
}

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedOrderForEmail, setSelectedOrderForEmail] = useState<Order | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailMessage, setEmailMessage] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const dateInputRef = React.createRef<HTMLInputElement>()

  // Lade Bestellungen aus der Datenbank
  useEffect(() => {
  const loadOrders = async () => {
    try {
        const dateStr = currentDate.toISOString().split('T')[0]
        console.log('Loading orders for date:', dateStr)
      
        const response = await fetch(`/api/orders?date=${dateStr}`)
        const data = await response.json()
      
        console.log('Orders loaded:', data.length, 'for date:', dateStr)
        setOrders(data)
    } catch (error) {
        console.error('Fehler beim Laden der Bestellungen:', error)
      setOrders([])
      }
    }
    
    loadOrders()
  }, [currentDate])

  const changeDay = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + direction)
    setCurrentDate(newDate)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const getStatusInfo = (status: string) => {
    const statusMap = {
      'pending': { Component: AlertCircle, text: 'Ausstehend', color: '#F59E0B' },
      'ready': { Component: CheckCircle, text: 'Fertig', color: '#8B5CF6' },
      'completed': { Component: CheckCircle, text: 'Abgeholt', color: '#059669' },
      'cancelled': { Component: XCircle, text: 'Storniert', color: '#EF4444' }
    }
    return statusMap[status as keyof typeof statusMap] || { Component: AlertCircle, text: 'Unbekannt', color: '#6B7280' }
  }

  const getSourceInfo = (source: string) => {
    const sourceMap = {
      'handy': { Component: Smartphone, text: 'Handy App' },
      'app': { Component: Smartphone, text: 'App' },
      'web': { Component: Globe, text: 'Website' },
      'manual': { Component: Edit, text: 'Manuell' }
    }
    return sourceMap[source as keyof typeof sourceMap] || { Component: Edit, text: 'Manuell' }
  }

  const getOrderType = (items: OrderItem[] | undefined) => {
    if (!items || items.length === 0) {
      return 'Unbekannt'
    }
    const categories = [...new Set(items.map(item => item.category))]
    if (categories.length === 1) {
      return categories[0]
    }
    return 'Gemischte Bestellung'
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setOrders(prev => {
        const updated = prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus as any } : order
        )
        return updated.sort((a, b) => a.pickup_time.localeCompare(b.pickup_time))
      })
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const totalOrders = orders.filter(order => order.status !== 'cancelled').length
  const totalRevenue = orders.filter(order => order.status !== 'cancelled').reduce((sum, order) => sum + order.total_amount, 0)

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Day Switcher - Compact */}
        <div className="rounded-2xl p-3" style={{ backgroundColor: '#1A1A1A', borderWidth: '1px', borderColor: '#242424' }}>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex gap-3 items-center">
              <button
                onClick={() => changeDay(-1)}
                className="text-white px-4 py-3 rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                style={{ backgroundColor: '#FF6B00', fontSize: '16px', fontWeight: '300' }}
              >
                ← Vorheriger
              </button>
              <div className="relative">
                <div 
                  className="text-white px-6 py-3 rounded-xl font-semibold text-lg flex items-center gap-3 cursor-pointer relative" 
                  style={{ backgroundColor: '#FF6B00' }}
                  onClick={() => {
                    if (dateInputRef.current) {
                      ;(dateInputRef.current as HTMLInputElement).showPicker()
                    }
                  }}
                >
                  <span style={{ fontFamily: 'Georgia', fontWeight: '300' }}>{formatDate(currentDate)}</span>
                  <Calendar className="w-5 h-5" />
                 <input
                    ref={dateInputRef}
                   type="date"
                    value={currentDate.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value)
                      setCurrentDate(newDate)
                    }}
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
              <button
                onClick={() => changeDay(1)}
                className="text-white px-4 py-3 rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                style={{ backgroundColor: '#FF6B00', fontSize: '16px', fontWeight: '300' }}
              >
                Nächster →
              </button>
            </div>

            <div className="flex gap-8 items-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-white" style={{ color: '#FF6B00', fontFamily: 'Georgia', fontWeight: '300' }}>{totalOrders}</div>
                <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Bestellungen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white" style={{ color: '#FF6B00', fontFamily: 'Georgia', fontWeight: '300' }}>{formatPrice(totalRevenue)}</div>
                <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Umsatz</div>
              </div>
              {/* Bestellung hinzufügen deaktiviert */}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1A1A1A', borderWidth: '1px', borderColor: '#242424' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#1A1A1A' }}>
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Typ</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Zeit</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Gastname</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Bestellung</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Preis</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Notiz</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>E-Mail</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-400" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                      Keine Bestellungen für diesen Tag
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const orderType = getOrderType(order.items)
                    
                    return (
                      <tr
                        key={order.id}
                        className={`transition-all duration-300 ${
                          order.status === 'cancelled' ? 'opacity-60' : ''
                        }`}
                        style={{ backgroundColor: '#242424', borderBottom: '1px solid #333333' }}
                      >
                        <td className={`px-6 py-2 ${order.status === 'cancelled' ? 'opacity-60' : ''}`}>
                          <div className="flex items-center justify-center" title={getSourceInfo(order.source || 'manual').text}>
                            {(() => {
                              const sourceInfo = getSourceInfo(order.source || 'manual')
                              const SourceIcon = sourceInfo.Component
                              return <SourceIcon className={`w-6 h-6 ${order.status === 'cancelled' ? 'line-through' : ''}`} />
                            })()}
                          </div>
                        </td>
                        <td className={`px-6 py-2 text-white font-medium ${order.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                          {order.pickup_time}
                        </td>
                        <td className={`px-6 py-2 text-white font-medium ${order.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                          {order.customer_name}
                        </td>
                        <td className={`px-6 py-2 text-white font-medium ${order.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                          <div className="max-w-xs">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, index) => (
                                <div key={index} className="text-sm">
                                  {item.quantity}x {item.name}
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-gray-400">Keine Artikel</div>
                            )}
                          </div>
                        </td>
                        <td className={`px-6 py-2 text-white font-medium ${order.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300', color: '#FF6B00' }}>
                          {formatPrice(order.total_amount)}
                        </td>
                        <td className={`px-3 py-2 text-gray-300 ${order.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300', maxWidth: '200px' }}>
                          <div className="break-words whitespace-pre-wrap">
                            {order.note || '—'}
                          </div>
                        </td>
                        <td className={`px-6 py-2 ${order.status === 'cancelled' ? 'opacity-60' : ''}`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (order.status !== 'cancelled') {
                                setSelectedOrderForEmail(order)
                                setEmailMessage('')
                                setShowEmailModal(true)
                              }
                            }}
                            className={`text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:opacity-80 ${
                              order.status === 'cancelled' ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            style={{ backgroundColor: '#FF6B00' }}
                            title={order.status === 'cancelled' ? 'Bestellung storniert' : 'E-Mail an Kunden senden'}
                            disabled={order.status === 'cancelled'}
                          >
                            <Mail className="w-5 h-5" />
                          </button>
                        </td>
                        <td className={`px-6 py-2 ${order.status === 'cancelled' ? 'opacity-60' : ''}`}>
                          <select
                            value={order.status}
                            onChange={(e) => {
                              e.stopPropagation()
                              updateOrderStatus(order.id, e.target.value)
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                            className={`px-4 py-2 rounded-xl border font-medium transition-all duration-300 ${
                              order.status === 'pending'
                                ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                                : order.status === 'ready'
                                ? 'bg-purple-100 border-purple-400 text-purple-800'
                                : order.status === 'completed'
                                ? 'bg-green-100 border-green-400 text-green-800'
                                : 'bg-red-100 border-red-400 text-red-800'
                            }`}
                          >
                            <option value="pending">Ausstehend</option>
                            <option value="ready">Fertig</option>
                            <option value="completed">Abgeholt</option>
                            <option value="cancelled">Storniert</option>
                          </select>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* E-Mail Modal */}
        {showEmailModal && selectedOrderForEmail && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="rounded-2xl max-w-2xl w-full shadow-2xl" style={{ backgroundColor: '#2D2D2D', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)' }}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                    E-Mail senden
                  </h3>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="text-gray-300 hover:text-orange-500 text-3xl transition-colors duration-300 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
                    style={{ color: '#FF6B00' }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Recipient Info */}
                <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#1A1A1A', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)' }}>
                  <h4 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                    Empfänger
                  </h4>
                  <div className="space-y-2">
                    <div className="text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                      <span className="text-gray-400">Name:</span> {selectedOrderForEmail.customer_name}
                    </div>
                    <div className="text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                      <span className="text-gray-400">E-Mail:</span> {selectedOrderForEmail.customer_email}
                    </div>
                    <div className="text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                      <span className="text-gray-400">Bestellung:</span> #{selectedOrderForEmail.order_number} - {selectedOrderForEmail.type || 'Bestellung'}
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="mb-6">
                  <label className="block text-sm text-white mb-3 font-medium">
                    Nachricht
                  </label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Schreiben Sie hier Ihre Nachricht..."
                    className="w-full border-2 border-gray-500 rounded-xl px-4 py-3 text-white h-32 resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                    style={{ backgroundColor: '#242424' }}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="px-6 py-3 border border-gray-500 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                    style={{ backgroundColor: '#242424', fontSize: '16px', fontWeight: '300' }}
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={async () => {
                      if (!emailMessage || emailMessage.trim() === '') {
                        alert('Bitte geben Sie eine Nachricht ein.')
                        return
                      }
                      if (!selectedOrderForEmail?.customer_email) {
                        alert('Keine E-Mail-Adresse vorhanden.')
                        return
                      }
                      try {
                        const res = await fetch('/api/email/send', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            type: 'order',
                            to: selectedOrderForEmail.customer_email,
                            message: emailMessage,
                          }),
                        })
                        if (!res.ok) {
                          const j = await res.json().catch(() => ({}))
                          throw new Error(j.error || 'E-Mail-Versand fehlgeschlagen')
                        }
                        setShowEmailModal(false)
                        setEmailMessage('')
                        setShowSuccessModal(true)
                      } catch (err) {
                        console.error(err)
                        alert('Fehler beim Senden der E-Mail.')
                      }
                    }}
                    className="px-6 py-3 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                    style={{ backgroundColor: '#FF6B00', fontSize: '16px', fontWeight: '600' }}
                  >
                    E-Mail senden
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="rounded-2xl max-w-md w-full shadow-2xl" style={{ backgroundColor: '#2D2D2D', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)' }}>
              <div className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6B00' }}>
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                  E-Mail gesendet!
                </h3>
                <p className="text-gray-300 mb-6" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                  Die Nachricht wurde erfolgreich an den Kunden gesendet.
                </p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-8 py-3 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium w-full"
                  style={{ backgroundColor: '#FF6B00', fontSize: '16px', fontWeight: '600' }}
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Editieren/Hinzufügen deaktiviert – keine Modals */}
      </div>
    </AdminLayout>
  )
}