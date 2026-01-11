'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminTabs from './AdminTabs'
import AdminUserList from './AdminUserList'

interface User {
  id: string
  email?: string
  display_name?: string
  created_at?: string
  approved: boolean
  is_admin: boolean
}

interface AdminDashboardProps {
  totalUsers: number
  pendingCount: number
  totalContent: number
  pendingUsers: User[]
  allUsers: User[]
}

export default function AdminDashboard({
  totalUsers,
  pendingCount,
  totalContent,
  pendingUsers: initialPendingUsers,
  allUsers: initialAllUsers,
}: AdminDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending')
  const [pendingUsers, setPendingUsers] = useState(initialPendingUsers)
  const [allUsers, setAllUsers] = useState(initialAllUsers)
  const [pendingCountState, setPendingCountState] = useState(pendingCount)

  const handleUserUpdate = () => {
    // Refresh the page data
    router.refresh()
    // Note: In a real app, you might want to fetch fresh data here instead of full refresh
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Admin Panel
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage users, approve registrations, and oversee platform content
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
              <svg
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Users
              </p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900/30">
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
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Pending Approval
              </p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {pendingCountState}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-400"
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
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Content Items
              </p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {totalContent}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="px-6 pt-6">
          <AdminTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            pendingCount={pendingCountState}
          />
        </div>

        <div className="p-6">
          {activeTab === 'pending' ? (
            <AdminUserList
              users={pendingUsers}
              view="pending"
              onUserUpdate={() => {
                handleUserUpdate()
                setPendingCountState((prev) => Math.max(0, prev - 1))
              }}
            />
          ) : (
            <AdminUserList
              users={allUsers}
              view="all"
              onUserUpdate={handleUserUpdate}
            />
          )}
        </div>
      </div>
    </div>
  )
}
