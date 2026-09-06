# M6 Region Art Handoff — Issue #22

Status: Artwork package prepared for Project Lead visual review. **No application integration is included.**

## Shared art direction

All three regions follow the Phase-1 world language:

- Adult Cozy Fantasy
- stylized painterly 2D illustration with light 2.5D/diorama depth
- calm storybook composition, not photorealistic, not chibi, not mobile-game/gacha
- no baked-in characters, timer, UI, text, numbers or logos
- focus-first: no central action event, combat, threat, loot burst or attention-demanding animation
- warm light cues against muted natural greens/blues/greys; the three regions vary in palette without changing visual language

The approved working reference is stored at:
`design/source/m6/m6-regions-concept-board-v1.webp`.

## Asset structure

Each region contains:

- `*-key-visual.webp` — 16:9 art reference / static journey composition
- `*-background.webp` — horizon / distant depth plate
- `*-midground.webp` — environmental depth plate
- `*-foreground.webp` — path / near-depth plate
- `*-reduced-motion.webp` — static 16:9 equivalent with the same narrative information

The three depth plates are intentionally delivered as consistent painterly source plates rather than hard-cut transparent extractions. This avoids artificial cut edges. A later Developer integration may use them as slow cross-fade/parallax sources or create implementation-specific masks without altering the source art.

All web assets are 1280×720 WebP (16:9), optimized for review and later web integration.

## Mooswald

**Journey use:** sheltered woodland travel; suitable for 15, 25 and 50 minute focus scenes.

**Visual identity:** ancient dense trees, moss, ferns, roots, stones, small clearings and warm light pockets.

**Timer / UI safe area:** central upper-middle to center-right area; avoid covering the strong foreground root/path shapes. Keep roughly 10% outer edge safety.

**Motion suggestion:**
- background: 1–2% very slow horizontal/vertical drift over 45–90s
- midground: 2–3% drift over 35–70s
- foreground: 3–4% drift over 30–60s
- optional light/fog opacity breathing only; no focal animation

**Reduced Motion:** use `region-moss-forest-reduced-motion.webp` without movement.

## Nebelmoor

**Journey use:** quiet, reflective route across open wetlands.

**Visual identity:** broad still water, low grasses, layered mist, boardwalk/path and isolated warm way-lights. Mystical and calm, not horror-coded.

**Timer / UI safe area:** open sky / mist field in the upper-center and upper-right. Do not place dense UI on the lantern/path focal line.

**Motion suggestion:**
- background: 0.5–1.5% drift over 60–120s
- midground: 1–2% drift over 50–100s
- foreground: 2–3% drift over 40–80s
- optional mist opacity change under 4%; never sweeping fog

**Reduced Motion:** use `region-mist-moor-reduced-motion.webp` unchanged.

## Bergpfad

**Journey use:** open highland travel with a sense of distance and progress, without danger.

**Visual identity:** rocky/grassy path, wide horizon, distant peaks and quiet travel markers.

**Timer / UI safe area:** broad sky and distant-valley area around the upper-middle / center-right; preserve the foreground path as the journey cue.

**Motion suggestion:**
- background: 0.5–1% drift over 60–120s
- midground: 1–2% drift over 50–90s
- foreground: 2–3% drift over 40–80s
- no dramatic cloud speed, camera shake or summit reveal

**Reduced Motion:** use `region-mountain-path-reduced-motion.webp` unchanged.

## Self-review

Checked against `docs/CONCEPT.md`, `docs/PHASE1-ART-AUDIO-HANDOFF.md`, Phase-1 art and Issue #22:

- [x] three visually distinct regions
- [x] same product/world language across all regions
- [x] Adult Cozy Fantasy, painterly 2D/2.5D
- [x] text/UI/character-free web art
- [x] calm focus-compatible compositions
- [x] documented three-depth structure
- [x] documented quiet timer/UI zones
- [x] documented subtle parallax
- [x] equivalent static Reduced-Motion assets
- [x] web naming and WebP export
- [ ] Project Lead visual acceptance

## Handoff gate

This package is for **Project Lead visual/product review only**. The Developer receives a separate integration task only after approval.
