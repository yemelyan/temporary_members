import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardContent from '@/components/DashboardContent'

export const runtime = 'edge'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch content if user is approved
  let content = null
  if (profile?.approved) {
    const { data: contentData } = await supabase
      .from('content')
      .select('*')
      .order('created_at', { ascending: false })

    // Fetch like and comment counts for each content item
    if (contentData) {
      const contentWithCounts = await Promise.all(
        contentData.map(async (item) => {
          // Get like count
          const { count: likeCount } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('content_id', item.id)

          // Get comment count
          const { count: commentCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('content_id', item.id)

          return {
            ...item,
            likeCount: likeCount || 0,
            commentCount: commentCount || 0,
          }
        })
      )

      content = contentWithCounts
    }
  }

  return (
    <DashboardContent
      user={user}
      profile={profile}
      content={content}
      profileError={profileError}
    />
  )
}
