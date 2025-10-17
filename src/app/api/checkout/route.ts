import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(req: Request) {
  try {
    const { priceId, customerId, email } = await req.json()

    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })
    }

    // 🧠 Automatically choose subscription or one-time mode
    const isSubscription = [
      process.env.NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED,
    ].includes(priceId)

    // 🧩 Clean email for metadata use
    const alertEmail = email?.trim().toLowerCase() || 'unknown'

    // ✅ Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? 'subscription' : 'payment',

      // ⚡ Do NOT prefill Stripe email to avoid Link login pop-up
      customer: customerId || undefined,

      // ✅ Keep both methods enabled for convenience
      payment_method_types: ['card', 'link'],

      line_items: [{ price: priceId, quantity: 1 }],

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/upgrade?status=cancel`,

      // ✅ Include alert email for webhook mapping
      metadata: {
        price_id: priceId,
        alert_email: alertEmail,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('❌ Stripe checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
