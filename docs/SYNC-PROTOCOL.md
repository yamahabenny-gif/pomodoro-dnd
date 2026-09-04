# Party-Sync-Protokoll

> Zuständigkeit: `#SENDEV` · Status: **Draft, review-bedürftig**
> Dies ist die Spezifikation, gegen die implementiert wird. Abweichungen brauchen einen ADR.

## Das Problem

Anforderung: *"Man kann sich mit einem 5-stelligen Code syncen und die Gruppe arbeitet
dann gemeinsam, also alle sehen die gleiche Uhrzeit."*

Die naheliegende Lösung — jeder Client zählt mit `setInterval` runter — hält dem nicht stand:

| Fehlerfall | Was passiert |
|---|---|
| Browser-Tab im Hintergrund | Chrome drosselt Timer auf ≥1 s, iOS Safari friert sie ganz ein. Nach 25 min fehlen Minuten. |
| Laptop klappt zu | Der Countdown steht, die Wanduhr läuft weiter. |
| Jemand tritt später bei | Hat keinen Startpunkt und rät. |
| Falsch gestellte Systemuhr | Client zeigt eine völlig andere Zeit als die Party. |
| Netz weg, Netz wieder da | Der lokale Zähler ist nicht mehr autoritativ, weiß es aber nicht. |

## Das Prinzip

**Der Timer ist kein Countdown. Der Timer ist ein Zeitstempel.**

