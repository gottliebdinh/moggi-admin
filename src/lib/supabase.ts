import { createClient } from '@supabase/supabase-js'

// Verwende die gleichen Supabase-Credentials wie in der App
const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin-spezifische Funktionen (mit Service Role Key für Admin-Rechte)
export const adminSupabase = createClient(
  supabaseUrl,
  'your-service-role-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
