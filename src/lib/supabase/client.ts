import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // TEMPORARY: Hardcoded for debugging Cloudflare deployment
  const supabaseUrl = 'https://kcrmwtjqjcqpqacukxxu.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjcm13dGpxamNxcHFhY3VreHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDk4NTQsImV4cCI6MjA4MzcyNTg1NH0.ftSkO8yg6LN1Zkhs3b9NnneS-CN2YHvsZi1ZjDHngzA'

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