Genau das macht das Referenzprojekt
[devmobasa/omarchy-pomodoro](https://github.com/devmobasa/omarchy-pomodoro) schon lokal:
sein Zustand liegt in einer Datei, verankert an der Wanduhr, damit ein Shell-Neustart den
Countdown *exakt* fortsetzt. Wir heben dieses Prinzip von "eine Maschine über Neustarts"
auf "n Maschinen gleichzeitig".

Der Server hält pro Party **einen** autoritativen Zustand:

```ts
type PartyPhase = {
  phase:            'quest' | 'rest' | 'long_rest'
  phase_started_at: string  // ISO-8601 UTC, vom Server gesetzt
  phase_duration_s: number
  paused_at:        string | null
  cycle:            number  // 1..4, für die Lange Rast
}
```

Jeder Client rechnet daraus **selbst**:

```ts
const remaining = phase_started_at + phase_duration_s - serverNow()
```

Über die Leitung geht **kein Tick** — nur Phasenwechsel. Das bedeutet: ein
Party-Mitglied, das 20 Minuten offline war, ist bei der ersten Antwort sofort
wieder exakt synchron. Die Restzeit ist kein Zustand, der gepflegt werden muss,
sondern ein Wert, der berechnet wird.

## Uhren-Abgleich (Clock Skew)

`serverNow()` darf nicht `Date.now()` sein — Client-Uhren gehen falsch, teils um Minuten.
Beim Verbindungsaufbau wird deshalb ein Offset gemessen, im Prinzip wie bei NTP:

```ts
const t0 = Date.now()
const { server_time } = await api.time()      // ein einziger, sehr schlanker Endpoint
const t1 = Date.now()

const rtt    = t1 - t0
const offset = server_time + rtt / 2 - t1      // Annahme: Latenz symmetrisch

serverNow = () => Date.now() + offset
```

**Regeln für die Umsetzung:**

- Fünf Messungen beim Verbindungsaufbau, den **Median** nehmen. Ein einzelner Ausreißer
  durch einen langsamen Request darf den Offset nicht verziehen.
- Messungen mit `rtt > 1500 ms` verwerfen — bei hoher Latenz trägt die
  Symmetrie-Annahme nicht mehr.
- Alle 5 Minuten und **nach jedem Reconnect** neu messen.
- Offset im Speicher halten, **nicht** persistieren. Nach einem Standby ist er wertlos.

Ein Restfehler von ±100 ms bleibt. Bei einem 25-Minuten-Timer, der sekundengenau
angezeigt wird, ist das unsichtbar — genau deshalb ist der Ansatz hier tragfähig.

## Darstellung im Client

- **Rendern über `requestAnimationFrame`, nicht `setInterval`.** Nicht wegen der
  Bildrate, sondern weil rAF im Hintergrund-Tab pausiert und beim Zurückkehren sofort
  mit dem *aktuellen* Wert weiterläuft. Ein `setInterval` würde aufholen wollen.
- **Bei `visibilitychange` → sichtbar:** sofort neu berechnen und rendern, bevor der
  erste Frame gezeichnet wird. Sonst blitzt ein veralteter Wert auf.
- **Anzeige mit `font-variant-numeric: tabular-nums`.** Ohne das springt die Ziffernbreite
  jede Sekunde und der Timer zappelt.
- Läuft `remaining` unter 0 und der Server hat noch nicht gewechselt: bei `00:00` stehen
  bleiben und einen dezenten "warte auf Party"-Zustand zeigen. **Nicht** ins Negative
  laufen und **nicht** selbst die nächste Phase erraten.

## Phasenwechsel

Autoritativ ist ausschließlich der Server.

1. Der Client erkennt lokal `remaining <= 0` und meldet **eine** `phase_complete`-Nachricht
   (idempotent, mit der aktuellen `phase_started_at` als Schlüssel).
2. Der Server prüft gegen seine eigene Uhr, schreibt die neue Phase und broadcastet sie.
3. Alle Clients übernehmen den neuen Zustand.

Meldet kein Client (alle offline), wird die Phase beim nächsten Beitritt **lazy**
weitergerechnet: aus `phase_started_at` und der vergangenen Zeit ergibt sich eindeutig,
wo die Party stehen müsste. Ein Cron-Job ist dafür ausdrücklich **nicht** nötig.

> **Offene Frage für den Review:** Sollen verpasste Phasen nachgeholt werden (Party war
> 3 h offline → Quest gilt als absolviert, Truhe wird gutgeschrieben) oder verfallen?
> Empfehlung: **verfallen**, und die Party landet in einem `idle`-Zustand. Alles andere
> lädt zum Farmen durch Wegklicken ein. → ADR-004, noch offen.

## Party-Codes

```
Alphabet: 0123456789ABCDEFGHJKMNPQRSTVWXYZ   (32 Zeichen, ohne I L O U)
Länge:    5                                   → 32^5 = 33 554 432
Beispiel: H26HE
```

- `I`/`L` sind von `1` und `O` von `0` beim Vorlesen nicht zu trennen — deshalb raus.
- `U` fliegt raus, damit keine ungewollten Wörter entstehen.
- Eingabe **case-insensitive**; zusätzlich `I→1`, `L→1`, `O→0` beim Parsen mappen,
  damit ein abgetipptes `HZ6HE` vs. `H26HE` nicht an Kleinigkeiten scheitert.
- Anzeige immer in Großbuchstaben, monospace, mit Abstand: `H 2 6 H E`.

**Kollisionen und Recycling:** Codes werden bei der Erstellung zufällig gezogen und
gegen die Tabelle geprüft (Unique-Constraint, bei Kollision neu ziehen). Eine Party ohne
Aktivität wird nach **30 Tagen** archiviert und ihr Code freigegeben.

**Missbrauchsschutz:** Der Code ist kurz genug, um ihn zu erraten. Deshalb:
- Rate-Limit auf Join-Versuche: 10 pro Minute und IP, danach exponentielles Backoff.
- Parties sind standardmäßig **nicht auffindbar** — es gibt keine Liste, keine Suche.
- Der DM kann die Party jederzeit schließen (`locked`), dann sind keine Joins mehr möglich.
- Ein Party-Beitritt gibt **keinen Zugriff auf Accountdaten** anderer Mitglieder,
  nur auf Anzeigename, Klasse und Party-Status.

## Transport

Supabase Realtime, **Broadcast**-Kanal pro Party (`party:H26HE`), nicht Postgres-Changes:

- Broadcast überträgt genau die Payload, die wir wollen, ohne Row-Level-Security-Umweg
  bei jedem Ereignis.
- Der autoritative Zustand liegt trotzdem in Postgres — Broadcast ist die
  Benachrichtigung, nicht die Wahrheit. Beim Verbindungsaufbau wird **immer** aus der
  Datenbank gelesen, nie aus dem Kanal-Verlauf.

**Presence** (wer ist gerade im Kanal) kommt von Supabase Realtime Presence und
speist die Mitgliederliste im Party-Screen.

## Testfälle, die grün sein müssen

Diese Liste ist die Abnahmebedingung für `#SENDEV Party-Sync implementieren`:

- [ ] Zwei Browser, dieselbe Party — Abweichung < 1 s über 25 min.
- [ ] Tab 10 min in den Hintergrund → beim Zurückkehren sofort korrekt, kein Aufholen.
- [ ] Client-Systemuhr um +5 min verstellt → Anzeige trotzdem korrekt.
- [ ] Beitritt bei Minute 17 einer laufenden Quest → sofort 08:00 verbleibend.
- [ ] Netzwerk 2 min getrennt → nach Reconnect korrekt, ohne Reload.
- [ ] Alle Clients offline über einen Phasenwechsel → definierter Zustand beim Beitritt.
- [ ] Zwei Clients melden gleichzeitig `phase_complete` → genau **ein** Phasenwechsel.
- [ ] Laptop-Standby über eine ganze Phase → korrekt, kein Sprung ins Negative.
