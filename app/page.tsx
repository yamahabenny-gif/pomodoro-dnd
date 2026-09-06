import Link from 'next/link'
import { withBasePath } from '../lib/base-path'

function ForestLayer({ id, className }: { id: string; className: string }) {
  return (
    <svg className={className} viewBox="0 0 1600 900" aria-hidden="true" focusable="false">
      <use href={withBasePath(`/assets/phase1-art-pack.svg#${id}`)} />
    </svg>
  )
}

export default function Home() {
  return (
    <main id="main-content" className="intro-shell">
      <section className="forest-intro" aria-labelledby="intro-title">
        <div className="forest-stage" aria-hidden="true">
          <ForestLayer id="intro-forest-bg" className="forest-layer forest-layer-bg" />
          <ForestLayer id="intro-forest-mid" className="forest-layer forest-layer-mid" />
          <ForestLayer id="intro-camp-glow" className="forest-layer forest-layer-glow" />
          <ForestLayer id="intro-forest-fg" className="forest-layer forest-layer-fg" />
        </div>

        <div className="intro-narration">
          <p className="eyebrow">Am Rand des Waldes</p>
          <h1 id="intro-title">Ah. Da bist du ja.</h1>
          <p className="intro-lead">
            Das Feuer brennt noch. Wir haben dir einen Platz freigehalten — direkt dort, wo der Wind nicht ganz so neugierig ist.
          </p>
          <p className="intro-muted">Komm näher. Den Rest klären wir am Feuer.</p>
          <Link className="primary-link" href="/account">
            Zum Feuer
          </Link>
        </div>
      </section>
    </main>
  )
}
