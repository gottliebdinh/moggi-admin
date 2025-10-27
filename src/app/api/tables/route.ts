import { NextRequest, NextResponse } from 'next/server'
import { tables } from '@/lib/supabase-database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')

    if (roomId) {
      const roomTables = await tables.getByRoomId(roomId)
      return NextResponse.json(roomTables)
    } else {
      const allTables = await tables.getAll()
      return NextResponse.json(allTables)
    }
  } catch (error) {
    console.error('Error fetching tables:', error)
    return NextResponse.json({ error: 'Fehler beim Laden der Tische' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { roomId, name, capacity } = await request.json()
    if (!roomId || !name || !capacity) {
      return NextResponse.json({ error: 'Raum-ID, Name und Kapazität sind erforderlich' }, { status: 400 })
    }
    const newTableId = await tables.create(roomId, name, capacity)
    const newTable = { id: newTableId, room_id: roomId, name, capacity }
    return NextResponse.json(newTable, { status: 201 })
  } catch (error) {
    console.error('Error creating table:', error)
    return NextResponse.json({ error: 'Fehler beim Erstellen des Tisches' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, capacity } = await request.json()
    if (!id || !name || !capacity) {
      return NextResponse.json({ error: 'ID, Name und Kapazität sind erforderlich' }, { status: 400 })
    }
    await tables.update(id, name, capacity)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating table:', error)
    return NextResponse.json({ error: 'Fehler beim Aktualisieren des Tisches' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID ist erforderlich' }, { status: 400 })
    }
    await tables.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting table:', error)
    return NextResponse.json({ error: 'Fehler beim Löschen des Tisches' }, { status: 500 })
  }
}
