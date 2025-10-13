'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

function AlertSubmittedInner() {
  const params = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    async function checkLatestAlertWithRetry() {
      try {
        const email = params.get('email')

        if (!email) {
          console.warn('⚠️ No email param provided — showing thank-you by default.')
          setStatus('active') // safe fallback
          setLoading(false)
          return
        }

        const cleanEmail = email.trim().toLowerCase()
        const maxAttempts = 5 // retry up to 5 times
        const delay = 1000 // 1s between retries
        let attempt = 0
        let latestStatus = 'none'

        // 🔁 Retry loop — wait for Mongo insert to exist
        while (attempt < maxAttempts) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_ALERTS_API_BASE_URL}/api/alerts/latest?email=${encodeURIComponent(
              cleanEmail
            )}`
          )

          if (!res.ok) {
            console.error('⚠️ Failed to fetch latest alert status:', res.status)
            break
          }

          const data = await res.json()
          latestStatus = data?.status || 'none'

          console.log(`🔁 [Attempt ${attempt + 1}] Latest alert for ${cleanEmail}: ${latestStatus}`)

          // Stop retrying once the record exists
          if (latestStatus !== 'none') break

          attempt++
          await new Promise((resolve) => setTimeout(resolve, delay))
        }

        // ✅ Redirect logic
        if (latestStatus === 'pending_payment') {
          console.log('💳 Redirecting user to /upgrade...')
          router.replace('/upgrade')
          return
        }

        console.log('✅ Showing thank-you screen.')
        setStatus(latestStatus)
      } catch (err) {
        console.error('❌ Error checking latest alert status:', err)
        setStatus('active') // fallback to thank-you
      } finally {
        setLoading(false)
      }
    }

    checkLatestAlertWithRetry()
  }, [params, router])

  // 🌀 Loading screen
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 animate-pulse">
        Checking your alert status…
      </div>
    )
  }

  // 💳 Redirect case handled above — just render thank-you for everything else
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
