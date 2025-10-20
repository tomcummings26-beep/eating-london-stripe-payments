import { NextResponse } from 'next/server'
import { connectToMongo, getDb } from '../../../db/mongo'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req) {
  try {
    await connectToMongo()
    const db = getDb()

    // Authorization: Bearer <access_token>
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '').trim()

    // ✅ Use a server-side Supabase client (NOT the browser client)
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            const v = cookieStore.get(name)
            return v ? v.value : undefined
          },
        },
      }
    )

    // Validate the provided access token
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data || !data.user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const email = (data.user.email || '').trim().toLowerCase()

    // Fetch alerts for this user (MongoDB)
    const alerts = await db
      .collection('booking')
      .find({ email })
      .sort({ createdAt: -1 })
      .toArray()

    console.log(`📦 Returned ${alerts.length} alerts for ${email}`)
    return NextResponse.json(alerts)
  } catch (err) {
    console.error('❌ Error fetching alerts:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

