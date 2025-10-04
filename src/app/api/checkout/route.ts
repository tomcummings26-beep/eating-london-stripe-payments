import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { priceId, customerId, email } = await req.json()

    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })
    }

    // ✅ Include metadata for Supabase webhook mapping
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // change to 'subscription' for recurring
      customer: customerId || undefined, // optional
      customer_email: email, // fallback if customerId not passed
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/upgrade?status=cancel`,
      metadata: {
        price_id: priceId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('❌ Stripe checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
