# ui-account-campfire — Login / Account Shell

## Verwendung
Hintergrund für „Am Feuer“ Account-Screen (`account.module.css` `.shell`). Ersetzt den reinen Radial-Gradienten.

## Dateien
- `ui-account-campfire-key-16x9.svg` — Haupt-Key-Visual (cover)
- `ui-account-campfire-mid.svg` — optional Parallax/Layer

## Zielpfad (Vorschlag)
`public/assets/world/camp/ui-account-campfire-key-16x9.svg`

## Komposition
- Adult Cozy Fantasy, Lagerfeuer-Wärme (Bernstein/Rest `#E08A4C`, Messing `#D4A72C`) gegen Nachtblau/Schwarz
- **Safe Zone Mitte** (~Kartenbereich): absichtlich ruhiger/dunkler, damit die Login-Card lesbar bleibt
- Feuer leicht links der Mitte unten; Zelt-Silhouette links; Bäume als Rahmen
- Keine Texte/UI/Figuren im Bild

## Einbindung (Layout)
- `background-image` auf `.shell`, `background-size: cover`, `background-position: center 40%`
- Overlay behalten oder leichten `rgba(20,17,13,.45)` Scrim für Kontrast der Form
- Dark/Dungeon first; Light-Mode: dunkleres Bild belassen + Card auf Pergament-Tokens
- Reduced Motion: statisches Bild, kein Flackern nötig (SVG ist still)

## Mobile
9:16 Crop: Fokus auf Feuer + Mitte (`background-position: 45% 55%`), Seitenbäume dürfen abgeschnitten werden.
