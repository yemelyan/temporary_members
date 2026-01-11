'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  email?: string
  display_name?: string
  approved: boolean
  created_at?: string
  updated_at?: string
}

interface UseUserReturn {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const supabase = createClient()
        
        // Get current user
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError

        setUser(currentUser)

        // Fetch profile if user exists
        if (currentUser) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single()

          if (profileError) {
            // Profile might not exist yet, that's okay
            console.warn('Profile not found:', profileError.message)
            setProfile(null)
          } else {
            setProfile(profileData as Profile)
          }
        } else {
          setProfile(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user')
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Set up auth state listener
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Refetch profile when auth state changes
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setProfile(data as Profile)
            }
          })
      } else {
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, profile, loading, error }
}
