import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import LoginClient from './login-client'

export default async function LoginPage() {
  const cookieStore = cookies()

  // ✅ Modern Supabase SSR setup
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    console.error('Supabase getSession error:', error.message)
  }

  // ✅ Redirect if already logged in
  if (session) {
    redirect('/dashboard')
  }

  // ✅ Otherwise render the login UI
  return <LoginClient />
}
