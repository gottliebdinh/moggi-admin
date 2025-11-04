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

  const formatDateCompact = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
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
        {/* Day Switcher - Compact, responsive bis 1024x768 */}
        <div className="rounded-2xl p-2 lg:p-3" style={{ backgroundColor: '#1A1A1A', borderWidth: '1px', borderColor: '#242424' }}>
          <div className="flex justify-between items-center gap-2 lg:gap-4 overflow-hidden">
            <div className="flex gap-1.5 lg:gap-3 items-center flex-shrink-0 min-w-0">
              <button
                onClick={() => changeDay(-1)}
                className="text-white px-1.5 lg:px-3 py-1.5 lg:py-2 rounded-xl transition-all duration-300 hover:opacity-80 font-medium text-xs lg:text-sm whitespace-nowrap flex-shrink-0"
                style={{ backgroundColor: '#FF6B00', fontWeight: '300' }}
              >
                <span className="hidden lg:inline">← Vorheriger</span>
                <span className="lg:hidden">←</span>
              </button>
              <div className="relative flex-shrink-0">
                <div 
                  className="text-white px-2 lg:px-4 py-1.5 lg:py-2 rounded-xl font-semibold text-xs lg:text-base flex items-center gap-1 lg:gap-2 cursor-pointer relative whitespace-nowrap" 
                  style={{ backgroundColor: '#FF6B00' }}
                  onClick={() => {
                    if (dateInputRef.current) {
                      ;(dateInputRef.current as HTMLInputElement).showPicker()
                    }
                  }}
                >
                  <span className="hidden lg:inline" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>{formatDate(currentDate)}</span>
                  <span className="lg:hidden text-xs" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>{formatDateCompact(currentDate)}</span>
                  <Calendar className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
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
                className="text-white px-1.5 lg:px-3 py-1.5 lg:py-2 rounded-xl transition-all duration-300 hover:opacity-80 font-medium text-xs lg:text-sm whitespace-nowrap flex-shrink-0"
                style={{ backgroundColor: '#FF6B00', fontWeight: '300' }}
              >
                <span className="hidden lg:inline">Nächster →</span>
                <span className="lg:hidden">→</span>
              </button>
            </div>

            <div className="flex gap-2 lg:gap-8 items-center flex-shrink-0 min-w-0">
              <div className="text-center flex-shrink-0">
                <div className="text-xl lg:text-3xl font-bold text-white whitespace-nowrap" style={{ color: '#FF6B00', fontFamily: 'Georgia', fontWeight: '300' }}>{totalOrders}</div>
                <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Bestellungen</div>
              </div>
              <div className="text-center flex-shrink-0">
                <div className="text-xl lg:text-3xl font-bold text-white whitespace-nowrap" style={{ color: '#FF6B00', fontFamily: 'Georgia', fontWeight: '300' }}>{formatPrice(totalRevenue)}</div>
                <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Umsatz</div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table - Responsive: Desktop Table, Mobile Cards */}
        {/* Desktop Table View */}
        <div className="hidden lg:block rounded-2xl overflow-hidden" style={{ backgroundColor: '#1A1A1A', borderWidth: '1px', borderColor: '#242424' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#1A1A1A' }}>
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-5 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Typ</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-5 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Zeit</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-5 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Gastname</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-5 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Bestellung</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-5 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Preis</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-5 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Notiz</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-5 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>E-Mail</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-5 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Status</th>
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
                        <td className={`px-4 sm:px-6 py-2 ${order.status === 'cancelled' ? 'opacity-60' : ''}`}>
                          <div className="flex items-center justify-center" title={getSourceInfo(order.source || 'manual').text}>
                            {(() => {
                              const sourceInfo = getSourceInfo(order.source || 'manual')
                              const SourceIcon = sourceInfo.Component
                              return <SourceIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${order.status === 'cancelled' ? 'line-through' : ''}`} />
                            })()}
                          </div>
                        </td>
                        <td className={`px-4 sm:px-6 py-2 text-white font-medium text-sm sm:text-base ${order.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                          {order.pickup_time}
                        </td>
                        <td className={`px-4 sm:px-6 py-2 text-white font-medium text-sm sm:text-base ${order.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                          {order.customer_name}
                        </td>
                        <td className={`px-4 sm:px-6 py-2 text-white font-medium text-sm sm:text-base ${order.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                          <div className="max-w-xs">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, index) => (
                                <div key={index} className="text-xs sm:text-sm">
                                  {item.quantity}x {item.name}
                                </div>
                              ))
                            ) : (
                              <div className="text-xs sm:text-sm text-gray-400">Keine Artikel</div>
                            )}
                          </div>
                        </td>
                        <td className={`px-4 sm:px-6 py-2 text-white font-medium text-sm sm:text-base ${order.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300', color: '#FF6B00' }}>
                          {formatPrice(order.total_amount)}
                        </td>
                        <td className={`px-3 sm:px-6 py-2 text-gray-300 text-xs sm:text-sm ${order.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300', maxWidth: '200px' }}>
                          <div className="break-words whitespace-pre-wrap">
                            {order.note || '—'}
                          </div>
                        </td>
                        <td className={`px-4 sm:px-6 py-2 ${order.status === 'cancelled' ? 'opacity-60' : ''}`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (order.status !== 'cancelled') {
                                setSelectedOrderForEmail(order)
                                setEmailMessage('')
                                setShowEmailModal(true)
                              }
                            }}
                            className={`text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:opacity-80 ${
                              order.status === 'cancelled' ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            style={{ backgroundColor: '#FF6B00' }}
                            title={order.status === 'cancelled' ? 'Bestellung storniert' : 'E-Mail an Kunden senden'}
                            disabled={order.status === 'cancelled'}
                          >
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </td>
                        <td className={`px-4 sm:px-6 py-2 ${order.status === 'cancelled' ? 'opacity-60' : ''}`}>
                          <select
                            value={order.status}
                            onChange={(e) => {
                              e.stopPropagation()
                              updateOrderStatus(order.id, e.target.value)
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border font-medium text-xs sm:text-sm transition-all duration-300 ${
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

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {orders.length === 0 ? (
            <div className="rounded-2xl p-8 text-center text-gray-400" style={{ backgroundColor: '#1A1A1A', borderWidth: '1px', borderColor: '#242424' }}>
              <p style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Keine Bestellungen für diesen Tag</p>
            </div>
          ) : (
            orders.map((order) => {
              const orderType = getOrderType(order.items)
              const statusInfo = getStatusInfo(order.status)
              const StatusIcon = statusInfo.Component
              const sourceInfo = getSourceInfo(order.source || 'manual')
              const SourceIcon = sourceInfo.Component
              
              return (
                <div
                  key={order.id}
                  className={`rounded-2xl p-4 transition-all duration-300 ${
                    order.status === 'cancelled' ? 'opacity-60' : ''
                  }`}
                  style={{ backgroundColor: '#1A1A1A', borderWidth: '1px', borderColor: '#242424' }}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <SourceIcon className={`w-5 h-5 ${order.status === 'cancelled' ? 'line-through' : ''}`} style={{ color: '#FF6B00' }} />
                      <div>
                        <div className={`text-white font-medium text-sm ${order.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                          {order.customer_name}
                        </div>
                        <div className="text-gray-400 text-xs">{order.pickup_time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-white font-bold text-lg ${order.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300', color: '#FF6B00' }}>
                        {formatPrice(order.total_amount)}
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => {
                          e.stopPropagation()
                          updateOrderStatus(order.id, e.target.value)
                        }}
                        className={`mt-1 px-2 py-1 rounded-lg border text-xs font-medium transition-all duration-300 ${
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
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-3">
                    {order.items && order.items.length > 0 ? (
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">Keine Artikel</div>
                    )}
                  </div>

                  {/* Note */}
                  {order.note && (
                    <div className="mb-3 text-xs text-gray-300" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                      <span className="text-gray-400">Notiz: </span>
                      {order.note}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: '#242424' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (order.status !== 'cancelled') {
                          setSelectedOrderForEmail(order)
                          setEmailMessage('')
                          setShowEmailModal(true)
                        }
                      }}
                      className={`text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:opacity-80 text-sm ${
                        order.status === 'cancelled' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{ backgroundColor: '#FF6B00' }}
                      disabled={order.status === 'cancelled'}
                    >
                      <Mail className="w-4 h-4" />
                      E-Mail
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* E-Mail Modal - Responsive */}
        {showEmailModal && selectedOrderForEmail && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
            <div className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" style={{ backgroundColor: '#2D2D2D', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)' }}>
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                    E-Mail senden
                  </h3>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="text-gray-300 hover:text-orange-500 text-3xl transition-colors duration-300 hover:bg-gray-700 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                    style={{ color: '#FF6B00' }}
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Recipient Info - Responsive */}
                <div className="rounded-xl p-3 sm:p-4 mb-4 sm:mb-6" style={{ backgroundColor: '#1A1A1A', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)' }}>
                  <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                    Empfänger
                  </h4>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="text-sm sm:text-base text-white break-words" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                      <span className="text-gray-400">Name:</span> {selectedOrderForEmail.customer_name}
                    </div>
                    <div className="text-sm sm:text-base text-white break-words" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                      <span className="text-gray-400">E-Mail:</span> {selectedOrderForEmail.customer_email}
                    </div>
                    <div className="text-sm sm:text-base text-white break-words" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                      <span className="text-gray-400">Bestellung:</span> #{selectedOrderForEmail.order_number}
                    </div>
                  </div>
                </div>

                {/* Message Input - Responsive */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-xs sm:text-sm text-white mb-2 sm:mb-3 font-medium">
                    Nachricht
                  </label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Schreiben Sie hier Ihre Nachricht..."
                    className="w-full border-2 border-gray-500 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white h-24 sm:h-32 resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300 text-sm sm:text-base"
                    style={{ backgroundColor: '#242424' }}
                  />
                </div>

                {/* Actions - Responsive */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-500 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium text-sm sm:text-base"
                    style={{ backgroundColor: '#242424', fontWeight: '300' }}
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
                    className="px-4 sm:px-6 py-2 sm:py-3 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium text-sm sm:text-base"
                    style={{ backgroundColor: '#FF6B00', fontWeight: '600' }}
                  >
                    E-Mail senden
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal - Responsive */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
            <div className="rounded-2xl max-w-md w-full shadow-2xl" style={{ backgroundColor: '#2D2D2D', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)' }}>
              <div className="p-6 sm:p-8 text-center">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6B00' }}>
                    <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                  E-Mail gesendet!
                </h3>
                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                  Die Nachricht wurde erfolgreich an den Kunden gesendet.
                </p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-6 sm:px-8 py-2 sm:py-3 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium w-full text-sm sm:text-base"
                  style={{ backgroundColor: '#FF6B00', fontWeight: '600' }}
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