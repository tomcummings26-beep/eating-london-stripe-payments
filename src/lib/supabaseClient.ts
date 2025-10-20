'use client'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase' // optional if you typed your DB

export const supabase = createPagesBrowserClient<Database>()
