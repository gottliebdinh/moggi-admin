import { NextRequest, NextResponse } from 'next/server'
import { reservations } from '@/lib/supabase-database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    if (date) {
      const data = await reservations.getByDate(date)
      return NextResponse.json(data)
    } else {
      const data = await reservations.getAll()
      return NextResponse.json(data)
    }
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json({ error: 'Fehler beim Laden der Reservierungen' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Transformiere Frontend-Daten zu Supabase-Format
    const supabaseData = {
      date: data.date,
      time: data.time,
      guest_name: data.guestName || data.guest_name,
      guests: data.guests,
      tables: data.tables,
      note: data.note,
      comment: data.comment,
      status: data.status || 'placed',
      duration: data.duration || 120,
      phone: data.phone,
      email: data.email,
      source: data.source || 'manual',
      type: data.type || 'Abendessen'
    }
    
    const id = await reservations.create(supabaseData)
    
    // Lade die erstellte Reservierung mit allen Feldern
    const createdReservation = await reservations.getById(id)
    return NextResponse.json(createdReservation, { status: 201 })
  } catch (error) {
    console.error('Error creating reservation:', error)
    return NextResponse.json({ error: 'Fehler beim Erstellen der Reservierung' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()
    
    // Transformiere Frontend-Daten zu Supabase-Format
    const supabaseData = {
      date: data.date,
      time: data.time,
      guest_name: data.guestName || data.guest_name, // Input: "Vorname Nachname"
      guests: data.guests,
      tables: data.tables,
      note: data.note,
      comment: data.comment,
      status: data.status || 'placed',
      duration: data.duration || 120,
      phone: data.phone,
      email: data.email,
      source: data.source || 'manual',
      type: data.type || 'Abendessen'
    }
    
    await reservations.update(id, supabaseData)
    
    // Lade die aktualisierte Reservierung mit allen Feldern
    const updatedReservation = await reservations.getById(id)
    return NextResponse.json(updatedReservation)
  } catch (error) {
    console.error('Error updating reservation:', error)
    return NextResponse.json({ error: 'Fehler beim Aktualisieren der Reservierung' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID ist erforderlich' }, { status: 400 })
    }
    await reservations.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting reservation:', error)
    return NextResponse.json({ error: 'Fehler beim Löschen der Reservierung' }, { status: 500 })
  }
}
