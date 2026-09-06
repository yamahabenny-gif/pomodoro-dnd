import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '../../lib/supabase/server'
import { QUEST_CATALOG } from '../../lib/quests/catalog'
import { withBasePath } from '../../lib/base-path'
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
          <h1 id="book-title">Welcher Weg passt heute zu dir?</h1>
          <p>
            Sechs kleine Wege liegen offen. Manche sind kurz, andere brauchen etwas mehr Wald — keiner davon hat es eilig.
          </p>
        </div>

        <div className={styles.catalog} aria-label="Verfügbare Quests">
          {QUEST_CATALOG.map((quest, index) => (
            <article className={styles.quest} aria-labelledby={`quest-title-${quest.key}`} key={quest.key}>
              <div className={styles.questArt} aria-hidden="true">
                <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" focusable="false">
                  <use href={withBasePath(`/assets/phase1-art-pack.svg#quest-light-undergrowth-beat-0${(index % 4) + 1}`)} />
                </svg>
              </div>

              <div className={styles.questCopy}>
                <div className={styles.meta}>
                  <span>{quest.region} · {quest.location}</span>
                  <strong>{quest.durationMinutes} Minuten</strong>
                </div>
                <h2 id={`quest-title-${quest.key}`}>{quest.title}</h2>
                {quest.assignment.map((paragraph) => paragraph ? <p key={paragraph}>{paragraph}</p> : null)}

                <Link className={styles.departure} href={quest.href}>
                  Diesen Weg wählen
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <Link className={styles.back} href="/camp">
          Zurück ans Feuer
        </Link>
      </section>
    </main>
  )
}
