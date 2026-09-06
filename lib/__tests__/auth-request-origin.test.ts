import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// `getAccountExpiredUrl`/`getCharacterUrl` gehen über `lib/auth-redirect.ts` auf
// `withBasePath()`, dessen `BASE_PATH`-Konstante beim Modul-Import einmalig aus
// `process.env.NEXT_PUBLIC_BASE_PATH` gelesen wird (siehe lib/base-path.ts und
// lib/__tests__/base-path.test.ts). `vi.stubEnv()` nach dem ersten Import ändert
// diese bereits ausgewertete Konstante nicht mehr rückwirkend — deshalb hier
// wie dort: Module nach jeder Env-Änderung per `vi.resetModules()` frisch laden.
async function importWithEnv(basePath: string | undefined, siteUrl: string) {
  vi.resetModules()
  if (basePath === undefined) {
    delete process.env.NEXT_PUBLIC_BASE_PATH
  } else {
    process.env.NEXT_PUBLIC_BASE_PATH = basePath
  }
  process.env.NEXT_PUBLIC_SITE_URL = siteUrl
  const [{ getAuthRequestOrigin }, { getAccountExpiredUrl, getCharacterUrl }] = await Promise.all([
    import('../auth-request-origin'),
    import('../auth-redirect'),
  ])
  return { getAuthRequestOrigin, getAccountExpiredUrl, getCharacterUrl }
}

describe('getAuthRequestOrigin', () => {
  const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    if (originalBasePath === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH
    else process.env.NEXT_PUBLIC_BASE_PATH = originalBasePath
    if (originalSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
    else process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl
    vi.resetModules()
  })

  it.each(['/preview', '/uat'])(
    'nutzt die vertrauenswürdige externe HTTPS-Origin und behält das %s-Präfix',
    async (basePath) => {
      const { getAuthRequestOrigin, getAccountExpiredUrl, getCharacterUrl } = await importWithEnv(
        basePath,
        'https://focus.lang-jamin.de',
      )
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

  it('weist nicht vertrauenswürdige Forwarded-Hosts/-Protokolle zurück', async () => {
    const { getAuthRequestOrigin } = await importWithEnv(undefined, 'https://focus.lang-jamin.de')
    const request = new Request('http://localhost:3000/auth/callback?code=abc', {
      headers: {
        'x-forwarded-host': 'attacker.example',
        'x-forwarded-proto': 'http',
      },
    })

    expect(getAuthRequestOrigin(request)).toBe('https://focus.lang-jamin.de')
  })
})
