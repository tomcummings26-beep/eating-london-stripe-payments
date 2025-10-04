import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// --- Init Stripe (no hardcoded apiVersion) ---
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Supabase client (service role key required for writes)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  const body = await req.text() // raw body required for signature verification
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const email = session.customer_email
        const priceId = session.metadata?.priceId

        console.log(`✅ Payment completed for ${email}, price: ${priceId}`)

        // Determine credits to add
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

          if (error) console.error('❌ Error incrementing credits:', error.message)
          else console.log(`✨ Successfully incremented credits for ${email}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('❌ Webhook error', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false, // ensure raw body
  },
}
