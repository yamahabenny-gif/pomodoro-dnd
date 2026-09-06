import { afterEach, describe, expect, it, vi } from 'vitest'
import { withBasePath } from '../base-path'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('withBasePath', () => {
  it('leaves public URLs at the site root when no base path is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '')

    expect(withBasePath('/assets/phase1-art-pack.svg#intro-forest-bg')).toBe('/assets/phase1-art-pack.svg#intro-forest-bg')
  })

  it.each(['/preview', '/uat'])('prefixes public URLs for %s', (basePath) => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', basePath)

    expect(withBasePath('/assets/phase1-art-pack.svg#intro-forest-bg')).toBe(
      `${basePath}/assets/phase1-art-pack.svg#intro-forest-bg`,
    )
    expect(withBasePath('/camp')).toBe(`${basePath}/camp`)
  })
})
