/**
 * Material-Paletten für den Item-Baukasten.
 *
 * Diese Farben gehören zur Illustrations-Ebene, nicht zur Oberfläche — sie stehen
 * deshalb bewusst nicht im Token-Satz aus DESIGN-SYSTEM.md. Sie erscheinen nur
 * innerhalb der Item-Kachel; außerhalb gibt es ausschließlich Linie und Tokens.
 * Siehe docs/ART-DIRECTION.md, Abschnitt „Die Grenze".
 */
import type { Material } from './items'

export interface MaterialPalette {
  /** Tiefer Ton, Schattenseite */
  dark: string
  /** Grundton der Fläche */
  body: string
  /** Kante zum Licht hin */
  light: string
}

export const MATERIAL_PALETTE: Record<Material, MaterialPalette> = {
  eisen:     { dark: '#3A3E42', body: '#5B6167', light: '#8B939B' },
  bronze:    { dark: '#4A3520', body: '#7A5528', light: '#B58542' },
  silber:    { dark: '#4E5257', body: '#878D95', light: '#C3C9D0' },
  mondstein: { dark: '#3B4358', body: '#66739A', light: '#A8B4D6' },
  glut:      { dark: '#4A1E12', body: '#93381C', light: '#DE7434' },
  obsidian:  { dark: '#17161C', body: '#2B2933', light: '#5C5768' },
}
