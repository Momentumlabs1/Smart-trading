// Saifs Kennenlern-Funnel. Jeder Knoten ist ein Video oder eine Karte; Antworten führen zum nächsten Knoten.
// Videos: public/videos/funnel/<id>.mp4 (720×1280, Captions eingebrannt), Poster: <id>.jpg.
// askAt = Sekunde, ab der Saif die Frage stellt; ab dann stehen die Antworten bereit.

export type FunnelStage = 'hallo' | 'saif' | 'stand' | 'ziel' | 'weg';

export const STAGES: { id: FunnelStage; label: string }[] = [
  { id: 'hallo', label: 'Hallo' },
  { id: 'saif', label: 'Saif' },
  { id: 'stand', label: 'Dein Stand' },
  { id: 'ziel', label: 'Dein Ziel' },
  { id: 'weg', label: 'Dein Weg' },
];

export interface FunnelAnswer { label: string; next: string; value?: string }

export interface FunnelNode {
  id: string;
  kind: 'video' | 'card' | 'result';
  stage: FunnelStage;
  /** Kurze Überschrift im Player */
  title: string;
  /** Frage, die Saif stellt (steht über den Antworten) */
  question?: string;
  /** Schlüssel, unter dem die Antwort gemerkt wird */
  answerKey?: 'level' | 'anlass' | 'ziel' | 'baustelle' | 'einstieg';
  video?: string;
  askAt?: number;
  /** Text der Karte, wenn es (noch) kein Video gibt */
  lines?: string[];
  answers?: FunnelAnswer[];
}

const LEVEL: FunnelAnswer[] = [
  { label: 'Ich fange gerade erst an', next: 'anfaenger', value: 'Einsteiger' },
  { label: 'Ich trade schon', next: 'fortgeschritten', value: 'Tradet schon' },
];

const ZIEL: FunnelAnswer[] = [
  { label: 'Mir etwas nebenbei aufbauen', next: 'ergebnis' },
  { label: 'Finanziell unabhängiger werden', next: 'ergebnis' },
  { label: 'Erstmal verstehen, wie Trading funktioniert', next: 'ergebnis' },
];

export const FUNNEL: Record<string, FunnelNode> = {
  begruessung: {
    id: 'begruessung', kind: 'video', stage: 'hallo', title: 'Hi, ich bin Saif.', video: 'begruessung', askAt: 11.5,
    question: 'Wie willst du starten?', answerKey: 'einstieg',
    answers: [
      { label: 'Erst mehr über Saif erfahren', next: 'geschichte', value: 'Geschichte' },
      { label: 'Direkt zum Trading', next: 'direkt', value: 'Direkt' },
    ],
  },
  geschichte: {
    id: 'geschichte', kind: 'video', stage: 'saif', title: 'Meine Geschichte.', video: 'geschichte', askAt: 64.7,
    question: 'Wo stehst du gerade?', answerKey: 'level', answers: LEVEL,
  },
  direkt: {
    id: 'direkt', kind: 'video', stage: 'saif', title: 'Direkt zum Punkt.', video: 'direkt', askAt: 10.5,
    question: 'Wo stehst du gerade?', answerKey: 'level', answers: LEVEL,
  },
  anfaenger: {
    id: 'anfaenger', kind: 'video', stage: 'stand', title: 'Du fängst gerade an.', video: 'anfaenger', askAt: 13.8,
    question: 'Was war dein Auslöser?', answerKey: 'anlass',
    answers: [
      { label: 'Ich habe endlich Zeit dafür', next: 'ziel' },
      { label: 'Ich will mir etwas aufbauen', next: 'ziel-kurz' },
      { label: 'Mich interessieren die Märkte', next: 'ziel-kurz' },
    ],
  },
  ziel: {
    id: 'ziel', kind: 'video', stage: 'ziel', title: 'Was willst du erreichen?', video: 'ziel', askAt: 5.9,
    question: 'Was ist dein Ziel?', answerKey: 'ziel', answers: ZIEL,
  },
  'ziel-kurz': {
    id: 'ziel-kurz', kind: 'video', stage: 'ziel', title: 'Was willst du erreichen?', video: 'ziel-kurz', askAt: 0.6,
    question: 'Was ist dein Ziel?', answerKey: 'ziel', answers: ZIEL,
  },
  fortgeschritten: {
    id: 'fortgeschritten', kind: 'card', stage: 'stand', title: 'Du tradest schon.',
    lines: [
      'Stark, dann bist du schon weiter als die meisten.',
      'Die härteste Phase ist oft nicht der Anfang, sondern die Zeit danach: mal Plus, mal Minus, und kein fester Plan.',
    ],
    question: 'Wo hakt es gerade am meisten?', answerKey: 'baustelle',
    answers: [
      { label: 'Ich verliere mehr, als ich gewinne', next: 'ergebnis' },
      { label: 'Mal Plus, mal Minus, kein System', next: 'ergebnis' },
      { label: 'Mir fehlt die Zeit für eigene Analysen', next: 'ergebnis' },
    ],
  },
  ergebnis: { id: 'ergebnis', kind: 'result', stage: 'weg', title: 'Dein Weg mit Saif.' },
};

export const VIDEO_BASE = '/videos/funnel/';
