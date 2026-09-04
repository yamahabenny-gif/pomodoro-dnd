# Design-System

> Zuständigkeit: `#junDev` (Umsetzung) · `#SENDEV` (Token-Struktur)
> Geprüft gegen: Vercel Web Interface Guidelines, Impeccable Craft Floor, WCAG 2.2 AA.

## Die visuelle Welt

**Alte Tinte auf Pergament, gelesen bei Kerzenlicht.**

Nicht generisches Fantasy-Rendering, nicht Neon-Gaming, keine violetten Verläufe. Die
Referenz ist ein abgegriffenes Regelwerk auf einem Tisch: warme Schwarztöne, gebrannter
Messing-Akzent, gestochene Kapitälchen als Überschrift, Ornament sparsam und nur dort,
wo es eine Kante begründet.

**Warum dunkel als Standard?** Nicht weil Dunkelmodus modern ist, sondern aus der
Nutzungssituation: Ein Fokus-Timer läuft stundenlang im Randblickfeld, oft abends. Eine
helle Fläche, die 25 Minuten leuchtet, ist ermüdend. Der helle Modus („Pergament") ist
vollwertig vorhanden, nicht nachgereicht.

**Woran wir uns *nicht* bedienen:** Verlaufs-Schrift, Glaseffekte als Dekoration,
Karten-Raster aus Icon + Überschrift + Text als Seitenstruktur, Emoji anstelle von
Icons, Kicker-Zeilen über Überschriften.

---

## Farben

Alle Werte sind gegen WCAG 2.2 AA geprüft; die Kontrastwerte stehen dabei.

### Dunkel — „Dungeon" (Standard)

| Token | Wert | Verwendung | Kontrast |
|---|---|---|---|
| `--bg` | `#14110D` | Seitengrund, warmes Schwarz | — |
| `--surface` | `#1D1913` | Karten, Panels | — |
| `--surface-raised` | `#262019` | Hervorgehobene Panels | — |
| `--border` | `#3A3126` | Dekorative Trennlinien | 1.5:1 |
| `--border-strong` | `#766753` | **Kanten von Bedienelementen** | 3.4:1 auf `--bg` |
| `--text` | `#EDE4D3` | Fließtext | 14.9:1 auf `--bg` |
| `--text-muted` | `#A8977B` | Sekundärtext | 6.6:1 auf `--bg` |
| `--accent` | `#D4A72C` | Quest, primäre Aktion, Messing | 8.4:1 auf `--bg` |
| `--accent-ink` | `#14110D` | Text **auf** `--accent` | 8.4:1 |
| `--rest` | `#E08A4C` | Rast, Lagerfeuer | 7.1:1 auf `--bg` |
| `--danger` | `#D9645A` | Fehler, Abbruch | 5.3:1 auf `--bg` |

### Hell — „Pergament"

| Token | Wert | Verwendung | Kontrast |
|---|---|---|---|
| `--bg` | `#F2EADB` | Seitengrund | — |
| `--surface` | `#FBF6EC` | Karten | — |
| `--border` | `#DFD2BC` | Dekorative Trennlinien | 1.3:1 |
| `--border-strong` | `#8C7960` | **Kanten von Bedienelementen** | 3.5:1 auf `--bg` |
| `--text` | `#241C14` | Fließtext | 14.0:1 |
| `--text-muted` | `#6B5B45` | Sekundärtext | 5.5:1 |
| `--accent` | `#7E600F` | Messing, dunkler für Kontrast | 4.9:1 |
| `--rest` | `#9A4E1E` | Rast | 5.0:1 |
| `--danger` | `#9B2F26` | Fehler | 6.2:1 |

> Der Akzent ist im hellen Modus **nicht derselbe Gelbton**. `#D4A72C` auf Pergament
> liegt bei 1.8:1 und ist als Text unbrauchbar. Wer Tokens nur invertiert, produziert
> unlesbare helle Modi.

### Seltenheitsstufen

Funktionale Farben — sie kodieren Information, nicht Stimmung. Deshalb bleiben sie in
beiden Modi erkennbar und werden **nie allein** eingesetzt: jede Stufe trägt zusätzlich
ihren Namen als Text. Farbe ist hier Verstärkung, nicht Träger.

Alle Werte sind gegen die jeweilige Kartenfläche geprüft und liegen zwischen 4.7:1 und 9.5:1.

| Stufe | Dunkel | Hell |
|---|---|---|
| Gewöhnlich | `#A79C8C` | `#5F5648` |
| Ungewöhnlich | `#7BB05A` | `#41692A` |
| Selten | `#5C9BD6` | `#245C93` |
| Episch | `#A87ED4` | `#6A3F9B` |
| Legendär | `#E8B93C` | `#7E600F` |

---

## Typografie

Drei Schnitte, jeder mit einer Aufgabe. Alle über Google Fonts verfügbar und frei lizenziert.

| Rolle | Schrift | Warum |
|---|---|---|
| Überschriften | **Cinzel** 600/700 | Römische Inschriften-Kapitälchen. Trägt das Historische, ohne ins Kostüm zu kippen — im Gegensatz zu Unzial- oder Fraktur-Schnitten, die nach Mittelalter-Markt aussehen. |
| Fließtext & UI | **Alegreya Sans** 400/500/700 | Humanistische Grotesk mit literarischer Herkunft. Wärmer als Inter, auf kleinen Größen einwandfrei lesbar. |
| Timer-Ziffern | **Alegreya Sans** 700, `tabular-nums` | Kein Zier-Schnitt. Die Zahl muss aus drei Metern Entfernung im Augenwinkel lesbar sein — der Charakter kommt aus der Fassung ringsum, nicht aus den Ziffern. |

**Verbindliche Regeln:**

- `font-variant-numeric: tabular-nums` auf **jeder** Zahl, die sich verändert. Ohne das
  springt die Ziffernbreite im Sekundentakt und der Timer zappelt sichtbar.
- Laufweite (`letter-spacing`) nicht enger als `-0.03em`. Cinzel-Versalien brauchen
  eher `+0.02em` — Kapitälchen ohne Sperrung kleben.
- `text-wrap: balance` auf Überschriften, `text-pretty` auf Absätzen.
- Zeilenlänge im Fließtext 65–75 Zeichen.
- Typografisch korrekt: `…` statt `...`, „deutsche Anführungszeichen", geschützte
  Leerzeichen in `25&nbsp;min` und `H&nbsp;2&nbsp;6&nbsp;H&nbsp;E`.

## Raster und Abstände

4 px Basis, 8 pt Rhythmus: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`.

Über einer Überschrift steht mehr Luft als darunter — die Überschrift gehört zu dem,
was sie einleitet, nicht zu dem, was davor endet.

**Radien:** Karten `14px`. Bedienelemente `8px`. Pillen nur für kleine Marker
(Party-Status, Seltenheits-Chips), nie für Karten.

**Elevation genau einmal deklarieren:**
- Dunkel → **nur Kante** (`1px solid var(--border)`). Ein Schatten auf Fast-Schwarz ist
  unsichtbar; Kante *und* Schatten ergeben die typische Geisterkarte.
- Hell → **nur Schatten**, mit echtem Versatz und weicher Streuung
  (`0 2px 8px -2px rgb(36 28 20 / .18)`). Kein nullversetzter Farbhalo.

## Bewegung

**Ein gestalteter Moment pro Screen, nicht überall ein bisschen.**

| Moment | Dauer | Kurve |
|---|---|---|
| Truhe öffnen (**der** Moment) | 1400 ms, mehrstufig | eigene Choreografie |
| Phasenwechsel Quest ↔ Rast | 600 ms | `cubic-bezier(.16,1,.3,1)` |
| Lagerfeuer-Atmung während der Rast | 4 s, Endlosschleife | `ease-in-out` |
| Hover, Fokus, Umschalter | 120–180 ms | `ease-out` |

Regeln:

- Nur `transform` und `opacity` animieren, plus gezielt `filter`/`clip-path` beim
  Truhen-Moment. Niemals `transition: all`.
- **`prefers-reduced-motion: reduce` ist kein Abschalten, sondern eine zweite Fassung.**
  Die Truhe öffnet sich dann als Überblendung mit demselben Ergebnis und demselben
  emotionalen Beat — nur ohne Bewegung. Wer die Animation ersatzlos streicht, nimmt
  genau den Nutzern die Belohnung weg, die sie am dringendsten brauchen.
- Das Lagerfeuer steht unter `reduce` still.
- Animationen sind unterbrechbar: Wer während der Truhen-Animation klickt, springt
  ans Ende, statt zu warten.

## Icons

**Gezeichnete SVGs, kein Emoji.** Ein Emoji in der Oberfläche rendert auf jedem
Betriebssystem anders, ignoriert die Palette und lässt sich nicht auf eine Strichstärke
bringen. Die sechs Klassen-Sigel und die Zustands-Icons werden als SVG-Set mit
einheitlicher Strichstärke (`1.5px`, `stroke-linecap: round`) angelegt.

Dekorative Icons bekommen `aria-hidden="true"`, Icon-Buttons ein `aria-label`.

## Barrierefreiheit

Nicht der letzte Durchgang, sondern Teil jedes Issues.

- Kontrast 4.5:1 im Fließtext, 3:1 bei großem Text und Bedienelement-Kanten. Deshalb
  gibt es zwei Kanten-Token: `--border` ist dekorativ und darf schwach sein,
  `--border-strong` liegt an allem, was man bedienen kann, und hält 3:1. Ein einziges
  Border-Token, das beides sein soll, ist entweder unsichtbar oder zu laut.
- Sichtbarer Fokusring auf **allem** Bedienbaren: `:focus-visible`, zweifarbig
  (Akzent + Grund), damit er auf hellen wie dunklen Flächen steht. Nie `outline: none`
  ohne Ersatz.
- Vollständig mit der Tastatur bedienbar, inklusive Truhe öffnen und Party beitreten.
- Der Timer meldet Phasenwechsel über `aria-live="polite"` — **nicht** jede Sekunde.
  Ein Screenreader, der 1500-mal die Restzeit vorliest, ist unbenutzbar.
- Der Party-Code ist ein Textfeld mit `spellCheck={false}`, `autocomplete="off"`,
  `inputmode` passend, und **Einfügen ist erlaubt**. Codes werden kopiert, nicht getippt.
- Zoom bis 200 % ohne horizontales Scrollen. Kein `user-scalable=no`.
- `color-scheme` auf `<html>`, damit Scrollbalken und native Felder mitziehen.
- `<meta name="theme-color">` passend zum jeweiligen Modus.

## Browser-Oberflächen mitgestalten

Das, was der Browser von sich aus zeichnet, gehört auch zum Design: Textauswahl,
Caret-Farbe, Scrollbalken, Fokusring, Unterstreichungs-Abstand. Diese Werte werden aus
der Palette gesetzt und nicht dem Standard überlassen.

## Zustände — vollständig

Ein Screen ist erst fertig, wenn diese Zustände alle gestaltet sind:

`leer` · `lädt` · `Fehler` · `offline` · `pausiert` · `Party wartet` · `sehr langer Name`
· `ein Mitglied` · `zwölf Mitglieder`

Fehlermeldungen benennen das Problem **und** den nächsten Schritt: nicht
„Ungültiger Code", sondern „Diese Party gibt es nicht. Prüf den Code — er hat fünf
Zeichen und enthält kein I, L, O oder U."
