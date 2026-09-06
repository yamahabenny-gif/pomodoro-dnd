const LOCAL_ORIGIN = 'http://localhost:3000'

function getConfiguredOrigin(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? LOCAL_ORIGIN
  const url = new URL(configuredUrl)

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('NEXT_PUBLIC_SITE_URL must use HTTP or HTTPS.')
  }

  return url.origin
}

function firstForwardedHeaderValue(value: string | null): string | null {
  return value?.split(',', 1)[0]?.trim() || null
}

export function getAuthRequestOrigin(request: Request): string {
  const configuredOrigin = getConfiguredOrigin()
  const forwardedHost = firstForwardedHeaderValue(request.headers.get('x-forwarded-host'))
  const forwardedProto = firstForwardedHeaderValue(request.headers.get('x-forwarded-proto'))

  if (!forwardedHost || !forwardedProto) {
    return configuredOrigin
  }

  try {
    const forwardedOrigin = new URL(`${forwardedProto}://${forwardedHost}`).origin
    return forwardedOrigin === configuredOrigin ? forwardedOrigin : configuredOrigin
  } catch {
    return configuredOrigin
  }
}
