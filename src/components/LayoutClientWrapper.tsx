'use client'

import Navigation from './Navigation'
import { usePathname } from 'next/navigation'

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Hide nav if the route starts with any of these
  const hideNavPatterns = [
    '/dashboard',
    '/billing',
    '/settings',
    '/alerts',
    '/login',
    '/account',
  ]

  const hideNav = hideNavPatterns.some((path) =>
    pathname?.startsWith(path)
  )

  return (
    <>
      {!hideNav && <Navigation />}
      <main className={!hideNav ? 'pt-16' : ''}>{children}</main>
    </>
  )
}
