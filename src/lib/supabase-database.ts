import { adminSupabase, isSupabaseConfigured } from './supabase'

// Prüfe ob Supabase korrekt konfiguriert ist
if (!isSupabaseConfigured()) {
  console.warn('⚠️ Supabase ist nicht korrekt konfiguriert. Verwende Fallback-Daten.')
}

// Types für Supabase-Tabellen
export interface Room {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Table {
  id: string
  room_id: string
  name: string
  capacity: number
  created_at: string
}

export interface Reservation {
  id: string
  date: string
  time: string
  guest_name: string
  guests: number
  tables: string | null
  note: string | null
  comment: string | null
  status: string
  duration: number
  phone: string | null
  email: string | null
  source: string
  type: string
  created_at: string
}

export interface CapacityRule {
  id: string
  days: string
  start_time: string
  end_time: string
  capacity: number
  interval_minutes: number
  created_at: string
}

export interface Exception {
  id: string
  date: string
  created_at: string
}

// Rooms CRUD Operations
export const rooms = {
  getAll: async (): Promise<Room[]> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase nicht konfiguriert - verwende Fallback-Daten für Räume')
      return []
    }
    
    try {
      const { data, error } = await adminSupabase
        .from('rooms')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching rooms:', error)
      return []
    }
  },

  create: async (name: string, description: string): Promise<string> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nicht konfiguriert - kann keine Räume erstellen')
    }
    
    const { data, error } = await adminSupabase
      .from('rooms')
      .insert({ name, description })
      .select('id')
      .single()
    
    if (error) throw error
    return data.id
  },

  update: async (id: string, name: string, description: string): Promise<void> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nicht konfiguriert - kann keine Räume aktualisieren')
    }
    
    const { error } = await adminSupabase
      .from('rooms')
      .update({ name, description })
      .eq('id', id)
    
    if (error) throw error
  },

  delete: async (id: string): Promise<void> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nicht konfiguriert - kann keine Räume löschen')
    }
    
    const { error } = await adminSupabase
      .from('rooms')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Tables CRUD Operations
export const tables = {
  getAll: async (): Promise<Table[]> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase nicht konfiguriert - verwende Fallback-Daten für Tische')
      return []
    }
    
    try {
      const { data, error } = await adminSupabase
        .from('tables')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching tables:', error)
      return []
    }
  },

  getByRoomId: async (roomId: string): Promise<Table[]> => {
    if (!isSupabaseConfigured()) {
      return []
    }
    
    try {
      const { data, error } = await adminSupabase
        .from('tables')
        .select('*')
        .eq('room_id', roomId)
        .order('name')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching tables by room:', error)
      return []
    }
  },

  create: async (roomId: string, name: string, capacity: number): Promise<string> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nicht konfiguriert - kann keine Tische erstellen')
    }
    
    const { data, error } = await adminSupabase
      .from('tables')
      .insert({ room_id: roomId, name, capacity })
      .select('id')
      .single()
    
    if (error) throw error
    return data.id
  },

  update: async (id: string, name: string, capacity: number): Promise<void> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nicht konfiguriert - kann keine Tische aktualisieren')
    }
    
    const { error } = await adminSupabase
      .from('tables')
      .update({ name, capacity })
      .eq('id', id)
    
    if (error) throw error
  },

  delete: async (id: string): Promise<void> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nicht konfiguriert - kann keine Tische löschen')
    }
    
    const { error } = await adminSupabase
      .from('tables')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Reservations CRUD Operations
export const reservations = {
  getAll: async (): Promise<Reservation[]> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase nicht konfiguriert - verwende Fallback-Daten für Reservierungen')
      return []
    }
    
    try {
      const { data, error } = await adminSupabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching reservations:', error)
      return []
    }
  },

  getByDate: async (date: string): Promise<Reservation[]> => {
    if (!isSupabaseConfigured()) {
      return []
    }
    
    try {
      const { data, error } = await adminSupabase
        .from('reservations')
        .select('*')
        .eq('date', date)
        .order('time', { ascending: true })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching reservations by date:', error)
      return []
    }
  },

  getById: async (id: string): Promise<Reservation | null> => {
    if (!isSupabaseConfigured()) {
      return null
    }
    
    try {
      const { data, error } = await adminSupabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching reservation by id:', error)
      return null
    }
  },

  create: async (data: Omit<Reservation, 'id' | 'created_at'>): Promise<string> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase nicht konfiguriert - verwende temporäre ID für Reservierung')
      // Generiere eine temporäre UUID-ähnliche ID
      return 'temp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    }
    
    const { data: result, error } = await adminSupabase
      .from('reservations')
      .insert(data)
      .select('id')
      .single()
    
    if (error) throw error
    return result.id
  },

  update: async (id: string, data: Partial<Reservation>): Promise<void> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nicht konfiguriert - kann keine Reservierungen aktualisieren')
    }
    
    const { error } = await adminSupabase
      .from('reservations')
      .update(data)
      .eq('id', id)
    
    if (error) throw error
  },

  delete: async (id: string): Promise<void> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nicht konfiguriert - kann keine Reservierungen löschen')
    }
    
    const { error } = await adminSupabase
      .from('reservations')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Capacity Rules CRUD Operations
export const capacityRules = {
  getAll: async (): Promise<CapacityRule[]> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase nicht konfiguriert - verwende Fallback-Daten für Kapazitätsregeln')
      return []
    }
    
    try {
      const { data, error } = await adminSupabase
        .from('capacity_rules')
        .select('*')
        .order('start_time')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching capacity rules:', error)
      return []
    }
  },

  create: async (data: Omit<CapacityRule, 'id' | 'created_at'>): Promise<string> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nicht konfiguriert - kann keine Kapazitätsregeln erstellen')
    }
    
    const { data: result, error } = await adminSupabase
      .from('capacity_rules')
      .insert(data)
      .select('id')
      .single()
    
    if (error) throw error
    return result.id
  },

  update: async (id: string, data: Partial<CapacityRule>): Promise<void> => {
    const { error } = await adminSupabase
      .from('capacity_rules')
      .update(data)
      .eq('id', id)
    
    if (error) throw error
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await adminSupabase
      .from('capacity_rules')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Exceptions CRUD Operations
export const exceptions = {
  getAll: async (): Promise<Exception[]> => {
    const { data, error } = await adminSupabase
      .from('exceptions')
      .select('*')
      .order('date')
    
    if (error) throw error
    return data || []
  },

  create: async (date: string): Promise<string> => {
    const { data, error } = await adminSupabase
      .from('exceptions')
      .insert({ date })
      .select('id')
      .single()
    
    if (error) throw error
    return data.id
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await adminSupabase
      .from('exceptions')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
