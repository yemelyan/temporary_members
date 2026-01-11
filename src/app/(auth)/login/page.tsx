'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Sign In
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Enter your credentials to access your account
        </p>
      </div>

      <AuthForm
        onSubmit={handleSubmit}
        submitLabel="Login"
        error={error}
        isLoading={isLoading}
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 dark:placeholder-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 dark:placeholder-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-500"
              placeholder="••••••••"
            />
          </div>
        </div>
      </AuthForm>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Don't have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-slate-900 hover:text-slate-700 dark:text-slate-50 dark:hover:text-slate-300"
        >
          Register here
        </Link>
      </p>
    </div>
  )
}
