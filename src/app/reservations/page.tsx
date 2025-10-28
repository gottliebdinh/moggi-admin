'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Edit, Mail, Trash2, Plus, X, Calendar, Smartphone, Globe, Check, X as XCircle, Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'

interface Reservation {
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
}

interface CapacityRule {
  id: string
  days: string | string[] // Kann JSON-String oder Array sein
  start_time: string
  end_time: string
  capacity: number
  interval_minutes: number
}

interface Exception {
  id: string
  date: string
}

export default function ReservationsDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [allReservations, setAllReservations] = useState<Reservation[]>([]) // Alle Reservierungen für Gast-Historie
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [availableTables, setAvailableTables] = useState<any[]>([])
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [guestCount, setGuestCount] = useState<number>(2)
  const dateInputRef = React.createRef<HTMLInputElement>()
  const [allTables, setAllTables] = useState<any[]>([])
  const [guestHistory, setGuestHistory] = useState<{
    visited: number
    noShow: number
    cancelled: number
  }>({ visited: 0, noShow: 0, cancelled: 0 })
  const [capacityRules, setCapacityRules] = useState<CapacityRule[]>([])
  const [exceptions, setExceptions] = useState<Exception[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(currentDate.toISOString().split('T')[0])
  const [settingsLoading, setSettingsLoading] = useState<boolean>(true)

  // Email Modal State
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailMessage, setEmailMessage] = useState('')
  const [emailRecipient, setEmailRecipient] = useState<Reservation | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Lade Reservierungen aus der Datenbank
  useEffect(() => {
    const loadReservations = async () => {
      try {
        const dateStr = currentDate.toISOString().split('T')[0]
        console.log('Loading reservations for date:', dateStr)
        
        const response = await fetch(`/api/reservations?date=${dateStr}`)
        const data = await response.json()
        
        console.log('Reservations loaded:', data.length, 'for date:', dateStr)
        setReservations(data)
      } catch (error) {
        console.error('Fehler beim Laden der Reservierungen:', error)
        setReservations(dummyReservations)
      }
    }
    
    loadReservations()
  }, [currentDate])

  // Lade alle Reservierungen für Gast-Historie
  useEffect(() => {
    const loadAllReservations = async () => {
      try {
        const response = await fetch('/api/reservations') // Ohne Datum = alle
        const data = await response.json()
        setAllReservations(data)
      } catch (error) {
        console.error('Fehler beim Laden aller Reservierungen:', error)
        setAllReservations([])
      }
    }
    
    loadAllReservations()
  }, [])

  // Lade Kapazitätsregeln und Ausnahmen
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        const data = await response.json()
        setCapacityRules(data.rules || [])
        setExceptions(data.exceptions || [])
      } catch (error) {
        console.error('Fehler beim Laden der Einstellungen:', error)
        setCapacityRules([])
        setExceptions([])
      }
      setSettingsLoading(false)
    }
    
    loadSettings()
  }, [])

  // Lade Tische aus der Datenbank
  useEffect(() => {
    const loadTables = async () => {
      try {
        const response = await fetch('/api/rooms')
        const rooms = await response.json()
        const tables: any[] = []
        
        rooms.forEach((room: any) => {
          room.tables.forEach((table: any) => {
            tables.push({
              id: table.id,
              name: table.name,
              capacity: table.capacity,
              room: room.name
            })
          })
        })
        
        setAllTables(tables)
      } catch (error) {
        console.error('Fehler beim Laden der Tische:', error)
        setAllTables(defaultTables)
      }
    }
    
    loadTables()
  }, [])


  // Dummy-Tische als Fallback
  const defaultTables = [
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
  const calculateAvailableTables = (selectedTime: string, selectedDuration: number, selectedDate: string, excludeReservationId?: string) => {
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
          const reservedTableNames = reservation.tables ? reservation.tables.split(', ').map(name => name.trim()) : []
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
  const updateTableAvailability = (time: string, duration: number, date: string, excludeReservationId?: string) => {
    const tables = calculateAvailableTables(time, duration, date, excludeReservationId)
    setAvailableTables(tables)
  }

  // Funktion um die nächste verfügbare Zeit zu berechnen
  const getNextAvailableTime = (date: string, duration: number = 120) => {
    // Verwende die getAvailableTimesForDate Funktion um alle verfügbaren Zeiten zu bekommen
    const availableTimes = getAvailableTimesForDate(date)
    
    if (availableTimes.length === 0) {
      return null // Restaurant ist geschlossen
    }
    
    // Konvertiere Zeit zu Minuten für einfacheren Vergleich
    const timeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number)
      return hours * 60 + minutes
    }
    
    // Finde die nächste verfügbare Zeit
    for (const time of availableTimes) {
      const timeMinutes = timeToMinutes(time)
      const endMinutes = timeMinutes + duration
      
      // Prüfe ob diese Zeit verfügbar ist
      let isAvailable = true
      
      for (const reservation of reservations) {
        // Nur Reservierungen am gleichen Tag und nicht storniert
        if (reservation.date === date && reservation.status !== 'cancelled' && reservation.tables) {
          const reservationStartMinutes = timeToMinutes(reservation.time)
          const reservationEndMinutes = reservationStartMinutes + (reservation.duration || 120)
          
          // Prüfe auf Zeitüberschneidung
          const hasOverlap = !(endMinutes <= reservationStartMinutes || timeMinutes >= reservationEndMinutes)
          
          if (hasOverlap) {
            isAvailable = false
            break
          }
        }
      }
      
      if (isAvailable) {
        return time
      }
    }
    
    // Fallback: wenn keine Zeit verfügbar ist, gib die erste verfügbare Zeit zurück
    return availableTimes.length > 0 ? availableTimes[0] : null
  }

  // Funktion um alle verfügbaren Zeiten für ein bestimmtes Datum zu generieren (nur DB-Regeln)
  const getAvailableTimesForDate = (date: string) => {
    console.log('=== getAvailableTimesForDate Debug ===')
    console.log('Date:', date)
    console.log('Capacity rules loaded:', capacityRules.length)
    console.log('Exceptions loaded:', exceptions.length)
    
    // Prüfe ob das Datum eine Ausnahme ist (geschlossen)
    const isException = exceptions.some(exception => exception.date === date)
    if (isException) {
      console.log('Date is an exception (closed)')
      return []
    }

    const dateObj = new Date(date)
    const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
    const dayName = dayNames[dateObj.getDay()]
    console.log('Day name:', dayName)

    const applicableRules = capacityRules.filter(rule => {
      try {
        const ruleDays = typeof rule.days === 'string' ? JSON.parse(rule.days) : rule.days
        console.log('Rule:', rule.id, 'Days:', ruleDays, 'Includes', dayName, '?', ruleDays.includes(dayName))
        return ruleDays.includes(dayName)
      } catch (error) {
        console.error('Error parsing rule days:', error, 'Rule:', rule)
        return false
      }
    })

    console.log('Applicable rules found:', applicableRules.length)

    if (applicableRules.length === 0) {
      console.log('No applicable rules found for', dayName)
      return []
    }

    const availableTimes: string[] = []
    const timeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number)
      return hours * 60 + minutes
    }
    const minutesToTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
    }

    applicableRules.forEach(rule => {
      console.log('Processing rule:', rule.id, 'Start:', rule.start_time, 'End:', rule.end_time, 'Interval:', rule.interval_minutes)
      const startMinutes = timeToMinutes(rule.start_time)
      const endMinutes = timeToMinutes(rule.end_time)
      const interval = rule.interval_minutes
      for (let minutes = startMinutes; minutes < endMinutes; minutes += interval) {
        availableTimes.push(minutesToTime(minutes))
      }
    })

    const result = [...new Set(availableTimes)].sort()
    console.log('Final result:', result)
    console.log('=== End Debug ===')
    return result
  }

  // Hilfsfunktion: wähle Standardzeit (nächste volle Stunde heute, sonst erster Slot)
  const pickDefaultTimeForDate = (date: string, times: string[]): string | null => {
    if (times.length === 0) return null
    const todayStr = new Date().toISOString().split('T')[0]
    if (date !== todayStr) return times[0]
    const now = new Date()
    const nextHour = new Date(now)
    nextHour.setMinutes(0, 0, 0)
    nextHour.setHours(now.getMinutes() > 0 ? now.getHours() + 1 : now.getHours())
    const toMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number)
      return h * 60 + m
    }
    const nextHourMinutes = nextHour.getHours() * 60
    const candidate = times.find(t => toMinutes(t) >= nextHourMinutes)
    return candidate || times[0]
  }

  // Funktion um Gast-Historie zu berechnen
  const calculateGuestHistory = (email: string) => {
    if (!email) {
      setGuestHistory({ visited: 0, noShow: 0, cancelled: 0 })
      return
    }

    // Verwende alle Reservierungen (nicht nur die des aktuellen Tages)
    const guestReservations = allReservations.filter(res => 
      res.email && res.email.toLowerCase() === email.toLowerCase()
    )

    const visitedCount = guestReservations.filter(res => 
      res.status === 'confirmed' || res.status === 'placed'
    ).length
    
    const history = {
      visited: Math.max(0, visitedCount - 1), // -1 weil der erste Besuch nicht als "Besuch" zählt
      noShow: guestReservations.filter(res => 
        res.status === 'no-show'
      ).length,
      cancelled: guestReservations.filter(res => 
        res.status === 'cancelled'
      ).length
    }

    setGuestHistory(history)
  }

  // Dummy-Daten genau wie in deinem HTML
  const dummyReservations: Reservation[] = [
    {
      id: '1',
      type: 'Abendessen',
      source: 'handy',
      time: '19:30',
      guest_name: 'Müller, Familie',
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
      id: '2',
      type: 'Mittagessen',
      source: 'web',
      time: '13:00',
      guest_name: 'Schmidt, Herr',
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
      id: '3',
      type: 'Abendessen',
      source: 'manual',
      time: '20:00',
      guest_name: 'Weber, Frau',
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
      id: '4',
      type: 'Mittagessen',
      source: 'handy',
      time: '12:30',
      guest_name: 'Klein, Familie',
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
      id: '5',
      type: 'Abendessen',
      source: 'web',
      time: '18:45',
      guest_name: 'Hoffmann, Herr',
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
      id: '6',
      type: 'Abendessen',
      time: '19:00',
      guest_name: 'Max Mustermann',
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


  const getSourceInfo = (source: string) => {
    const sourceMap = {
      'handy': { Component: Smartphone, text: 'Handy App' },
      'web': { Component: Globe, text: 'Website' },
      'manual': { Component: Edit, text: 'Manuell' }
    }
    return sourceMap[source as keyof typeof sourceMap] || { Component: Edit, text: 'Manuell' }
  }

  const updateStatus = async (reservationId: string, newStatus: string) => {
    try {
      // Finde die Reservierung
      const reservation = reservations.find(r => r.id === reservationId)
      if (!reservation) return
      
      // Aktualisiere den Status - stelle sicher, dass alle Felder korrekt sind
      const updatedReservation = { 
        ...reservation, 
        status: newStatus,
        guestName: reservation.guest_name || 'Neue Reservierung',
        date: reservation.date || new Date().toISOString().split('T')[0],
        time: reservation.time || '19:30',
        guests: reservation.guests || 2,
        duration: reservation.duration || 120,
        source: reservation.source || 'manual',
        type: reservation.type || 'Abendessen'
      }
      
      const response = await fetch('/api/reservations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReservation)
      })
      
      if (response.ok) {
        const updatedReservation = await response.json()
        
        // Update the reservation and maintain chronological sorting
        setReservations(prev => {
          const updated = prev.map(res => 
            res.id === reservationId ? updatedReservation : res
          )
          // Sort by date ASC, then by time ASC
          return updated.sort((a, b) => {
            if (a.date !== b.date) {
              return a.date.localeCompare(b.date)
            }
            return a.time.localeCompare(b.time)
          })
        })
        
        // Update allReservations for guest history
        setAllReservations(prev => prev.map(res => 
          res.id === reservationId ? updatedReservation : res
        ))
      } else {
        alert('Fehler beim Aktualisieren des Status')
      }
    } catch (error) {
      console.error('Fehler:', error)
      alert('Fehler beim Aktualisieren des Status')
    }
  }

  const sendEmailToCustomer = (reservation: Reservation) => {
    if (!reservation.email) {
      alert('Keine E-Mail-Adresse für diesen Gast hinterlegt.')
      return
    }

    const subject = `Reservierung bei Moggi - ${reservation.date}`
    const body = `Hallo ${reservation.guest_name},

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
                      dateInputRef.current.showPicker()
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
                  // Initialisiere verfügbare Tische für neue Reservierung mit der nächsten verfügbaren Zeit
                  setTimeout(() => {
                    const date = currentDate.toISOString().split('T')[0]
                    setSelectedDate(date)
                    const duration = 120 // Standardwert aus dem Modal
                    const availableTimes = getAvailableTimesForDate(date)
                    const defaultTime = pickDefaultTimeForDate(date, availableTimes)
                    
                    // Setze die Standardzeit im Select-Element
                    const timeSelect = document.querySelector('select[id="time"]') as HTMLSelectElement
                    if (timeSelect && defaultTime) {
                      timeSelect.value = defaultTime
                    }
                    
                    if (defaultTime) {
                      updateTableAvailability(defaultTime, duration, date)
                    }
                  }, 100) // Kurze Verzögerung damit das Modal gerendert ist
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
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>E-Mail</th>
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
                        
                        // Berechne Gast-Historie basierend auf E-Mail
                        calculateGuestHistory(reservation.email || '')
                        
                        // Berechne verfügbare Tische für diese Reservierung
                        const time = reservation.time || '19:30'
                        const duration = reservation.duration || 120
                        const date = reservation.date || currentDate.toISOString().split('T')[0]
                        updateTableAvailability(time, duration, date, reservation.id)
                      }}
                    >
                      <td className={`px-6 py-2 ${reservation.status === 'cancelled' ? 'opacity-60' : ''}`}>
                        <div className="flex items-center justify-center" title={sourceInfo.text}>
                          <sourceInfo.Component 
                            className={`w-6 h-6 ${reservation.status === 'cancelled' ? 'line-through' : ''}`} 
                          />
                        </div>
                      </td>
                      <td className={`px-6 py-2 text-white font-medium ${reservation.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                        {reservation.time ? reservation.time.substring(0, 5) : ''}
                      </td>
                      <td className={`px-6 py-2 text-white font-medium ${reservation.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                        <div className="flex items-center gap-2">
                          <span>{reservation.guest_name}</span>
                          {reservation.email && (() => {
                            const guestReservations = allReservations.filter(res => 
                              res.email && res.email.toLowerCase() === reservation.email!.toLowerCase()
                            )
                            const visitedCount = guestReservations.filter(res => 
                              res.status === 'confirmed' || res.status === 'placed'
                            ).length
                            
                            const actualVisits = Math.max(0, visitedCount - 1) // -1 weil der erste Besuch nicht als "Besuch" zählt
                            
                            if (actualVisits > 0) {
                              return (
                                <span 
                                  className="px-2 py-1 rounded-full font-medium text-xs"
                                  style={{ backgroundColor: '#86efac', color: '#14532d' }}
                                  title={`${actualVisits} Besuche`}
                                >
                                  {actualVisits} Besuche
                                </span>
                              )
                            }
                            return null
                          })()}
                        </div>
                      </td>
                      <td className={`px-6 py-2 text-white font-medium ${reservation.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                        {reservation.guests}
                      </td>
                      <td className={`px-6 py-2 text-white font-medium ${reservation.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                        {reservation.tables || (
                          <span className="font-bold text-xl animate-pulse" style={{ color: '#FF6B00' }}>!</span>
                        )}
                      </td>
                      <td className={`px-3 py-2 text-gray-300 ${reservation.status === 'cancelled' ? 'line-through opacity-60' : ''}`} style={{ fontFamily: 'Georgia', fontWeight: '300', maxWidth: '200px' }}>
                        <div className="break-words whitespace-pre-wrap">
                          {reservation.note}
                        </div>
                      </td>
                      <td className={`px-6 py-2 ${reservation.status === 'cancelled' ? 'opacity-60' : ''}`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (reservation.status !== 'cancelled') {
                              setEmailRecipient(reservation)
                              setEmailMessage('')
                              setShowEmailModal(true)
                            }
                          }}
                          className={`text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:opacity-80 ${
                            reservation.status === 'cancelled' ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          style={{ backgroundColor: '#FF6B00' }}
                          title={reservation.status === 'cancelled' ? 'Reservierung storniert' : 'E-Mail an Kunden senden'}
                          disabled={reservation.status === 'cancelled'}
                        >
                          <Mail className="w-5 h-5" />
                        </button>
                      </td>
                      <td className={`px-6 py-2 ${reservation.status === 'cancelled' ? 'opacity-60' : ''}`}>
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
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Reservierung bearbeiten</h3>
                    
                    {/* Gast-Historie - Kompakte Symbole */}
                    {selectedReservation?.email && (guestHistory.visited > 0 || guestHistory.noShow > 0 || guestHistory.cancelled > 0) && (
                      <div className="flex items-center gap-2">
                        {guestHistory.visited > 0 && (
                          <div className="flex items-center gap-1" title={`${guestHistory.visited} Besuche`}>
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-white text-sm font-medium">{guestHistory.visited}</span>
                          </div>
                        )}
                        {guestHistory.noShow > 0 && (
                          <div className="flex items-center gap-1" title={`${guestHistory.noShow} No-Shows`}>
                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">⚠</span>
                            </div>
                            <span className="text-white text-sm font-medium">{guestHistory.noShow}</span>
                          </div>
                        )}
                        {guestHistory.cancelled > 0 && (
                          <div className="flex items-center gap-1" title={`${guestHistory.cancelled} Stornierungen`}>
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                              <X className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-white text-sm font-medium">{guestHistory.cancelled}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-300 hover:text-orange-500 text-3xl transition-colors duration-300 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
                    style={{ color: '#FF6B00' }}
                  >
                    <X className="w-5 h-5" />
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
                            id="edit-date"
                            type="date"
                            defaultValue={selectedReservation.date}
                            onChange={(e) => {
                              const date = e.target.value
                              const time = (document.querySelector('select') as HTMLSelectElement)?.value || '19:30'
                              const duration = parseInt((document.querySelector('select[id="duration"]') as HTMLSelectElement)?.value || '120')
                              updateTableAvailability(time, duration, date, selectedReservation?.id)
                            }}
                            className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                            style={{ backgroundColor: '#242424' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white mb-2 font-medium">Gruppengröße</label>
                          <input
                            id="edit-guests"
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
                            id="edit-duration"
                            defaultValue={selectedReservation.duration || 120}
                            onChange={(e) => {
                              const duration = parseInt(e.target.value)
                              const time = (document.querySelector('select') as HTMLSelectElement)?.value || '19:30'
                              const date = (document.querySelector('input[type="date"]') as HTMLInputElement)?.value || currentDate.toISOString().split('T')[0]
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
                            id="edit-time"
                            defaultValue={selectedReservation.time || "19:30"}
                            onChange={(e) => {
                              const time = e.target.value
                              const duration = parseInt((document.querySelector('select[id="duration"]') as HTMLSelectElement)?.value || '120')
                              const date = (document.querySelector('input[type="date"]') as HTMLInputElement)?.value || currentDate.toISOString().split('T')[0]
                              updateTableAvailability(time, duration, date, selectedReservation?.id)
                            }}
                            className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                            style={{ backgroundColor: '#242424' }}
                          >
                            {(() => {
                              const date = (document.querySelector('input[type="date"]') as HTMLInputElement)?.value || selectedReservation?.date || currentDate.toISOString().split('T')[0]
                              const availableTimes = getAvailableTimesForDate(date)
                              
                              if (settingsLoading) {
                                return <option value="">Zeiten laden...</option>
                              }
                              
                              if (availableTimes.length === 0) {
                                return <option value="">Restaurant geschlossen</option>
                              }
                              
                              return availableTimes.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))
                            })()}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">Notiz</label>
                        <textarea
                          id="edit-note"
                          defaultValue={selectedReservation.note || ''}
                          placeholder="Notiz zur Reservierung..."
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
                          id="edit-guestName"
                          type="text"
                          defaultValue={selectedReservation.guest_name}
                          className="w-full border-2 border-gray-500 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                          style={{ backgroundColor: '#2D2D2D' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">Telefonnummer</label>
                        <input
                          id="edit-phone"
                          type="tel"
                          defaultValue={selectedReservation.phone || ''}
                          className="w-full border-2 border-gray-500 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                          style={{ backgroundColor: '#2D2D2D' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">E-Mail</label>
                        <input
                          id="edit-email"
                          type="email"
                          defaultValue={selectedReservation.email || ''}
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
                          <Info className="w-4 h-4 inline mr-1" /> Keine Tische ausgewählt.
                        </div>
                      )
                    } else if (selectedTablesCapacity < guestCount) {
                      return (
                        <div className="bg-red-100 border-2 border-red-400 rounded-xl p-3 mb-4 text-red-800 text-sm font-medium">
                          <AlertCircle className="w-4 h-4 inline mr-1" /> Zu wenige Plätze! ({selectedTablesCapacity} Plätze für {guestCount} Gäste)
                        </div>
                      )
                    } else if (selectedTablesCapacity === guestCount) {
                      return (
                        <div className="bg-green-100 border-2 border-green-400 rounded-xl p-3 mb-4 text-green-800 text-sm font-medium">
                          <CheckCircle className="w-4 h-4 inline mr-1" /> Passt perfekt! ({selectedTablesCapacity} Plätze für {guestCount} Gäste)
                        </div>
                      )
                    } else if (selectedTablesCapacity <= guestCount + 2) {
                      return (
                        <div className="bg-blue-100 border-2 border-blue-400 rounded-xl p-3 mb-4 text-blue-800 text-sm font-medium">
                          <Info className="w-4 h-4 inline mr-1" /> Passt gut! ({selectedTablesCapacity} Plätze für {guestCount} Gäste)
                        </div>
                      )
                    } else {
                      return (
                        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-3 mb-4 text-yellow-800 text-sm font-medium">
                          <AlertTriangle className="w-4 h-4 inline mr-1" /> Zu viele Plätze! ({selectedTablesCapacity} Plätze für {guestCount} Gäste)
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
                           onClick={async () => {
                             if (selectedReservation) {
                               try {
                                 // Lese die Werte aus den Eingabefeldern
                                 const guestName = (document.getElementById('edit-guestName') as HTMLInputElement)?.value || selectedReservation.guest_name
                                 const phone = (document.getElementById('edit-phone') as HTMLInputElement)?.value || selectedReservation.phone
                                 const email = (document.getElementById('edit-email') as HTMLInputElement)?.value || selectedReservation.email
                                 const date = (document.getElementById('edit-date') as HTMLSelectElement)?.value || selectedReservation.date
                                 const time = (document.getElementById('edit-time') as HTMLSelectElement)?.value || selectedReservation.time
                                 const guests = parseInt((document.getElementById('edit-guests') as HTMLInputElement)?.value || selectedReservation.guests.toString())
                                 const duration = parseInt((document.getElementById('edit-duration') as HTMLSelectElement)?.value || selectedReservation.duration.toString())
                                 const note = (document.getElementById('edit-note') as HTMLTextAreaElement)?.value || selectedReservation.note
                                 
                                 // Aktualisiere die Reservierung mit den neuen Werten
                                 const updatedReservation = {
                                   ...selectedReservation,
                                   guestName: guestName ? guestName.trim() : '',
                                   phone: phone || '',
                                   email: email || '',
                                   date: date,
                                   time: time,
                                   guests: guests,
                                   duration: duration,
                                   note: note || '',
                                   tables: selectedTables.length > 0 ? selectedTables.join(', ') : ''
                                 }
                                 
                                 const response = await fetch('/api/reservations', {
                                   method: 'PUT',
                                   headers: { 'Content-Type': 'application/json' },
                                   body: JSON.stringify(updatedReservation)
                                 })
                                 
                                 if (response.ok) {
                                   const updatedReservation = await response.json()
                                   
                                   // Update the reservation and maintain chronological sorting
                                   setReservations(prev => {
                                     const updated = prev.map(res => 
                                       res.id === selectedReservation.id ? updatedReservation : res
                                     )
                                     // Sort by date ASC, then by time ASC
                                     return updated.sort((a, b) => {
                                       if (a.date !== b.date) {
                                         return a.date.localeCompare(b.date)
                                       }
                                       return a.time.localeCompare(b.time)
                                     })
                                   })
                                   
                                   setShowDetailModal(false)
                                 } else {
                                   alert('Fehler beim Speichern der Reservierung')
                                 }
                               } catch (error) {
                                 console.error('Fehler:', error)
                                 alert('Fehler beim Speichern der Reservierung')
                               }
                             }
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
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Guest Details - Mobile App Style */}
                  <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: '#1A1A1A', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)' }}>
                    <h4 className="text-lg font-semibold text-white mb-4 font-serif">Gastinformationen</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">Gastname *</label>
                        <input
                          type="text"
                          placeholder="Name des Gastes eingeben..."
                          id="guestName"
                          className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                          style={{ backgroundColor: '#242424' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">Telefon</label>
                        <input
                          type="tel"
                          placeholder="+49 123 456789"
                          id="phone"
                          className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                          style={{ backgroundColor: '#242424' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">E-Mail</label>
                        <input
                          type="email"
                          placeholder="gast@example.com"
                          id="email"
                          className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                          style={{ backgroundColor: '#242424' }}
                        />
                      </div>
                    </div>
                  </div>

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
                            id="date"
                            onChange={(e) => {
                              const date = e.target.value
                              setSelectedDate(date)
                              const duration = parseInt((document.querySelector('select[id="duration"]') as HTMLSelectElement)?.value || '120')
                              const availableTimes = getAvailableTimesForDate(date)
                              const defaultTime = pickDefaultTimeForDate(date, availableTimes)
                              
                              // Setze die Standardzeit im Select-Element
                              const timeSelect = document.querySelector('select[id="time"]') as HTMLSelectElement
                              if (timeSelect && defaultTime) {
                                timeSelect.value = defaultTime
                              }
                              
                              if (defaultTime) {
                                updateTableAvailability(defaultTime, duration, date)
                              }
                            }}
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
                            id="guests"
                            onChange={(e) => setGuestCount(parseInt(e.target.value) || 2)}
                            className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                            style={{ backgroundColor: '#242424' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white mb-2 font-medium">Aufenthaltsdauer</label>
                          <select 
                            defaultValue="120"
                            id="duration"
                            onChange={(e) => {
                              const duration = parseInt(e.target.value)
                              const availableTimes = getAvailableTimesForDate(selectedDate)
                              const defaultTime = pickDefaultTimeForDate(selectedDate, availableTimes)
                              
                              // Setze die Standardzeit im Select-Element
                              const timeSelect = document.querySelector('select[id="time"]') as HTMLSelectElement
                              if (timeSelect && defaultTime) {
                                timeSelect.value = defaultTime
                              }
                              
                              if (defaultTime) {
                                updateTableAvailability(defaultTime, duration, selectedDate)
                              }
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
                            id="time"
                            onChange={(e) => {
                              const time = e.target.value
                              const duration = parseInt((document.querySelector('select[id="duration"]') as HTMLSelectElement)?.value || '120')
                              const date = (document.querySelector('input[type="date"]') as HTMLInputElement)?.value || currentDate.toISOString().split('T')[0]
                              updateTableAvailability(time, duration, date)
                            }}
                            className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                            style={{ backgroundColor: '#242424' }}
                          >
                            {(() => {
                              const availableTimes = getAvailableTimesForDate(selectedDate)
                              
                              if (settingsLoading) {
                                return <option value="">Zeiten laden...</option>
                              }
                              
                              if (availableTimes.length === 0) {
                                return <option value="">Restaurant geschlossen</option>
                              }
                              
                              return availableTimes.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))
                            })()}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">Notiz</label>
                        <textarea
                          placeholder="Notiz zur Reservierung..."
                          id="note"
                          className="w-full border-2 border-gray-500 rounded-lg px-4 py-3 text-white h-16 resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
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
                          <Info className="w-4 h-4 inline mr-1" /> Keine Tische ausgewählt.
                        </div>
                      )
                    } else if (selectedTablesCapacity < guestCount) {
                      return (
                        <div className="bg-red-100 border border-red-400 rounded-lg p-3 mb-4 text-red-800 text-sm">
                          <AlertCircle className="w-4 h-4 inline mr-1" /> Zu wenige Plätze! ({selectedTablesCapacity} Plätze für {guestCount} Gäste)
                        </div>
                      )
                    } else if (selectedTablesCapacity === guestCount) {
                      return (
                        <div className="bg-green-100 border border-green-400 rounded-lg p-3 mb-4 text-green-800 text-sm">
                          <CheckCircle className="w-4 h-4 inline mr-1" /> Passt perfekt! ({selectedTablesCapacity} Plätze für {guestCount} Gäste)
                        </div>
                      )
                    } else if (selectedTablesCapacity <= guestCount + 2) {
                      return (
                        <div className="bg-blue-100 border border-blue-400 rounded-lg p-3 mb-4 text-blue-800 text-sm">
                          <Info className="w-4 h-4 inline mr-1" /> Passt gut! ({selectedTablesCapacity} Plätze für {guestCount} Gäste)
                        </div>
                      )
                    } else {
                      return (
                        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 mb-4 text-yellow-800 text-sm">
                          <AlertTriangle className="w-4 h-4 inline mr-1" /> Zu viele Plätze! ({selectedTablesCapacity} Plätze für {guestCount} Gäste)
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
                    onClick={async () => {
                      // Lese die Werte aus den Eingabefeldern
                      const guestName = (document.getElementById('guestName') as HTMLInputElement)?.value
                      const phone = (document.getElementById('phone') as HTMLInputElement)?.value
                      const email = (document.getElementById('email') as HTMLInputElement)?.value
                      const date = (document.getElementById('date') as HTMLInputElement)?.value
                      const guests = parseInt((document.getElementById('guests') as HTMLInputElement)?.value || '2')
                      const duration = parseInt((document.getElementById('duration') as HTMLSelectElement)?.value || '120')
                      const time = (document.getElementById('time') as HTMLSelectElement)?.value
                      const note = (document.getElementById('note') as HTMLTextAreaElement)?.value

                      // Validiere Gastname
                      if (!guestName || (guestName && guestName.trim() === '')) {
                        alert('Bitte geben Sie einen Gastnamen ein.')
                        return
                      }

                      // Verhindere Doppelklicks
                      if (isSaving) return
                      
                      setIsSaving(true)

                      // Erstelle neue Reservierung mit echten Daten
                      const newReservation = {
                        date: date || currentDate.toISOString().split('T')[0],
                        time: time || '19:30',
                        guestName: guestName ? guestName.trim() : '',
                        guests: guests,
                        tables: selectedTables.length > 0 ? selectedTables.join(', ') : '',
                        note: note || '',
                        comment: '',
                        status: 'confirmed',
                        duration: duration,
                        phone: phone || '',
                        email: email || '',
                        source: 'manual',
                        type: 'Abendessen'
                      }
                      
                      try {
                        const response = await fetch('/api/reservations', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(newReservation)
                        })
                        
                        if (response.ok) {
                          const savedReservation = await response.json()
                          
                          // Insert the mindset reservation in the correct chronological position
                          setReservations(prev => {
                            const updated = [...prev, savedReservation]
                            // Sort by date ASC, then by time ASC
                            return updated.sort((a, b) => {
                              if (a.date !== b.date) {
                                return a.date.localeCompare(b.date)
                              }
                              return a.time.localeCompare(b.time)
                            })
                          })
                          
                          // Update allReservations for guest history
                          setAllReservations(prev => [...prev, savedReservation])
                          
                          setShowAddModal(false)
                          setSelectedTables([])
                        } else {
                          alert('Fehler beim Speichern der Reservierung')
                        }
                      } catch (error) {
                        console.error('Fehler:', error)
                        alert('Fehler beim Speichern der Reservierung')
                      } finally {
                        setIsSaving(false)
                      }
                    }}
                    disabled={isSaving}
                    className="px-6 py-3 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#FF6B00' }}
                  >
                    {isSaving ? 'Wird gespeichert...' : 'Hinzufügen'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Modal */}
        {showEmailModal && emailRecipient && (
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
                      <span className="text-gray-400">Name:</span> {emailRecipient.guest_name}
                    </div>
                    <div className="text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                      <span className="text-gray-400">E-Mail:</span> {emailRecipient.email}
                    </div>
                    <div className="text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                      <span className="text-gray-400">Reservierung:</span> {emailRecipient.date} um {emailRecipient.time}
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
                      
                      try {
                        // TODO: API Call zum Versenden der E-Mail
                        console.log('Sending email to:', emailRecipient.email)
                        console.log('Message:', emailMessage)
                        
                        // Simuliere erfolgreichen Versand
                        alert('E-Mail wurde erfolgreich gesendet!')
                        setShowEmailModal(false)
                        setEmailMessage('')
                        setEmailRecipient(null)
                      } catch (error) {
                        console.error('Error sending email:', error)
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

      </div>
    </AdminLayout>
  )
}
