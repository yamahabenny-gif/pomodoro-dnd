'use client'

import { useEffect, useState } from 'react'

/**
 * Reads `prefers-reduced-motion` and stays in sync if the person changes it
 * mid-session. CSS handles most of the actual motion reduction (see the
 * `@media (prefers-reduced-motion: reduce)` blocks); this hook exists for the
 * handful of decisions JS has to make anyway — which beat to render, whether
 * to run a rAF loop at all.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}
