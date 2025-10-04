'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()

  // ✅ Get Supabase session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login')
      } else {
        setSession(data.session)
      }
    })
  }, [router])

  // ✅ Fetch profile data when logged in
  useEffect(() => {
    async function fetchProfile() {
      if (!session) return
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', session.user.email)
        .single()

      if (error) console.error('❌ Error fetching profile:', error)
      else setProfile(data)
    }
    fetchProfile()
  }, [session])

  if (!session) return <p>Loading...</p>

  return (
    <main className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-700">Signed in as {session.user.email}</p>

      {profile ? (
        <div className="border p-4 rounded-lg bg-gray-50 space-y-2">
          <p>
            <strong>Alert Credits:</strong>{' '}
            {profile.alert_credits ?? 0}
          </p>
          <p>
            <strong>Subscription:</strong>{' '}
            {profile.subscription_active ? 'Active' : 'Inactive'}
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {new Date(profile.updated_at || profile.last_alert_at || profile.created_at).toLocaleString()}
          </p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      <div className="space-x-4">
        <button
          onClick={() => router.push('/upgrade')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Buy More Alerts
        </button>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push('/login')
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Sign out
        </button>
      </div>
    </main>
  )
}




