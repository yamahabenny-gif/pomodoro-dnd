export type QuestDurationMinutes = 15 | 25 | 50

export interface QuestDefinition {
  key: string
  title: string
  durationMinutes: QuestDurationMinutes
  assignment: readonly [string, string?]
  region: string
  location: string
  journeyRef: 'unterholz'
  href: string
}

export const QUEST_CATALOG: readonly QuestDefinition[] = [
  {
    key: 'ein-licht-im-unterholz',
    title: 'Ein Licht im Unterholz',
    durationMinutes: 15,
    assignment: [
      'Zwischen Farnen flackert ein schwaches Licht. Folge ihm ein Stück und widme dich dabei genau einer Sache, die heute wirklich weiterkommen soll.',
      'Du musst nichts beweisen. Fünfzehn Minuten reichen für diesen Abschnitt des Weges.',
    ],
    region: 'Flüsterwald',
    location: 'Unterholzpfad',
    journeyRef: 'unterholz',
    href: '/quest/first-light',
  },
  {
    key: 'moos-am-alten-steg',
    title: 'Moos am alten Steg',
    durationMinutes: 15,
    assignment: [
      'Am alten Steg sammelt sich Morgenfeuchte im Moos. Nimm dir einen kleinen Arbeitsabschnitt vor und bleib bei ihm, bis der Weg ein Stück klarer ist.',
      'Der Steg hält auch ohne Eile.',
    ],
    region: 'Flüsterwald',
    location: 'Alter Steg',
    journeyRef: 'unterholz',
    href: '/quest/catalog/moos-am-alten-steg',
  },
  {
    key: 'kartenrand-im-farn',
    title: 'Der Kartenrand im Farn',
    durationMinutes: 25,
    assignment: [
      'Ein Stück einer alten Karte schaut zwischen den Farnen hervor. Nutze diesen Weg, um eine Sache konzentriert weiterzuführen, die etwas mehr Ruhe braucht.',
      'Fünfundzwanzig Minuten sind genug, um eine Spur aufzunehmen.',
    ],
    region: 'Flüsterwald',
    location: 'Farnsenke',
    journeyRef: 'unterholz',
    href: '/quest/catalog/kartenrand-im-farn',
  },
  {
    key: 'teehaus-hinter-den-birken',
    title: 'Das Teehaus hinter den Birken',
    durationMinutes: 25,
    assignment: [
      'Hinter den Birken steht ein kleines Teehaus, dessen Fenster schon lange niemand geöffnet hat. Arbeite an genau einer Aufgabe weiter, während du den Weg dorthin suchst.',
      'Der Tee läuft nicht weg. Sehr wahrscheinlich.',
    ],
    region: 'Flüsterwald',
    location: 'Birkenhain',
    journeyRef: 'unterholz',
    href: '/quest/catalog/teehaus-hinter-den-birken',
  },
  {
    key: 'pfad-der-stillen-steine',
    title: 'Der Pfad der stillen Steine',
    durationMinutes: 50,
    assignment: [
      'Runde Wegsteine führen tiefer in den Wald, einer nach dem anderen. Nimm eine größere Aufgabe mit und gib ihr für diesen Abschnitt deine ungeteilte Aufmerksamkeit.',
      'Fünfzig Minuten dürfen sich lang anfühlen. Der Pfad erwartet nichts weiter.',
    ],
    region: 'Flüsterwald',
    location: 'Steinpfad',
    journeyRef: 'unterholz',
    href: '/quest/catalog/pfad-der-stillen-steine',
  },
  {
    key: 'laternen-am-waldrand',
    title: 'Laternen am Waldrand',
    durationMinutes: 50,
    assignment: [
      'Am Waldrand hängen alte Laternen zwischen niedrigen Ästen und markieren einen ruhigen, langen Weg. Nimm dir ein Vorhaben vor, das heute wirklich Raum bekommen soll.',
      'Du musst nicht schneller gehen. Nur beim Weg bleiben.',
    ],
    region: 'Flüsterwald',
    location: 'Nördlicher Waldrand',
    journeyRef: 'unterholz',
    href: '/quest/catalog/laternen-am-waldrand',
  },
] as const

export function getQuestByKey(key: string): QuestDefinition | null {
  return QUEST_CATALOG.find((quest) => quest.key === key) ?? null
}
