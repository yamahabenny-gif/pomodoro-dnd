# Architecture & Product Decision Records

> Historische ADRs bleiben nachvollziehbar, aber **Concept V2 ist die verbindliche Produktspezifikation**. Bei Widerspruch gilt die neuere Entscheidung in diesem Dokument bzw. `CONCEPT.md`.

Format: **Kontext · Entscheidung · Alternative · Grund**.

---

## Weiterhin gültige technische Entscheidungen

### ADR-001 · Supabase Realtime statt eigenem WebSocket-Server
**Status:** angenommen · 2026-09-04  
**Kontext:** Party braucht Echtzeit-Synchronisation.  
**Entscheidung:** Supabase Realtime Broadcast.  
**Grund:** Das Protokoll überträgt Zustandswechsel, keine sekündlichen Ticks.

### ADR-002 · Timer ist Zeit-/Sessionzustand, kein lokaler Countdown
**Status:** angenommen · 2026-09-04  
**Entscheidung:** Autoritative Zeitinformation; Clients leiten Restzeit daraus ab.  
**Grund:** Überlebt Reload, Hintergrund-Tab, Gerätewechsel, Reconnect und Party-Sync.

### ADR-003 · Kurzer Party-Code als Fallback
**Status:** **geändert durch ADR-024**  
Der bestehende fünfstellige Code kann als Fallback bestehen bleiben, ist aber nicht mehr der primäre Einladungsweg.

### ADR-007 · Keine Game-Engine
**Status:** angenommen · 2026-09-04  
**Entscheidung:** 2D-Webdarstellung; keine Phaser/Pixi/Three-Game-Engine ohne neue belegte Notwendigkeit.  
**Grund:** Fokus-App benötigt Illustration und zeitbasierte Zustände, keine Physik- oder Kampfsimulation.

### ADR-008 · Journey ist abgeleiteter Zustand
**Status:** angenommen · 2026-09-04  
**Entscheidung:** Visueller Fortschritt wird aus verstrichener Zeit / Questdauer abgeleitet.  
**Grund:** Robuste Wiederherstellung und Synchronisation ohne zweite Animationsuhr.

### ADR-011 · Item-Baukasten bleibt technisches Hilfsmittel
**Status:** angenommen mit neuer Rolle  
Der bestehende Baukasten kann Darstellung liefern; Produktwahrheit ist der katalogisierte, dauerhaft freischaltbare Gegenstand mit No-Duplicate-Regel.

### ADR-012 · Quests werden als Content gepflegt, nicht aus Satzbausteinen erzeugt
**Status:** angenommen  
Vorhandener Questcontent darf weiterverwendet werden, sofern Ton, Dauer und Struktur Concept V2 entsprechen.

### ADR-013 · Fünf Völker, keine mechanischen Klassen
**Status:** angenommen  
Mensch, Elf, Zwerg, Goblin, Ork. Reine Identität. Quest bestimmt Fokusdauer.

### ADR-014 · Kein Gastzugang
**Status:** angenommen  
Konto und Charakter sind für persistente Nutzung und Party erforderlich.

### ADR-015 · Bereitschaftsprüfung statt Dungeon Master
**Status:** angenommen  
Alle bestätigen vor dem gemeinsamen Aufbruch. Individueller Abbruch betrifft nur die eigene Person.

### ADR-016 · Abenteuerbuch läuft nie leer
**Status:** angenommen  
Ungefähr zehn sichtbare Quests; abgeschlossene werden nachgefüllt. Keine Frist-/Expiry-Kommunikation.

### ADR-018 · Epische Quest ist 3×25 Minuten
**Status:** angenommen  
Drei persistente Akte mit Rasten; Boss/Höhepunkt in Akt III. Kein 90-Minuten-Dauerblock.

### ADR-036 · Produktionsziel Hostinger / `focus.lang-jamin.de`
**Status:** angenommen · 2026-09-04  
**Kontext:** Die Hostinger-Subdomain-Infrastruktur wurde bereits auf `focus.lang-jamin.de` umgewidmet; die bisherige Repo-Dokumentation nannte weiterhin Vercel und `pomodoro.lang-jamin.de`.  
**Entscheidung:** Öffentliche Ziel-URL ist `https://focus.lang-jamin.de`; Hostinger ist das vorgesehene Produktionshosting, Supabase bleibt für Auth/Postgres/Realtime. Anbieterabhängige Next.js-Konfiguration und der eigentliche Cutover folgen erst nach nachgewiesener Hostinger-Laufzeitqualifikation und den Gates aus Issue #3.  
**Alternative:** Vercel und die bisherige Domain unverändert als Produktionsziel beibehalten.  
**Grund:** Die vorhandene Infrastruktur und Ziel-Domain sollen konsistent dokumentiert werden, ohne unbestätigte Hostinger-Runtime-Eigenschaften oder einen vorzeitigen Produktions-Cutover anzunehmen.

