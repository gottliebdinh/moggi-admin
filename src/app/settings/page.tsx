'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Edit, Trash2, Plus, X } from 'lucide-react'

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

// Dummy-Daten als Konstanten
const dummyCapacityRules: CapacityRule[] = [
  {
    id: '1',
    days: ['tuesday', 'wednesday'],
    start_time: '17:30',
    end_time: '22:00',
    capacity: 120,
    interval_minutes: 30
  },
  {
    id: '2',
    days: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    start_time: '11:30',
    end_time: '14:00',
    capacity: 120,
    interval_minutes: 30
  },
  {
    id: '3',
    days: ['thursday', 'friday', 'saturday'],
    start_time: '17:30',
    end_time: '22:30',
    capacity: 120,
    interval_minutes: 30
  }
]

const dummyExceptions: Exception[] = [
  { id: '1', date: '2024-12-25' },
  { id: '2', date: '2024-12-26' },
  { id: '3', date: '2024-01-01' }
]

// Hilfsfunktion: Formatiere Zeit von HH:MM:SS auf HH:MM
const formatTimeHHMM = (timeStr: string): string => {
  if (!timeStr) return ''
  // Wenn Zeit im Format HH:MM:SS ist, nimm nur die ersten 5 Zeichen (HH:MM)
  return timeStr.substring(0, 5)
}

