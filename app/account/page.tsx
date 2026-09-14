import { AccountForm } from './account-form'
import { withBasePath } from '../../lib/base-path'
import styles from './account.module.css'

const campfireImage = `url(${withBasePath('/assets/world/camp/ui-account-campfire-key-16x9.svg')})`

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams

  return (
    <main
      id="main-content"
      className={styles.shell}
      style={{ ['--account-campfire-image' as string]: campfireImage }}
    >
      <section className={styles.card} aria-labelledby="account-title">
        <p className="eyebrow">Am Feuer</p>
        <h1 id="account-title">Nur noch ein kleiner Schritt.</h1>
        <p>
          Damit dein Charakter und dein Fortschritt nicht im nächsten Nebel verschwinden, brauchst du einen Account.
          Kein Passwort — wir schicken dir einfach einen Anmeldelink.
        </p>
        <AccountForm expired={params.error === 'expired'} />
      </section>
    </main>
  )
}
