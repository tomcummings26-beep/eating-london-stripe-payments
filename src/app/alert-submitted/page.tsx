'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

function AlertSubmittedInner() {
  const params = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [showThankYou, setShowThankYou] = useState<boolean>(false)

  useEffect(() => {
    async function checkLatestAlert() {
      try {
        const email = params.get('email')
        if (!email) {
          // No email param – default to thank you screen
          setShowThankYou(true)
          setLoading(false)
          return
        }

        const cleanEmail = email.trim().toLowerCase()

        // ✅ Fetch latest alert status from Railway API
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ALERTS_API_BASE_URL}/api/alerts/latest?email=${encodeURIComponent(
            cleanEmail
          )}`
        )

        if (!res.ok) {
          console.error('⚠️ Failed to fetch latest alert status:', res.status)
          setShowThankYou(true)
          setLoading(false)
          return
        }

        const data = await res.json()
        const latestStatus = data?.status || 'active'

        // ✅ Logic: if "pending_payment" → redirect to upgrade
        if (latestStatus === 'pending_payment') {
          router.replace('/upgrade')
        } else {
          setShowThankYou(true)
        }
      } catch (err) {
        console.error('❌ Error checking latest alert status:', err)
        setShowThankYou(true)
      } finally {
        setLoading(false)
      }
    }

    checkLatestAlert()
  }, [params, router])

  // 🌀 Loading state
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 animate-pulse">
        Checking your alert status…
      </div>
    )
  }

  // 🪄 Thank-you screen
  if (showThankYou) {
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
          eating.london© {new Date().getFullYear()}
        </p>
      </main>
    )
  }

  return null
}

export default function AlertSubmittedPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-gray-500 animate-pulse">
          Loading...
        </div>
      }
    >
      <AlertSubmittedInner />
    </Suspense>
  )
}
