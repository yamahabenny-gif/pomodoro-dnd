import Link from 'next/link'
import { redirect } from 'next/navigation'
import { withBasePath } from '../../lib/base-path'
import { createSupabaseServerClient } from '../../lib/supabase/server'
import styles from './adventure-book.module.css'

export const dynamic = 'force-dynamic'

export default async function AdventureBookPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/account')

  const { data: character } = await supabase
    .from('characters')
    .select('name')
    .eq('profile_id', user.id)
    .maybeSingle()

  if (!character) redirect('/character')

  return (
    <main id="main-content" className={styles.shell}>
      <section className={styles.book} aria-labelledby="book-title">
        <div className={styles.heading}>
          <p className="eyebrow">Abenteuerbuch</p>
          <h1 id="book-title">Heute wartet nur ein Weg.</h1>
          <p>
            Kein Stapel voller Pflichten. Nur eine kleine Spur im Unterholz, die für fünfzehn ruhige Minuten deine
            Aufmerksamkeit gebrauchen könnte.
          </p>
        </div>

        <article className={styles.quest} aria-labelledby="quest-title">
          <div className={styles.questArt} aria-hidden="true">
            <svg viewBox="0 0 1600 900" focusable="false">
              <use href={withBasePath('/assets/phase1-art-pack.svg#quest-light-undergrowth-beat-01')} />
            </svg>
          </div>

          <div className={styles.questCopy}>
            <div className={styles.meta}>
              <span>Erste Quest</span>
              <strong>15 Minuten</strong>
            </div>
            <h2 id="quest-title">Ein Licht im Unterholz</h2>
            <p>
              Zwischen Farnen flackert ein schwaches Licht. Folge ihm ein Stück und widme dich dabei genau einer Sache,
              die heute wirklich weiterkommen soll.
            </p>
            <p>Du musst nichts beweisen. Fünfzehn Minuten reichen für diesen Abschnitt des Weges.</p>

            <Link className={styles.departure} href="/quest/first-light">
              Zum Aufbruch
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>

        <Link className={styles.back} href="/camp">
          Zurück ans Feuer
        </Link>
      </section>
    </main>
  )
}
