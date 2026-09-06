import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Gleicher Grund wie in auth-request-origin.test.ts: withBasePath()s BASE_PATH
// wird beim Modul-Import einmalig ausgewertet, vi.stubEnv() danach wirkt sich
// darauf nicht mehr aus. Modul nach jeder Env-Änderung frisch importieren.
async function importWithBasePath(basePath: string) {
  vi.resetModules()
  process.env.NEXT_PUBLIC_BASE_PATH = basePath
  return import('../auth-redirect')
}

describe('auth redirect URLs', () => {
  const original = process.env.NEXT_PUBLIC_BASE_PATH

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH
    else process.env.NEXT_PUBLIC_BASE_PATH = original
    vi.resetModules()
  })

  it.each(['/preview', '/uat'])('keeps magic-link and callback redirects under %s', async (basePath) => {
    const { getAuthCallbackUrl, getAccountExpiredUrl, getCharacterUrl } = await importWithBasePath(basePath)

    expect(getAuthCallbackUrl('https://example.test')).toBe(`https://example.test${basePath}/auth/callback`)
    expect(getAccountExpiredUrl('https://example.test')).toBe(
      `https://example.test${basePath}/account?error=expired`,
    )
    expect(getCharacterUrl('https://example.test')).toBe(`https://example.test${basePath}/character`)
  })
})
