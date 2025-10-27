import { NextRequest, NextResponse } from 'next/server'
import { rooms, tables } from '@/lib/supabase-database'

// Räume API
export async function GET() {
  try {
    const allRooms = await rooms.getAll()
    
    // Für jeden Raum die Tische laden
    const roomsWithTables = await Promise.all(
      allRooms.map(async (room) => {
        const roomTables = await tables.getByRoomId(room.id)
        return {
          ...room,
          tables: roomTables
        }
      })
    )
    
    return NextResponse.json(roomsWithTables)
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json({ error: 'Fehler beim Laden der Räume' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json()
    if (!name) {
      return NextResponse.json({ error: 'Name ist erforderlich' }, { status: 400 })
    }
    const newRoomId = await rooms.create(name, description)
    const newRoom = { id: newRoomId, name, description, tables: [] }
    return NextResponse.json(newRoom, { status: 201 })
  } catch (error) {
    console.error('Error creating room:', error)
    return NextResponse.json({ error: 'Fehler beim Erstellen des Raums' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description } = await request.json()
    if (!id || !name) {
      return NextResponse.json({ error: 'ID und Name sind erforderlich' }, { status: 400 })
    }
    await rooms.update(id, name, description)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating room:', error)
    return NextResponse.json({ error: 'Fehler beim Aktualisieren des Raums' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID ist erforderlich' }, { status: 400 })
    }
    await rooms.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting room:', error)
    return NextResponse.json({ error: 'Fehler beim Löschen des Raums' }, { status: 500 })
  }
}
