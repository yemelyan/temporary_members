'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ConfirmDialog from './ConfirmDialog'

interface User {
  id: string
  email?: string
  display_name?: string
  created_at?: string
  approved: boolean
  is_admin: boolean
}

interface AdminUserListProps {
  users: User[]
  view: 'pending' | 'all'
  onUserUpdate: () => void
}

export default function AdminUserList({
  users: initialUsers,
  view,
  onUserUpdate,
}: AdminUserListProps) {
  const [users, setUsers] = useState(initialUsers)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    action: string
    userId: string
    userName: string
  }>({
    isOpen: false,
    action: '',
    userId: '',
    userName: '',
  })

  const handleApprove = async (userId: string) => {
    setLoadingId(userId)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ approved: true })
        .eq('id', userId)

      if (updateError) {
        console.error('Error approving user:', updateError)
        setError(updateError.message || 'Failed to approve user')
        return
      }

      // Optimistic UI update
      if (view === 'pending') {
        // Remove from pending list
        setUsers((prev) => prev.filter((user) => user.id !== userId))
      } else {
        // Update status in all users list
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, approved: true } : user
          )
        )
      }
      setSuccess('User approved successfully!')
      onUserUpdate()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Unexpected error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoadingId(null)
    }
  }

  const handleRevokeApproval = async (userId: string) => {
    setLoadingId(userId)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ approved: false })
        .eq('id', userId)

      if (updateError) {
        console.error('Error revoking approval:', updateError)
        setError(updateError.message || 'Failed to revoke approval')
        return
      }

      // Optimistic UI update
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, approved: false } : user
        )
      )
      setSuccess('User access revoked successfully!')
      onUserUpdate()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Unexpected error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoadingId(null)
    }
  }

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    setLoadingId(userId)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId)

      if (updateError) {
        console.error('Error updating admin status:', updateError)
        setError(updateError.message || 'Failed to update admin status')
        return
      }

      // Optimistic UI update
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, is_admin: !currentStatus } : user
        )
      )
      setSuccess(
        `Admin status ${!currentStatus ? 'granted' : 'revoked'} successfully!`
      )
      onUserUpdate()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Unexpected error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoadingId(null)
    }
  }

  const openConfirmDialog = (
    action: 'revoke' | 'remove-admin' | 'grant-admin',
    userId: string,
    userName: string
  ) => {
    setConfirmDialog({
      isOpen: true,
      action,
      userId,
      userName,
    })
  }

  const handleConfirm = () => {
    const { action, userId } = confirmDialog
    const user = users.find((u) => u.id === userId)

    if (action === 'revoke' && user) {
      handleRevokeApproval(userId)
    } else if (action === 'remove-admin' && user) {
      handleToggleAdmin(userId, true)
    } else if (action === 'grant-admin' && user) {
      handleToggleAdmin(userId, false)
    }

    setConfirmDialog({ isOpen: false, action: '', userId: '', userName: '' })
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const getDialogConfig = () => {
    if (confirmDialog.action === 'revoke') {
      return {
        title: 'Revoke User Access',
        message: `Are you sure you want to revoke access for ${confirmDialog.userName}? They will no longer be able to access the platform.`,
        confirmText: 'Revoke Access',
        variant: 'danger' as const,
      }
    } else if (confirmDialog.action === 'remove-admin') {
      return {
        title: 'Remove Admin Status',
        message: `Are you sure you want to remove admin privileges from ${confirmDialog.userName}?`,
        confirmText: 'Remove Admin',
        variant: 'warning' as const,
      }
    } else {
      return {
        title: 'Grant Admin Status',
        message: `Are you sure you want to grant admin privileges to ${confirmDialog.userName}?`,
        confirmText: 'Grant Admin',
        variant: 'warning' as const,
      }
    }
  }

  const dialogConfig = getDialogConfig()

  return (
    <div className="space-y-4">
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={dialogConfig.title}
        message={dialogConfig.message}
        confirmText={dialogConfig.confirmText}
        variant={dialogConfig.variant}
        onConfirm={handleConfirm}
        onCancel={() =>
          setConfirmDialog({
            isOpen: false,
            action: '',
            userId: '',
            userName: '',
          })
        }
      />

      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {users.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  User
                </th>
                {view === 'all' && (
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Registered
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-slate-900 dark:text-slate-50">
                        {user.display_name || 'No name'}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400">
                        {user.email || 'No email'}
                      </div>
                    </div>
                  </td>
                  {view === 'all' && (
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex gap-2">
                        {user.approved ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Pending
                          </span>
                        )}
                        {user.is_admin && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            Admin
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {view === 'pending' && (
                        <button
                          onClick={() => handleApprove(user.id)}
                          disabled={loadingId === user.id}
                          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600"
                        >
                          {loadingId === user.id ? 'Approving...' : 'Approve'}
                        </button>
                      )}
                      {view === 'all' && user.approved && (
                        <button
                          onClick={() =>
                            openConfirmDialog(
                              'revoke',
                              user.id,
                              user.display_name || user.email || 'this user'
                            )
                          }
                          disabled={loadingId === user.id}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600"
                        >
                          Revoke Access
                        </button>
                      )}
                      {view === 'all' && (
                        <button
                          onClick={() =>
                            openConfirmDialog(
                              user.is_admin ? 'remove-admin' : 'grant-admin',
                              user.id,
                              user.display_name || user.email || 'this user'
                            )
                          }
                          disabled={loadingId === user.id}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                            user.is_admin
                              ? 'bg-slate-600 hover:bg-slate-700 focus:ring-slate-500 dark:bg-slate-600 dark:hover:bg-slate-700'
                              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700'
                          }`}
                        >
                          {loadingId === user.id
                            ? 'Updating...'
                            : user.is_admin
                            ? 'Remove Admin'
                            : 'Make Admin'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-slate-600 dark:text-slate-400">
            {view === 'pending'
              ? 'No pending user approvals at this time.'
              : 'No users found.'}
          </p>
        </div>
      )}
    </div>
  )
}
