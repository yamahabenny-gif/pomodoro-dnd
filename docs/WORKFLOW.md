# Arbeitsweise

> Diese Seite ist verbindlich für alle Mitwirkenden — Menschen wie Agents.

## Der Grundsatz

**Was nicht in GitHub steht, existiert nicht.**

Kein Wissen in DMs, keine Absprache "kurz mündlich", keine ToDo-Liste im Kopf oder in
einem privaten Notiz-Tool. Dieses Repo ist die einzige Quelle der Wahrheit — für den Code,
für die offenen Aufgaben und für die Gründe hinter Entscheidungen.

Das ist keine Bürokratie, sondern eine Notwendigkeit: Dieses Projekt wird später von einem
**anderen Team** übernommen und gehostet. Alles, was nur in einem Kopf existiert, geht bei
der Übergabe verloren.

## Die drei Hashtags

Jedes Issue und jeder Pull Request trägt Hashtags im Titel. Sie sind gleichzeitig als
GitHub-Labels gesetzt, damit man filtern kann.

### `#SENDEV` — Senior Development

Aufgaben, die Systemverständnis oder Sicherheitsbewusstsein voraussetzen und bei denen
ein Fehler teuer ist:

- Sync-Protokoll, Zeit-Logik, Clock-Skew
- Datenmodell, Migrationen, Row Level Security
- Auth-Flows, Sitzungen, Rate-Limiting
- Serverseitige Loot- und XP-Berechnung
- Deployment, Infrastruktur, Secrets

### `#junDev` — Junior Development

Klar abgegrenzte Aufgaben mit sichtbarem Ergebnis und begrenztem Schadensradius.
Ausdrücklich **nicht** "die langweiligen Reste" — hier liegt der ganze sichtbare Teil
des Produkts:

- UI-Komponenten nach Design-System
- Animationen (Truhe, Lagerfeuer, Phasenübergänge)
- Screens zusammensetzen, Zustände abdecken (leer, lädt, Fehler)
- Texte und Mikro-Copy
- Accessibility-Durchgänge
- Tests für einzelne Komponenten

Jedes `#junDev`-Issue **muss** enthalten: Akzeptanzkriterien, betroffene Dateien und
einen benannten Ansprechpartner für Rückfragen. Ein Issue, das diese drei Dinge nicht
hat, ist noch kein `#junDev`-Issue.

### `#release` — Freigabe durch das Release Team

Alles, was nach außen wirkt oder schwer rückholbar ist. **Merge erst nach ausdrücklicher
Freigabe durch das Release Team.**

- Deployment auf `focus.lang-jamin.de`
- DNS- und Domain-Änderungen
- Schema-Migrationen gegen Produktion
- Änderungen an öffentlichen Texten, Impressum, Datenschutzerklärung
- Versions-Tags, Änderungen an der Lizenz
- Alles, was Nutzerdaten anfasst

`#release` ersetzt `#SENDEV`/`#junDev` nicht — es kommt dazu. Ein Deployment ist
`#release #SENDEV`.

Der kanonische öffentliche Release-Tracker ist **Issue #3**. Die in #3 dokumentierten
Hostinger-Laufzeit-, Backup-, Auth-, DNS- und Rollback-Gates müssen vor jedem Produktions-
Cutover erfüllt sein. Ein gemergter Architektur- oder Dokumentations-PR ist kein Deployment.

## Issues

**Jede Aufgabe ist ein Issue. Kein Issue → keine Arbeit.**

Titelformat:

```
#SENDEV Party-Sync: Clock-Skew-Abgleich implementieren
#junDev Chest-Opening-Animation mit Reduced-Motion-Fallback
#release #SENDEV Hostinger-Deployment für focus.lang-jamin.de
```

Fällt dir bei der Arbeit etwas Zusätzliches auf, gilt: **nicht nebenbei miterledigen,
sondern ein Issue aufmachen.** Ein Pull Request, der drei unzusammenhängende Dinge
enthält, ist nicht reviewbar.

## Branches

```
main                      geschützt, immer deploybar
feat/<issue>-kurzname     feat/42-clock-skew
fix/<issue>-kurzname
docs/<kurzname>
```

## Pull Requests

- Titel trägt dieselben Hashtags wie das Issue.
- Body enthält `Closes #<nummer>`.
- Bei UI-Änderungen: **Screenshot oder kurzes Video**, hell und dunkel.
- Ein PR bearbeitet ein Thema.

**Reviews:** `#junDev`-PRs brauchen ein Review von einem `#SENDEV`.
`#SENDEV`-PRs brauchen ein Review von einem anderen `#SENDEV`.
`#release`-PRs brauchen zusätzlich die ausdrückliche Freigabe des Release Teams
als Kommentar im PR — ein Approve allein reicht nicht.

## Entscheidungen festhalten

Jede Entscheidung, bei der es eine ernsthafte Alternative gab, kommt als kurzer
ADR nach [DECISIONS.md](DECISIONS.md). Vier Zeilen reichen: Kontext, Entscheidung,
Alternative, Grund.

Der Sinn ist nicht Dokumentation um ihrer selbst willen. Der Sinn ist, dass in sechs
Monaten niemand eine Entscheidung zurückdreht, ohne den Grund zu kennen — und dass
das übernehmende Team nicht raten muss.

## Für Agents

Wer als KI-Agent an diesem Repo arbeitet, hält sich an dieselben Regeln:

1. **Zuerst lesen**, was schon dokumentiert ist — `docs/` und offene Issues.
2. **Issue anlegen oder zuweisen**, bevor Code entsteht.
3. **Ergebnisse ins Repo schreiben**, nicht nur in den Chat. Ein Ergebnis, das nur im
   Gesprächsverlauf steht, ist für das Team nicht existent.
4. **Nichts als `#release` mergen** — Freigabe liegt beim Release Team, immer.
5. **Unsicherheiten als offene Frage im Issue notieren**, nicht stillschweigend eine
   Annahme treffen und weiterbauen.
