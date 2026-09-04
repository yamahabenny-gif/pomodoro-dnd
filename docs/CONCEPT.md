# Spielkonzept

> Status: **Draft** · Änderungen brauchen ein Issue mit `#SENDEV` und einen ADR-Eintrag.

## Leitgedanke

Ein Pomodoro-Timer scheitert selten an der Technik, sondern daran, dass niemand ihn
benutzt. Die Gamification hier ist deshalb kein Anstrich, sondern übernimmt zwei
konkrete Aufgaben:

1. **Sie macht die Timer-Konfiguration zu einer Entscheidung mit Bedeutung.**
   Niemand stellt gerne Minuten in einem Formular ein. Aber eine Klasse wählt man gern.
2. **Sie gibt der Pause einen Grund.** Der häufigste Fehler beim Pomodoro ist, die
   Pause zu überspringen. Wenn die Pause "Rast" heißt und der Charakter dort etwas
   regeneriert, wird das Überspringen zu einer sichtbaren Entscheidung.

**Anti-Ziel:** Kein Zwang, keine Streak-Angst, keine Dark Patterns. Wer eine Quest
abbricht, verliert nichts Aufgebautes — er bekommt nur diese eine Truhe nicht.

---

## 1. Klassen

Die Klasse bestimmt das **Timer-Profil** und ein **Passiv**. Sie ist jederzeit
wechselbar (kein Fortschrittsverlust) — die Wahl soll Spaß machen, nicht binden.

| Klasse | Quest | Rast | Lange Rast | Passiv |
|---|---:|---:|---:|---|
| 🛡️ **Krieger** | 25 min | 5 min | 15 min | *Zweiter Wind* — +10 % XP für eine Quest ohne Pause-Skip |
| 🔮 **Magier** | 50 min | 10 min | 25 min | *Arkane Konzentration* — +15 % Chance auf seltene Truhen-Stufen |
| 🗡️ **Schurke** | 15 min | 3 min | 12 min | *Flinke Finger* — jede 3. Quest gibt zwei Truhen |
| ✨ **Kleriker** | 25 min | 8 min | 20 min | *Segen* — in einer Party bekommen **alle** +5 % XP |
| 🏹 **Waldläufer** | 30 min | 6 min | 18 min | *Fährtenleser* — Streak-Bonus wächst doppelt so schnell |
| 🎻 **Barde** | 20 min | 5 min | 15 min | *Inspiration* — +3 % XP je aktivem Party-Mitglied (max. +15 %) |

**Warum diese Zahlen?** Sie decken die real existierenden Arbeitsrhythmen ab —
klassisch (25/5), Deep Work (50/10), ADHS-freundliche Kurzsprints (15/3) — und
verpacken sie so, dass niemand ein Einstellungsmenü öffnen muss. Die freie Konfiguration
bleibt trotzdem in den Settings verfügbar, für alle die sie wollen.

**Balancing-Hinweis für die Umsetzung:** XP wird **pro fokussierter Minute** vergeben,
nicht pro Quest. Sonst wäre der Schurke mit 15-Minuten-Sprints massiv überlegen.
Formel und Kalibrierung: siehe Issue `#SENDEV Loot- und XP-Balancing`.

---

## 2. Der Zyklus

```
  Quest  ──▶  Truhe  ──▶  Rast  ──▶  Quest  ──▶ …
   (4×)                                 │
                                        ▼
                              nach 4 Quests: Lange Rast
```

- **Quest (Fokus).** Die UI wird ruhig: Timer groß, alles andere zurückgenommen.
  Auto-DND schaltet Systembenachrichtigungen stumm (übernommen vom Referenzprojekt).
- **Truhe.** Erscheint nach jeder *abgeschlossenen* Quest. Öffnen ist optional und
  jederzeit nachholbar — sie wartet im Inventar.
- **Rast.** Warme Farben, Lagerfeuer, Atem-Animation. Ein Timer, der zur Pause einlädt
  statt sie zu bewachen.
