'use client'

import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Comment {
  id: string
  text: string
  created_at?: string
  display_name: string
}

interface CommentSectionProps {
  contentId: string
  comments: Comment[]
  userId: string
  onCommentAdded: (comment: Comment) => void
}

export default function CommentSection({
  contentId,
  comments: initialComments,
  userId,
  onCommentAdded,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!commentText.trim() || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    const textToSubmit = commentText.trim()
    const originalText = commentText // Save original text for error restoration
    setCommentText('') // Clear input immediately

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('You must be logged in to comment')
      }

      // Get user's display_name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single()

      // Insert comment
      const { data: newComment, error: insertError } = await supabase
        .from('comments')
        .insert({
          content_id: contentId,
          user_id: user.id,
          text: textToSubmit,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Create comment object with display_name
      const commentWithName: Comment = {
        id: newComment.id,
        text: newComment.text,
        created_at: newComment.created_at,
        display_name: profile?.display_name || 'Anonymous',
      }

      // Add new comment at the top of the list
      setComments((prev) => [commentWithName, ...prev])
      onCommentAdded(commentWithName)
    } catch (err) {
      console.error('Error adding comment:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to add comment. Please try again.'
      )
      setCommentText(originalText) // Restore text on error
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return 'Just now'
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

      if (diffInSeconds < 60) return 'Just now'
      if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
      }
      if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
      }
      if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400)
        return `${days} ${days === 1 ? 'day' : 'days'} ago`
      }
      if (diffInSeconds < 2592000) {
        const weeks = Math.floor(diffInSeconds / 604800)
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Discussion Header */}
      <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Discussion
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Share your thoughts and questions with the community
        </p>
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="comment-text"
            className="sr-only mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Add a comment
          </label>
          <textarea
            id="comment-text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm placeholder-slate-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 dark:placeholder-slate-500 dark:focus:border-blue-400"
            disabled={isSubmitting}
          />
        </div>
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={!commentText.trim() || isSubmitting}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-700">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-slate-600"
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {comment.display_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-50">
                    {comment.display_name}
                  </span>
                  <span className="ml-2 text-xs text-slate-500 dark:text-slate-500">
                    {formatRelativeTime(comment.created_at)}
                  </span>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">
                {comment.text}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/50">
          <svg
            className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-50">
            No comments yet. Start the discussion!
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
            Be the first to share your thoughts or ask a question.
          </p>
        </div>
      )}
    </div>
  )
}
