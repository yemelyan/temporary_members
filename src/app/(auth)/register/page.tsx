'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AuthForm from '@/components/AuthForm'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const displayName = formData.get('display_name') as string

    try {
      const supabase = createClient()
      
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError('Registration is not configured. Please contact support.')
        setIsLoading(false)
        return
      }
      
      const signUpResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      })

      // Log the full response for debugging (even on success)
      console.log('SignUp response:', signUpResponse)

      if (signUpResponse.error) {
        console.error('Registration error:', signUpResponse.error)
        setError(signUpResponse.error.message)
        return
      }

      setSuccess(true)
    } catch (err) {
      // Log the full error object
      console.error('Registration error:', err)
      
      // Check if error is from Supabase and has a message
      if (err && typeof err === 'object' && 'message' in err) {
        setError(err.message as string)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          Registration successful! Please wait for admin approval.
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <Link
            href="/login"
            className="font-semibold text-slate-900 hover:text-slate-700 dark:text-slate-50 dark:hover:text-slate-300"
          >
            Return to login
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Sign up to get started
        </p>
      </div>

      <AuthForm
        onSubmit={handleSubmit}
        submitLabel="Register"
        error={error}
        isLoading={isLoading}
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="display_name"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Display Name
            </label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              autoComplete="name"
              required
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 dark:placeholder-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-500"
              placeholder="John Doe"
            />
          </div>

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
              autoComplete="new-password"
              required
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 dark:placeholder-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-500"
              placeholder="••••••••"
            />
          </div>
        </div>
      </AuthForm>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-slate-900 hover:text-slate-700 dark:text-slate-50 dark:hover:text-slate-300"
        >
          Sign in here
        </Link>
      </p>
    </div>
  )
}
