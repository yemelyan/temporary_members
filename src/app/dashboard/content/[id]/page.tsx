import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ContentDetail from '@/components/ContentDetail'

export const runtime = 'edge'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ContentDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is approved
  const { data: profile } = await supabase
    .from('profiles')
    .select('approved')
    .eq('id', user.id)
    .single()

  if (!profile?.approved) {
    redirect('/dashboard')
  }

  // Fetch content item
  const { data: content, error: contentError } = await supabase
    .from('content')
    .select('*')
    .eq('id', id)
    .single()

  if (contentError || !content) {
    notFound()
  }

  // Fetch comments with user display_name
  const { data: comments } = await supabase
    .from('comments')
    .select(`
      id,
      text,
      created_at,
      profiles:user_id (
        display_name
      )
    `)
    .eq('content_id', id)
    .order('created_at', { ascending: false }) // Newest first for display

  // Fetch comment count
  const { count: commentCount } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('content_id', id)

  // Fetch like count
  const { count: likeCount } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('content_id', id)

  // Check if current user has liked
  const { data: userLike } = await supabase
    .from('likes')
    .select('id')
    .eq('content_id', id)
    .eq('user_id', user.id)
    .single()

  // Transform comments to include display_name directly (already sorted newest first)
  const transformedComments = comments?.map((comment) => ({
    id: comment.id,
    text: comment.text,
    created_at: comment.created_at,
    display_name: (comment.profiles as { display_name?: string } | null)?.display_name || 'Anonymous',
  })) || []

  return (
    <ContentDetail
      content={content}
      comments={transformedComments}
      likeCount={likeCount || 0}
      commentCount={commentCount || 0}
      userHasLiked={!!userLike}
      userId={user.id}
    />
  )
}
