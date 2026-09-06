import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// `BASE_PATH`/`withBasePath` lesen `process.env.NEXT_PUBLIC_BASE_PATH` beim
// Modul-Import aus (genau wie next.config.mjs `basePath` beim Next.js-Build
// ausliest). Um beide Konfigurationen (kein basePath / `/preview` /
// `/uat`) in einer Testdatei zu prüfen, muss das Modul nach jeder
// Env-Änderung frisch importiert werden.
async function importWithBasePath(value: string | undefined) {
  vi.resetModules()
  if (value === undefined) {
    delete process.env.NEXT_PUBLIC_BASE_PATH
  } else {
    process.env.NEXT_PUBLIC_BASE_PATH = value
  }
  return import('../base-path')
}

describe('base-path', () => {
  const original = process.env.NEXT_PUBLIC_BASE_PATH

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_BASE_PATH
    } else {
      process.env.NEXT_PUBLIC_BASE_PATH = original
    }
    vi.resetModules()
  })

  it('liefert einen leeren basePath, wenn NEXT_PUBLIC_BASE_PATH nicht gesetzt ist (Standard-Build)', async () => {
    const { BASE_PATH, withBasePath } = await importWithBasePath(undefined)
    expect(BASE_PATH).toBe('')
    expect(withBasePath('/auth/callback')).toBe('/auth/callback')
    expect(withBasePath('/camp')).toBe('/camp')
  })

  it('hängt /preview voran, wenn NEXT_BASE_PATH=/preview gebaut wurde', async () => {
    const { withBasePath } = await importWithBasePath('/preview')
    expect(withBasePath('/auth/callback')).toBe('/preview/auth/callback')
    expect(withBasePath('/account?error=expired')).toBe('/preview/account?error=expired')
    expect(withBasePath('/character')).toBe('/preview/character')
    expect(withBasePath('/camp')).toBe('/preview/camp')
  })

  it('hängt /uat voran, wenn NEXT_BASE_PATH=/uat gebaut wurde', async () => {
    const { withBasePath } = await importWithBasePath('/uat')
    expect(withBasePath('/auth/callback')).toBe('/uat/auth/callback')
  })

  it('simuliert den Magic-Link-Redirect (emailRedirectTo) korrekt mit basePath', async () => {
    // Reproduziert exakt die Zusammensetzung aus
    // app/account/account-form.tsx, ohne einen echten Browser/Supabase-
    // Projekt zu benötigen: `${window.location.origin}${withBasePath(...)}`.
    const { withBasePath } = await importWithBasePath('/preview')
    const origin = 'https://focus.lang-jamin.de'
    const emailRedirectTo = `${origin}${withBasePath('/auth/callback')}`
    expect(emailRedirectTo).toBe('https://focus.lang-jamin.de/preview/auth/callback')
  })
})
