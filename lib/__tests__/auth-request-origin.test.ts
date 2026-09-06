import { afterEach, describe, expect, it, vi } from 'vitest'
import { getAccountExpiredUrl, getCharacterUrl } from '../auth-redirect'
import { getAuthRequestOrigin } from '../auth-request-origin'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('getAuthRequestOrigin', () => {
  it.each(['/preview', '/uat'])(
    'uses the trusted external HTTPS origin and preserves the %s redirect prefix',
    (basePath) => {
      vi.stubEnv('NEXT_PUBLIC_BASE_PATH', basePath)
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://focus.lang-jamin.de')
      const request = new Request('http://localhost:3000/auth/callback?code=abc', {
        headers: {
          'x-forwarded-host': 'focus.lang-jamin.de',
          'x-forwarded-proto': 'https',
        },
      })

      const origin = getAuthRequestOrigin(request)

      expect(origin).toBe('https://focus.lang-jamin.de')
      expect(getAccountExpiredUrl(origin)).toBe(`https://focus.lang-jamin.de${basePath}/account?error=expired`)
      expect(getCharacterUrl(origin)).toBe(`https://focus.lang-jamin.de${basePath}/character`)
    },
  )

  it('rejects untrusted forwarded hosts and protocols', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://focus.lang-jamin.de')
    const request = new Request('http://localhost:3000/auth/callback?code=abc', {
      headers: {
        'x-forwarded-host': 'attacker.example',
        'x-forwarded-proto': 'http',
      },
    })

    expect(getAuthRequestOrigin(request)).toBe('https://focus.lang-jamin.de')
  })
})
