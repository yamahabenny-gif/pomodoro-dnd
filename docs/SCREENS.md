# Screens & User Journey – Concept V2

> Textliche UX-Referenz. Produktentscheidungen kommen aus [CONCEPT.md](CONCEPT.md). Die Welt ist das Menü; konventionelle UI wird dort eingesetzt, wo sie Verständlichkeit oder Accessibility verbessert.

## 1 · Erster Eintritt (`/`)

**Modus: Welt betreten, nicht Marketing konsumieren.**

Ruhige Waldszene, entferntes warmes Licht.

> „Ah. Da bist du ja.“
>
> „Wir haben noch einen Platz am Feuer.“

Primäre Aktion: **Zum Lager**.

Kein laufender Demo-Timer, keine Klassenwerbung, kein Party-Code-Feld als dominanter Einstieg.

---

## 2 · Login / Account (`/login`)

So wenig Reibung wie möglich. Account ist nötig für Charakter, Fortschritt und Gerätewechsel.

Copy-Prinzip: Grund erklären statt Registrierung verkaufen, z. B. **„Damit dein Lager dich wiederfindet.“**

Kein Gastzugang.

Zustände: lädt · Anmeldung versendet/gestartet · abgelaufen/abgebrochen · offline · Fehler.

---

## 3 · Charaktererstellung (`/character`)

Fünf Völker: **Mensch · Elf · Zwerg · Goblin · Ork**.

Keine Klassen und keine Geschlechtsauswahl.

V1-Auswahl:
- Volk
- Körperform / Silhouette
- Haut-/Fantasyfarbe
- Frisur
- Haarfarbe
- Name

Keine Detailregler, Tattoos, Narben, Patches oder Make-up-Systeme.

Figur groß im Mittelpunkt, Änderungen live sichtbar. Nach Namensvergabe kein Success-Dialog; der Charakter geht direkt ins Lager.

---

## 4 · Lager (`/camp`)

**Home-Screen und zentraler Hub.** Leicht erhöhte 2D-Diorama-Perspektive.

Diegetische Objekte:
- Abenteuerbuch → Quests
- Charakter / Rucksack → Ausrüstung
- Sammlung → Sets/Funde
- Signalhorn → Gefährten/Party
- Händlerwagen → kosmetische Goldkäufe

Settings bleiben als dezentes konventionelles Zahnrad verfügbar.

Erstes Lager ist bereits gemütlich: Feuer, einfacher Schlafplatz, Buch, Rucksack, Horn. Spätere Entwicklung macht es reicher und persönlicher, nicht erst „schön“.

Auf Mobile wird die Szene neu komponiert statt nur verkleinert.

---

## 5 · Abenteuerbuch (`/quests`)

Illustriertes Journal statt SaaS-Kartenraster.

Quest auf einen Blick:
- Name
- Region
- Typ
- **Dauer prominent**
- kurzer Hook

Lesezeichen/Filter: **15 · 25 · 50 · Episch**.

Der Pool hält ungefähr zehn Optionen sichtbar und füllt sich nach; keine Fristen oder Ablaufkommunikation.

Questdetail zeigt Illustration/Atmosphäre, 1–2 Erzählerzeilen, Dauer und Grundbelohnungen.

Aktionen: **Alleine aufbrechen** · **Gefährten rufen** (sobald Party verfügbar ist).

Kein Pflichtfeld „Woran möchtest du arbeiten?“.

---

## 6 · Aufbruch

Kurze 3–5-Sekunden-Sequenz. Charakter steht auf, nimmt Ausrüstung, Musikmotiv beginnt, Szene wechselt. Danach startet die Fokuszeit.

---

## 7 · Quest läuft (`/quest/[session]`)

**Hauptscreen. Ruhig, illustrativ, lesbar.**

- dominante 2D-Questlandschaft
- Questname
- integrierter exakter Timer, standardmäßig z. B. `18:42`
- atmosphärischer Reise-/Fortschrittsindikator
- Pause
- Audio
- optional Vollbild
- Quest verlassen

Der Timer ist Teil der Abenteuerwelt, aber funktional sofort lesbar. Kein riesiger generischer Digitaltimer als Overlay.

Timer-Modi:
- exakt
- ungefähr („Noch etwa 20 Minuten“)
- atmosphärisch (nur Journey-Fortschritt)

Während Fokus kein Inventar, Händler, Sammlung, Chat, Pings oder klickbare Spielmechanik.

Zustände: läuft · pausiert · offline/reconnecting · abgeschlossen.

---

## 8 · Questabschluss

Die Szene erreicht ihr Ziel; Aufbruchsmotiv löst sich musikalisch auf. Kein schriller Beep.

Anzeige:

**Quest abgeschlossen**

`+ XP` · `+ Gold`

**Eine Truhe wartet auf dich.**

Die Truhe wird jetzt noch nicht geöffnet.

---

## 9 · Rast (`/quest/[session]/rest` oder Session-State)

Charakter am Feuer. Optional eine einzige kleine Handlung wie **Holz nachlegen**.

Danach:

> „Das Feuer hält. Geh ruhig. Wir passen hier auf.“

