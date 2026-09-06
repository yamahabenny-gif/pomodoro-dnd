import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

export default [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
  }),
  {
    // next-env.d.ts wird von Next.js bei jedem build/dev neu geschrieben
    // und darf laut eigenem Dateikommentar nicht manuell gepflegt werden
    // (siehe .gitignore und #73) - ESLint soll den generierten Inhalt
    // deshalb nie bewerten, unabhaengig davon, ob die Datei gerade existiert.
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
]
