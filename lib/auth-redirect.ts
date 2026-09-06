import { withBasePath } from './base-path'

export function getAuthCallbackUrl(origin: string): string {
  return new URL(withBasePath('/auth/callback'), origin).toString()
}

export function getAccountExpiredUrl(origin: string): string {
  const url = new URL(withBasePath('/account'), origin)
  url.searchParams.set('error', 'expired')
  return url.toString()
}

export function getCharacterUrl(origin: string): string {
  return new URL(withBasePath('/character'), origin).toString()
}