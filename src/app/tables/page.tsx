'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Edit, Trash2, X } from 'lucide-react'

interface Table {
  id: string
  room_id: string
  name: string
  capacity: number
}

interface Room {
  id: string
  name: string
  description: string | null
  tables: Table[]
}

export default function TablesDashboard() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [showAddRoomModal, setShowAddRoomModal] = useState(false)
  const [showAddTableModal, setShowAddTableModal] = useState(false)
  const [showEditRoomModal, setShowEditRoomModal] = useState(false)
  const [showEditTableModal, setShowEditTableModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  
  // Form states for adding new items
  const [newRoom, setNewRoom] = useState({ name: '', description: '' })
  const [newTable, setNewTable] = useState({ name: '', capacity: 2 })

  // Lade Räume aus der Datenbank
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetch('/api/rooms')
        const data = await response.json()
        setRooms(data)
        if (data.length > 0) {
          setSelectedRoomId(data[0].id)
        }
      } catch (error) {
        console.error('Fehler beim Laden der Räume:', error)
        // Fallback zu Dummy-Daten
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
              { id: 2, name: '2 Tisch', capacity: 4 },
              { id: 3, name: '3 Tisch', capacity: 4 },
              { id: 4, name: '4 Tisch', capacity: 6 },
              { id: 5, name: '5 Tisch', capacity: 2 }
            ]
          }
        ]
        setRooms(dummyRooms)
        setSelectedRoomId(1)
      }
    }
    
    loadRooms()
  }, [])

  const addRoom = async () => {
    if (!newRoom.name.trim()) {
      alert('Bitte geben Sie einen Raumnamen ein.')
      return
    }
    
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRoom.name.trim(),
          description: newRoom.description.trim()
        })
      })
      
      if (response.ok) {
        const newRoomData = await response.json()
        setRooms(prev => [...prev, { ...newRoomData, tables: [] }])
        setNewRoom({ name: '', description: '' })
        setShowAddRoomModal(false)
      } else {
        alert('Fehler beim Erstellen des Raums')
      }
    } catch (error) {
      console.error('Fehler:', error)
      alert('Fehler beim Erstellen des Raums')
    }
  }

  const addTable = async () => {
    if (!selectedRoomId) {
      alert('Bitte wählen Sie zuerst einen Raum aus.')
      return
    }
    
    if (!newTable.name.trim()) {
      alert('Bitte geben Sie einen Tischnamen ein.')
      return
    }
    
    try {
      const response = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoomId,
          name: newTable.name.trim(),
          capacity: newTable.capacity
        })
      })
      
      if (response.ok) {
        const newTableData = await response.json()
        setRooms(prev => prev.map(r => 
          r.id === selectedRoomId 
            ? { ...r, tables: [...r.tables, newTableData] }
            : r
        ))
        setNewTable({ name: '', capacity: 2 })
        setShowAddTableModal(false)
      } else {
        alert('Fehler beim Erstellen des Tisches')
      }
    } catch (error) {
      console.error('Fehler:', error)
      alert('Fehler beim Erstellen des Tisches')
    }
  }

  const editRoom = (roomId: number) => {
    const room = rooms.find(r => r.id === roomId)
    if (!room) return
    
    setEditingRoom(room)
    setShowEditRoomModal(true)
  }

  const editTable = (tableId: number) => {
    const room = rooms.find(r => r.id === selectedRoomId)
    if (!room) return

    const table = room.tables.find(t => t.id === tableId)
    if (!table) return
    
    setEditingTable(table)
    setShowEditTableModal(true)
  }

  const updateRoom = () => {
    if (!editingRoom) return
    
    setRooms(prev => prev.map(r => 
      r.id === editingRoom.id ? editingRoom : r
    ))
    setShowEditRoomModal(false)
    setEditingRoom(null)
  }

  const updateTable = () => {
    if (!editingTable || !selectedRoomId) return
    
    setRooms(prev => prev.map(r => 
      r.id === selectedRoomId 
        ? { ...r, tables: r.tables.map(t => 
            t.id === editingTable.id ? editingTable : t
          )}
        : r
    ))
    setShowEditTableModal(false)
    setEditingTable(null)
  }

  const deleteRoom = async (roomId: string) => {
    if (confirm('Möchten Sie diesen Raum wirklich löschen? Alle Tische werden ebenfalls gelöscht.')) {
      try {
        const response = await fetch(`/api/rooms?id=${roomId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          // Lade Räume neu nach dem Löschen
          const updatedResponse = await fetch('/api/rooms')
          const updatedRooms = await updatedResponse.json()
          setRooms(updatedRooms)
          
          if (selectedRoomId === roomId) {
            setSelectedRoomId(null)
          }
        } else {
          alert('Fehler beim Löschen des Raums')
        }
      } catch (error) {
        console.error('Error deleting room:', error)
        alert('Fehler beim Löschen des Raums')
      }
    }
  }

  const deleteTable = async (tableId: string) => {
    if (!selectedRoomId) return
    
    if (confirm('Möchten Sie diesen Tisch wirklich löschen?')) {
      try {
        const response = await fetch(`/api/tables?id=${tableId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          // Lade Räume neu nach dem Löschen
          const updatedResponse = await fetch('/api/rooms')
          const updatedRooms = await updatedResponse.json()
          setRooms(updatedRooms)
        } else {
          alert('Fehler beim Löschen des Tisches')
        }
      } catch (error) {
        console.error('Error deleting table:', error)
        alert('Fehler beim Löschen des Tisches')
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        editRoom(room.id)
                      }}
                      className="text-gray-300 hover:text-orange-500 transition-all duration-300 p-2 rounded-xl hover:bg-gray-600 hover:shadow-lg hover:-translate-y-0.5"
                      title="Bearbeiten"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
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
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white mb-2 font-medium">Raumname</label>
                    <input
                      type="text"
                      placeholder="z.B. Hauptraum, Terrasse, VIP-Bereich"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                      className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                      style={{ backgroundColor: '#242424' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white mb-2 font-medium">Beschreibung (optional)</label>
                    <input
                      type="text"
                      placeholder="Kurze Beschreibung des Raums"
                      value={newRoom.description}
                      onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
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
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white mb-2 font-medium">Tischname</label>
                    <input
                      type="text"
                      placeholder="z.B. Tisch 1, Fensterplatz A"
                      value={newTable.name}
                      onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
                      className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                      style={{ backgroundColor: '#242424' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white mb-2 font-medium">Kapazität (Personen)</label>
                    <input
                      type="number"
                      placeholder="2"
                      value={newTable.capacity}
                      onChange={(e) => setNewTable({ ...newTable, capacity: parseInt(e.target.value) || 2 })}
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

        {/* Edit Room Modal */}
        {showEditRoomModal && editingRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="rounded-2xl max-w-md w-full" style={{ backgroundColor: '#242424', borderWidth: '1px', borderColor: '#666666' }}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Raum bearbeiten</h3>
                  <button
                    onClick={() => setShowEditRoomModal(false)}
                    className="text-gray-300 hover:text-orange-500 text-3xl transition-colors duration-300 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white mb-2 font-medium">Raumname</label>
                    <input
                      type="text"
                      value={editingRoom.name}
                      onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                      className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                      style={{ backgroundColor: '#242424' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white mb-2 font-medium">Beschreibung</label>
                    <input
                      type="text"
                      value={editingRoom.description}
                      onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                      className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                      style={{ backgroundColor: '#242424' }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-6 pt-4" style={{ borderTop: '1px solid #242424' }}>
                  <button
                    onClick={() => {
                      if (confirm('Möchten Sie diesen Raum wirklich löschen? Alle Tische werden ebenfalls gelöscht.')) {
                        deleteRoom(editingRoom.id)
                        setShowEditRoomModal(false)
                        setEditingRoom(null)
                      }
                    }}
                    className="px-6 py-3 border border-red-500 text-red-500 rounded-xl transition-all duration-300 hover:bg-red-500 hover:text-white font-medium"
                    style={{ fontSize: '16px', fontWeight: '300' }}
                  >
                    Löschen
                  </button>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowEditRoomModal(false)}
                      className="px-6 py-3 border border-gray-500 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                      style={{ backgroundColor: '#242424', fontSize: '16px', fontWeight: '300' }}
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={updateRoom}
                      className="px-6 py-3 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                      style={{ backgroundColor: '#FF6B00', fontSize: '16px', fontWeight: '600' }}
                    >
                      Speichern
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Table Modal */}
        {showEditTableModal && editingTable && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="rounded-2xl max-w-md w-full" style={{ backgroundColor: '#242424', borderWidth: '1px', borderColor: '#666666' }}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Tisch bearbeiten</h3>
                  <button
                    onClick={() => setShowEditTableModal(false)}
                    className="text-gray-300 hover:text-orange-500 text-3xl transition-colors duration-300 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white mb-2 font-medium">Tischname</label>
                    <input
                      type="text"
                      value={editingTable.name}
                      onChange={(e) => setEditingTable({ ...editingTable, name: e.target.value })}
                      className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                      style={{ backgroundColor: '#242424' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white mb-2 font-medium">Kapazität (Personen)</label>
                    <input
                      type="number"
                      value={editingTable.capacity}
                      onChange={(e) => setEditingTable({ ...editingTable, capacity: parseInt(e.target.value) || 2 })}
                      min="1"
                      max="20"
                      className="w-full border border-gray-500 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                      style={{ backgroundColor: '#242424' }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-6 pt-4" style={{ borderTop: '1px solid #242424' }}>
                  <button
                    onClick={() => {
                      if (confirm('Möchten Sie diesen Tisch wirklich löschen?')) {
                        deleteTable(editingTable.id)
                        setShowEditTableModal(false)
                        setEditingTable(null)
                      }
                    }}
                    className="px-6 py-3 border border-red-500 text-red-500 rounded-xl transition-all duration-300 hover:bg-red-500 hover:text-white font-medium"
                    style={{ fontSize: '16px', fontWeight: '300' }}
                  >
                    Löschen
                  </button>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowEditTableModal(false)}
                      className="px-6 py-3 border border-gray-500 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                      style={{ backgroundColor: '#242424', fontSize: '16px', fontWeight: '300' }}
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={updateTable}
                      className="px-6 py-3 text-white rounded-xl transition-all duration-300 hover:opacity-80 font-medium"
                      style={{ backgroundColor: '#FF6B00', fontSize: '16px', fontWeight: '600' }}
                    >
                      Speichern
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}