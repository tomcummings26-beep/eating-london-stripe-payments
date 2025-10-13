'use client'

import Navigation from '../components/Navigation'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const supabaseClient = createBrowserSupabaseClient()

export default function ClientLayout({ children }: Props) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // detect mobile once on mount + window resize
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Hide nav on mobile dashboard only
  const hideNav = isMobile && pathname.startsWith('/dashboard')

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {!hideNav && <Navigation />}
      <main className={!hideNav ? 'pt-16' : ''}>{children}</main>
    </SessionContextProvider>
  )
}
