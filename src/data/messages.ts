/** Messages d'aide à la construction — §10.9 */
export const BUILDER_HELP = {
  missingStructure: 'Ajoute une structure.',
  missingCamera: 'Ajoute une caméra pour observer la Terre.',
  missingAntenna: 'Ajoute une antenne pour transmettre les données.',
  missingBattery: 'Ajoute une batterie.',
  missingSolar: 'Ajoute un panneau solaire pour produire de l’énergie.',
  missingOrientation: 'Ajoute un système d’orientation.',
  massExceeded: 'Réduis la masse ou choisis un lanceur plus puissant.',
  budgetExceeded: 'Retire un composant ou choisis un lanceur moins coûteux.',
  energyInsufficient: 'Ajoute un panneau solaire ou réduis la consommation.',
} as const

export const REQUIRED_LABELS: Record<string, string> = {
  structure: 'structure',
  energy: 'panneau solaire',
  battery: 'batterie',
  camera: 'caméra',
  antenna: 'antenne',
  attitude: 'système d’orientation',
}

export const CATEGORY_LABELS: Record<string, string> = {
  structure: 'Structure',
  energy: 'Énergie',
  battery: 'Batterie',
  camera: 'Caméra',
  antenna: 'Antenne',
  attitude: 'Orientation',
  shield: 'Protection',
}

export const QUICK_MESSAGES = {
  noActiveMission: 'Aucune mission en cours',
  missionSaved: 'Mission enregistrée',
  missionDeleted: 'Mission supprimée',
} as const
