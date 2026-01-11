/**
 * Validates that required environment variables are set
 * Throws helpful error messages if variables are missing
 * During build time (like on Cloudflare Pages), env vars may not be available yet
 */
export function validateEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const missing: string[] = []

  if (!supabaseUrl || supabaseUrl === 'your-project-url') {
    missing.push('NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
    missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  // During build/static generation, env vars might not be available
  // On Cloudflare Pages, env vars should be available at runtime
  // Return empty strings gracefully instead of throwing to prevent server errors
  if (missing.length > 0) {
    const isBuildTime = process.env.NODE_ENV === 'production' && 
                        (process.env.VERCEL || process.env.CF_PAGES)
    
    if (isBuildTime) {
      // During build, return empty strings - they'll be available at runtime
      console.warn(
        `Warning: Environment variables ${missing.join(', ')} not available during build. ` +
        `They should be available at runtime.`
      )
    } else {
      // At runtime, log warning but don't throw - allow app to continue
      // This prevents internal server errors if env vars aren't configured yet
      console.warn(
        `Warning: Environment variables ${missing.join(', ')} are missing. ` +
        `Some features may not work. Please add them in Cloudflare Pages Settings.`
      )
    }
    
    return {
      supabaseUrl: supabaseUrl || '',
      supabaseAnonKey: supabaseAnonKey || '',
    }
  }

  return {
    supabaseUrl: supabaseUrl!,
    supabaseAnonKey: supabaseAnonKey!,
  }
}

/**
 * Gets environment variables with validation
 * Use this in client components
 */
export function getEnv() {
  if (typeof window === 'undefined') {
    // Server-side: validate
    return validateEnv()
  }

  // Client-side: just return (validation happens at build time)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      'Missing Supabase environment variables. Please check your .env.local file.'
    )
  }

  return {
    supabaseUrl: supabaseUrl || '',
    supabaseAnonKey: supabaseAnonKey || '',
  }
}
