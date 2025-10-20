'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginClient() {
  const session = useSession()
  const router = useRouter()

  // Client-side safety net (redirect if session becomes active)
  useEffect(() => {
    if (session) router.push('/dashboard')
  }, [session, router])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4">
      {/* Logo + Heading */}
      <div className="mb-6 flex flex-col items-center">
        <Image
          src="/logo-eating-london.svg"
          alt="Eating.London"
          width={180}
          height={48}
          priority
        />
        <h1 className="mt-4 text-2xl font-semibold text-neutral-800">Sign in</h1>
        <p className="text-neutral-500 mt-1 text-sm">
          Access your alerts & dashboard
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-sm bg-white shadow-md rounded-2xl p-6 border border-neutral-100">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: { brand: '#000000', brandAccent: '#ff3b30' },
                radii: { borderRadiusButton: '8px' },
              },
            },
          }}
          theme="light"
          providers={['google']}
          redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`}
        />
      </div>

      <p className="mt-6 text-sm text-neutral-500">
        Trouble signing in?{' '}
        <a href="/contact" className="text-black underline">
          Contact support
        </a>
      </p>
    </main>
  )
}
