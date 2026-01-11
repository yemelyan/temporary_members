import { createBrowserClient } from '@supabase/ssr'
import { getEnv } from '@/lib/env'

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getEnv()

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file.\n' +
        'Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
