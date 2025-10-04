'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function UpgradePage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePurchase = async (priceId: string) => {
    try {
      setLoading(true)

      // ✅ Get current user email from Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user?.email) {
        alert('You must be signed in to make a purchase.')
        router.push('/login')
        return
      }

      // ✅ Send request to /api/checkout
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          email: user.email,
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url // redirect to Stripe Checkout
      } else {
        alert('Error creating Stripe checkout session.')
        console.error('Stripe response:', data)
      }
    } catch (err) {
      console.error('❌ Purchase error:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Upgrade Your Alerts</h1>
      <p className="text-center text-gray-600 mb-8">
        Buy additional alerts or go unlimited.
      </p>

      <div className="grid gap-6 sm:grid-cols-3">
        {/* 1 Alert */}
        <div className="border rounded-2xl p-6 text-center shadow-sm">
          <h2 className="text-xl font-semibold mb-2">1 Alert</h2>
          <p className="text-gray-600 mb-4">£1 one-time</p>
          <button
            onClick={() =>
              handlePurchase(process.env.NEXT_PUBLIC_STRIPE_PRICE_ONE_ALERT!)
            }
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 w-full"
          >
            {loading ? 'Processing...' : 'Buy 1 Alert'}
          </button>
        </div>

        {/* 5 Alerts */}
        <div className="border rounded-2xl p-6 text-center shadow-sm">
          <h2 className="text-xl font-semibold mb-2">5 Alerts</h2>
          <p className="text-gray-600 mb-4">£3.99 one-time</p>
          <button
            onClick={() =>
              handlePurchase(process.env.NEXT_PUBLIC_STRIPE_PRICE_FIVE_ALERTS!)
            }
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 w-full"
          >
            {loading ? 'Processing...' : 'Buy 5 Alerts'}
          </button>
        </div>

        {/* Unlimited */}
        <div className="border rounded-2xl p-6 text-center shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Unlimited</h2>
          <p className="text-gray-600 mb-4">£9.99 monthly</p>
          <button
            onClick={() =>
              handlePurchase(process.env.NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED!)
            }
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 w-full"
          >
            {loading ? 'Processing...' : 'Subscribe'}
          </button>
        </div>
      </div>
    </main>
  )
}
