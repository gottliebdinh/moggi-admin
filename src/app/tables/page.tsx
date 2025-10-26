'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'

interface Table {
  id: number
  name: string
  capacity: number
}

interface Room {
  id: number
  name: string
  description: string
  tables: Table[]
}

export default function TablesDashboard() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [showAddRoomModal, setShowAddRoomModal] = useState(false)
  const [showAddTableModal, setShowAddTableModal] = useState(false)

  // Dummy data based on tischplan-settings.html
  useEffect(() => {
    const dummyRooms: Room[] = [
      {
        id: 1,
        name: 'Galerie',
        description: 'Oberer Bereich des Restaurants',
        tables: [
          { id: 61, name: '61 Galerie oben', capacity: 2 },
          { id: 51, name: '51 Galerie oben', capacity: 2 },
          { id: 58, name: '58 Galerie oben', capacity: 2 },
          { id: 60, name: '60 Galerie oben', capacity: 2 },
          { id: 50, name: '50 Galerie oben', capacity: 3 },
          { id: 62, name: '62 Galerie oben', capacity: 3 },
          { id: 57, name: '57 Galerie oben', capacity: 4 },
          { id: 53, name: '53 Galerie oben', capacity: 4 },
          { id: 54, name: '54 Galerie oben', capacity: 4 },
          { id: 55, name: '55 Galerie oben', capacity: 4 },
          { id: 56, name: '56 Galerie oben', capacity: 4 },
          { id: 59, name: '59 Galerie oben', capacity: 4 }
        ]
      },
      {
        id: 2,
        name: 'Unten',
        description: 'Unterer Bereich des Restaurants',
        tables: [
          { id: 1, name: '1 Tisch', capacity: 2 },
          { id: 7, name: '7 Tisch', capacity: 2 },
          { id: 26, name: '26 Tisch', capacity: 2 },
          { id: 27, name: '27 Tisch', capacity: 2 },
          { id: 23, name: '23 Tisch', capacity: 2 },
          { id: 22, name: '22 Tisch', capacity: 2 },
          { id: 25, name: '25 Tisch', capacity: 2 },
          { id: 18, name: '18 Tisch', capacity: 2 },
          { id: 19, name: '19 Tisch', capacity: 2 },
          { id: 28, name: '28 Tisch', capacity: 2 },
          { id: 24, name: '24 Tisch', capacity: 2 },
          { id: 30, name: '30 Tisch', capacity: 3 },
          { id: 31, name: '31 Tisch', capacity: 3 },
          { id: 17, name: '17 Tisch', capacity: 4 },
          { id: 2, name: '2 Tisch', capacity: 4 },
          { id: 3, name: '3 Tisch', capacity: 4 },
          { id: 4, name: '4 Tisch', capacity: 4 },
          { id: 5, name: '5 Tisch', capacity: 4 },
          { id: 6, name: '6 Tisch', capacity: 4 },
          { id: 20, name: '20 Tisch', capacity: 6 },
          { id: 21, name: '21 Tisch', capacity: 6 }
        ]
      }
    ]

    setRooms(dummyRooms)
    setSelectedRoomId(1) // Select first room by default
  }, [])

  const addRoom = () => {
    // In real app, this would save to Supabase
    console.log('Adding room...')
    setShowAddRoomModal(false)
  }

  const addTable = () => {
    // In real app, this would save to Supabase
    console.log('Adding table...')
    setShowAddTableModal(false)
  }

  const editRoom = (roomId: number) => {
    const room = rooms.find(r => r.id === roomId)
    if (!room) return

    const newName = prompt('Neuer Raumname:', room.name)
    if (newName && newName.trim()) {
      setRooms(prev => prev.map(r => 
        r.id === roomId ? { ...r, name: newName.trim() } : r
      ))
    }
  }

  const editTable = (tableId: number) => {
    const room = rooms.find(r => r.id === selectedRoomId)
    if (!room) return

    const table = room.tables.find(t => t.id === tableId)
    if (!table) return

    const newName = prompt('Neuer Tischname:', table.name)
    if (newName && newName.trim()) {
      setRooms(prev => prev.map(r => 
        r.id === selectedRoomId 
          ? { ...r, tables: r.tables.map(t => 
              t.id === tableId ? { ...t, name: newName.trim() } : t
            )}
          : r
      ))
    }
  }

  const deleteRoom = (roomId: number) => {
    if (confirm('Möchten Sie diesen Raum wirklich löschen? Alle Tische werden ebenfalls gelöscht.')) {
      setRooms(prev => prev.filter(r => r.id !== roomId))
      if (selectedRoomId === roomId) {
        setSelectedRoomId(null)
      }
    }
  }

  const currentRoom = rooms.find(room => room.id === selectedRoomId)

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rooms Section */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: '#1A1A1A', borderWidth: '1px', borderColor: '#242424' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Räume</h2>
              <button
                onClick={() => setShowAddRoomModal(true)}
                className="text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 font-medium border-2 border-orange-500 hover:bg-orange-500"
              >
                <span className="text-lg">+</span>
                Raum hinzufügen
              </button>
            </div>
            <div className="space-y-3">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={`rounded-2xl p-4 transition-all duration-300 cursor-pointer hover:opacity-80 ${
                    selectedRoomId === room.id
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: selectedRoomId === room.id ? '#FF6B00' : '#242424',
                    borderWidth: '1px',
                    borderColor: '#666666'
                  }}
                  onClick={() => setSelectedRoomId(room.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>{room.name}</h3>
                      <p className="text-sm opacity-80" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
                        {room.tables.length} Tische • {room.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          editRoom(room.id)
                        }}
                        className="text-gray-300 hover:text-orange-500 transition-all duration-300 p-2 rounded-xl hover:bg-gray-600 hover:shadow-lg hover:-translate-y-0.5"
                        title="Bearbeiten"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteRoom(room.id)
                        }}
                        className="text-gray-300 hover:text-red-500 transition-all duration-300 p-2 rounded-xl hover:bg-gray-600 hover:shadow-lg hover:-translate-y-0.5"
                        title="Löschen"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tables Section */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: '#1A1A1A', borderWidth: '1px', borderColor: '#242424' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Tische</h2>
              <button
                onClick={() => setShowAddTableModal(true)}
                disabled={!selectedRoomId}
                className={`px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 font-medium ${
                  selectedRoomId
                    ? 'text-white border-2 border-orange-500 hover:bg-orange-500'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed border-2 border-gray-500'
                }`}
              >
                <span className="text-lg">+</span>
                Tisch hinzufügen
              </button>
            </div>
            
            {!selectedRoomId ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Wählen Sie einen Raum aus</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {currentRoom?.tables.map((table) => (
                  <div
                    key={table.id}
                    className="rounded-2xl p-4 text-center transition-all duration-300 cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: '#242424', borderWidth: '1px', borderColor: '#666666' }}
                    onClick={() => editTable(table.id)}
                  >
                    <div className="text-white font-semibold mb-2" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>{table.name}</div>
                    <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm mx-auto font-bold" style={{ backgroundColor: '#FF6B00' }}>
                      {table.capacity}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Room Modal */}
        {showAddRoomModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="rounded-2xl max-w-md w-full" style={{ backgroundColor: '#242424', borderWidth: '1px', borderColor: '#666666' }}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Raum hinzufügen</h3>
                  <button
                    onClick={() => setShowAddRoomModal(false)}
                    className="text-gray-300 hover:text-orange-500 text-3xl transition-colors duration-300 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white mb-2 font-medium">Raumname</label>
                    <input
                      type="text"
                      placeholder="z.B. Hauptraum, Terrasse, VIP-Bereich"
                      className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                      style={{ backgroundColor: '#242424' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white mb-2 font-medium">Beschreibung (optional)</label>
                    <input
                      type="text"
                      placeholder="Kurze Beschreibung des Raums"
                      className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                      style={{ backgroundColor: '#242424' }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-600">
                  <button
                    onClick={() => setShowAddRoomModal(false)}
                    className="px-6 py-3 border border-gray-500 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                    style={{ backgroundColor: '#242424', fontSize: '16px', fontWeight: '300' }}
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={addRoom}
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

        {/* Add Table Modal */}
        {showAddTableModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="rounded-2xl max-w-md w-full shadow-2xl" style={{ backgroundColor: '#2D2D2D', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)' }}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white font-serif">Tisch hinzufügen</h3>
                  <button
                    onClick={() => setShowAddTableModal(false)}
                    className="text-gray-300 hover:text-orange-500 text-3xl transition-colors duration-300 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white mb-2 font-medium">Tischname</label>
                    <input
                      type="text"
                      placeholder="z.B. Tisch 1, Fensterplatz A"
                      className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                      style={{ backgroundColor: '#242424' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white mb-2 font-medium">Kapazität (Personen)</label>
                    <input
                      type="number"
                      placeholder="2"
                      min="1"
                      max="20"
                      className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                      style={{ backgroundColor: '#242424' }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-600">
                  <button
                    onClick={() => setShowAddTableModal(false)}
                    className="px-6 py-3 border border-gray-500 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                    style={{ backgroundColor: '#242424', fontSize: '16px', fontWeight: '300' }}
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={addTable}
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