'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useSession() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ✅ Get current session immediately
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // ✅ Listen for login/logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { session, loading }
}
