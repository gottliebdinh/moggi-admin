import { NextRequest, NextResponse } from 'next/server'
import { capacityRules, exceptions } from '@/lib/supabase-database'

// Kapazitätsregeln
export async function GET() {
  try {
    const rules = await capacityRules.getAll()
    const exceptionList = await exceptions.getAll()
    return NextResponse.json({ rules, exceptions: exceptionList })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Fehler beim Laden der Einstellungen' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()
    
    if (type === 'capacity_rule') {
      const { days, startTime, endTime, capacity, interval } = data
      if (!days || !startTime || !endTime || !capacity || !interval) {
        return NextResponse.json({ error: 'Alle Felder sind erforderlich' }, { status: 400 })
      }
      const id = await capacityRules.create({ 
        days: JSON.stringify(days), 
        start_time: startTime, 
        end_time: endTime, 
        capacity, 
        interval_minutes: interval 
      })
      return NextResponse.json({ id, ...data })
    } else if (type === 'exception') {
      const { date } = data
      if (!date) {
        return NextResponse.json({ error: 'Datum ist erforderlich' }, { status: 400 })
      }
      const id = await exceptions.create(date)
      return NextResponse.json({ id, date })
    }
    
    return NextResponse.json({ error: 'Ungültiger Typ' }, { status: 400 })
  } catch (error) {
    console.error('Error creating setting:', error)
    return NextResponse.json({ error: 'Fehler beim Erstellen' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { type, id, data } = await request.json()
    
    if (type === 'capacity_rule') {
      if (!id || !data) {
        return NextResponse.json({ error: 'ID und Daten sind erforderlich' }, { status: 400 })
      }
      const { days, startTime, endTime, capacity, interval } = data
      await capacityRules.update(id, {
        days: JSON.stringify(days),
        start_time: startTime,
        end_time: endTime,
        capacity,
        interval_minutes: interval
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating setting:', error)
    return NextResponse.json({ error: 'Fehler beim Aktualisieren' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID ist erforderlich' }, { status: 400 })
    }
    
    if (type === 'capacity_rule') {
      await capacityRules.delete(id)
    } else if (type === 'exception') {
      await exceptions.delete(id)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting setting:', error)
    return NextResponse.json({ error: 'Fehler beim Löschen' }, { status: 500 })
  }
}
