import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { type CookieOptions } from '@supabase/ssr'

export function createClient(request: NextRequest) {
  // TEMPORARY: Hardcoded for debugging Cloudflare deployment
  const supabaseUrl = 'https://kcrmwtjqjcqpqacukxxu.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjcm13dGpxamNxcHFhY3VreHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDk4NTQsImV4cCI6MjA4MzcyNTg1NH0.ftSkO8yg6LN1Zkhs3b9NnneS-CN2YHvsZi1ZjDHngzA'

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  return { supabase, response }
}
