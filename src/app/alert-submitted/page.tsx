'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

function AlertSubmittedInner() {
  const params = useSearchParams()
  const pathParams = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [redirecting, setRedirecting] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    async function checkLatestAlertWithSmartRetry() {
      try {
        // ✅ Detect email from query (?email=) or path (/alert-submitted/[email])
        const queryEmail = params.get('email')
        const pathEmail = (pathParams?.email as string) || null
        const email = queryEmail || pathEmail

        if (!email) {
          console.warn('⚠️ No email param found — showing thank-you by default.')
          setStatus('active')
          setLoading(false)
          return
        }

        const cleanEmail = decodeURIComponent(email.trim().toLowerCase())

        // 🆕 Store email locally for later Stripe checkout (Upgrade page)
        if (typeof window !== 'undefined') {
          localStorage.setItem('alert_email', cleanEmail)
        }

        const baseUrl = process.env.NEXT_PUBLIC_ALERTS_API_BASE_URL

        // 1️⃣ Get the current latest alert
        const prevRes = await fetch(
          `${baseUrl}/api/alerts/latest?email=${encodeURIComponent(cleanEmail)}`
        )
        const prevData = await prevRes.json()
        const prevStatus = prevData?.status || 'none'
        const prevCreatedAt = prevData?.createdAt || null
        const createdMs = prevCreatedAt ? new Date(prevCreatedAt).getTime() : 0
        const ageMs = Date.now() - createdMs

        console.log(`📦 Latest alert: status=${prevStatus}, age=${ageMs}ms`)

        // 🆕 Instant thank-you for brand new alerts (very fresh or none)
        if (prevStatus === 'none' || (prevStatus === 'active' && ageMs < 3000)) {
          console.log('🆕 First-time alert detected — instant thank-you.')
          setStatus('active')
          setLoading(false)
          return
        }

        // 2️⃣ Otherwise, retry for returning users
        const maxAttempts = 7
        const delay = 1000
        let attempt = 0
        let latestStatus = prevStatus
        let latestCreatedAt = prevCreatedAt

        while (attempt < maxAttempts) {
          const res = await fetch(
            `${baseUrl}/api/alerts/latest?email=${encodeURIComponent(cleanEmail)}`
          )
          const data = await res.json()

          latestStatus = data?.status || 'none'
          latestCreatedAt = data?.createdAt || null

          console.log(
            `🔁 [Attempt ${attempt + 1}] status=${latestStatus}, createdAt=${latestCreatedAt || 'none'}`
          )

          // ✅ Stop early if a new alert appeared or it's pending_payment
          if (
            latestStatus === 'pending_payment' ||
            (latestCreatedAt && latestCreatedAt !== prevCreatedAt)
          ) {
            break
          }

          attempt++
          await new Promise((r) => setTimeout(r, delay))
        }

        // 3️⃣ Redirect or show success
        if (latestStatus === 'pending_payment') {
          console.log('💳 Redirecting to /upgrade')
          setRedirecting(true)
          router.replace('/upgrade')
          return
        }

        console.log('✅ Showing thank-you screen.')
        setStatus(latestStatus)
      } catch (err) {
        console.error('❌ Error checking latest alert status:', err)
        setStatus('active')
      } finally {
        setLoading(false)
      }
    }

    checkLatestAlertWithSmartRetry()
  }, [params, pathParams, router])

  // 🌀 Loading or redirecting
  if (loading || redirecting) {
    return (
      <div className="p-10 text-center text-gray-500 animate-pulse">
        Checking your alert status…
      </div>
    )
  }

  // ✅ Default thank-you view
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
