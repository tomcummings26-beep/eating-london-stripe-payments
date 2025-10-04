import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  // Get raw body as text (needed for signature verification)
  const rawBody = await req.text()
  console.log('🔍 Raw webhook body:', rawBody)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed.', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  console.log('📩 Event received:', event.type)

  // ✅ Create Supabase client only after verification
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      console.log('🧾 Session object:', JSON.stringify(session, null, 2))

      // Fallback to customer_details.email if customer_email is null
      const email = session.customer_email || session.customer_details?.email
      const priceId = session.metadata?.price_id // snake_case

      console.log(`✅ Payment completed. Email: ${email}, PriceId: ${priceId}`)

      let creditsToAdd = 0
      if (priceId === process.env.STRIPE_PRICE_ONE_ALERT) creditsToAdd = 1
      if (priceId === process.env.STRIPE_PRICE_FIVE_ALERTS) creditsToAdd = 5
      if (priceId === process.env.STRIPE_PRICE_UNLIMITED) creditsToAdd = 9999

      if (email && creditsToAdd > 0) {
        console.log(`⚡ Incrementing ${creditsToAdd} credits for ${email}`)
        const { error } = await supabase.rpc('increment_credits', {
          p_email: email,
          p_amount: creditsToAdd,
        })

        if (error) {
          console.error('❌ Error incrementing credits:', error.message)
        } else {
          console.log(`✨ Successfully incremented credits for ${email}`)
        }
      } else {
        console.log('ℹ️ Skipped increment — missing email or no matching priceId.')
      }
    } else {
      console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('❌ Webhook handler error', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// 🚨 Important: disable body parsing so raw body can be verified
export const config = {
  api: {
    bodyParser: false,
  },
}
