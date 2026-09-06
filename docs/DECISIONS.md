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
**Status:** **teilweise geändert durch ADR-038** (befristete Dev-Preview-Ausnahme) · 2026-09-05  
**Kontext:** Für #51 wurde zwischenzeitlich ein GitHub-Actions-Workflow vorbereitet, der einen Vercel-Preview-Runner voraussetzt (`VERCEL_TOKEN`/`VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` als GitHub-Environment-Secrets). Das widerspricht sowohl `docs/PREVIEW-DEPLOYMENT.md` ("kein Vercel, kein automatisches Deployment aus GitHub Actions") als auch ADR-036, das Hostinger bereits als Produktionsziel festlegt.  
**Entscheidung:** Auch der interne Preview-Stand für #51 läuft ausschließlich über den vom Webdesigner betreuten Hostinger-Teststand, wie in `docs/PREVIEW-DEPLOYMENT.md` beschrieben. Kein Vercel-Pfad, keine Vercel-Credentials als Voraussetzung, kein automatisches GitHub-Actions-Deployment. Der zwischenzeitlich vorbereitete Vercel-Workflow gilt als obsolet.  
**Alternative:** Vercel als separater, schnellerer Preview-Runner neben der Hostinger-Produktion.  
**Grund:** Zwei parallele Hosting-Pfade (Vercel für Preview, Hostinger für Produktion) erzeugen doppelte Environment-Pflege und ein Preview, das sich vom späteren Produktions-Runtime unterscheidet — genau das Risiko, das #51 eigentlich absichern soll.

