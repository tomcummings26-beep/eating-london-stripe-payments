'use client'

import { Check, Star } from 'lucide-react'

export default function UpgradePage() {
  const buyAlert = async (priceId: string) => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-16">
      {/* Hero Section */}
      <section className="max-w-2xl text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Never miss your next reservation 🍽️
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          You've used your free Alert - Add more credits and we'll notify when your favourite London restaurants open up tables.  
          Choose the option that fits your appetite.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="grid gap-6 md:grid-cols-3 max-w-5xl w-full">
        {/* 3 Alerts */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition transform">
          <h2 className="text-xl font-semibold mb-2">3 Alerts</h2>
          <p className="text-gray-600 mb-4">Perfect for one-off bookings or last-minute checks.</p>
          <p className="text-4xl font-bold mb-6">£2.99</p>

          <ul className="text-sm text-gray-700 space-y-2 mb-6">
            <li className="flex items-center gap-2"><Check className="text-green-500" size={16}/>One restaurant search</li>
            <li className="flex items-center gap-2"><Check className="text-green-500" size={16}/>Instant email alert</li>
            <li className="flex items-center gap-2"><Check className="text-green-500" size={16}/>Valid for 7 days</li>
          </ul>

          <button
            onClick={() => buyAlert(process.env.NEXT_PUBLIC_STRIPE_PRICE_THREE_ALERTS!)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
          >
            Buy 3 Alerts
          </button>
        </div>

        {/* 5 Alerts (Most Popular) */}
        <div className="relative bg-white border-2 border-blue-600 rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition transform">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            MOST POPULAR
          </div>

          <h2 className="text-xl font-semibold mb-2">5 Alerts Pack</h2>
          <p className="text-gray-600 mb-4">Best for regular diners tracking multiple spots.</p>
          <p className="text-4xl font-bold mb-6">£3.99</p>

          <ul className="text-sm text-gray-700 space-y-2 mb-6">
            <li className="flex items-center gap-2"><Check className="text-green-500" size={16}/>Covers up to 5 restaurants</li>
            <li className="flex items-center gap-2"><Check className="text-green-500" size={16}/>Instant SMS & email alerts</li>
            <li className="flex items-center gap-2"><Check className="text-green-500" size={16}/>Flexible time windows</li>
          </ul>

          <button
            onClick={() => buyAlert(process.env.NEXT_PUBLIC_STRIPE_PRICE_FIVE_ALERTS!)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition flex justify-center items-center gap-2"
          >
            <Star size={18} /> Buy 5 Alerts
          </button>
        </div>

        {/* Unlimited */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition transform">
          <h2 className="text-xl font-semibold mb-2">Unlimited Alerts</h2>
          <p className="text-gray-600 mb-4">Ideal for serious foodies or concierge-style planning.</p>
          <p className="text-4xl font-bold mb-6">£5.99<span className="text-base font-medium text-gray-600">/month</span></p>

          <ul className="text-sm text-gray-700 space-y-2 mb-6">
            <li className="flex items-center gap-2"><Check className="text-green-500" size={16}/>Unlimited restaurant monitoring</li>
            <li className="flex items-center gap-2"><Check className="text-green-500" size={16}/>Real-time alerts 24/7</li>
            <li className="flex items-center gap-2"><Check className="text-green-500" size={16}/>Cancel anytime</li>
          </ul>

          <button
            onClick={() => buyAlert(process.env.NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED!)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition"
          >
            Subscribe Monthly
          </button>
        </div>
      </section>

      {/* Social Proof */}
      <section className="mt-20 text-center max-w-2xl">
        <p className="text-lg text-gray-700 mb-4 italic">
          “I finally got a Saturday booking at Mountain and Brat — this alert system actually works.”
        </p>
        <p className="text-gray-500 text-sm">— Emily R, London</p>
      </section>

      {/* CTA Footer */}
      <section className="mt-20 text-center">
        <h3 className="text-2xl font-semibold mb-3">Still deciding?</h3>
        <p className="text-gray-600 mb-6">Start small — your first alert could land your next Michelin dinner.</p>
        <button
          onClick={() => buyAlert(process.env.NEXT_PUBLIC_STRIPE_PRICE_ONE_ALERT!)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          Try 1 Alert Now
        </button>
      </section>
    </main>
  )
}
