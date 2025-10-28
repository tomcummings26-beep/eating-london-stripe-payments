'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  Bell,
  CreditCard,
  Settings,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

type Profile = {
  email: string
  credits: number
  subscription_active?: boolean
  updated_at?: string
}

type Alert = {
  _id: string
  restaurant?: string
  restaurants?: string[] | { name: string }[]
  dateRange?: { start?: string | Date; end?: string | Date }
  timeRange?: { start?: string; end?: string }
  preferredDate?: string
  preferredTime?: string
  status?: string
  createdAt?: string | Date
  matchedAt?: string | Date
}

export default function Dashboard() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [tab, setTab] = useState<
    'overview' | 'alerts' | 'history' | 'billing' | 'settings'
  >('overview')
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  // ✅ Get Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/login')
      else setSession(data.session)
    })
  }, [router])

  // ✅ Fetch profile + alerts
  useEffect(() => {
    if (!session) return

    async function fetchData() {
      setLoading(true)
      try {
        const user = session.user
        const cleanEmail = user.email.trim().toLowerCase()

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .ilike('email', cleanEmail)
          .single()

        const alertsRes = await fetch('/api/alerts', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })

        if (!alertsRes.ok)
          throw new Error(`API error: ${await alertsRes.text()}`)
        const alertsData = await alertsRes.json()

        console.log('📦 Alerts fetched from API:', alertsData)

        setProfile(profileData)
        setAlerts(Array.isArray(alertsData) ? alertsData : [])
      } catch (err) {
        console.error('❌ Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  if (loading)
    return (
      <div className="flex bg-gray-50 flex-col md:flex-row md:min-h-[calc(100vh-64px)]">
        {/* Mobile Header Skeleton */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center gap-3">
            <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="h-9 w-9 rounded-md bg-gray-200 animate-pulse" />
        </div>

        {/* Sidebar Skeleton */}
        <aside className="hidden md:flex md:flex-col gap-6 bg-white border-r w-64 p-6">
          <div className="space-y-3">
            <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="h-10 rounded-md bg-gray-200 animate-pulse"
              />
            ))}
          </div>
          <div className="mt-auto space-y-3">
            <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
            <div className="h-10 rounded-md bg-gray-200 animate-pulse" />
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 p-6 md:p-10">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(3)].map((_, idx) => (
                  <div
                    key={idx}
                    className="h-28 rounded-xl bg-white shadow-sm border border-gray-200 p-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                      <div className="h-6 w-20 rounded bg-gray-200 animate-pulse" />
                    </div>
                    <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
                <div className="h-8 w-32 rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="space-y-3">
                {[...Array(3)].map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
                      <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {[...Array(3)].map((_, colIdx) => (
                        <div
                          key={colIdx}
                          className="h-4 w-full rounded bg-gray-200 animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    )

  // ✅ Helpers
  const parseDate = (d?: string | Date) => {
    if (!d) return null
    if (d instanceof Date) return d
    const parsed = new Date(String(d))
    return isNaN(parsed.getTime()) ? null : parsed
  }

  const renderRestaurantName = (a: Alert) => {
    if (a.restaurant) return a.restaurant
    if (Array.isArray(a.restaurants)) {
      const names = a.restaurants
        .map((r: any) => (typeof r === 'string' ? r : r.name))
        .filter(Boolean)
      return names.join(', ')
    }
    return 'Unknown'
  }

  const now = new Date()

  // ✅ Filters
  const activeAlerts = alerts
    .filter((a) => {
      const end = parseDate(a.dateRange?.end)
      const start = parseDate(a.dateRange?.start)
      const hasValidDate = !!(start || end)
      const isFuture = end ? end >= now : start ? start >= now : false
      return a.status === 'active' && hasValidDate && isFuture
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    )

  const historyAlerts = alerts
    .filter((a) => {
      const end = parseDate(a.dateRange?.end)
      const start = parseDate(a.dateRange?.start)
      const hasValidDate = !!(start || end)
      const isPast = end ? end < now : start ? start < now : false
      return (
        ['matched', 'expired', 'notified'].includes(a.status || '') ||
        (a.status === 'active' && hasValidDate && isPast)
      )
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'history', label: 'History', icon: History },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  // ✅ Layout
return (
  <div className="flex bg-gray-50 flex-col md:flex-row md:min-h-[calc(100vh-64px)]">
    {/* Mobile Header */}
    <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
      {/* Left side: logo + title */}
      <div className="flex items-center gap-2">
        <a href="/" className="flex items-center">
          <img
            src="/logo-eating-london.svg"
            alt="eating.london"
            className="h-5 opacity-90 hover:opacity-100 transition"
          />
        </a>
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

  {/* Right side: menu button */}
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="text-gray-700 hover:text-blue-600"
  >
    {menuOpen ? <X size={22} /> : <Menu size={22} />}
  </button>
</div>


      {/* Sidebar / Mobile Menu */}
      <aside
        className={`${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static z-40 bg-white border-r w-64 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out h-full md:h-auto`}
      >
        <div>
          {/* Header section */}
          <div className="mb-6 flex items-center justify-between">
            {/* Desktop heading */}
            <h2 className="text-lg font-semibold text-gray-800 hidden md:block">
              Your Dashboard
            </h2>

            {/* Mobile logo link */}
            <a href="/" className="md:hidden flex items-center gap-2">
              <img
                src="/logo-eating-london.svg"
                alt="eating.london"
                className="h-5 opacity-90 hover:opacity-100 transition"
              />
            </a>
          </div>

          <nav className="space-y-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setTab(id as any)
                  setMenuOpen(false)
                }}
                className={`flex items-center w-full gap-3 px-3 py-2 rounded-lg transition ${
                  tab === id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          {profile && (
            <div className="text-sm text-gray-600 mb-3 border-t pt-4 hidden md:block">
              <p>{profile.email}</p>
              <p>
                Credits: <strong>{profile.credits ?? 0}</strong>
              </p>
            </div>
          )}
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/login')
            }}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay when mobile menu is open */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 md:hidden z-30 backdrop-blur-sm bg-white/20"
        ></div>
      )}

      {/* Main content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto mt-0 md:mt-0">
        {tab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Welcome back 👋</h2>
            <div className="bg-white p-6 rounded-lg shadow border">
              <p className="text-gray-700">
                <strong>{profile?.credits ?? 0}</strong> alert credits available
              </p>
              <p className="text-gray-700 mt-1">
                <strong>{activeAlerts.length}</strong> active alerts
              </p>
            </div>

            <button
              onClick={() => router.push('/upgrade')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Buy More Alerts
            </button>
          </div>
        )}

        {tab === 'alerts' && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold mb-2">Active Alerts</h2>
            {activeAlerts.length === 0 && (
              <p className="text-gray-500">No active alerts yet.</p>
            )}
            {activeAlerts.map((a) => (
              <div
                key={a._id}
                className="border rounded-md bg-white shadow-sm p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium capitalize">
                    {renderRestaurantName(a)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {a.dateRange?.start
                      ? new Date(a.dateRange.start).toLocaleDateString()
                      : 'No date set'}{' '}
                    ·{' '}
                    {a.timeRange?.start
                      ? `${a.timeRange.start}${
                          a.timeRange.end ? `–${a.timeRange.end}` : ''
                        }`
                      : 'Any time'}
                  </p>
                  {a.createdAt && (
                    <p className="text-xs text-gray-500">
                      Created: {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500 capitalize">{a.status}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'history' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Alert History</h2>
            {historyAlerts.length === 0 ? (
              <p className="text-gray-500">No alert history yet.</p>
            ) : (
              <ul className="space-y-2">
                {historyAlerts.map((a) => (
                  <li
                    key={a._id}
                    className="border rounded-md bg-white shadow-sm p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium capitalize">
                        {renderRestaurantName(a)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {a.dateRange?.start
                          ? new Date(a.dateRange.start).toLocaleDateString()
                          : 'No date set'}{' '}
                        ·{' '}
                        {a.timeRange?.start
                          ? `${a.timeRange.start}${
                              a.timeRange.end ? `–${a.timeRange.end}` : ''
                            }`
                          : 'Any time'}
                      </p>
                      {a.createdAt && (
                        <p className="text-xs text-gray-500">
                          Created: {new Date(a.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 capitalize">
                      {a.status}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
