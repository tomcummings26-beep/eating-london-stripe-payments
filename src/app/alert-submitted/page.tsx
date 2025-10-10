'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import Link from 'next/link'

function AlertSubmittedInner() {
  const params = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hasCredits, setHasCredits] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkCredits() {
      try {
        const email = params.get('email')
        if (!email) {
          setHasCredits(true)
          setLoading(false)
          return
        }

        const cleanEmail = email.trim().toLowerCase()
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('credits')
          .eq('email', cleanEmail)
          .maybeSingle()

        if (error) {
          console.error('Supabase error:', error)
          setHasCredits(true)
          setLoading(false)
          return
        }

        setHasCredits(profile?.credits > 0)
      } catch (err) {
        console.error('Error checking credits:', err)
        setHasCredits(true)
      } finally {
        setLoading(false)
      }
    }

    checkCredits()
  }, [params])

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Checking your alert status…
      </div>
    )
  }

  if (hasCredits === false) {
    router.push('/upgrade')
    return null
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-6 text-center">
      <Link href="/" className="mb-8 flex items-center">
        <Image
          src="/logo-eating-london.svg"
          alt="Eating London"
          width={180}
          height={48}
          priority
        />
      </Link>

      <div className="bg-white shadow-md border border-neutral-200 rounded-2xl p-8 max-w-md w-full space-y-5">
        <h1 className="text-2xl font-semibold text-neutral-800">
          Alert Created 🎉
        </h1>
        <p className="text-neutral-600 leading-relaxed">
          Thank you! Your alert has been created.
        </p>
        <p className="text-neutral-600">
          We’ll notify you as soon as a table becomes available.
        </p>
        <Link
          href="/dashboard"
          className="block w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition"
        >
          View Your Dashboard
        </Link>
      </div>

      <p className="mt-10 text-xs text-neutral-400">
        Eating London © {new Date().getFullYear()}
      </p>
    </main>
  )
}

export default function AlertSubmittedPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading...</div>}>
      <AlertSubmittedInner />
    </Suspense>
  )
}
