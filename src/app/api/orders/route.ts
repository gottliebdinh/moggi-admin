import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json([])
    }

    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    
    // Get start and end of the selected date in UTC
    const startDate = new Date(`${date}T00:00:00`)
    const endDate = new Date(`${date}T23:59:59.999`)

    console.log('Fetching orders for date:', date)
    console.log('Date range:', {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    })

    const { data, error } = await adminSupabase
      .from('orders')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false })

    console.log('Orders found:', data?.length || 0)

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { id, status } = await request.json()
    
    const { error } = await adminSupabase
      .from('orders')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Error updating order:', error)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

