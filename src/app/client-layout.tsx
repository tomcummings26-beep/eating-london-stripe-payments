'use client'

import Navigation from '../components/Navigation'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

// ✅ Move createBrowserSupabaseClient OUTSIDE the component
// so it persists between navigations / reloads
const supabaseClient = createBrowserSupabaseClient()

export default function ClientLayout({ children }: Props) {
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <Navigation />
      <main className="pt-16">{children}</main>
    </SessionContextProvider>
  )
}
