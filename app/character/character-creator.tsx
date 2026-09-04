'use client'

import { FormEvent, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '../../lib/supabase/client'
import styles from './character.module.css'

const ancestries = [
  { id: 'mensch', label: 'Mensch', asset: 'race-human-base', note: 'Findet überall einen Weg hinein' },
  { id: 'elf', label: 'Elf', asset: 'race-elf-base', note: 'Hört, was der Wald noch weiß' },
  { id: 'zwerg', label: 'Zwerg', asset: 'race-dwarf-base', note: 'Vertraut dem Stein mehr als der Karte' },
  { id: 'goblin', label: 'Goblin', asset: 'race-goblin-base', note: 'Nimmt mit, was liegen bleibt' },
  { id: 'ork', label: 'Ork', asset: 'race-orc-base', note: 'Geht weiter, wenn andere umkehren' },
] as const

type Ancestry = (typeof ancestries)[number]['id']

export type CharacterDraft = {
  name: string
  ancestry: Ancestry
  bodyVariant: string
  skinVariant: string
  hairStyle: string
  hairColor: string
}

const defaults: CharacterDraft = {
  name: '',
  ancestry: 'mensch',
  bodyVariant: 'ausgewogen',
  skinVariant: 'warm',
  hairStyle: 'kurz',
  hairColor: 'dunkel',
}

const bodyOptions = [
  ['schmal', 'Schmal'],
  ['ausgewogen', 'Ausgewogen'],
  ['kraeftig', 'Kräftig'],
]
const skinOptions = [
  ['warm', 'Warm'],
  ['kuehl', 'Kühl'],
  ['moos', 'Moos'],
  ['stein', 'Stein'],
]
const hairStyleOptions = [
  ['kurz', 'Kurz'],
  ['lang', 'Lang'],
  ['geflochten', 'Geflochten'],
]
const hairColorOptions = [
  ['dunkel', 'Dunkel'],
  ['kastanie', 'Kastanie'],
  ['kupfer', 'Kupfer'],
  ['silber', 'Silber'],
]

export function CharacterCreator({ userId, initialCharacter }: { userId: string; initialCharacter: CharacterDraft | null }) {
  const router = useRouter()
  const [draft, setDraft] = useState<CharacterDraft>(initialCharacter ?? defaults)
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const selectedAncestry = useMemo(
    () => ancestries.find((ancestry) => ancestry.id === draft.ancestry) ?? ancestries[0],
    [draft.ancestry],
  )

  function update<K extends keyof CharacterDraft>(key: K, value: CharacterDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
    if (status === 'error') setStatus('idle')
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = draft.name.trim()
    if (!name) return

    setStatus('saving')
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.from('characters').upsert(
      {
        profile_id: userId,
        name,
        ancestry: draft.ancestry,
        body_variant: draft.bodyVariant,
        skin_variant: draft.skinVariant,
        hair_style: draft.hairStyle,
        hair_color: draft.hairColor,
      },
      { onConflict: 'profile_id' },
    )

    if (error) {
      setStatus('error')
      return
    }

    router.push('/camp')
  }

  return (
    <form className={styles.creator} onSubmit={save}>
      <fieldset className={styles.raceFieldset}>
        <legend>Volk wählen</legend>
        <div className={styles.raceGrid}>
          {ancestries.map((ancestry) => {
            const selected = draft.ancestry === ancestry.id
            return (
              <button
                key={ancestry.id}
                type="button"
                className={styles.raceOption}
                data-selected={selected}
                aria-pressed={selected}
                onClick={() => update('ancestry', ancestry.id)}
              >
                <svg viewBox="0 0 220 260" aria-hidden="true" focusable="false">
                  <use href={`/assets/phase1-art-pack.svg#${ancestry.asset}`} />
                </svg>
                <strong>{ancestry.label}</strong>
                <span>{ancestry.note}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <section className={styles.detailPanel} aria-labelledby="appearance-title">
        <div className={styles.preview} aria-hidden="true">
          <svg viewBox="0 0 220 260" focusable="false">
            <use href={`/assets/phase1-art-pack.svg#${selectedAncestry.asset}`} />
          </svg>
          <span>{draft.name.trim() || selectedAncestry.label}</span>
        </div>

        <div className={styles.controls}>
          <h2 id="appearance-title">Dein Weggefährte</h2>
          <label>
            Name
            <input
              value={draft.name}
              onChange={(event) => update('name', event.target.value)}
              maxLength={80}
              autoComplete="off"
              required
            />
          </label>

          <div className={styles.selectGrid}>
            <Select label="Körperform" value={draft.bodyVariant} options={bodyOptions} onChange={(value) => update('bodyVariant', value)} />
            <Select label="Haut / Fantasyfarbe" value={draft.skinVariant} options={skinOptions} onChange={(value) => update('skinVariant', value)} />
            <Select label="Frisur" value={draft.hairStyle} options={hairStyleOptions} onChange={(value) => update('hairStyle', value)} />
            <Select label="Haarfarbe" value={draft.hairColor} options={hairColorOptions} onChange={(value) => update('hairColor', value)} />
          </div>

          <p className={styles.scopeNote}>
            Keine Werte, Klassen oder Boni: Diese Auswahl verändert nur, wer in deiner Geschichte sichtbar mitreist.
          </p>

          <div className={styles.actions}>
            <p role="status" aria-live="polite">
              {status === 'error' ? 'Der Charakter konnte nicht gespeichert werden. Versuch es bitte noch einmal.' : ''}
            </p>
            <button type="submit" disabled={status === 'saving'}>
              {status === 'saving' ? 'Wird gespeichert …' : 'Ins Lager aufbrechen'}
            </button>
          </div>
        </div>
      </section>
    </form>
  )
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[][]
  onChange: (value: string) => void
}) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  )
}
