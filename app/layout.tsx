import type { Metadata, Viewport } from 'next'
import { Alegreya_Sans, Cinzel } from 'next/font/google'
import './globals.css'

const ui = Alegreya_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-ui',
  display: 'swap',
  preload: true,
})

const display = Cinzel({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'D&D Pomodoro',
  description: 'Fokus wird zum Abenteuer.',
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#14110D' },
    { media: '(prefers-color-scheme: light)', color: '#F2EADB' },
  ],
}

const themeScript = `
(() => {
  const saved = localStorage.getItem('theme') || 'system';
  const dark = saved === 'dark' || (saved === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
})();`

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className={`${ui.variable} ${display.variable}`}>{children}</body>
    </html>
  )
}
