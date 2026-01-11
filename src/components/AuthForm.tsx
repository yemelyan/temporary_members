'use client'

import { useState, FormEvent, ReactNode } from 'react'

interface AuthFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
  submitLabel: string
  children: ReactNode
  error?: string | null
  isLoading?: boolean
}

export default function AuthForm({
  onSubmit,
  submitLabel,
  children,
  error,
  isLoading = false,
}: AuthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {children}
      
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-100 dark:focus:ring-slate-50"
      >
        {isSubmitting || isLoading ? 'Processing...' : submitLabel}
      </button>
    </form>
  )
}