### ADR-038 · Render.com als befristete Dev-Preview, SteerCo-Entscheidung wegen Hostinger-Kosten
**Status:** **geändert durch ADR-039** (Ionos-VPS statt Render) · 2026-09-06  
**Kontext:** Hostingers Node.js-Hosting-Produkt (Voraussetzung für #51, siehe ADR-037/#58) kostet bei monatlicher Laufzeit **18 €/Monat**; der beworbene Preis von 3,99 €/Monat gilt nur bei 48 Monaten Vertragsbindung. Für die aktive, noch unabgeschlossene Entwicklungsphase ist weder die laufende Kostenhöhe noch eine 48-Monats-Bindung angemessen. Diese Kostenfrage wurde im SteerCo besprochen.  
**Entscheidung:** Für die Dauer der aktiven Entwicklungsphase läuft der interne Preview-Stand für #51 auf **Render.com (Free-Tier)** statt auf Hostinger — echtes Node.js (`npm run build` / `npm run start`, siehe `render.yaml`), kein Vertrags-Lock-in, keine laufenden Kosten. Diese Ausnahme ist **befristet**: Sobald der Produktions-Cutover ansteht (Issue #3), wird auf Hostinger als Produktionsziel umgestellt — daran ändert diese Entscheidung nichts. ADR-036 (Hostinger als Produktionsziel) bleibt vollständig in Kraft. Der in ADR-037 festgehaltene Vercel-Ausschluss bleibt ebenfalls in Kraft — Render wurde bewusst gewählt, weil es echtes Node.js statt einer Edge-Runtime bereitstellt und damit näher an der Ziel-Produktionsumgebung liegt als ein Edge-/Workers-basierter Anbieter.  
**Alternative 1:** Hostinger Node.js-Hosting sofort buchen (18 €/Monat oder 48-Monats-Bindung) — abgelehnt wegen der Kosten während einer noch offenen Entwicklungsphase ohne festen Zeitrahmen.  
**Alternative 2:** Cloudflare Pages/Workers (ebenfalls kostenlos) — abgelehnt, weil es auf einer Edge-Runtime statt Node.js läuft und damit stärker von der Ziel-Produktionsumgebung abweicht als Render.  
**Grund:** Kostenkontrolle während der Entwicklungsphase, ohne die Produktionsentscheidung (Hostinger, ADR-036) oder den Vercel-Ausschluss (ADR-037) aufzugeben. Setup-Details: `docs/PREVIEW-DEPLOYMENT.md`, Abschnitt "Render (befristete Dev-Preview)".

### ADR-039 · Ionos-VPS statt Render als Dev-Preview
**Status:** angenommen · 2026-09-06  
**Kontext:** Es steht ein bereits vorhandener, ungenutzter VPS bei **Ionos** zur Verfügung (Ubuntu 24.04, Plesk, 4 vCore, 4 GB RAM, 120 GB NVMe SSD) — eine andere Plattform als sowohl Render (ADR-038) als auch das Produktionsziel Hostinger (ADR-036). Gegenüber Render bietet der VPS echten, unbegrenzten Node.js-Betrieb ohne Cold-Starts und ohne die 512-MB-RAM-Grenze des Render-Free-Tiers — und verursacht keine zusätzlichen Kosten, da er bereits existiert.  
**Entscheidung:** Der interne Preview-Stand für #51 läuft ab sofort auf dem Ionos-VPS statt auf Render. `render.yaml` wird entfernt. Eine neue `server.js` (Next.js Custom Server) wird ergänzt, da Plesks Node.js-Betrieb eine Startdatei statt eines Startkommandos erwartet — nutzbar über `npm run start:plesk`, ohne das bestehende `npm run start` (next start) für andere Hosts zu verändern. Diese Entscheidung ändert **nichts** an ADR-036: Hostinger bleibt das Produktionsziel für `focus.lang-jamin.de`. Der VPS ist eine dritte, unabhängige Plattform ausschließlich für die Dev-/Preview-Phase.  
**Alternative:** Render beibehalten — abgelehnt, da der VPS technisch überlegen ist (kein Cold-Start, mehr Ressourcen, volle Kontrolle) und ohnehin bereits verfügbar ist.  
**Grund:** Bessere technische Eignung bei gleichen Kosten (keine). Wichtig festzuhalten: Der VPS **vereinheitlicht Preview und Produktion nicht** — Ionos und Hostinger bleiben zwei verschiedene Anbieter. Das in ADR-037 benannte Grundrisiko (Preview läuft auf anderer Laufzeitumgebung als Produktion) bleibt bestehen, wird aber durch echtes Node.js auf beiden Seiten deutlich kleiner als bei einer Edge-Runtime.

### ADR-040 · Supabase-Aktivitäts-Heartbeat gegen automatisches Pausieren
**Status:** angenommen · 2026-09-06  
**Kontext:** Supabase pausiert Free-Plan-Projekte nach etwa sieben Tagen ohne Aktivität automatisch. Während einer offenen, nicht terminierten Entwicklungsphase ist das ein reales Betriebsrisiko — HERMES (Webadmin) hat es auf #51 aufgeworfen und nach Freigabe umgesetzt, direkt gegen die Live-Instanz, **ohne begleitende Migration im Repository**.  
**Entscheidung:** Alle drei Kalendertage schreibt ein Betriebsjob genau einen Datensatz (`service = 'pomodoro-dnd'`, aktueller Git-Commit, Zeitstempel) in eine dedizierte Tabelle `public.ops_heartbeats` — siehe Migration `20260906143000_ops_heartbeats.sql` (nachträglich ins Repo aufgenommen, damit Schema und Git wieder übereinstimmen; das eigentliche `create table` wurde bereits vorher live angewendet). Ausdrücklich **keine** Berührung von `profiles`, `characters`, `focus_sessions` oder `unlocks`. Jede DB-Schreiboperation außerhalb dieses einen Heartbeat-Datensatzes bleibt freigabepflichtig durch den Account-Owner.  
**Alternative:** Rein lesende API-Aktivität ohne DB-Schreibvorgang — laut Supabase-Doku unter Umständen ausreichend, aber nicht zuverlässig genug geprüft, um sich allein darauf zu verlassen.  
**Grund:** Verhindert ein unbeabsichtigtes Pausieren des Projekts während längerer Entwicklungspausen, mit minimaler, klar abgegrenzter Schreibfläche.  
**Offener Punkt:** Das ausführende Script (\`~/.hermes/scripts/pomodoro_dnd_heartbeat.py\`) läuft aktuell außerhalb dieses Repositories, in HERMES' eigener Umgebung, mit dem vollprivilegierten \`service_role\`-Key — für niemand sonst einsehbar oder review-fähig. Sollte perspektivisch als Skript ins Repo (z. B. \`scripts/\`) überführt werden, damit auch der Automatisierungscode selbst der "Was nicht in GitHub steht, existiert nicht"-Regel aus `docs/WORKFLOW.md` folgt.

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
