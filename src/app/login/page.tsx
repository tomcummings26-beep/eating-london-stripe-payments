'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto mt-24 text-center space-y-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>

      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
        redirectTo={
          typeof window !== 'undefined'
            ? `${window.location.origin}/dashboard`
            : 'http://localhost:3000/dashboard'
        }
      />
    </main>
  )
}












