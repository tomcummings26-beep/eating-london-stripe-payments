import { redirect } from 'next/navigation'

// ✅ Redirect root of app.eating.london → main Framer site
export default function HomeRedirect() {
  redirect('https://eating.london')
}

