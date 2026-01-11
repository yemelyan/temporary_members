/**
 * Development-only utility to check if environment variables are loaded
 * This should only be used in development mode
 */
export function checkEnvVariables() {
  if (process.env.NODE_ENV !== 'development') {
    return // Only run in development
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.group('🔍 Environment Variables Check')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  if (supabaseUrl) {
    console.log('  Value:', supabaseUrl.substring(0, 30) + '...')
  }
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
  if (supabaseAnonKey) {
    console.log('  Value:', supabaseAnonKey.substring(0, 20) + '...')
  }
  console.groupEnd()

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      '\n⚠️  Missing environment variables!\n' +
        'Please ensure .env.local exists in the project root with:\n' +
        '  NEXT_PUBLIC_SUPABASE_URL=your-project-url\n' +
        '  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\n' +
        '\nAfter updating .env.local, restart the development server.'
    )
  }
}
