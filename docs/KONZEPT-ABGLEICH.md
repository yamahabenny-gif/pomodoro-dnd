# Abgleich: Konzept V1 gegen die vorhandenen Drafts

> Stand 2026-09-04 · Zuständigkeit: `#SENDEV` `#release`
> Quellen: **Konzept V1 – Fantasy Focus Adventure** (anderes Team) gegen
> [CONCEPT.md](CONCEPT.md), [SYNC-PROTOCOL.md](SYNC-PROTOCOL.md),
> [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md), [SCREENS.md](SCREENS.md),
> [DECISIONS.md](DECISIONS.md) und dem Code unter `lib/` und `content/`.

## Kurzfassung

Die beiden Entwürfe sind **nicht dasselbe Produkt mit anderen Worten.** Sie stimmen in
der Haltung fast vollständig überein und weichen in der Struktur erheblich ab.

| | |
|---|---|
| ✅ **Deckungsgleich** | Haltung, Fokusphase, Belohnungslogik, technisches Fundament |
| ⚠️ **Echter Konflikt** | 9 Punkte, davon 2 auf Eigentümer-Ebene |
| 🔴 **Widerspruch in V1 selbst** | 5 Punkte, die V1 intern nicht auflöst |
| 📦 **Bereits gebaut und verwendbar** | Sync-Protokoll, Wanderung, 100 Quests, Design-System |

**Die wichtigste Einsicht aus dem Abgleich:** V1 bringt eine Idee mit, die hier fehlt und
die besser ist als das, was hier steht — **das Lager als Hub, „die Welt ist das Menü"**.
Und die vorhandenen Drafts bringen etwas mit, das V1 als offene Frage führt — die
**technische Lösung für gemeinsames Arbeiten** ist bereits gebaut und getestet.

---

## 1 · Was zusammenpasst

Diese Punkte brauchen keine Entscheidung. Sie sind in beiden Entwürfen gleich und im
Repo teilweise schon umgesetzt.

| Thema | V1 | Vorhandener Draft | Status |
|---|---|---|---|
| Keine Bestrafung, kein FOMO | §14 | CONCEPT „Was bewusst nicht dabei ist" | ✅ |
| Loot rein kosmetisch, kein Pay-to-Win | §9, §10 | ADR-006 | ✅ |
| Fokusphase ohne nötige Interaktion | §7 | MOTION-ENGINE, Quest-Screen | ✅ **gebaut** |
| Abenteuer läuft in Stufen weiter | §7 | `beats` + `beatIndexAt()` | ✅ **gebaut** |
| Quest statt „50-Minuten-Pomodoro" | §6 | 100 Quests mit Titel und Region | ✅ **gebaut** |
| Belohnung aus echter Fokuszeit | §9 | ADR-006, XP pro fokussierter Minute | ✅ |
| Keine SaaS-App mit Fantasy-Anstrich | §15 | ART-DIRECTION | ✅ |
| Musik und Ton dezent | §7 | Einstellungen | ✅ |

**Besonders erwähnenswert:** V1 §7 verlangt, dass die Animation „lediglich im Hintergrund
erzählt" und keine Interaktion nötig ist. Genau dafür ist
[`lib/timer/journey.ts`](../lib/timer/journey.ts) gebaut — die Position der Gruppe wird aus
der verstrichenen Zeit **berechnet**, es gibt keine Animationsschleife. Das ist die
technisch sauberste Umsetzung von §7 und liegt fertig und getestet vor.

Ebenso: V1 §11 „In der Realität arbeitet jede Person unabhängig an ihrer eigenen Aufgabe"
bei gemeinsamer Quest — das ist exakt das Modell aus
[SYNC-PROTOCOL.md](SYNC-PROTOCOL.md). Eine Uhr, unabhängige Arbeit. V1 §17 führt
„technische Anforderungen" noch als offen; dieser Teil ist bereits spezifiziert, mit
acht Abnahme-Testfällen.

---

## 2 · Echte Konflikte

### K1 · Klassen oder Völker? 🔴 **Eigentümer-Entscheidung**

