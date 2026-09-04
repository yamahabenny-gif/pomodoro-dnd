# Agent-Skills

Dieses Projekt nutzt Claude-/Agent-Skills als Design- und Review-Werkzeug. Welche
Skills gelten, steht versioniert in [`skills-lock.json`](../skills-lock.json) —
die Dateien selbst liegen bewusst **nicht** im Repo.

## Einrichten

```bash
npx skills experimental_install
```

## Was hier eingesetzt wird und wofür

| Skill | Quelle | Eingesetzt für |
|---|---|---|
| `impeccable` | `pbakaus/impeccable` | Design-Qualität, Anti-Pattern-Prüfung, `audit` und `polish` vor jedem UI-Merge |
| `ui-ux-pro-max` | `nextlevelbuilder/ui-ux-pro-max-skill` | Stil-Katalog, Farb- und Typo-Referenzen, Stack-Regeln |
| `emil-design-eng`, `animate`, `improve-animations` | `emilkowalski/skill` | Truhen-Animation, Phasenübergänge, Micro-Interactions |
| `shadcn` | `shadcn/ui` | Komponenten korrekt anlegen und thematisieren |
| `web-design-guidelines` | `vercel-labs/agent-skills` | Barrierefreiheits- und UI-Audit gegen die Web Interface Guidelines |
| `vercel-react-view-transitions`, `vercel-cli-with-tokens` | `vercel-labs/agent-skills` | Seitenübergänge, Deployment |

## Nicht installiert — und warum

Zwei Skills der ursprünglichen Auswahl gibt es unter den genannten Adressen nicht
(HTTP 404, Stand 2026-09-04):

- `ui-skills/interaction-design`
- `ui-skills/interface-design`

Deren Themen — Micro-Interactions, Feedback-Schleifen, Zustandsübergänge, Grids,
8-pt-Abstände, datendichte Layouts — sind hier durch `emil-design-eng` (Interaktion)
und `impeccable` mit `ui-ux-pro-max` (Interface, Raster, Abstände) abgedeckt, und die
konkreten Regeln stehen ausformuliert in [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

Findet jemand die Originale unter einer anderen Adresse: Issue aufmachen, nicht
stillschweigend eine ähnlich klingende Fremdquelle einsetzen. Skills laufen mit
vollen Agent-Rechten — die Herkunft muss stimmen.

## Regel

**Vor jedem UI-Pull-Request** läuft mindestens ein Durchgang mit
`web-design-guidelines` und `impeccable audit` über die geänderten Dateien. Die
Befunde gehören in den PR — behoben oder mit Begründung offengelassen.
