'use client'

import { useState } from 'react'
import Link from 'next/link'
import LikeButton from './LikeButton'
import CommentSection from './CommentSection'

interface ContentItem {
  id: string
  title?: string
  description?: string
  created_at?: string
  [key: string]: unknown
}

interface Comment {
  id: string
  text: string
  created_at?: string
  display_name: string
}

interface ContentDetailProps {
  content: ContentItem
  comments: Comment[]
  likeCount: number
  commentCount: number
  userHasLiked: boolean
  userId: string
}

export default function ContentDetail({
  content,
  comments: initialComments,
  likeCount: initialLikeCount,
  commentCount: initialCommentCount,
  userHasLiked: initialUserHasLiked,
  userId,
}: ContentDetailProps) {
  const [comments, setComments] = useState(initialComments)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [commentCount, setCommentCount] = useState(initialCommentCount)
  const [userHasLiked, setUserHasLiked] = useState(initialUserHasLiked)

  const handleLikeToggle = (liked: boolean, newCount: number) => {
    setUserHasLiked(liked)
    setLikeCount(newCount)
  }

  const handleCommentAdded = (newComment: Comment) => {
    // Add new comment at the top of the list
    setComments((prev) => [newComment, ...prev])
    setCommentCount((prev) => prev + 1)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <Link
          href="/dashboard"
          className="hover:text-slate-900 dark:hover:text-slate-50"
        >
          Dashboard
        </Link>
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="text-slate-900 dark:text-slate-50">
          {content.title || 'Content'}
        </span>
      </nav>

      {/* Content Card */}
      <article className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {/* Header with engagement summary */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <LikeButton
                  contentId={content.id}
                  initialLiked={userHasLiked}
                  initialCount={likeCount}
                  onLikeToggle={handleLikeToggle}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg
                  className="h-5 w-5"
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
                <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
              </div>
            </div>
            {content.created_at && (
              <time className="text-sm text-slate-500 dark:text-slate-500">
                {formatDate(content.created_at)}
              </time>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 py-8">
          {content.title && (
            <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 dark:text-slate-50">
              {content.title}
            </h1>
          )}

          {content.description && (
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-base leading-7 text-slate-700 dark:text-slate-300">
                {content.description}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Discussion Section */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <CommentSection
          contentId={content.id}
          comments={comments}
          userId={userId}
          onCommentAdded={handleCommentAdded}
        />
      </div>
    </div>
  )
}
