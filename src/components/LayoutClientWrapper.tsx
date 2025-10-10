'use client'

import Navigation from './Navigation'

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main className="pt-16">{children}</main>
    </>
  )
}
