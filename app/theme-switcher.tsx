'use client'

import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

function resolved(theme: Theme) {
  if (theme !== 'system') return theme
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored === 'dark' || stored === 'light' || stored === 'system') setTheme(stored)
  }, [])

  useEffect(() => {
    const apply = () => {
      const value = resolved(theme)
      document.documentElement.dataset.theme = value
      document.documentElement.style.colorScheme = value
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#14110D' : '#F2EADB')
    }
    localStorage.setItem('theme', theme)
    apply()
    const media = matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme])

  return (
    <fieldset className="theme-switcher">
      <legend>Darstellung</legend>
      {(['dark', 'light', 'system'] as const).map((value) => (
        <label key={value}>
          <input type="radio" name="theme" value={value} checked={theme === value} onChange={() => setTheme(value)} />
          {value === 'dark' ? 'Dungeon' : value === 'light' ? 'Pergament' : 'System'}
        </label>
      ))}
    </fieldset>
  )
}
