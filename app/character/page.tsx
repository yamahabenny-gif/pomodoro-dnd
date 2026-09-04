import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '../../lib/supabase/server'
import { CharacterCreator, type CharacterDraft } from './character-creator'
import styles from './character.module.css'

export const dynamic = 'force-dynamic'

export default async function CharacterPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/account')
  }

  const { data: character } = await supabase
    .from('characters')
    .select('name, ancestry, body_variant, skin_variant, hair_style, hair_color')
    .eq('profile_id', user.id)
    .maybeSingle()

  const initialCharacter: CharacterDraft | null = character
    ? {
        name: character.name,
        ancestry: character.ancestry as CharacterDraft['ancestry'],
        bodyVariant: character.body_variant,
        skinVariant: character.skin_variant,
        hairStyle: character.hair_style,
        hairColor: character.hair_color,
      }
    : null

  return (
    <main id="main-content" className={styles.shell}>
      <div className={styles.heading}>
        <p className="eyebrow">Am Feuer · Schritt 2 von 2</p>
        <h1>Wer bricht auf?</h1>
        <p>
          Dein Charakter bleibt bei dir. Volk und Aussehen erzählen, wer mit dir unterwegs ist — sie verändern weder
          Fokusdauer noch Belohnungen.
        </p>
      </div>
      <CharacterCreator userId={user.id} initialCharacter={initialCharacter} />
    </main>
  )
}