Keine Minispiele, kein Händler, keine Sammlung, kein Lootmenü.

Kurze Rast ca. 5 Minuten. Lange Rast wird später anhand kumulierter Fokuszeit empfohlen, nicht nach starrer Questanzahl.

Rast überspringen ist erlaubt und ohne Strafe.

---

## 10 · Truhe

Erst nach der Rast bzw. nach bewusstem Überspringen.

> „Während du weg warst, hat sich die Truhe leider nicht selbst geöffnet.“

Aktionen: **Truhe öffnen** · **Später**.

Öffnung wirkt materiell und hochwertig, nicht wie Slotmachine. Reduced Motion zeigt denselben Inhalt ohne große Bewegung.

Wenn ein Item enthalten ist, ist es neu. Gefundene Ausrüstung wird nicht automatisch angelegt.

Erste Truhe im Onboarding ist deterministisch: **Alte Weglaterne** (oder final benannter äquivalenter Lagerfund). Danach sichtbare Platzierung im Lager.

---

## 11 · Sammlung

Wird erst nach dem ersten relevanten Fund eingeführt.

Thematische Sets statt generischer Itemlisten, z. B. **Relikte des Flüsterwaldes · 3/5**. Unbekannte Teile als Silhouetten/Hinweise.

---

## 12 · Händler

Erscheint nach frühen Fortschritten als Welt-Ereignis und bleibt danach im Lager.

Nur kosmetische Waren gegen Gold. Keine Countdown-Angebote, keine dauerhafte künstliche Verknappung.

---

## 13 · Charakter / Ausrüstung

Kein klassischer RPG-Charakterbogen mit Stats oder Streak.

Zeigt:
- Charakter und Level
- XP / kumulativen Fortschritt
- Gold
- kosmetische Ausrüstung
- freigeschaltete Looks
- neutrale Fokus-/Questhistorie, sofern später vorgesehen

Keine Power-Werte und keine roten „verpassten Tage“.

---

## 14 · Signalhorn / Party

Das Signalhorn öffnet die soziale Ebene aus dem Lager heraus.

Standard: **Einladungslink teilen**. Zusätzlich kurzer Party-Code als Fallback.

Kein Freundschafts-Handshake vor der ersten Session. Nach gemeinsamer Quest optional: **Als Gefährten merken**.

Konto und Charakter sind Pflicht.

---

## 15 · Party wartet

Alle sehen vorgeschlagene Quest, Dauer und Bereitschaft.

Beispiel:
- Daisy — bereit ✓
- Benny — bereit ✓
- Juliette — noch nicht bereit

Kein Dungeon Master und kein automatischer Countdown. Start erst nach Bereitschaft aller aktuellen Mitglieder.

---

## 16 · Party-Quest

Dieselbe Fokusoberfläche wie solo, zusätzlich die gemeinsam reisenden Charaktere. Eine gemeinsame serverbasierte Uhr.

Während Fokus:
- kein Chat
- keine Emojis
- keine Pings
- keine Reactions

**Zusammen allein.**

Individueller Abbruch beendet die Quest nicht für andere.

Erstmaliger Beitritt während einer laufenden Quest ist nicht möglich; der Screen zeigt, dass die Gruppe unterwegs ist und bei der nächsten Quest gemeinsam aufbrechen kann. Reconnect eines bestehenden Teilnehmers stellt die laufende Session wieder her.

Abschluss: individuelle XP/Gold/Truhen; keine Party-Truhe. Optional kleiner additiver Goldbonus.

---

## 17 · Einstellungen (`/settings`)

Bewusst konventionell und klar:
- Account
- Timerdarstellung
- Ruhiger Fokus
- Reduced Motion
- Musik
- Umgebung
- Effekte
- alles stummschalten
- Accessibility
- später Benachrichtigungen
- Datenexport / Kontolöschung

Keine Fantasy-Metapher, wenn sie Bedienbarkeit verschlechtert.

---

## 18 · Rückkehr / laufende Quest auf anderem Gerät

Wenn eine Session läuft, wird sie wiederhergestellt:

> „Du bist noch unterwegs.“

Restzeit wird aus dem autoritativen Sessionzustand rekonstruiert, nicht lokal neu gestartet.

Nach langer Abwesenheit kein Recovery-/Schuld-Screen. Lager bleibt unverändert.

---

## Für jeden Screen verbindlich

| Prinzip | Regel |
|---|---|
| Zustände | leer · lädt · Fehler · offline/reconnect, wo relevant |
| Tastatur | Kernfunktionen vollständig bedienbar, sichtbarer Fokus |
| Semantik | diegetisch visuell, semantisch darunter |
| Responsive | Mobile neu komponieren, nicht Desktop nur schrumpfen |
| Farbe | Status nie ausschließlich über Farbe |
| Audio | wichtige Information nie ausschließlich akustisch |
| Motion | `prefers-reduced-motion` + In-App Reduced Motion |
| Fokus | keine unnötige Interaktion während laufender Quest |
| Copy | warm, kurz, klar; Fehler nennen Problem und nächsten Schritt |

**Informationshierarchie:** Verständlichkeit → Fokus → Atmosphäre → dekorativer Detailreichtum.
