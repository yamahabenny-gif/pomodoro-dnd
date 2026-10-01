'use client'

import { FormEvent, useEffect, useState } from 'react'
import { getAuthCallbackUrl } from '../../lib/auth-redirect'
import { createSupabaseBrowserClient } from '../../lib/supabase/client'

type Status = 'idle' | 'loading' | 'sent' | 'offline' | 'error'

// Supabase meldet Rate-Limits als HTTP 429 bzw. mit einem `*rate_limit*`-Code
// (z. B. `over_email_send_rate_limit`). Dafür eine eigene Meldung, damit man
// sofort sieht, dass Warten hilft und nicht die Adresse falsch ist.
function isRateLimited(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const { status, code } = error as { status?: unknown; code?: unknown }
  return status === 429 || (typeof code === 'string' && code.includes('rate_limit'))
}

export function AccountForm({ expired }: { expired: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>(expired ? 'error' : 'idle')
  const [message, setMessage] = useState(expired ? 'Der Anmeldelink ist abgelaufen. Schick dir einfach einen neuen.' : '')

  useEffect(() => {
    const syncOnlineState = () => {
      if (!navigator.onLine) {
        setStatus('offline')
        setMessage('Du bist gerade offline. Sobald die Verbindung wieder da ist, kannst du dir den Link schicken lassen.')
      } else if (status === 'offline') {
        setStatus('idle')
        setMessage('')
      }
    }

    syncOnlineState()
    window.addEventListener('online', syncOnlineState)
    window.addEventListener('offline', syncOnlineState)
    return () => {
      window.removeEventListener('online', syncOnlineState)
      window.removeEventListener('offline', syncOnlineState)
    }
  }, [status])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!navigator.onLine) {
      setStatus('offline')
      setMessage('Du bist gerade offline. Versuch es erneut, sobald du wieder verbunden bist.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: getAuthCallbackUrl(window.location.origin) },
      })

      if (error) throw error
      setStatus('sent')
      setMessage('Der Wegweiser ist unterwegs. Schau in dein Postfach und öffne den Link auf diesem Gerät.')
    } catch (error) {
      setStatus('error')
      setMessage(
        isRateLimited(error)
          ? 'Zu viele Versuche, warte kurz. In ein paar Minuten kannst du dir einen neuen Link schicken lassen.'
          : 'Der Link konnte nicht verschickt werden. Prüfe deine Adresse und versuch es noch einmal.',
      )
    }
  }

  return (
    <form onSubmit={onSubmit} aria-describedby="account-status">
      <label htmlFor="email">E-Mail-Adresse</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={status === 'loading' || status === 'sent'}
      />
      <button type="submit" disabled={status === 'loading' || status === 'sent' || status === 'offline'}>
        {status === 'loading' ? 'Wegweiser wird geschickt …' : status === 'sent' ? 'Link verschickt' : 'Anmeldelink senden'}
      </button>
      <p id="account-status" role="status" aria-live="polite">
        {message}
      </p>
    </form>
  )
}
