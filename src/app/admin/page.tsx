import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminUserList from '@/components/AdminUserList'
import AdminTabs from '@/components/AdminTabs'
import AdminDashboard from '@/components/AdminDashboard'

export const runtime = 'edge'

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch current user's profile to check admin status
  const { data: currentProfile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  // If profile doesn't exist or user is not admin, redirect to dashboard
  if (profileError || !currentProfile?.is_admin) {
    redirect('/dashboard')
  }

  // Fetch summary statistics
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: pendingUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('approved', false)

  const { count: totalContent } = await supabase
    .from('content')
    .select('*', { count: 'exact', head: true })

  // Fetch all pending users (approved = false)
  const { data: pendingUsersList, error: pendingError } = await supabase
    .from('profiles')
    .select('id, email, display_name, created_at, approved, is_admin')
    .eq('approved', false)
    .order('created_at', { ascending: true })

  // Fetch all users
  const { data: allUsers, error: allUsersError } = await supabase
    .from('profiles')
    .select('id, email, display_name, created_at, approved, is_admin')
    .order('created_at', { ascending: false })

  if (pendingError || allUsersError) {
    console.error('Error fetching users:', pendingError || allUsersError)
  }

  return (
    <AdminDashboard
      totalUsers={totalUsers || 0}
      pendingCount={pendingUsers || 0}
      totalContent={totalContent || 0}
      pendingUsers={pendingUsersList || []}
      allUsers={allUsers || []}
    />
  )
}
