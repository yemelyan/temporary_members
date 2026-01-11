'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface LikeButtonProps {
  contentId: string
  initialLiked: boolean
  initialCount: number
  onLikeToggle: (liked: boolean, newCount: number) => void
}

export default function LikeButton({
  contentId,
  initialLiked,
  initialCount,
  onLikeToggle,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggle = async () => {
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    // Optimistic update
    const newLiked = !liked
    const newCount = newLiked ? count + 1 : count - 1

    setLiked(newLiked)
    setCount(newCount)
    onLikeToggle(newLiked, newCount)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('You must be logged in to like content')
      }

      if (newLiked) {
        // Add like
        const { error: insertError } = await supabase
          .from('likes')
          .insert({
            content_id: contentId,
            user_id: user.id,
          })

        if (insertError) {
          // Revert optimistic update
          setLiked(!newLiked)
          setCount(!newLiked ? count + 1 : count - 1)
          onLikeToggle(!newLiked, !newLiked ? count + 1 : count - 1)
          throw insertError
        }
      } else {
        // Remove like
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id)

        if (deleteError) {
          // Revert optimistic update
          setLiked(!newLiked)
          setCount(!newLiked ? count + 1 : count - 1)
          onLikeToggle(!newLiked, !newLiked ? count + 1 : count - 1)
          throw deleteError
        }
      }
    } catch (err) {
      console.error('Error toggling like:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to update like. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`group flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        liked
          ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
      }`}
      aria-label={liked ? 'Unlike this content' : 'Like this content'}
    >
      {liked ? (
        // Filled heart (liked) - red color
        <svg
          className={`h-5 w-5 fill-red-500 text-red-500 transition-transform duration-200 ${
            !isLoading ? 'group-hover:scale-110' : ''
          }`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        // Outline heart (not liked) - gray color
        <svg
          className={`h-5 w-5 transition-transform duration-200 ${
            !isLoading ? 'group-hover:scale-110 group-hover:text-red-500' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
      <span
        className={`font-medium transition-colors duration-200 ${
          liked
            ? 'text-red-600 dark:text-red-400'
            : 'text-slate-700 dark:text-slate-300'
        }`}
      >
        {count}
      </span>
      {error && (
        <span className="ml-2 text-xs text-red-600 dark:text-red-400">{error}</span>
      )}
    </button>
  )
}
