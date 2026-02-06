import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getDashboardRoute } from '@/lib/rbac'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Get user profile to determine role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile?.role) {
        return NextResponse.redirect(
          new URL(getDashboardRoute(profile.role), requestUrl.origin)
        )
      }
    }
  }

  // Redirect to error page if something went wrong
  return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
}
