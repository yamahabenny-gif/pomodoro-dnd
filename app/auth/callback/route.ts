import { NextResponse } from 'next/server'
import { getAccountExpiredUrl, getCharacterUrl } from '../../../lib/auth-redirect'
import { getAuthRequestOrigin } from '../../../lib/auth-request-origin'
import { createSupabaseServerClient } from '../../../lib/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const origin = getAuthRequestOrigin(request)

  if (!code) {
    return NextResponse.redirect(getAccountExpiredUrl(origin))
  }

  try {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(getAccountExpiredUrl(origin))
    }

    return NextResponse.redirect(getCharacterUrl(origin))
  } catch {
    return NextResponse.redirect(getAccountExpiredUrl(origin))
  }
}
