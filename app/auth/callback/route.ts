import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '../../../lib/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const origin = url.origin

  if (!code) {
    return NextResponse.redirect(`${origin}/account?error=expired`)
  }

  try {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(`${origin}/account?error=expired`)
    }

    return NextResponse.redirect(`${origin}/character`)
  } catch {
    return NextResponse.redirect(`${origin}/account?error=expired`)
  }
}