export default function SettingsDashboard() {
  const [capacityRules, setCapacityRules] = useState<CapacityRule[]>([])
  const [exceptions, setExceptions] = useState<Exception[]>([])
  const [showAddCapacityModal, setShowAddCapacityModal] = useState(false)
  const [showAddExceptionModal, setShowAddExceptionModal] = useState(false)
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null)
  
  // Form states for capacity rules
  const [newCapacityRule, setNewCapacityRule] = useState<{
    days: string[]
    startTime: string
    endTime: string
    capacity: number
    interval: number
  }>({
    days: [],
    startTime: '17:30',
    endTime: '22:00',
    capacity: 120,
    interval: 30
  })
  
  // Form states for exceptions
  const [newException, setNewException] = useState<Partial<Exception>>({
    date: ''
  })

  // Lade Daten von der API
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      
      setCapacityRules(data.rules || [])
      setExceptions(data.exceptions || [])
    } catch (error) {
      console.error('Error loading settings:', error)
      // Fallback zu leeren Arrays
      setCapacityRules([])
      setExceptions([])
    }
  }

  const dayNames = {
    'Montag': 'MO.',
    'Dienstag': 'DI.',
    'Mittwoch': 'MI.',
    'Donnerstag': 'DO.',
    'Freitag': 'FR.',
    'Samstag': 'SA.',
    'Sonntag': 'SO.'
  }

  const dayNamesForDisplay = {
    'Montag': 'MO.',
    'Dienstag': 'DI.',
    'Mittwoch': 'MI.',
    'Donnerstag': 'DO.',
    'Freitag': 'FR.',
    'Samstag': 'SA.',
    'Sonntag': 'SO.',
    // Fallback für englische Namen
    'monday': 'MO.',
    'tuesday': 'DI.',
    'wednesday': 'MI.',
    'thursday': 'DO.',
    'friday': 'FR.',
    'saturday': 'SA.',
    'sunday': 'SO.'
  }

  const openAddCapacityModal = () => {
    setEditingRuleId(null)
    setShowAddCapacityModal(true)
  }

  const openAddExceptionModal = () => {
    setShowAddExceptionModal(true)
  }

  const addCapacityRule = async () => {
    if (!newCapacityRule.days || newCapacityRule.days.length === 0) {
      alert('Bitte wählen Sie mindestens einen Tag aus.')
      return
    }
    
    try {
      const url = '/api/settings'
      const method = editingRuleId ? 'PUT' : 'POST'
      const body = editingRuleId ? {
        type: 'capacity_rule',
        id: editingRuleId,
        data: {
          days: newCapacityRule.days,
          startTime: newCapacityRule.startTime || '17:30',
          endTime: newCapacityRule.endTime || '22:00',
          capacity: newCapacityRule.capacity || 120,
          interval: newCapacityRule.interval || 30
        }
      } : {
        type: 'capacity_rule',
        data: {
          days: newCapacityRule.days,
          startTime: newCapacityRule.startTime || '17:30',
          endTime: newCapacityRule.endTime || '22:00',
          capacity: newCapacityRule.capacity || 120,
          interval: newCapacityRule.interval || 30
        }
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      if (response.ok) {
        await loadSettings() // Lade Daten neu
        setNewCapacityRule({
          days: [],
          startTime: '17:30',
          endTime: '22:00',
          capacity: 120,
          interval: 30
        })
        setEditingRuleId(null)
        setShowAddCapacityModal(false)
      }
    } catch (error) {
      console.error('Error adding/updating capacity rule:', error)
    }
  }

  const addException = async () => {
    if (!newException.date) {
      alert('Bitte wählen Sie ein Datum aus.')
      return
    }
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'exception',
          data: {
            date: newException.date
          }
        })
      })
      
      if (response.ok) {
        await loadSettings() // Lade Daten neu von der API
        setNewException({ date: '' })
        setShowAddExceptionModal(false)
      } else {
        console.error('Fehler beim Hinzufügen der Ausnahme')
      }
    } catch (error) {
      console.error('Error adding exception:', error)
    }
  }

  const editCapacityRule = (ruleId: string) => {
    const rule = capacityRules.find(r => r.id === ruleId)
    if (rule) {
      setEditingRuleId(ruleId)
      // Konvertiere days von JSON-String zu Array für das Formular
      const parsedDays = typeof rule.days === 'string' ? JSON.parse(rule.days) : rule.days
      setNewCapacityRule({
        days: parsedDays,
        startTime: formatTimeHHMM(rule.start_time),
        endTime: formatTimeHHMM(rule.end_time),
        capacity: rule.capacity,
        interval: rule.interval_minutes
      })
      setShowAddCapacityModal(true)
    }
  }

  const deleteCapacityRule = async (ruleId: string) => {
    if (confirm('Möchten Sie diese Kapazitäts-Regel wirklich löschen?')) {
      try {
        const response = await fetch(`/api/settings?type=capacity_rule&id=${ruleId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          await loadSettings() // Lade Daten neu von der API
        } else {
          console.error('Fehler beim Löschen der Kapazitätsregel')
        }
      } catch (error) {
        console.error('Error deleting capacity rule:', error)
      }
    }
  }

  const deleteException = async (exceptionId: string) => {
    if (confirm('Möchten Sie diese Ausnahme wirklich löschen?')) {
      try {
        const response = await fetch(`/api/settings?type=exception&id=${exceptionId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          await loadSettings() // Lade Daten neu von der API
        } else {
          console.error('Fehler beim Löschen der Ausnahme')
        }
      } catch (error) {
        console.error('Error deleting exception:', error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Capacity Rules Section */}
                 <div className="rounded-2xl p-6" style={{ backgroundColor: '#1A1A1A', borderWidth: '1px', borderColor: '#242424' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Kapazitäts-Regeln</h2>
              <button
                onClick={openAddCapacityModal}
                className="text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 font-medium border-2 border-orange-500 hover:bg-orange-500"
              >
                <span className="text-lg">+</span>
                Regel hinzufügen
              </button>
            </div>
            <div className="space-y-4">
              {capacityRules.map((rule) => (
                <div
                  key={rule.id}
                  className="rounded-2xl p-4 transition-all duration-300 hover:opacity-80"
                  style={{ backgroundColor: '#242424', borderLeft: '4px solid #666666', borderWidth: '1px', borderColor: '#666666' }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div className="font-semibold text-orange-500" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                      {(typeof rule.days === 'string' ? JSON.parse(rule.days) : rule.days).map((day: string) => dayNamesForDisplay[day as keyof typeof dayNamesForDisplay]).join(', ')}
                    </div>
                    <div className="text-white text-sm" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                      {formatTimeHHMM(rule.start_time)} - {formatTimeHHMM(rule.end_time)}
                    </div>
                    <div className="font-semibold text-gray-300" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                      {rule.capacity} Personen
                    </div>
                    <div className="text-gray-300 text-sm" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                      Alle {rule.interval_minutes}min
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editCapacityRule(rule.id)}
                        className="text-gray-300 hover:text-orange-500 transition-all duration-300 p-2 rounded-xl hover:bg-gray-600 hover:shadow-lg hover:-translate-y-0.5"
                        title="Bearbeiten"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteCapacityRule(rule.id)}
                        className="text-gray-300 hover:text-red-500 transition-all duration-300 p-2 rounded-xl hover:bg-gray-600 hover:shadow-lg hover:-translate-y-0.5"
                        title="Löschen"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

                 {/* Exceptions Section */}
                 <div className="rounded-2xl p-6" style={{ backgroundColor: '#1A1A1A', borderWidth: '1px', borderColor: '#242424' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Geschlossene Tage</h2>
              <button
                onClick={openAddExceptionModal}
                className="text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 font-medium border-2 border-red-500 hover:bg-red-500"
              >
                <span className="text-lg">+</span>
                Ausnahme hinzufügen
              </button>
            </div>
            <div className="space-y-4">
              {exceptions.map((exception) => (
                <div
                  key={exception.id}
                  className="rounded-2xl p-4 transition-all duration-300 hover:opacity-80"
                  style={{ backgroundColor: '#242424', borderLeft: '4px solid #666666', borderWidth: '1px', borderColor: '#666666' }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-orange-500" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                        {formatDate(exception.date)}
                      </div>
                      <div className="text-gray-300 font-medium" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                        Geschlossen
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteException(exception.id)}
                        className="text-gray-300 hover:text-red-500 transition-all duration-300 p-2 rounded-xl hover:bg-gray-600 hover:shadow-lg hover:-translate-y-0.5"
                        title="Löschen"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Capacity Rule Modal */}
        {showAddCapacityModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                 <div className="rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" style={{ backgroundColor: '#242424', borderWidth: '1px', borderColor: '#666666' }}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                    {editingRuleId ? 'Kapazitäts-Regel bearbeiten' : 'Kapazitäts-Regel hinzufügen'}
                  </h3>
                  <button
                    onClick={() => setShowAddCapacityModal(false)}
                    className="text-gray-300 hover:text-orange-500 text-3xl transition-colors duration-300 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Days Selection */}
                  <div>
                    <label className="block text-sm text-white mb-3 font-medium">Wochentage</label>
                    <div className="grid grid-cols-7 gap-3">
                      {Object.entries(dayNames).map(([key, name]) => (
                        <label
                          key={key}
                          className="flex items-center justify-center p-4 border-2 border-gray-500 rounded-xl cursor-pointer transition-all duration-300 hover:border-orange-500 hover:bg-orange-600 hover:bg-opacity-20 hover:shadow-lg hover:-translate-y-0.5"
                          style={{ backgroundColor: '#1A1A1A' }}
                        >
                          <input
                            type="checkbox"
                            value={key}
                            checked={Array.isArray(newCapacityRule.days) ? newCapacityRule.days.includes(key) : false}
                            onChange={(e) => {
                              const currentDays = Array.isArray(newCapacityRule.days) ? newCapacityRule.days : []
                              if (e.target.checked) {
                                setNewCapacityRule({ ...newCapacityRule, days: [...currentDays, key] })
                              } else {
                                setNewCapacityRule({ ...newCapacityRule, days: currentDays.filter(d => d !== key) })
                              }
                            }}
                            className="mr-2 accent-orange-500"
                          />
                          <span className="text-white text-sm font-medium">{name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Time Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white mb-2 font-medium">Von</label>
                      <input
                        type="time"
                        value={newCapacityRule.startTime || '17:30'}
                        onChange={(e) => setNewCapacityRule({ ...newCapacityRule, startTime: e.target.value })}
                        className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                        style={{ backgroundColor: '#242424' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white mb-2 font-medium">Bis</label>
                      <input
                        type="time"
                        value={newCapacityRule.endTime || '22:00'}
                        onChange={(e) => setNewCapacityRule({ ...newCapacityRule, endTime: e.target.value })}
                        className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                        style={{ backgroundColor: '#242424' }}
                      />
                    </div>
                  </div>

                  {/* Capacity and Interval */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white mb-2 font-medium">Kapazität (Personen)</label>
                      <input
                        type="number"
                        placeholder="120"
                        value={newCapacityRule.capacity || 120}
                        onChange={(e) => setNewCapacityRule({ ...newCapacityRule, capacity: parseInt(e.target.value) || 120 })}
                        min="1"
                        max="1000"
                        className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                        style={{ backgroundColor: '#242424' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white mb-2 font-medium">Intervall (Minuten)</label>
                      <select
                        value={newCapacityRule.interval || 30}
                        onChange={(e) => setNewCapacityRule({ ...newCapacityRule, interval: parseInt(e.target.value) || 30 })}
                        className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                        style={{ backgroundColor: '#242424' }}
                      >
                        <option value="15">15 Minuten</option>
                        <option value="30">30 Minuten</option>
                        <option value="45">45 Minuten</option>
                        <option value="60">60 Minuten</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-600">
                  <button
                    onClick={() => setShowAddCapacityModal(false)}
                    className="px-6 py-3 border border-gray-500 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                    style={{ backgroundColor: '#242424', fontSize: '16px', fontWeight: '300' }}
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={addCapacityRule}
                    className="px-6 py-3 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                    style={{ backgroundColor: '#FF6B00', fontSize: '16px', fontWeight: '600' }}
                  >
                    {editingRuleId ? 'Speichern' : 'Hinzufügen'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Exception Modal */}
        {showAddExceptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                 <div className="rounded-2xl max-w-md w-full shadow-2xl" style={{ backgroundColor: '#2D2D2D', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)' }}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white font-serif">Geschlossenen Tag hinzufügen</h3>
                  <button
                    onClick={() => setShowAddExceptionModal(false)}
                    className="text-gray-300 hover:text-orange-500 text-3xl transition-colors duration-300 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-white mb-2 font-medium">Datum</label>
                    <input
                      type="date"
                      value={newException.date || ''}
                      onChange={(e) => setNewException({ ...newException, date: e.target.value })}
                      className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                      style={{ backgroundColor: '#242424' }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-600">
                  <button
                    onClick={() => setShowAddExceptionModal(false)}
                    className="px-6 py-3 border border-gray-500 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                    style={{ backgroundColor: '#242424', fontSize: '16px', fontWeight: '300' }}
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={addException}
                    className="px-6 py-3 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                    style={{ backgroundColor: '#FF6B00', fontSize: '16px', fontWeight: '600' }}
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