- **Lange Rast.** Jede vierte Rast, in der Taverne. Hier gibt es die Zusammenfassung
  des Blocks: geschaffte Quests, verdiente XP, Party-Statistik.

---

## 3. Truhen und Loot

Fünf Seltenheitsstufen, angelehnt an die etablierte D&D-/Loot-Konvention:

| Stufe | Farbe | Chance |
|---|---|---:|
| Gewöhnlich | Grau | 55 % |
| Ungewöhnlich | Grün | 25 % |
| Selten | Blau | 13 % |
| Episch | Violett | 6 % |
| Legendär | Gold | 1 % |

Inhalt: **XP**, **Gold** und gelegentlich ein **Item** (rein kosmetisch — Titel,
Charakter-Rahmen, Truhen-Skins). Es gibt bewusst **keine Items mit Spielvorteil** und
**keine Käufe**. Loot ist Feedback, keine Währung.

**Die Öffnungs-Animation ist ein eigenes Feature, kein Detail.** Sie ist der Moment,
in dem die Belohnung passiert — sie bekommt Zeit, Sound und einen sauberen
Reduced-Motion-Fallback. Siehe `#junDev Chest-Opening-Animation`.

---

## 4. Party — das Kernfeature

### Beitreten

Ein **5-stelliger Code**, z. B. `H26HE`. Zeichensatz: `0-9 A-Z` **ohne `I`, `L`, `O`, `U`**
— `I/L/1` und `O/0` sind beim Vorlesen nicht unterscheidbar, und das fehlende `U`
verhindert versehentlich entstehende Wörter. Bleiben 32 Zeichen, also 32⁵ ≈ **33,5 Mio.**
Kombinationen. Eingabe ist case-insensitive; die Anzeige ist immer Großbuchstaben.

Beitreten geht **ohne Account** — Charaktername eingeben, fertig. Wer die Hürde für
eine gemeinsame Fokus-Session hoch legt, bekommt keine gemeinsame Fokus-Session.

### Gemeinsam arbeiten

- **Eine Uhr für alle.** Alle Mitglieder sehen exakt dieselbe verbleibende Zeit.
  Technisch gelöst über Server-Zeitstempel statt Countdown — siehe
  [SYNC-PROTOCOL.md](SYNC-PROTOCOL.md).
- **Eine gemeinsame Quest.** Die Party ist zusammen unterwegs. Der Party-Screen zeigt
  alle Mitglieder mit Klasse und Status.
- **Party-Truhe.** Am Ende einer gemeinsamen Quest gibt es zusätzlich zur eigenen Truhe
  eine Party-Truhe, deren Stufe mit der Anzahl der Mitglieder steigt, die die Quest
  komplett durchgezogen haben.

### Wer steuert?

Die Party hat einen **Dungeon Master** (den Ersteller). Nur er startet, pausiert und
überspringt Phasen. Bei Verlassen wandert die Rolle automatisch weiter.

**Bewusst offen gelassen:** ob Mitglieder eine Pause *vorschlagen* können ("Rast
erbitten") — das ist ein sinnvolles, aber nachgelagertes Feature. Erfasst als
`#junDev` Issue für M4.

---

## 5. Was bewusst *nicht* dabei ist

| Nicht dabei | Grund |
|---|---|
| Leaderboards über alle Nutzer | Erzeugt Konkurrenz statt Fokus. Innerhalb der Party reicht Sichtbarkeit. |
| Streak-Verlust / "du hast X verloren" | Bestraft Krankheit und Urlaub. Streaks wachsen, sie brechen nicht. |
| Käufe, Premium, Lootboxen mit Geld | Loot ist Feedback. Sobald Geld im Spiel ist, ist es das nicht mehr. |
| Tracking, wer wie lange gearbeitet hat, für Dritte | Das ist ein Fokus-Tool, kein Überwachungswerkzeug. |
