'use client'

import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  email?: string
  display_name?: string
  approved: boolean
  created_at?: string
  updated_at?: string
}

interface ContentItem {
  id: string
  title?: string
  description?: string
  created_at?: string
  likeCount?: number
  commentCount?: number
  [key: string]: unknown
}

interface DashboardContentProps {
  user: User
  profile: Profile | null
  content: ContentItem[] | null
  profileError: { message: string } | null
}

export default function DashboardContent({
  user,
  profile,
  content,
  profileError,
}: DashboardContentProps) {
  if (profileError && profileError.message !== 'PGRST116') {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        <p className="font-semibold">Error loading profile</p>
        <p className="text-sm">{profileError.message}</p>
      </div>
    )
  }

  if (!profile || !profile.approved) {
    return (
      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
            <svg
              className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
            Pending Approval
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Your account registration was successful, but it's currently pending
            admin approval. You'll be able to access all features once an
            administrator approves your account.
          </p>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
            We'll notify you once your account has been approved.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm dark:border-blue-900/50 dark:bg-blue-900/20">
        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
          Welcome back, {profile.display_name || user.email}!
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Stay informed with the latest updates, educational content, and community discussions.
        </p>
      </div>

      {content && content.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Community Updates
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.map((item) => (
              <a
                key={item.id}
                href={`/dashboard/content/${item.id}`}
                className="group block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600"
              >
                {item.title && (
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-50 dark:group-hover:text-blue-400">
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                    <div className="flex items-center gap-1.5">
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span>{item.likeCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
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
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span>{item.commentCount || 0}</span>
                    </div>
                  </div>
                  {item.created_at && (
                    <time className="text-xs text-slate-500 dark:text-slate-500">
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
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
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-50">
            No updates available
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Check back soon for new community updates and educational content.
          </p>
        </div>
      )}
    </div>
  )
}
