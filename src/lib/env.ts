/**
 * Validates that required environment variables are set
 * Throws helpful error messages if variables are missing
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

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        `Please create a .env.local file in the project root with these variables.\n` +
        `You can copy .env.local.example and update it with your Supabase credentials.`
    )
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
