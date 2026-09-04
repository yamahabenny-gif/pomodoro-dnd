## Was ändert sich

<!-- Zwei bis vier Sätze. Was kann man danach, was vorher nicht ging? -->

Closes #

## Zuständigkeit

- [ ] `#junDev`
- [ ] `#SENDEV`
- [ ] `#release` — **wirkt nach außen, Merge erst nach Freigabe durch das Release Team**

## Nachweis

<!-- Bei UI-Änderungen: Screenshot oder kurzes Video, hell UND dunkel. -->

## Checkliste

- [ ] Ein Thema in diesem PR — Zusätzliches ist als eigenes Issue erfasst
- [ ] Zustände abgedeckt: leer, lädt, Fehler, offline
- [ ] Tastaturbedienbar, sichtbarer Fokusring, Kontrast geprüft
- [ ] Heller und dunkler Modus geprüft
- [ ] `prefers-reduced-motion` berücksichtigt (falls Animation)
- [ ] Zeit-Logik ohne `Date.now()` und ohne React-Import in `lib/timer/`
- [ ] Dokumentation angepasst (`docs/`), Entscheidung ggf. als ADR ergänzt

## Für das Release Team

<!-- Nur bei #release ausfüllen -->
**Risiko:** <!-- niedrig / mittel / hoch -->
**Rückrollplan:** <!-- Wie wird das rückgängig gemacht, wenn es schiefgeht? -->