| | |
|---|---|
| **V1 §4** | Fünf Völker (Mensch, Elf, Zwerg, Goblin, Ork). Ausdrücklich **keine Klassen**, keine Stats. Die Wahl beeinflusst nur Optik. Die Produktivitätsmechanik ist für alle gleich. |
| **Draft** | Sechs Klassen, und **die Klasse ist das Timer-Profil** (Magier 50/10, Schurke 15/3). Die Klassenwahl *ist* die Konfiguration. |
| **Ursprungsbriefing** | „Dabei soll es eine Klasse geben, welche ausgewählt werden kann, die in der Arbeitszeit auf Quests geht." |

Das ist ein direkter Widerspruch zwischen V1 und dem, was der Auftraggeber ursprünglich
beschrieben hat. Das kann ich nicht auflösen.

**Empfehlung: V1 folgen — mit einer Ergänzung.** Der Grund, warum die Klasse hier zum
Timer-Profil gemacht wurde, war: *Niemand stellt gern Minuten in einem Formular ein.*
V1 löst dasselbe Problem eleganter — die **Dauer hängt an der Quest**, nicht am
Charakter. Man wählt „Der verlassene Wachtturm, 50 Minuten", und das ist die Einstellung.
Das ist für die Zielgruppe besser: Wer heute nur 25 Minuten schafft und morgen 50, muss
nicht den Charakter wechseln.

