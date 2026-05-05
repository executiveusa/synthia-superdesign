import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { hasRequiredTier, type UserTier } from '@/lib/access-control'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublic =
    pathname === '/' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/u/') ||
    pathname.startsWith('/portfolio') ||
    pathname.startsWith('/pricing') ||
    pathname.startsWith('/api/creem-webhook') ||
    pathname.startsWith('/api/whatsapp') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')

  if (isPublic) return NextResponse.next()

  const response = NextResponse.next()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return response

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) =>
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/auth', request.url))

  const gatedRoutes: Array<{ prefix: string; tier: UserTier }> = [
    { prefix: '/studios/image', tier: 'starter' },
    { prefix: '/studios/workflow', tier: 'starter' },
    { prefix: '/studios/lipsync', tier: 'starter' },
    { prefix: '/studios/video', tier: 'pro' },
    { prefix: '/studios/cinema', tier: 'pro' },
    { prefix: '/operator', tier: 'operator' },
  ]
  const matched = gatedRoutes.find((r) => pathname.startsWith(r.prefix))
  if (matched) {
    const { data: profile } = await supabase.from('profiles').select('tier').eq('id', user.id).single()
    if (!hasRequiredTier(profile?.tier, matched.tier)) {
      const target = new URL('/pricing', request.url)
      target.searchParams.set('required_tier', matched.tier)
      target.searchParams.set('next', pathname)
      return NextResponse.redirect(target)
    }
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
}