### ADR-037 · Preview-Deployment ebenfalls ausschließlich über Hostinger, kein Vercel-Runner
**Status:** angenommen · 2026-09-05  
**Kontext:** Für #51 wurde zwischenzeitlich ein GitHub-Actions-Workflow vorbereitet, der einen Vercel-Preview-Runner voraussetzt (`VERCEL_TOKEN`/`VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` als GitHub-Environment-Secrets). Das widerspricht sowohl `docs/PREVIEW-DEPLOYMENT.md` ("kein Vercel, kein automatisches Deployment aus GitHub Actions") als auch ADR-036, das Hostinger bereits als Produktionsziel festlegt.  
**Entscheidung:** Auch der interne Preview-Stand für #51 läuft ausschließlich über den vom Webdesigner betreuten Hostinger-Teststand, wie in `docs/PREVIEW-DEPLOYMENT.md` beschrieben. Kein Vercel-Pfad, keine Vercel-Credentials als Voraussetzung, kein automatisches GitHub-Actions-Deployment. Der zwischenzeitlich vorbereitete Vercel-Workflow gilt als obsolet.  
**Alternative:** Vercel als separater, schnellerer Preview-Runner neben der Hostinger-Produktion.  
**Grund:** Zwei parallele Hosting-Pfade (Vercel für Preview, Hostinger für Produktion) erzeugen doppelte Environment-Pflege und ein Preview, das sich vom späteren Produktions-Runtime unterscheidet — genau das Risiko, das #51 eigentlich absichern soll.

---

## Concept-V2-Entscheidungen

### ADR-021 · Vier Seltenheitsstufen
**Status:** angenommen · 2026-09-04  
**Kontext:** Ältere Dokumente nannten fünf Stufen.  
**Entscheidung:** Gewöhnlich 60 %, Ungewöhnlich 27 %, Selten 11 %, Außergewöhnlich 2 %.  
**Grund:** Einfacheres No-Duplicate-System und klarere kosmetische Progression.

### ADR-022 · Questabschluss → Rast → Truhe
**Status:** angenommen · 2026-09-04  
**Kontext:** Frühere Schleife öffnete Loot vor der Pause.  
**Entscheidung:** Nach Abschluss werden XP/Gold und eine wartende Truhe angezeigt; zuerst Rast, danach Lootöffnung.  
**Grund:** Die Belohnung darf die reale Pause nicht am Bildschirm auffressen.

### ADR-023 · Keine Streaks
**Status:** angenommen · 2026-09-04  
**Entscheidung:** Keine Tagesstreaks, auch keine „unzerbrechlichen“ Streaks.  
**Grund:** Kalenderbasierte Serien erzeugen impliziten Druck und widersprechen der No-Dark-Patterns-Charta.

### ADR-024 · Einladungslink primär, Code als Fallback
**Status:** angenommen · 2026-09-04  
**Entscheidung:** Signalhorn erzeugt bevorzugt einen teilbaren Einladungslink; kurzer Party-Code bleibt für Vorlesen/anderes Gerät verfügbar.  
**Grund:** Link minimiert Reibung, Code bleibt praktischer Fallback. Beide referenzieren dieselbe Party.

### ADR-025 · Keine Party-Truhe
**Status:** angenommen · 2026-09-04  
**Kontext:** Früher war eine zusätzliche, mit Gruppengröße skalierende Truhe vorgesehen.  
**Entscheidung:** Jede Person erhält individuelle normale Rewards; optional nur ein sehr kleiner additiver Goldbonus.  
**Grund:** Solo darf wirtschaftlich nicht zur schlechteren Spielweise werden.

### ADR-026 · Kein erstmaliger Drop-in in laufende Quest
**Status:** angenommen · 2026-09-04  
**Entscheidung:** Neue Teilnehmer warten bis zum nächsten gemeinsamen Aufbruch. Reconnect bestehender Teilnehmer stellt die laufende Session wieder her.  
**Grund:** Bewahrt Ready-Check-Ritual und vermeidet unklare Teilbelohnungen.

