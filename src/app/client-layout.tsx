'use client'

import Navigation from '../components/Navigation'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { usePathname } from 'next/navigation'
import { useState, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

// ✅ Create Supabase client once (persists between reloads)
const supabaseClient = createBrowserSupabaseClient()

export default function ClientLayout({ children }: Props) {
  const pathname = usePathname()
  const hideNav = pathname.startsWith('/dashboard')

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {!hideNav && <Navigation />}
      <main className={!hideNav ? 'pt-16' : ''}>{children}</main>
    </SessionContextProvider>
  )
}