Was dabei verloren geht und ersetzt werden muss: die Klassen-Passive (Segen, Inspiration,
Flinke Finger). Vorschlag: als **Ausrüstungseffekte** wieder einführen — dann sind sie
erspielt statt gewählt, was zu V1 §4 („individualisiert sich später durch erspielte
Ausrüstung") passt.

---

### K2 · Das Lager als Hub — fehlt im Draft vollständig ⚠️

V1 §2 macht das Lager zum Zentrum: Home-Screen, Menü und sichtbarer Langzeitfortschritt
in einem. Navigation über Gegenstände statt über Menüpunkte — Abenteuerbuch, Rucksack,
Signalhorn, Charakter.

Der vorhandene Draft hat **kein Lager**. Er hat eine konventionelle App-Navigation mit
Topbar und den Routen `/quest`, `/party`, `/character/sheet`, `/settings`.

**Empfehlung: V1 folgen.** Das ist die stärkste Idee im ganzen Konzept und sie ist besser
als die Screen-Liste hier. Sie ersetzt Party-Hub, Charakterbogen und Teile der
Einstellungen durch **einen** Ort und macht die App zu dem, was V1 §15 fordert.

**Eine Bedingung, die in V1 fehlt und nicht verhandelbar ist:** Eine rein diegetische
Oberfläche ist barrierefrei ein Rückschritt. Ein Screenreader-Nutzer, der ein „Signalhorn"
findet, weiß nicht, dass das die Einladefunktion ist.

> **Regel: diegetisch an der Oberfläche, semantisch darunter.**
> Jedes Objekt im Lager ist ein echtes `<button>` mit sinnvollem `aria-label`
> („Abenteuerbuch öffnen — Quests"), in einer sinnvollen Tabulator-Reihenfolge, plus
> eine konventionelle Navigation, die per Tastatur erreichbar ist. Die Fantasy-Welt ist
> die *Darstellung*, nicht die *Struktur*.

Das ist keine Einschränkung der Idee, sondern die Bedingung dafür, dass sie ausgeliefert
werden darf.

---

### K3 · Solo zuerst oder Gruppe als Hauptmerkmal? 🔴 **Eigentümer-Entscheidung**

| | |
|---|---|
| **V1 §11** | „Die Anwendung muss vollständig alleine nutzbar sein. **Solo ist der Standard.** Multiplayer ist eine optionale soziale Ebene." |
| **Ursprungsbriefing** | „Ein besonderes Feature ist DND-Gruppen … dann ist die Gruppe auch gemeinsam im Quest." |
| **Draft** | Party-Sync als Kernfeature, M3 vor M4. |

Kein Widerspruch in der Sache — beides ist baubar —, aber ein Widerspruch in der
**Reihenfolge**. Danach richtet sich, was zuerst entsteht.

**Empfehlung:** V1 folgen und die Meilensteine umstellen. Lager, Abenteuerbuch und die
Solo-Schleife zuerst; Gruppe danach. Begründung: Eine Gruppenfunktion ohne Lager hat
keinen Ort, an dem sie stattfindet — das Signalhorn steht im Lager. Umgekehrt
funktioniert das Lager ohne Gruppe vollständig.

Das Sync-Protokoll bleibt davon unberührt und muss nicht neu gedacht werden, nur später
gebaut.

---

### K4 · Gruppensteuerung: Dungeon Master oder Bereitschaftsprüfung? ⚠️

| | |
|---|---|
| **V1 §11** | „Alle bestätigen ihre Bereitschaft. Anschließend bricht die Gruppe gemeinsam auf." |
| **Draft** | Ein Dungeon Master startet, pausiert und überspringt. Die Rolle wandert beim Verlassen. |

**Empfehlung: V1 folgen.** Bereitschaftsprüfung passt besser zu „niemals sozialer Druck"
(§11) — beim DM-Modell wartet die Gruppe auf eine Person, was genau den Druck erzeugt,
den V1 vermeiden will.

Eine Einschränkung bleibt: **Abbrechen und Überspringen brauchen trotzdem eine Regel.**
Vorschlag: Aufbruch per Bereitschaft aller, Abbruch nur für einen selbst (die anderen
laufen weiter), Rast automatisch. Damit gibt es gar keine Rolle mehr, die jemand haben
muss. → betrifft die Testfälle in [SYNC-PROTOCOL.md](SYNC-PROTOCOL.md) und Issue #8.

---

### K5 · Wochenpool oder durchlaufender Pool? ⚠️

| | |
|---|---|
| **V1 §5** | Zehn Quests pro Woche: 4 kurz, 4 mittel, 2 episch. Zufällig aus einem größeren Pool. Keine Pflicht, alle zu schaffen. |
| **Draft** | 100 Quests, Auswahl deterministisch je Zyklus, zuletzt gespielte ausgeschlossen. |

**Empfehlung: beides verbinden.** Der Wochenpool als *kuratiertes Regal* im
Abenteuerbuch — er macht die Auswahl überschaubar, was für die Zielgruppe wichtig ist.
Aber: **er darf nie leerlaufen.** Sind die zehn abgearbeitet, füllt das Buch aus dem
Gesamtpool nach, statt leer zu sein. Siehe Widerspruch W2 unten.

Die 100 vorhandenen Quests sind genau der Pool, aus dem V1 §5 ziehen will. Sie sind
hier kein Konfliktpunkt, sondern das fehlende Material.

---

### K6 · „Keine Duplikate" gegen den Item-Baukasten ⚠️ **inhaltlich schwerwiegend**

| | |
|---|---|
| **V1 §10** | „**Keine Duplikate.** Eine Truhe enthält grundsätzlich etwas Neues, solange im Pool noch etwas Neues verfügbar ist." Dazu Sammlungssets mit Abschlussbelohnung. |
| **Draft** | Gegenstand wird aus einer Kennung gehasht — Wiederholungen sind möglich, „schon besessen" existiert nicht. |

**V1 hat recht, und das ist der Punkt, der am meisten Arbeit auslöst.** Die Regel ist
motivational deutlich besser und macht aus dem Ziehen ein Freischalten.

Die Konsequenz ist strukturell: Gegenstände können nicht mehr *errechnet* werden, sie
brauchen einen **Katalog** mit Kategorien (Charakter / Lager / Begleiter / Atmosphäre),
Seltenheit und Set-Zugehörigkeit. Gezogen wird gleichverteilt aus dem, was noch **nicht**
besessen wird.

Der Baukasten aus ADR-011 stirbt dabei **nicht** — er wechselt die Aufgabe: Er ist ab
jetzt das *Aussehen* eines Katalogeintrags, der noch keine Illustration hat. Genau
dafür war das Feld `art` von Anfang an vorgesehen. Umgesetzt in
[`lib/loot/draw.ts`](../lib/loot/draw.ts).

**Was V1 dabei nicht ausrechnet:** „Keine Duplikate" × 4 Seltenheiten × 4 Kategorien
ergibt 16 Töpfe, die alle gefüllt sein müssen. Bei acht Quests am Tag ist ein Topf mit
20 Einträgen in zwei Wochen leer. Der Katalog braucht **Mindestgrößen pro Topf**, sonst
greift die Regel nach kurzer Zeit ins Leere. → Widerspruch W4.

---

### K7 · Vier oder fünf Seltenheitsstufen ⚠️ *klein*

V1 §10 nennt vier (gewöhnlich, selten, episch, legendär), der Draft fünf (zusätzlich
„ungewöhnlich").

**Empfehlung: vier, also V1.** Mit der Keine-Duplikate-Regel muss jede Stufe eigene
gefüllte Töpfe haben — eine Stufe weniger heißt vier Töpfe weniger. Die
Wahrscheinlichkeiten werden dann: 60 / 27 / 11 / 2 %.
→ betrifft DESIGN-SYSTEM.md (Farben), CONCEPT.md, `lib/loot/`.

---

### K8 · Streaks ⚠️

V1 §14 verbietet „kaputte Streaks". Der Draft lässt Streaks nur wachsen, nie brechen —
mechanisch also vereinbar. Trotzdem zeigt der Charakterbogen „Streak 11 Tage" prominent.

**Empfehlung: die Tagesserie ganz streichen.** Es ist die eine Zahl, die auch dann
Druck erzeugt, wenn sie technisch nicht brechen kann — man sieht sie und denkt an den
Tag, an dem sie stehen bleibt. Kumulative Zahlen (Fokusstunden gesamt, abgeschlossene
Quests) leisten dasselbe, ohne einen Kalender zu implizieren.

---

### K9 · Konto verpflichtend oder Gastzugang? ⚠️

| | |
|---|---|
| **V1 §4, §12** | „Ein Account ist notwendig, damit Charakter, Inventar, Level und Fortschritt auf unterschiedlichen Geräten verfügbar bleiben." |
| **Draft** | Gastzugang gleichwertig, damit ein Gruppenbeitritt keine Hürde hat. |

Beide haben aus ihrer Sicht recht: V1 für die Persistenz, der Draft für die Reibung.

**Empfehlung: Konto für Fortschritt, Gast für die Sitzung.** Wer per Code beitritt, darf
sofort mitarbeiten und sieht dieselbe Uhr — bekommt aber XP und Loot erst gutgeschrieben,
wenn ein Konto entsteht. Die Belohnungen der Sitzung werden dabei nachträglich
übernommen. Damit steht kein Login zwischen einem Menschen und einer gemeinsamen
Fokus-Session, und §4 bleibt erfüllt.

---

### K10 · Der Ton der Quests ⚠️ **entscheidet über die 100 vorhandenen Quests**

| | |
|---|---|
| **V1 §3, §5, §15** | Cozy Fantasy, warm, leicht humorvoll. Themen: Flüsterwald, Frostgebirge, Drachengebiete, Dungeons. Gegner, Bosskämpfe, „gelegentlich episch". |
| **Draft** | Karg, beobachtend, melancholisch-archäologisch. Verlassene Orte, **keine Kreaturen, keine Gefahr, kein Kampf**. |

Das ist der Konflikt, der am meisten Material betrifft. Die 100 geschriebenen Quests
haben keine Drachen und keine Bosskämpfe. Sie passen zu „mystisch" und „geborgen", aber
nicht zu „episch".

**Empfehlung — und V1 legt sie selbst nahe:** V1 §15 unterscheidet bereits
„Fokusoberfläche: ruhig" von „Bosskämpfe: deutlich epischer". Genau daran entlang teilen:

- **Kurze und mittlere Quests** behalten den ruhigen Ton. Sie laufen nebenher, während
  jemand arbeitet — dort ist Zurückhaltung keine Stilfrage, sondern Funktion.
- **Epische Quests und Bosskämpfe** bekommen den lauteren Ton. Sie sind selten (2 von 10
  pro Woche) und dürfen tragen.

Was das für die vorhandenen Quests heißt: **die 100 bleiben nutzbar**, müssen aber auf
V1s Themenwelten umgehängt werden (Vorschlag unten), und die epische Stufe fehlt
vollständig — die muss neu geschrieben werden.

**Vorschlag zur Regionen-Zuordnung**

| Draft | V1-Themenwelt |
|---|---|
| Die Salzmarschen | Küste |
| Der Aschenwald | Flüsterwald *(Ton anpassen)* |
| Die Hohle Stadt | Dungeons |
| Die Nebelklippen | Frostgebirge |
| Das Bruchglastal | alte Ruinen |
| Die Tiefe Bibliothek | verlassene Tempel |
| Das Rostmoor | verwunschene Höhlen *(schwache Passung)* |
| Sternwarte Kalt | — *(kein Gegenstück)* |
| — | Wüste, mystische Dörfer, Drachengebiete *(fehlen ganz)* |

Drei von V1s zehn Themenwelten haben kein Gegenstück, zwei Zuordnungen sind schwach.
Das ist Schreibarbeit, kein Blocker.

---

### K11 · 90 Minuten am Stück ⚠️

V1 §6 setzt die epische Quest auf „ca. 90 Minuten".

**Bedenken, aber baubar.** Neunzig Minuten ohne Unterbrechung widersprechen dem Grundsatz,
auf dem die ganze Methode beruht, und treffen ausgerechnet die Zielgruppe aus §1 —
Menschen, die Schwierigkeiten haben, lange fokussiert zu bleiben.

**Empfehlung:** Die epische Quest ist ein **Bogen aus drei Abschnitten** — 25 / Rast /
25 / Rast / 25 — die *als eine* Quest erzählt wird. Der Bosskampf ist der dritte
Abschnitt. Das Gefühl bleibt episch, die Pausen bleiben drin, und der Wiedereinstieg
nach einer Rast ist erzählerisch motiviert („die Gruppe sammelt sich vor dem Tor").

Falls das Team bei 90 Minuten am Stück bleibt: geht ebenfalls, gehört dann aber als
bewusste Entscheidung in einen ADR, mit dem Hinweis auf §1.

---

## 3 · Widersprüche innerhalb von Konzept V1

Diese Punkte löst V1 nicht selbst auf. Sie brauchen eine Entscheidung des Teams, das
V1 geschrieben hat — hier ohne Wertung benannt, damit sie nicht erst in der Umsetzung
auffallen.

**W1 · Die Rast soll interaktiver werden und gleichzeitig keine Bildschirmzeit erzeugen.**
§8 nennt Feuerholz sammeln, Suppe kochen, Ausrüstung betrachten — und sagt zwei Absätze
später: „Der Zweck der Rast ist nicht zusätzliche Bildschirmzeit. Die Person soll bewusst
aus dem Arbeitsfokus herauskommen." Jede Tätigkeit im Lager hält sie am Bildschirm.
*Vorschlag:* **eine** Handlung mit einem Klick, etwa drei Sekunden — Holz auflegen —,
danach verabschiedet der Screen aktiv („Das Feuer hält. Geh ruhig.") und zeigt nur noch
die Restzeit. Das Lager entwickelt sich, ohne die Pause zu füllen.

**W2 · Der Wochenpool kann leerlaufen, und ein Wochenwechsel ist selbst ein FOMO-Motiv.**
Zehn Quests pro Woche reichen bei sechs Quests am Tag keine zwei Tage. §5 sagt, was
passiert, wenn man *nicht* alle schafft — nicht, was passiert, wenn man sie *aufbraucht*.
Zugleich erzeugt „die Quests dieser Woche" genau die Sorge, etwas zu verpassen, die §14
ausschließt. *Vorschlag:* Das Buch füllt nach und der Wochenwechsel wird nie als Ablauf
kommuniziert.

**W3 · Die kürzeste Quest ist 25 Minuten, die Zielgruppe schafft oft weniger.**
§1 nennt als Zielgruppe ausdrücklich Menschen, die Schwierigkeiten haben, „über längere
Zeit fokussiert zu bleiben". §6 bietet 25, 50 und 90 Minuten an. Für einen erheblichen
Teil dieser Zielgruppe ist die Einstiegshürde damit der erste Misserfolg.
*Vorschlag:* eine vierte, kürzeste Stufe — 10 bis 15 Minuten, etwa „Kundschaftergang".
Sie kostet fast nichts und ist für manche der einzige gangbare Einstieg.

**W4 · „Keine Duplikate" ist ohne Mindestgrößen nicht durchhaltbar.**
Siehe K6. Vier Kategorien × vier Seltenheiten sind sechzehn Töpfe. Erst wenn pro Topf
eine Mindestzahl steht, hält die Regel länger als zwei Wochen. *Vorschlag:* mindestens
40 Einträge je Kategorie in den unteren beiden Stufen, mindestens 12 in den oberen —
und ein definiertes Verhalten für den Fall, dass ein Topf trotzdem leer läuft
(Vorschlag: dann Gold statt Item, nie ein Duplikat).

**W5 · Konto-Pflicht gegen „sanfte Verbindlichkeit".**
§4 verlangt ein Konto vor dem ersten Charakter, §12 macht es zu Schritt 1 des Onboardings.
Das ist die härteste Hürde der ganzen App und steht direkt vor dem ersten Erlebnis.
Siehe K9.

---

## 4 · Was V1 als offen führt und hier schon entschieden ist

V1 §17 listet offene Punkte. Ein Teil davon ist im Repo bereits beantwortet — das muss
niemand zweimal machen:

| V1 §17 | Steht bereits |
|---|---|
| Loot-Wahrscheinlichkeiten | CONCEPT.md — nach K7 auf vier Stufen umzustellen |
| Seltenheitslogik | DESIGN-SYSTEM.md, mit geprüften Kontrastwerten |
| Animationsprinzipien | MOTION-ENGINE.md, ADR-007 bis ADR-009 |
| Content-Struktur für Quests | `content/quests.de.json`, Schema + 33 Tests |
| Technische Anforderungen | ARCHITECTURE.md, SYNC-PROTOCOL.md |
| Gruppenflow (technisch) | SYNC-PROTOCOL.md mit acht Abnahme-Testfällen |

Offen bleiben aus V1 §17: XP-Logik, Levelsystem, Gold-Economy, Item-Pools, Sammlungen
und Sets, Level-Up-Belohnungen, Charakterdesigns, Lager-Ausbaustufen, Sounddesign, Musik.

---

## 5 · Vorgeschlagene neue Reihenfolge

Aus K3 folgt eine andere Meilenstein-Ordnung als die bisherige:

| | Bisher | Nach V1 |
|---|---|---|
| M1 | Fundament | Fundament *(unverändert)* |
| M2 | Solo-Timer | **Lager + Abenteuerbuch + Solo-Schleife** |
| M3 | Party-Sync | **Progression: XP, Level, Gold, Loot-Katalog** |
| M4 | Spiel-Ebene | **Gruppe** (Signalhorn, Bereitschaft, Sync) |
| M5 | Release | Release |
| M6 | Artwork | Artwork *(parallel ab M2)* |

Das Sync-Protokoll rutscht damit nach hinten, wird aber nicht angefasst — es ist
fertig spezifiziert und wartet.

---

## 6 · Entscheidungstabelle

| Nr. | Frage | Empfehlung | Wer entscheidet |
|---|---|---|---|
| K1 | Klassen oder Völker? | **Völker**, Dauer an der Quest; Passive später als Ausrüstung | 🔴 Eigentümer |
| K2 | Lager als Hub? | **Ja** — mit der Regel „diegetisch oben, semantisch darunter" | Team + Release |
| K3 | Solo zuerst? | **Ja**, Meilensteine umstellen | 🔴 Eigentümer |
| K4 | DM oder Bereitschaft? | **Bereitschaft**, keine feste Rolle | Team |
| K5 | Wochenpool? | **Ja, aber nachfüllend** | Team |
| K6 | Keine Duplikate? | **Ja** — Katalog statt Berechnung | Team |
| K7 | Vier Stufen? | **Ja**, 60/27/11/2 % | Team |
| K8 | Tagesserie? | **Streichen** | Team |
| K9 | Konto-Pflicht? | Konto für Fortschritt, **Gast für die Sitzung** | Team + Release |
| K10 | Welcher Ton? | **Ruhig kurz/mittel, episch nur beim Boss** | Team |
| K11 | 90 Minuten? | **Bogen aus 3 × 25 mit Rasten** | Team |
| W1–W5 | Widersprüche in V1 | siehe Abschnitt 3 | V1-Team |

Jede Zeile liegt als Issue vor. Erst wenn K1, K3 und K10 entschieden sind, lohnt sich
die Überarbeitung des visuellen Drafts — sie hängen alle drei am selben Material.
