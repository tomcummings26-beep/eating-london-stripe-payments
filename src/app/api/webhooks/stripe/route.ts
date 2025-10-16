import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { sendPurchaseConfirmation } from '@/lib/sendPurchaseConfirmation' // 👈 new import

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const ALERTS_API_BASE_URL =
  process.env.ALERTS_API_BASE_URL || 'https://eatinglondon-production.up.railway.app'

export async function POST(req: Request) {
  let event: Stripe.Event
  let rawBody: string

  try {
    const sig = req.headers.get('stripe-signature')
    rawBody = await req.text()

    // ✅ Verify webhook signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.warn('⚠️ Webhook signature verification failed or skipped:', err.message)
    // Return 200 to prevent Stripe retries
    return NextResponse.json({ received: true })
  }

  console.log(`📩 Stripe event received: ${event.type}`)

  // ✅ Supabase server client (using Service Role Key)
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      const email = session.customer_email || session.customer_details?.email
      const priceId = session.metadata?.price_id

      console.log(`💳 Payment complete | Email: ${email} | PriceId: ${priceId}`)

      // 🧠 Determine how many credits to add
      let creditsToAdd = 0
      if (priceId === process.env.STRIPE_PRICE_ONE_ALERT) creditsToAdd = 1
      if (priceId === process.env.STRIPE_PRICE_THREE_ALERTS) creditsToAdd = 3
      if (priceId === process.env.STRIPE_PRICE_FIVE_ALERTS) creditsToAdd = 5
      if (priceId === process.env.STRIPE_PRICE_UNLIMITED) creditsToAdd = 9999

      if (email && creditsToAdd > 0) {
        // ✅ Increment Supabase credits
        const { error } = await supabase.rpc('increment_credits', {
          p_email: email,
          p_amount: creditsToAdd,
        })

        if (error) {
          console.error('❌ Supabase RPC failed:', error.message)
        } else {
          console.log(`✨ Added ${creditsToAdd} credit(s) for ${email}`)

          // 🚀 Call Railway API to activate pending alerts
          const activateUrl = `${ALERTS_API_BASE_URL}/api/alerts/activate-pending`
          try {
            const response = await fetch(activateUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email }),
            })

            if (!response.ok) {
              console.error(`⚠️ Activation failed (${response.status})`)
            } else {
              const data = await response.json()
              console.log(`🚀 Pending alerts activation response:`, data)
            }
          } catch (err: any) {
            console.error('⚠️ Failed to call activate-pending endpoint:', err.message)
          }

          // 📨 Send SendGrid confirmation email
          try {
            await sendPurchaseConfirmation(email, creditsToAdd)
            console.log(`📧 Sent purchase confirmation email to ${email}`)
          } catch (err: any) {
            console.error('⚠️ Failed to send SendGrid confirmation email:', err.message)
          }
        }
      } else {
        console.log('ℹ️ Skipped increment — missing email or unmatched priceId.')
      }
    } else {
      console.log(`ℹ️ Ignored event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('❌ Webhook handler error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// 🚨 Required so Stripe receives unparsed body
export const config = {
  api: {
    bodyParser: false,
  },
}


