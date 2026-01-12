import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // TEMPORARY: Hardcoded for debugging Cloudflare deployment
  const supabaseUrl = 'https://kcrmwtjqjcqpqacukxxu.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjcm13dGpxamNxcHFhY3VreHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDk4NTQsImV4cCI6MjA4MzcyNTg1NH0.ftSkO8yg6LN1Zkhs3b9NnneS-CN2YHvsZi1ZjDHngzA'
  
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
