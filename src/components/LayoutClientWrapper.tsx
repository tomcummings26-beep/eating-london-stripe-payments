'use client'

import Navigation from './Navigation'
import { usePathname } from 'next/navigation'

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Hide the global nav on dashboard-related routes
  const hideNav =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/billing') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/alerts') ||
    pathname.startsWith('/login')

  return (
    <>
      {!hideNav && <Navigation />}
      <main className={!hideNav ? 'pt-16' : ''}>{children}</main>
    </>
  )
}
