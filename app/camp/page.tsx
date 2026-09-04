import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '../../lib/supabase/server'
import styles from './camp.module.css'

export const dynamic = 'force-dynamic'

const ancestryAssets: Record<string, string> = {
  mensch: 'race-human-base',
  elf: 'race-elf-base',
  zwerg: 'race-dwarf-base',
  goblin: 'race-goblin-base',
  ork: 'race-orc-base',
}

export default async function CampPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/account')

  const [{ data: character }, { data: lanternUnlock }] = await Promise.all([
    supabase.from('characters').select('name, ancestry').eq('profile_id', user.id).maybeSingle(),
    supabase
      .from('unlocks')
      .select('unlock_key')
      .eq('profile_id', user.id)
      .eq('unlock_key', 'alte-weglaterne')
      .maybeSingle(),
  ])

  if (!character) redirect('/character')

  const characterAsset = ancestryAssets[character.ancestry] ?? ancestryAssets.mensch
  const lanternVisible = Boolean(lanternUnlock)

  return (
    <main id="main-content" className={styles.shell}>
      <section className={styles.stage} aria-labelledby="camp-title">
        <svg className={styles.campArt} viewBox="0 0 1600 900" aria-hidden="true" focusable="false">
          <use href="/assets/phase1-art-pack.svg#camp-stage-01-base" />
          {lanternVisible ? <use href="/assets/phase1-art-pack.svg#camp-stage-01-lantern" /> : null}
        </svg>

        <div className={styles.character} aria-label={`${character.name}, dein Charakter`}>
          <svg viewBox="0 0 220 260" aria-hidden="true" focusable="false">
            <use href={`/assets/phase1-art-pack.svg#${characterAsset}`} />
          </svg>
          <span>{character.name}</span>
        </div>

        <div className={styles.narration}>
          <p className="eyebrow">Dein Lager</p>
          <h1 id="camp-title">Das Feuer kennt dich schon.</h1>
          <p>
            Für heute reicht ein Platz am Feuer, ein ruhiger Atemzug und ein Buch, das verdächtig nach Arbeit aussieht.
          </p>
        </div>

        <Link className={styles.bookAction} href="/adventure-book" aria-label="Abenteuerbuch öffnen">
          <svg viewBox="0 0 320 220" aria-hidden="true" focusable="false">
            <use href="/assets/phase1-art-pack.svg#camp-adventure-book" />
          </svg>
          <span>Abenteuerbuch öffnen</span>
        </Link>

        <div className={styles.lanternSlot} data-unlocked={lanternVisible}>
          <span className={styles.slotLabel}>Weglaterne</span>
          <span>{lanternVisible ? 'Ihr Licht ist zurück im Lager.' : 'Hier ist noch Platz für etwas, das den Weg kennt.'}</span>
        </div>
      </section>
    </main>
  )
}
