'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-6 text-center">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center">
        <Image
          src="/logo-eating-london.svg"
          alt="Eating London"
          width={180}
          height={48}
          priority
        />
      </Link>

      {/* Card */}
      <div className="bg-white shadow-md border border-neutral-200 rounded-2xl p-8 max-w-md w-full space-y-5">
        <h1 className="text-2xl font-semibold text-neutral-800">
          Payment Successful 🎉
        </h1>

        <p className="text-neutral-600 leading-relaxed">
          Thank you for your purchase! Your alert credit
          {`(s)`} have been applied to your account.
        </p>

        <p className="text-neutral-600 leading-relaxed">
          Any pending alerts have now been activated.
        </p>

        <div className="space-y-3 pt-3">
          <Link
            href="/dashboard"
            className="block w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition"
          >
            View Your Dashboard
          </Link>

          <Link
            href="/login"
            className="block w-full text-blue-600 font-medium py-2 rounded-lg hover:underline"
          >
            Create / Log In to Your Account
          </Link>
        </div>
      </div>

      <p className="mt-10 text-xs text-neutral-400">
        eating.london© {new Date().getFullYear()}
      </p>
    </main>
  )
}
