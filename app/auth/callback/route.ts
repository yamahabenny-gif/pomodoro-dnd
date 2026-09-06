import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '../../../lib/supabase/server'
import { withBasePath } from '../../../lib/base-path'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const origin = url.origin

  if (!code) {
    return NextResponse.redirect(`${origin}${withBasePath('/account?error=expired')}`)
  }

  try {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(`${origin}${withBasePath('/account?error=expired')}`)
    }

    return NextResponse.redirect(`${origin}${withBasePath('/character')}`)
  } catch {
    return NextResponse.redirect(`${origin}${withBasePath('/account?error=expired')}`)
  }
}
