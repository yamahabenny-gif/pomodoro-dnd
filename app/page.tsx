import { ThemeSwitcher } from './theme-switcher'

export default function Home() {
  return (
    <main id="main-content" className="shell">
      <section className="foundation-card" aria-labelledby="foundation-title">
        <p className="eyebrow">Das Lager wartet</p>
        <h1 id="foundation-title">Dein Abenteuer beginnt hier.</h1>
        <p>Die technische Grundlage steht. Die Welt wird nun Screen für Screen darauf aufgebaut.</p>
        <button type="button">Quest beginnen</button>
      </section>
      <ThemeSwitcher />
    </main>
  )
}
