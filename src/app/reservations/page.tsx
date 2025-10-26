'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'

interface Reservation {
  id: number
  type: string
  source: 'handy' | 'web' | 'manual'
  time: string
  guestName: string
  guests: number
  tables: string
  note: string
  comment: string
  status: 'placed' | 'confirmed' | 'no-show' | 'cancelled'
  date: string
  duration: number
  phone: string
  email: string
}

export default function ReservationsDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [availableTables, setAvailableTables] = useState<any[]>([])
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [guestCount, setGuestCount] = useState<number>(2)
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDatePicker) {
        const target = event.target as HTMLElement
        if (!target.closest('.date-picker-container')) {
          setShowDatePicker(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDatePicker])

  // Alle verfügbaren Tische aus dem Tischplan
  const allTables = [
    // Unten - 2 Plätze
    { id: 1, name: '1 Tisch', capacity: 2, room: 'Unten' },
    { id: 7, name: '7 Tisch', capacity: 2, room: 'Unten' },
    { id: 26, name: '26 Tisch', capacity: 2, room: 'Unten' },
    { id: 27, name: '27 Tisch', capacity: 2, room: 'Unten' },
    { id: 23, name: '23 Tisch', capacity: 2, room: 'Unten' },
    { id: 22, name: '22 Tisch', capacity: 2, room: 'Unten' },
    { id: 25, name: '25 Tisch', capacity: 2, room: 'Unten' },
    { id: 18, name: '18 Tisch', capacity: 2, room: 'Unten' },
    { id: 19, name: '19 Tisch', capacity: 2, room: 'Unten' },
    { id: 28, name: '28 Tisch', capacity: 2, room: 'Unten' },
    { id: 24, name: '24 Tisch', capacity: 2, room: 'Unten' },
    
    // Unten - 3 Plätze
    { id: 30, name: '30 Tisch', capacity: 3, room: 'Unten' },
    { id: 31, name: '31 Tisch', capacity: 3, room: 'Unten' },
    
    // Unten - 4 Plätze
    { id: 17, name: '17 Tisch', capacity: 4, room: 'Unten' },
    { id: 2, name: '2 Tisch', capacity: 4, room: 'Unten' },
    { id: 3, name: '3 Tisch', capacity: 4, room: 'Unten' },
    { id: 4, name: '4 Tisch', capacity: 4, room: 'Unten' },
    { id: 5, name: '5 Tisch', capacity: 4, room: 'Unten' },
    { id: 6, name: '6 Tisch', capacity: 4, room: 'Unten' },
    
    // Unten - 6 Plätze
    { id: 20, name: '20 Tisch', capacity: 6, room: 'Unten' },
    { id: 21, name: '21 Tisch', capacity: 6, room: 'Unten' },
    
    // Galerie - 2 Plätze
    { id: 61, name: '61 Galerie oben', capacity: 2, room: 'Galerie' },
    { id: 51, name: '51 Galerie oben', capacity: 2, room: 'Galerie' },
    { id: 58, name: '58 Galerie oben', capacity: 2, room: 'Galerie' },
    { id: 60, name: '60 Galerie oben', capacity: 2, room: 'Galerie' },
    
    // Galerie - 3 Plätze
    { id: 50, name: '50 Galerie oben', capacity: 3, room: 'Galerie' },
    { id: 62, name: '62 Galerie oben', capacity: 3, room: 'Galerie' },
    
    // Galerie - 4 Plätze
    { id: 57, name: '57 Galerie oben', capacity: 4, room: 'Galerie' },
    { id: 53, name: '53 Galerie oben', capacity: 4, room: 'Galerie' },
    { id: 54, name: '54 Galerie oben', capacity: 4, room: 'Galerie' },
    { id: 55, name: '55 Galerie oben', capacity: 4, room: 'Galerie' },
    { id: 56, name: '56 Galerie oben', capacity: 4, room: 'Galerie' },
    { id: 59, name: '59 Galerie oben', capacity: 4, room: 'Galerie' }
  ]

  // Funktion um verfügbare Tische zu berechnen
  const calculateAvailableTables = (selectedTime: string, selectedDuration: number, selectedDate: string, excludeReservationId?: number) => {
    const tables = allTables.map(table => ({ ...table, available: true }))
    
    // Konvertiere Zeit zu Minuten für einfacheren Vergleich
    const timeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number)
      return hours * 60 + minutes
    }
    
    const selectedStartMinutes = timeToMinutes(selectedTime)
    const selectedEndMinutes = selectedStartMinutes + selectedDuration
    
    // Prüfe jede Reservierung auf Zeitkonflikte
    reservations.forEach(reservation => {
      // Überspringe die aktuelle Reservierung beim Bearbeiten
      if (reservation.id === excludeReservationId) return
      
      // Nur Reservierungen am gleichen Tag und nicht storniert
      if (reservation.date === selectedDate && reservation.status !== 'cancelled' && reservation.tables) {
        const reservationStartMinutes = timeToMinutes(reservation.time)
        const reservationEndMinutes = reservationStartMinutes + (reservation.duration || 120)
        
        // Prüfe auf Zeitüberschneidung
        const hasOverlap = !(selectedEndMinutes <= reservationStartMinutes || selectedStartMinutes >= reservationEndMinutes)
        
        if (hasOverlap) {
          // Markiere belegte Tische als nicht verfügbar
          const reservedTableNames = reservation.tables.split(', ').map(name => name.trim())
          tables.forEach(table => {
            if (reservedTableNames.includes(table.name)) {
              table.available = false
            }
          })
        }
      }
    })
    
    return tables
  }

  // Funktion um Tische zu aktualisieren wenn sich Zeit/Datum ändert
  const updateTableAvailability = (time: string, duration: number, date: string, excludeReservationId?: number) => {
    const tables = calculateAvailableTables(time, duration, date, excludeReservationId)
    setAvailableTables(tables)
  }

  // Dummy-Daten genau wie in deinem HTML
  const dummyReservations: Reservation[] = [
    {
      id: 1,
      type: 'Abendessen',
      source: 'handy',
      time: '19:30',
      guestName: 'Müller, Familie',
      guests: 4,
      tables: 'Tisch 5',
      note: 'Hochzeitstag',
      comment: '',
      status: 'placed',
      date: '2024-01-15',
      duration: 120,
      phone: '+49 911 123456',
      email: 'mueller@beispiel.de'
    },
    {
      id: 2,
      type: 'Mittagessen',
      source: 'web',
      time: '13:00',
      guestName: 'Schmidt, Herr',
      guests: 2,
      tables: 'Tisch 2',
      note: 'Vegetarisch',
      comment: 'Sehr zufrieden mit dem Service',
      status: 'placed',
      date: '2024-01-15',
      duration: 90,
      phone: '+49 911 234567',
      email: 'schmidt@beispiel.de'
    },
    {
      id: 3,
      type: 'Abendessen',
      source: 'manual',
      time: '20:00',
      guestName: 'Weber, Frau',
      guests: 6,
      tables: 'Tisch 8, 9',
      note: 'Geburtstag',
      comment: '',
      status: 'no-show',
      date: '2024-01-15',
      duration: 180,
      phone: '+49 911 345678',
      email: 'weber@beispiel.de'
    },
    {
      id: 4,
      type: 'Mittagessen',
      source: 'handy',
      time: '12:30',
      guestName: 'Klein, Familie',
      guests: 3,
      tables: 'Tisch 3',
      note: 'Allergien: Nüsse',
      comment: 'Allergien wurden berücksichtigt',
      status: 'placed',
      date: '2024-01-15',
      duration: 90,
      phone: '+49 911 456789',
      email: 'klein@beispiel.de'
    },
    {
      id: 5,
      type: 'Abendessen',
      source: 'web',
      time: '18:45',
      guestName: 'Hoffmann, Herr',
      guests: 2,
      tables: 'Tisch 1',
      note: '',
      comment: '',
      status: 'cancelled',
      date: '2024-01-15',
      duration: 120,
      phone: '+49 911 567890',
      email: 'hoffmann@beispiel.de'
    },
    {
      id: 6,
      type: 'Abendessen',
      time: '19:00',
      guestName: 'Max Mustermann',
      guests: 4,
      tables: '',
      note: 'Neue Reservierung',
      comment: '',
      status: 'placed',
      date: '2024-01-15',
      duration: 120,
      source: 'web',
      phone: '+49 911 999888',
      email: 'max@beispiel.de'
    }
  ]

  useEffect(() => {
    setReservations(dummyReservations)
  }, [])

  const getSourceInfo = (source: string) => {
    const sourceMap = {
      'handy': { icon: '📱', text: 'Handy App' },
      'web': { icon: '🌐', text: 'Website' },
      'manual': { icon: '✏️', text: 'Manuell' }
    }
    return sourceMap[source as keyof typeof sourceMap] || { icon: '✏️', text: 'Manuell' }
  }

  const updateStatus = (reservationId: number, newStatus: string) => {
    setReservations(prev => 
      prev.map(res => 
        res.id === reservationId 
          ? { ...res, status: newStatus as Reservation['status'] }
          : res
      )
    )
  }

  const sendEmailToCustomer = (reservation: Reservation) => {
    if (!reservation.email) {
      alert('Keine E-Mail-Adresse für diesen Gast hinterlegt.')
      return
    }

    const subject = `Reservierung bei Moggi - ${reservation.date}`
    const body = `Hallo ${reservation.guestName},

vielen Dank für Ihre Reservierung bei Moggi!

Reservierungsdetails:
- Datum: ${reservation.date}
- Uhrzeit: ${reservation.time}
- Anzahl Personen: ${reservation.guests}
- Tische: ${reservation.tables || 'Noch nicht zugewiesen'}

${reservation.note ? `Notiz: ${reservation.note}` : ''}

Wir freuen uns auf Ihren Besuch!

Mit freundlichen Grüßen
Ihr Moggi-Team`

    const mailtoLink = `mailto:${reservation.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink)
  }

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

  const totalReservations = reservations.length
  const totalGuests = reservations.reduce((sum, res) => sum + res.guests, 0)

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Day Switcher - Exact App Style */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#1A1A1A', borderWidth: '1px', borderColor: '#242424' }}>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex gap-3 items-center">
              <button
                onClick={() => changeDay(-1)}
                className="text-white px-4 py-3 rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                style={{ backgroundColor: '#FF6B00', fontSize: '16px', fontWeight: '300' }}
              >
                ← Vorheriger
              </button>
              <div className="relative date-picker-container">
                <div className="text-white px-6 py-3 rounded-xl font-semibold text-lg flex items-center gap-3" style={{ backgroundColor: '#FF6B00' }}>
                  <span style={{ fontFamily: 'Georgia', fontWeight: '300' }}>{formatDate(currentDate)}</span>
                  <button 
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="text-white hover:text-orange-100 transition-colors p-1 rounded hover:bg-white hover:bg-opacity-20"
                  >
                    📅
                  </button>
                </div>
                
                {/* Dropdown Calendar */}
                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-2 z-50">
                    <div className="rounded-xl shadow-2xl" style={{ backgroundColor: '#242424', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)' }}>
                      <div className="p-4">
                        <input
                          type="date"
                          value={currentDate.toISOString().split('T')[0]}
                          onChange={(e) => {
                            const newDate = new Date(e.target.value)
                            setCurrentDate(newDate)
                            setShowDatePicker(false)
                          }}
                          className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                          style={{ backgroundColor: '#1A1A1A' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
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
                <div className="text-3xl font-bold text-white" style={{ color: '#FF6B00', fontFamily: 'Georgia', fontWeight: '300' }}>{totalReservations}</div>
                <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Reservierungen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white" style={{ color: '#FF6B00', fontFamily: 'Georgia', fontWeight: '300' }}>{totalGuests}</div>
                <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Gäste</div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(true)
                  setSelectedTables([])
                  // Initialisiere verfügbare Tische für neue Reservierung
                  const time = '19:30'
                  const duration = 120
                  const date = currentDate.toISOString().split('T')[0]
                  updateTableAvailability(time, duration, date)
                }}
                className="text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 font-medium border-2 border-orange-500 hover:bg-orange-500"
              >
                <span className="text-lg">+</span>
                Reservierung hinzufügen
              </button>
            </div>
          </div>
        </div>

        {/* Reservations Table - Exact App Style */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1A1A1A', borderWidth: '1px', borderColor: '#242424' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#1A1A1A' }}>
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Typ</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Zeit</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Gastname</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Anz.</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Tische</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Notiz</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Antwort</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => {
                  const sourceInfo = getSourceInfo(reservation.source)
                  return (
                    <tr
                      key={reservation.id}
                      className={`hover:bg-opacity-80 cursor-pointer transition-all duration-300 ${
                        reservation.status === 'cancelled' ? 'opacity-60' : ''
                      }`}
                      style={{ backgroundColor: '#242424', borderBottom: '1px solid #333333' }}
                      onClick={() => {
                        setSelectedReservation(reservation)
                        setShowDetailModal(true)
                        
                        // Initialisiere die ausgewählten Tische
                        const tables = reservation.tables ? reservation.tables.split(', ').map(t => t.trim()) : []
                        setSelectedTables(tables)
                        
                        // Berechne verfügbare Tische für diese Reservierung
                        const time = reservation.time || '19:30'
                        const duration = reservation.duration || 120
                        const date = reservation.date || currentDate.toISOString().split('T')[0]
                        updateTableAvailability(time, duration, date, reservation.id)
                      }}
                    >
                      <td className={`px-6 py-4 ${reservation.status === 'cancelled' ? 'opacity-60' : ''}`}>
                        <div className="flex items-center justify-center">
                          <span className={`text-2xl ${reservation.status === 'cancelled' ? 'line-through' : ''}`} title={sourceInfo.text}>
                            {sourceInfo.icon}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-white font-medium ${reservation.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                        {reservation.time}
                      </td>
                      <td className={`px-6 py-4 text-white font-medium ${reservation.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                        {reservation.guestName}
                      </td>
                      <td className={`px-6 py-4 text-white font-medium ${reservation.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                        {reservation.guests}
                      </td>
                      <td className={`px-6 py-4 text-white font-medium ${reservation.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                        {reservation.tables || (
                          <span className="font-bold text-xl animate-pulse" style={{ color: '#FF6B00' }}>!</span>
                        )}
                      </td>
                      <td className={`px-6 py-4 text-gray-300 ${reservation.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                        {reservation.note}
                      </td>
                      <td className={`px-6 py-4 ${reservation.status === 'cancelled' ? 'opacity-60' : ''}`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (reservation.status !== 'cancelled') {
                              sendEmailToCustomer(reservation)
                            }
                          }}
                          className={`text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:opacity-80 ${
                            reservation.status === 'cancelled' ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          style={{ backgroundColor: '#FF6B00' }}
                          title={reservation.status === 'cancelled' ? 'Reservierung storniert' : 'E-Mail an Kunden senden'}
                          disabled={reservation.status === 'cancelled'}
                        >
                          📧
                        </button>
                      </td>
                      <td className={`px-6 py-4 ${reservation.status === 'cancelled' ? 'opacity-60' : ''}`}>
                        <select
                          value={reservation.status}
                          onChange={(e) => {
                            e.stopPropagation()
                            updateStatus(reservation.id, e.target.value)
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                          className={`px-4 py-2 rounded-xl border font-medium transition-all duration-300 ${
                            reservation.status === 'no-show'
                              ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                              : reservation.status === 'placed'
                              ? 'bg-green-100 border-green-400 text-green-800'
                              : reservation.status === 'confirmed'
                              ? 'bg-blue-100 border-blue-400 text-blue-800'
                              : 'bg-red-100 border-red-400 text-red-800'
                          }`}
                        >
                          <option value="placed">Platziert</option>
                          <option value="confirmed">Bestätigt</option>
                          <option value="no-show">No-Show</option>
                          <option value="cancelled">Storniert</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reservation Detail Modal - Exact App Style */}
        {showDetailModal && selectedReservation && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="rounded-2xl max-w-6xl w-full max-h-[85vh] overflow-y-auto" style={{ backgroundColor: '#242424', borderWidth: '1px', borderColor: '#666666' }}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Reservierung bearbeiten</h3>
                        <button
                          onClick={() => setShowDetailModal(false)}
                          className="text-gray-300 hover:text-orange-500 text-3xl transition-colors duration-300 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
                          style={{ color: '#FF6B00' }}
                        >
                          ✕
                        </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         {/* Reservation Details - Exact App Style */}
                         <div className="rounded-2xl p-4" style={{ backgroundColor: '#1A1A1A', borderWidth: '1px', borderColor: '#242424' }}>
                           <h4 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Reservierungsdetails</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-white mb-2 font-medium">Datum</label>
                          <input
                            type="date"
                            defaultValue={selectedReservation.date}
                            onChange={(e) => {
                              const date = e.target.value
                              const time = document.querySelector('select')?.value || '19:30'
                              const duration = parseInt(document.querySelector('select[id="duration"]')?.value || '120')
                              updateTableAvailability(time, duration, date, selectedReservation?.id)
                            }}
                            className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                            style={{ backgroundColor: '#242424' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white mb-2 font-medium">Gruppengröße</label>
                          <input
                            type="number"
                            defaultValue={selectedReservation.guests}
                            min="1"
                            max="50"
                            onChange={(e) => {
                              // Trigger re-render für Info-Box
                              setGuestCount(parseInt(e.target.value) || 2)
                            }}
                            className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                            style={{ backgroundColor: '#242424' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white mb-2 font-medium">Aufenthaltsdauer</label>
                          <select
                            id="duration"
                            defaultValue={selectedReservation.duration || 120}
                            onChange={(e) => {
                              const duration = parseInt(e.target.value)
                              const time = document.querySelector('select')?.value || '19:30'
                              const date = document.querySelector('input[type="date"]')?.value || currentDate.toISOString().split('T')[0]
                              updateTableAvailability(time, duration, date, selectedReservation?.id)
                            }}
                            className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                            style={{ backgroundColor: '#242424' }}
                          >
                            <option value="60">1 Stunde</option>
                            <option value="90">1,5 Stunden</option>
                            <option value="120">2 Stunden</option>
                            <option value="150">2,5 Stunden</option>
                            <option value="180">3 Stunden</option>
                            <option value="240">4+ Stunden</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-white mb-2 font-medium">Verfügbare Zeit</label>
                          <select
                            defaultValue={selectedReservation.time || "19:30"}
                            onChange={(e) => {
                              const time = e.target.value
                              const duration = parseInt(document.querySelector('select[id="duration"]')?.value || '120')
                              const date = document.querySelector('input[type="date"]')?.value || currentDate.toISOString().split('T')[0]
                              updateTableAvailability(time, duration, date, selectedReservation?.id)
                            }}
                            className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                            style={{ backgroundColor: '#242424' }}
                          >
                            <option value="12:00">12:00</option>
                            <option value="12:30">12:30</option>
                            <option value="13:00">13:00</option>
                            <option value="13:30">13:30</option>
                            <option value="14:00">14:00</option>
                            <option value="18:00">18:00</option>
                            <option value="18:30">18:30</option>
                            <option value="19:00">19:00</option>
                            <option value="19:30">19:30</option>
                            <option value="20:00">20:00</option>
                            <option value="20:30">20:30</option>
                            <option value="21:00">21:00</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">Kommentar</label>
                        <textarea
                          defaultValue={selectedReservation.comment}
                          placeholder="Kommentar zur Reservierung..."
                          className="w-full border-2 border-gray-500 rounded-lg px-4 py-3 text-white h-16 resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                          style={{ backgroundColor: '#2D2D2D' }}
                        />
                      </div>
                    </div>
                  </div>

                         {/* Guest Details - Mobile App Style */}
                         <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: '#1A1A1A', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)' }}>
                    <h4 className="text-lg font-semibold text-white mb-4 font-serif">Gastdetails</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">Name</label>
                        <input
                          type="text"
                          defaultValue={selectedReservation.guestName}
                          className="w-full border-2 border-gray-500 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                          style={{ backgroundColor: '#2D2D2D' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">Telefonnummer</label>
                        <input
                          type="tel"
                          defaultValue={selectedReservation.phone}
                          className="w-full border-2 border-gray-500 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                          style={{ backgroundColor: '#2D2D2D' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">E-Mail</label>
                        <input
                          type="email"
                          defaultValue={selectedReservation.email}
                          className="w-full border-2 border-gray-500 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                          style={{ backgroundColor: '#2D2D2D' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                       {/* Available Tables - Mobile App Style */}
                       <div className="mt-4 rounded-xl p-4 shadow-lg" style={{ backgroundColor: '#1A1A1A', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)' }}>
                  <h4 className="text-lg font-semibold text-white mb-4 font-serif">Verfügbare Tische</h4>
                  
                  {/* Intelligenter Info-Text basierend auf Gruppengröße und ausgewählten Tischen */}
                  {(() => {
                    // Lese aktuelle Gruppengröße aus dem Input-Feld
                    const guestInput = document.querySelector('input[type="number"]') as HTMLInputElement
                    const guestCount = guestInput ? parseInt(guestInput.value) || selectedReservation?.guests || 2 : selectedReservation?.guests || 2
                    const selectedTablesCapacity = selectedTables.reduce((total, tableName) => {
                      const table = availableTables.find(t => t.name === tableName)
                      return total + (table?.capacity || 0)
                    }, 0)
                    
                    if (selectedTables.length === 0) {
                      return (
                        <div className="bg-blue-100 border-2 border-blue-400 rounded-xl p-3 mb-4 text-blue-800 text-sm font-medium">
                          ℹ️ Keine Tische ausgewählt.
                        </div>
                      )
                    } else if (selectedTablesCapacity < guestCount) {
                      return (
                        <div className="bg-red-100 border-2 border-red-400 rounded-xl p-3 mb-4 text-red-800 text-sm font-medium">
                          ❌ Zu wenige Plätze! ({selectedTablesCapacity} Plätze für {guestCount} Gäste)
                        </div>
                      )
                    } else if (selectedTablesCapacity === guestCount) {
                      return (
                        <div className="bg-green-100 border-2 border-green-400 rounded-xl p-3 mb-4 text-green-800 text-sm font-medium">
                          ✅ Passt perfekt! ({selectedTablesCapacity} Plätze für {guestCount} Gäste)
                        </div>
                      )
                    } else if (selectedTablesCapacity <= guestCount + 2) {
                      return (
                        <div className="bg-blue-100 border-2 border-blue-400 rounded-xl p-3 mb-4 text-blue-800 text-sm font-medium">
                          ℹ️ Passt gut! ({selectedTablesCapacity} Plätze für {guestCount} Gäste)
                        </div>
                      )
                    } else {
                      return (
                        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-3 mb-4 text-yellow-800 text-sm font-medium">
                          ⚠️ Zu viele Plätze! ({selectedTablesCapacity} Plätze für {guestCount} Gäste)
                        </div>
                      )
                    }
                  })()}
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {/* Nur verfügbare Tische aus dem Tischplan */}
                    {availableTables
                      .filter(table => table.available || selectedTables.includes(table.name))
                      .map((table) => {
                        const isSelected = selectedTables.includes(table.name)
                        
                        return (
                          <div
                            key={table.id}
                            className={`border-2 rounded-lg p-3 text-center transition-all duration-300 ${
                              isSelected
                                ? 'text-white shadow-lg cursor-pointer'
                                : 'cursor-pointer hover:shadow-lg hover:-translate-y-1 text-white hover:border-orange-500 hover:bg-orange-600'
                            }`}
                            style={{
                              backgroundColor: isSelected ? '#FF6B00' : '#2D2D2D',
                              borderColor: isSelected ? '#FF6B00' : '#666666'
                            }}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedTables(prev => prev.filter(t => t !== table.name))
                              } else {
                                setSelectedTables(prev => [...prev, table.name])
                              }
                            }}
                          >
                            <div className="font-semibold text-sm mb-2">{table.name}</div>
                            <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm mx-auto font-bold" style={{ backgroundColor: '#FF6B00' }}>
                              {table.capacity}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>

                       {/* Actions - Mobile App Style */}
                       <div className="flex justify-end gap-4 mt-4 pt-4" style={{ borderTop: '1px solid #242424' }}>
                         <button
                           onClick={() => setShowDetailModal(false)}
                           className="px-6 py-3 border border-gray-500 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                           style={{ backgroundColor: '#242424', fontSize: '16px', fontWeight: '300' }}
                         >
                           Abbrechen
                         </button>
                         <button
                           onClick={() => {
                             if (selectedReservation) {
                               // Aktualisiere die Reservierung mit den ausgewählten Tischen (auch leer möglich)
                               const updatedReservation = {
                                 ...selectedReservation,
                                 tables: selectedTables.length > 0 ? selectedTables.join(', ') : ''
                               }
                               
                               // Aktualisiere die Reservierung in der Liste
                               setReservations(prev => 
                                 prev.map(res => 
                                   res.id === selectedReservation.id ? updatedReservation : res
                                 )
                               )
                             }
                             setShowDetailModal(false)
                           }}
                           className="px-6 py-3 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                           style={{ backgroundColor: '#FF6B00', fontSize: '16px', fontWeight: '600' }}
                         >
                           Speichern
                         </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Reservation Modal - Mobile App Style */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="rounded-2xl max-w-6xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" style={{ backgroundColor: '#2D2D2D', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)' }}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-semibold text-white font-serif">Neue Reservierung hinzufügen</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-300 hover:text-orange-500 text-3xl transition-colors duration-300 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
                    style={{ color: '#FF6B00' }}
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Reservation Details - Mobile App Style */}
                  <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: '#1A1A1A', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)' }}>
                    <h4 className="text-lg font-semibold text-white mb-4 font-serif">Reservierungsdetails</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-white mb-2 font-medium">Datum</label>
                          <input
                            type="date"
                            defaultValue={currentDate.toISOString().split('T')[0]}
                            className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                            style={{ backgroundColor: '#242424' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white mb-2 font-medium">Gruppengröße</label>
                          <input
                            type="number"
                            defaultValue="2"
                            min="1"
                            max="50"
                            onChange={(e) => setGuestCount(parseInt(e.target.value) || 2)}
                            className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                            style={{ backgroundColor: '#242424' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white mb-2 font-medium">Aufenthaltsdauer</label>
                          <select 
                            defaultValue="120"
                            className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                            style={{ backgroundColor: '#242424' }}
                          >
                            <option value="60">1 Stunde</option>
                            <option value="90">1,5 Stunden</option>
                            <option value="120">2 Stunden</option>
                            <option value="150">2,5 Stunden</option>
                            <option value="180">3 Stunden</option>
                            <option value="240">4+ Stunden</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-white mb-2 font-medium">Verfügbare Zeit</label>
                          <select 
                            defaultValue="19:00"
                            className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                            style={{ backgroundColor: '#242424' }}
                          >
                            <option value="12:00">12:00</option>
                            <option value="12:30">12:30</option>
                            <option value="13:00">13:00</option>
                            <option value="13:30">13:30</option>
                            <option value="14:00">14:00</option>
                            <option value="18:00">18:00</option>
                            <option value="18:30">18:30</option>
                            <option value="19:00">19:00</option>
                            <option value="19:30">19:30</option>
                            <option value="20:00">20:00</option>
                            <option value="20:30">20:30</option>
                            <option value="21:00">21:00</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">Kommentar</label>
                        <textarea
                          placeholder="Kommentar zur Reservierung..."
                          className="w-full border-2 border-gray-500 rounded-lg px-4 py-3 text-white h-16 resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                          style={{ backgroundColor: '#2D2D2D' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guest Details - Mobile App Style */}
                  <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: '#1A1A1A', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)' }}>
                    <h4 className="text-lg font-semibold text-white mb-4 font-serif">Gastdetails</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">Name</label>
                        <input
                          type="text"
                          placeholder="Vor- und Nachname"
                          className="w-full border-2 border-gray-500 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                          style={{ backgroundColor: '#2D2D2D' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">Telefonnummer</label>
                        <input
                          type="tel"
                          placeholder="+49 123 456789"
                          className="w-full border-2 border-gray-500 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                          style={{ backgroundColor: '#2D2D2D' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">E-Mail</label>
                        <input
                          type="email"
                          placeholder="gast@beispiel.de"
                          className="w-full border-2 border-gray-500 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                          style={{ backgroundColor: '#2D2D2D' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Available Tables - Mobile App Style */}
                <div className="mt-8 rounded-xl p-4 shadow-lg" style={{ backgroundColor: '#1A1A1A', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)' }}>
                  <h4 className="text-lg font-semibold text-white mb-4 font-serif">Verfügbare Tische</h4>
                  
                  {/* Intelligenter Info-Text basierend auf Gruppengröße und ausgewählten Tischen */}
                  {(() => {
                    const selectedTablesCapacity = selectedTables.reduce((total, tableName) => {
                      const table = availableTables.find(t => t.name === tableName)
                      return total + (table?.capacity || 0)
                    }, 0)
                    
                    if (selectedTables.length === 0) {
                      return (
                        <div className="bg-blue-100 border border-blue-400 rounded-lg p-3 mb-4 text-blue-800 text-sm">
                          ℹ️ Keine Tische ausgewählt.
                        </div>
                      )
                    } else if (selectedTablesCapacity < guestCount) {
                      return (
                        <div className="bg-red-100 border border-red-400 rounded-lg p-3 mb-4 text-red-800 text-sm">
                          ❌ Zu wenige Plätze! ({selectedTablesCapacity} Plätze für {guestCount} Gäste)
                        </div>
                      )
                    } else if (selectedTablesCapacity === guestCount) {
                      return (
                        <div className="bg-green-100 border border-green-400 rounded-lg p-3 mb-4 text-green-800 text-sm">
                          ✅ Passt perfekt! ({selectedTablesCapacity} Plätze für {guestCount} Gäste)
                        </div>
                      )
                    } else if (selectedTablesCapacity <= guestCount + 2) {
                      return (
                        <div className="bg-blue-100 border border-blue-400 rounded-lg p-3 mb-4 text-blue-800 text-sm">
                          ℹ️ Passt gut! ({selectedTablesCapacity} Plätze für {guestCount} Gäste)
                        </div>
                      )
                    } else {
                      return (
                        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 mb-4 text-yellow-800 text-sm">
                          ⚠️ Zu viele Plätze! ({selectedTablesCapacity} Plätze für {guestCount} Gäste)
                        </div>
                      )
                    }
                  })()}
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {/* Nur verfügbare Tische aus dem Tischplan */}
                    {availableTables
                      .filter(table => table.available || selectedTables.includes(table.name))
                      .map((table) => {
                        const isSelected = selectedTables.includes(table.name)
                        
                        return (
                          <div
                            key={table.id}
                            className={`border-2 rounded-lg p-3 text-center transition-all duration-300 ${
                              isSelected
                                ? 'text-white shadow-lg cursor-pointer'
                                : 'cursor-pointer hover:shadow-lg hover:-translate-y-1 text-white hover:border-orange-500 hover:bg-orange-600'
                            }`}
                            style={{
                              backgroundColor: isSelected ? '#FF6B00' : '#2D2D2D',
                              borderColor: isSelected ? '#FF6B00' : '#666666'
                            }}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedTables(prev => prev.filter(t => t !== table.name))
                              } else {
                                setSelectedTables(prev => [...prev, table.name])
                              }
                            }}
                          >
                            <div className="font-semibold text-sm mb-2">{table.name}</div>
                            <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm mx-auto font-bold" style={{ backgroundColor: '#FF6B00' }}>
                              {table.capacity}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>

                {/* Actions - Mobile App Style */}
                <div className="flex justify-end gap-4 mt-8 pt-6" style={{ borderTop: '1px solid #242424' }}>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 border-2 border-gray-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-medium"
                    style={{ backgroundColor: '#2D2D2D' }}
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={() => {
                      // Erstelle neue Reservierung (auch ohne Tisch möglich)
                      const newReservation: Reservation = {
                        id: Math.max(...reservations.map(r => r.id)) + 1,
                        date: currentDate.toISOString().split('T')[0],
                        time: '19:30',
                        guestName: 'Neue Reservierung',
                        guests: 2,
                        tables: selectedTables.length > 0 ? selectedTables.join(', ') : '',
                        note: '',
                        comment: '',
                        status: 'placed',
                        duration: 120,
                        phone: '',
                        email: '',
                        source: 'manual',
                        type: 'Abendessen'
                      }
                      
                      // Füge neue Reservierung zur Liste hinzu
                      setReservations(prev => [...prev, newReservation])
                      setShowAddModal(false)
                      setSelectedTables([])
                    }}
                    className="px-6 py-3 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-medium"
                    style={{ backgroundColor: '#FF6B00' }}
                  >
                    Hinzufügen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  )
}
