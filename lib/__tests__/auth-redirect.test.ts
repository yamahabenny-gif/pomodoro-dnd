import { afterEach, describe, expect, it, vi } from 'vitest'
import { getAccountExpiredUrl, getAuthCallbackUrl, getCharacterUrl } from '../auth-redirect'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('auth redirect URLs', () => {
  it.each(['/preview', '/uat'])('keeps magic-link and callback redirects under %s', (basePath) => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', basePath)

    expect(getAuthCallbackUrl('https://example.test')).toBe(`https://example.test${basePath}/auth/callback`)
    expect(getAccountExpiredUrl('https://example.test')).toBe(
      `https://example.test${basePath}/account?error=expired`,
    )
    expect(getCharacterUrl('https://example.test')).toBe(`https://example.test${basePath}/character`)
  })
})