# Phase 1 Art/Audio Handoff

Status: Art/Audio production deliverables for #40 and #41 are prepared for integration and review.

## Visual asset pack

`public/assets/phase1-art-pack.svg` is a web-optimized SVG sprite with semantic symbols for the complete Vertical Slice:

- `intro-forest-bg`, `intro-forest-mid`, `intro-forest-fg`, `intro-camp-glow`
- `camp-stage-01-base`, `camp-stage-01-lantern`
- `camp-adventure-book`
- `quest-light-undergrowth-beat-01` through `-04`
- `journey-silhouette`
- `rest-campfire`
- `chest-closed`, `chest-open`
- `item-old-road-lantern`
- `race-human-base`, `race-elf-base`, `race-dwarf-base`, `race-goblin-base`, `race-orc-base`
- `character-variants-guide`

The art intentionally contains no baked-in text or timer. The focus timer remains a semantic UI layer integrated by the Developer.

## Visual guardrails

- Adult Cozy Fantasy; illustrated adventure-book / 2D-2.5D diorama language.
- Warm amber camp light against muted night blue, forest green, earth, wood, brass and parchment.
- Character customization stays minimal: no tattoos, scars, plasters/patches, make-up system or detail sliders.
- Journey beats are static key states. Motion should use slow parallax/cross-fades only; Reduced Motion can switch them discretely.
- Keep approximately 10% safe zone for responsive UI.

## Audio pack

The Phase-1 audio identity consists of six original synthesized cues:

1. `audio-camp-forest-ambience-01.ogg`
2. `audio-departure-motif-01.ogg`
3. `audio-focus-light-undergrowth-01.ogg`
4. `audio-completion-resolve-01.ogg`
5. `audio-rest-campfire-ambience-01.ogg`
6. `sfx-chest-lantern-material-01.ogg`

Source generation is deterministic and license-free; no third-party recordings or music are used.

## Audio integration guardrails

- Music, ambience and SFX remain independently mutable.
- Audio must never block focus start.
- No sudden loud peaks; focus ambience stays subdued.
- Completion uses a musical resolve instead of an alarm/beep.
- Chest/lantern SFX stays material and non-gambling-like.

## Ownership after this handoff

- Developer: integration into Vertical Slice.
- Project Lead: visual/audio product acceptance.
- Technical Owner: technical review only; no asset development.
