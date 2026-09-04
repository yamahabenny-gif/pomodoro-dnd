# Mitwirken

Willkommen. Bitte lies zuerst [docs/WORKFLOW.md](docs/WORKFLOW.md) — dort steht,
wie hier gearbeitet wird. Diese Seite ist die Kurzfassung.

## In 30 Sekunden

1. **Kein Issue → keine Arbeit.** Jede Aufgabe wird als GitHub Issue erfasst.
2. **Hashtag setzen:** `#SENDEV` oder `#junDev` im Titel — plus `#release`, wenn es
   nach außen wirkt.
3. **Branch** von `main`: `feat/<issue-nr>-kurzname`.
4. **PR** mit `Closes #<nr>`, bei UI-Änderungen mit Screenshot (hell **und** dunkel).
5. **`#release` wird nie ohne ausdrückliche Freigabe des Release Teams gemergt.**

## Was gute Arbeit hier bedeutet

- **Dokumentieren, während du arbeitest**, nicht danach. Das Projekt wird an ein anderes
  Team übergeben — undokumentierte Entscheidungen sind verlorene Entscheidungen.
- **Ein PR, ein Thema.** Etwas anderes fällt dir auf? Issue aufmachen.
- **Zustände vollständig abdecken.** Ein Screen ist nicht fertig, wenn er nur den
  Idealfall zeigt: leer, lädt, Fehler und offline gehören dazu.
- **Barrierefreiheit ist kein späterer Durchgang.** Kontrast, Tastaturbedienung,
  `prefers-reduced-motion` — von Anfang an. Siehe [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md).

## Zeit-Logik

Alles unter `lib/timer/` ist **rein**: keine React-Imports, kein `Date.now()`, keine
Seiteneffekte. Die Uhr wird als Parameter hereingereicht. Wer das umgeht, macht die
Sync-Tests unmöglich — und der Sync ist das Kernfeature dieses Projekts.

## Setup

```bash
git clone https://github.com/yamahabenny-gif/pomodoro-dnd.git
cd pomodoro-dnd
npm install
cp .env.example .env.local   # Werte kommen vom Team, nie ins Repo
npm run dev
```

Fragen? Mach ein Issue mit dem Label `question` auf — dann hat die Antwort auch der
Nächste, der sie braucht.
