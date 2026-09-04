# Spielkonzept

> Status: **Draft** · Änderungen brauchen ein Issue mit `#SENDEV` und einen ADR-Eintrag.

## Leitgedanke

Ein Pomodoro-Timer scheitert selten an der Technik, sondern daran, dass niemand ihn
benutzt. Die Gamification hier ist deshalb kein Anstrich, sondern übernimmt zwei
konkrete Aufgaben:

1. **Sie macht die Timer-Konfiguration zu einer Entscheidung mit Bedeutung.**
   Niemand stellt gerne Minuten in einem Formular ein. Aber eine Quest wählt man gern —
   und die Quest bringt ihre Dauer mit.
2. **Sie gibt der Pause einen Grund.** Der häufigste Fehler beim Pomodoro ist, die
   Pause zu überspringen. Wenn die Pause "Rast" heißt und der Charakter dort etwas
   regeneriert, wird das Überspringen zu einer sichtbaren Entscheidung.

**Anti-Ziel:** Kein Zwang, keine Streak-Angst, keine Dark Patterns. Wer eine Quest
abbricht, verliert nichts Aufgebautes — er bekommt nur diese eine Truhe nicht.

---

## 1. Charakter und Völker

Beim ersten Start wählt man **ein Volk** und vergibt einen Namen. Das ist die ganze
Charaktererstellung.

**Mensch · Elf · Zwerg · Goblin · Ork**

Die Wahl ist **Identität, keine Mechanik**. Sie bringt keine Zeiten, keine Attribute und
keine Fähigkeiten mit. Der Charakter bleibt dauerhaft, geht auf alle Quests und levelt.
Besondere Fähigkeiten kann er später erhalten — aber **als Gewinn, nicht als Anlage**
(Entscheidung zu K1, Issue #27). Individualisiert wird er über erspielte Ausrüstung,
Kleidung, Begleiter und Kosmetik.

### Warum die Dauer an der Quest hängt und nicht am Charakter

Ein Timer, den man in einem Formular einstellt, wird nicht eingestellt. Deshalb war die
Dauer in einem früheren Entwurf an eine Klasse gebunden — man wählte einen Charakter und
bekam einen Arbeitsrhythmus dazu.

Der bessere Weg hängt sie an die **Quest**: Man wählt „Der verlassene Wachtturm ·
Mittlere Quest · 50 Minuten", und das *ist* die Einstellung. Für die Zielgruppe ist das
entscheidend — wer heute fünfzehn Minuten schafft und morgen fünfzig, soll nicht seinen
Charakter wechseln müssen.

### Quest-Längen

| Stufe | Dauer | Wegabschnitte |
|---|---:|---:|
| Kundschaftergang | 15 min | 3 |
| Kurze Quest | 25 min | 4 |
| Mittlere Quest | 50 min | 5 |
| Epische Quest | 90 min | 6 |

Der **Kundschaftergang** existiert, weil die Zielgruppe sonst beim Einstieg scheitert.
Für Menschen, die Schwierigkeiten haben, lange fokussiert zu bleiben, sind 25 Minuten
nicht der Anfang, sondern schon das Ziel (Entscheidung zu W3, Issue #30).

**XP wird pro fokussierter Minute vergeben**, nicht pro Quest — sonst wäre der
Kundschaftergang die effizienteste Art zu spielen.

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
  statt sie zu bewachen. Es gibt **eine** Handlung — Holz auflegen, ein Klick, drei
  Sekunden — und danach verabschiedet der Screen aktiv: „Das Feuer hält. Geh ruhig."
  Keine Minispiele: Der Zweck der Rast ist, vom Bildschirm wegzukommen, und eine
  Tätigkeit, die fünf Minuten füllt, erreicht das Gegenteil (W1, Issue #30).
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

Beitreten setzt ein Konto und einen Charakter voraus (Entscheidung zu W5, Issue #30) —
der Charakter muss ja am Lagerfeuer sitzen und seine XP behalten können. Der Beitritt
selbst bleibt eine einzige Eingabe: Code eintippen, fertig.

Eingeladen wird **im Lager**, über das Signalhorn. Es gibt keinen getrennten
Multiplayer-Bereich; die Gefährten setzen sich sichtbar mit ans Feuer.

### Gemeinsam arbeiten

- **Eine Uhr für alle.** Alle Mitglieder sehen exakt dieselbe verbleibende Zeit.
  Technisch gelöst über Server-Zeitstempel statt Countdown — siehe
  [SYNC-PROTOCOL.md](SYNC-PROTOCOL.md).
- **Eine gemeinsame Quest.** Die Party ist zusammen unterwegs. Der Party-Screen zeigt
  alle Mitglieder mit Volk und Status.
- **Gruppenquests geben dasselbe.** XP, Gold und Loot fallen genauso an wie im
  Alleingang. Zusätzlich gibt es eine Party-Truhe, deren Stufe mit der Zahl der
  Mitglieder steigt, die durchgezogen haben — **rein additiv**. Niemand bekommt
  weniger, weil jemand anderes abbricht.

### Wer steuert? Niemand.

Es gibt **keinen Dungeon Master**. Der Aufbruch geschieht per **Bereitschaftsprüfung**:
Alle bestätigen, dann bricht die Gruppe gemeinsam auf.

Das ist nicht nur freundlicher, es beseitigt eine ganze Klasse von Problemen — keine
Rolle, die weitergereicht werden muss, wenn jemand geht; keine Gruppe, die auf eine
Person wartet; kein sozialer Druck durch eine Person, die alle anderen steuert.

| Handlung | Regel |
|---|---|
| Aufbruch | erst wenn **alle** bereit sind |
| Rast | folgt automatisch, niemand löst sie aus |
| Abbruch | gilt **nur für einen selbst** — die anderen laufen weiter |
| Beitritt während einer Quest | jederzeit, man steigt an der aktuellen Stelle ein |

Niemand verliert XP, Gold oder Loot, weil eine andere Person abbricht.

---

## 5. Was bewusst *nicht* dabei ist

| Nicht dabei | Grund |
|---|---|
| Leaderboards über alle Nutzer | Erzeugt Konkurrenz statt Fokus. Innerhalb der Party reicht Sichtbarkeit. |
| Streak-Verlust / "du hast X verloren" | Bestraft Krankheit und Urlaub. Streaks wachsen, sie brechen nicht. |
| Käufe, Premium, Lootboxen mit Geld | Loot ist Feedback. Sobald Geld im Spiel ist, ist es das nicht mehr. |
| Tracking, wer wie lange gearbeitet hat, für Dritte | Das ist ein Fokus-Tool, kein Überwachungswerkzeug. |
