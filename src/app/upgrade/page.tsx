'use client'

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
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-6">Upgrade your alerts</h1>
      <p className="mb-8 text-gray-600">You’ve used your free alert. Choose an option below to unlock more.</p>

      <div className="space-y-4">
        <button
          onClick={() => buyAlert(process.env.NEXT_PUBLIC_STRIPE_PRICE_ONE_ALERT!)}
          className="bg-blue-500 text-white px-6 py-3 rounded w-full"
        >
          Buy 1 Alert (£1.50)
        </button>

        <button
          onClick={() => buyAlert(process.env.NEXT_PUBLIC_STRIPE_PRICE_FIVE_ALERTS!)}
          className="bg-green-500 text-white px-6 py-3 rounded w-full"
        >
          Buy 5 Alerts (£5.99)
        </button>

        <button
          onClick={() => buyAlert(process.env.NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED!)}
          className="bg-purple-500 text-white px-6 py-3 rounded w-full"
        >
          Unlimited Alerts (£4.99/month)
        </button>
      </div>
    </main>
  )
}