### ADR-027 · Minimale, genderfreie Charaktererstellung
**Status:** angenommen · 2026-09-04  
**Entscheidung:** Volk, Körperform, Haut-/Fantasyfarbe, Frisur, Haarfarbe, Name. Keine Geschlechtsauswahl und keine Detailregler.  
**Grund:** Identität ohne unnötige Onboarding-Reibung; visuelle Optionen werden nicht künstlich nach Gender getrennt.

### ADR-028 · Lager ist Home und Navigation
**Status:** angenommen · 2026-09-04  
**Entscheidung:** Die Welt ist das Menü: Abenteuerbuch, Rucksack, Sammlung, Signalhorn und Händler leben im Lager. Settings bleiben konventionell erreichbar.  
**Grund:** Das Produkt soll eine Fantasywelt sein, nicht ein SaaS-Dashboard mit Fantasy-Skin.

### ADR-029 · Kuratierte Lager-Slots statt freiem Housing
**Status:** angenommen · 2026-09-04  
**Entscheidung:** Dekoration über definierte Slots, keine freie Platzierung.  
**Grund:** Personalisierung und sichtbare Geschichte ohne zweiten komplexen Spielmodus.

### ADR-030 · XP und Gold haben getrennte Rollen
**Status:** angenommen · 2026-09-04  
**Entscheidung:** 1 tatsächlich fokussierte Minute = 1 XP. 1 Gold pro 5 erfolgreich abgeschlossenen Fokusminuten. Bei Abbruch bleiben XP, aber kein Questabschluss-Gold/keine Truhe.  
**Grund:** Investierte Zeit bleibt wertvoll, Abschluss erhält trotzdem einen eigenen Reward.

### ADR-031 · Erste Truhe ist deterministisch
**Status:** angenommen · 2026-09-04  
**Entscheidung:** Erste 15-Minuten-Onboardingquest gibt einen kuratierten Lagerfund, z. B. die Alte Weglaterne.  
**Grund:** Der erste Loop muss zuverlässig zeigen, dass reale Fokuszeit die Welt sichtbar verändert.

### ADR-032 · Art Direction: lebendiges illustriertes Abenteuerbuch
**Status:** angenommen · 2026-09-04  
**Entscheidung:** Adult Cozy Fantasy, 2D-Illustration mit leichter Diorama-/2.5D-Tiefe; nicht chibi, nicht fotorealistisch, nicht SaaS-Fantasy-Skin.  
**Grund:** Ruhige Pen-&-Paper-Seele ist Teil der Produktidentität und unterstützt Fokus.

### ADR-033 · Accessibility verändert niemals Progression
**Status:** angenommen · 2026-09-04  
**Entscheidung:** Reduced Motion, Ruhiger Fokus, Timer-Ausblendung/-Vereinfachung und Audioeinstellungen haben keine Reward-Nachteile.  
**Grund:** Zugänglichkeit ist Produktdesign, keine Schwierigkeitsstufe.

### ADR-034 · No-Dark-Patterns-Charta
**Status:** angenommen · 2026-09-04  
**Entscheidung:** Keine Streaks, Daily Rewards, Countdown-Shops, künstliche Verknappung, Schuldkommunikation, Vernachlässigung, Produktivitätsrankings oder bezahlte Lootboxen.  
**Grund:** Das Produkt soll beim Fokussieren helfen und Aufmerksamkeit respektieren, nicht Retention durch Druck maximieren.

### ADR-035 · Vertical Slice vor Feature-Breite
**Status:** angenommen · 2026-09-04  
**Entscheidung:** Zuerst den vollständigen Weg Waldintro → Account → Charakter → Lager → „Ein Licht im Unterholz“ → 15 Min → Abschluss → Rast → Weglaterne nahezu final umsetzen.  
**Grund:** Erst die emotionale Kernhypothese beweisen, bevor Content- und Featurebreite ausgebaut werden.

---

## Superseded / nicht mehr gültig

Folgende ältere Annahmen dürfen nicht mehr als Produktanforderung verwendet werden:
- sechs Klassen oder klassenabhängige Timerprofile
- epische Quest als 90-Minuten-Dauerblock
- fünf Loot-Seltenheiten
- Lootöffnung vor der Rast
- lange Rast starr nach jeder vierten Quest
- Party-Truhe
- Dungeon-Master-Steuerung
- erstmaliger Drop-in in eine laufende Quest
- Streak-Anzeige
- Charaktererstellung nur aus Volk + Name
- Party-Code als einziger/primärer Einladungsweg
- Charakterfähigkeiten oder Items mit Fokus-/Progressionsvorteilen

Bei Konflikten mit älteren Dokumenten gilt [CONCEPT.md](CONCEPT.md).
