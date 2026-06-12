import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  // Non-fatal: app still loads so the UI/screens can be developed,
  // but every query will fail until .env.local is filled.
  console.error(
    '[Marathonazza] Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local',
  )
}

export const supabase = createClient(url ?? '', key ?? '', {
  realtime: { params: { eventsPerSecond: 10 } },
})
