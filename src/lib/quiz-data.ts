// Quiz Types
export interface QuizOption {
  label: string;
  value: string;
  description?: string;
}

export interface QuizQuestion {
  id: number;
  title: string;
  subtitle?: string;
  type: 'single' | 'multi' | 'slider' | 'chart' | 'contact';
  options?: QuizOption[];
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    format: (value: number) => string;
  };
  chartImage?: string;
  feedback?: Record<string, string>;
}

export interface QuizAnswers {
  [key: string]: string | string[] | number;
}

export interface QuizResult {
  level: 'einsteiger' | 'fortgeschrittener_einsteiger' | 'erfahren' | 'fortgeschritten';
  levelLabel: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: {
    primary: 'free' | 'academy' | 'elite';
    secondary: 'free' | 'academy' | 'elite' | null;
  };
}

// Die 12 Fragen
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    title: 'Was ist dein Hauptziel mit Trading?',
    type: 'single',
    options: [
      { label: 'Nebeneinkommen aufbauen', value: 'side_income' },
      { label: 'Haupteinkommen langfristig ersetzen', value: 'main_income' },
      { label: 'Vermögen aufbauen', value: 'wealth' },
      { label: 'Einfach lernen und verstehen', value: 'learn' },
    ],
  },
  {
    id: 2,
    title: 'Wo stehst du gerade?',
    type: 'single',
    options: [
      { label: 'Noch nie getradet / nur Demo', value: 'never' },
      { label: 'Trade seit einigen Monaten mit echtem Geld', value: 'months' },
      { label: 'Trade seit über einem Jahr', value: 'year_plus' },
      { label: 'Bereits konstant profitabel', value: 'profitable' },
    ],
  },
  {
    id: 3,
    title: 'Wie viel Zeit kannst du pro Woche investieren?',
    type: 'single',
    options: [
      { label: '1-5 Stunden', value: '1-5' },
      { label: '5-15 Stunden', value: '5-15' },
      { label: '15+ Stunden', value: '15+' },
    ],
  },
  {
    id: 4,
    title: 'Mit welchem Kapital planst du zu traden?',
    type: 'slider',
    sliderConfig: {
      min: 500,
      max: 50000,
      step: 500,
      format: (value: number) => value >= 50000 ? '€50.000+' : `€${value.toLocaleString('de-DE')}`,
    },
  },
  {
    id: 5,
    title: 'Was siehst du in diesem Chart?',
    subtitle: 'Preis an einer klaren Support-Zone mit bullisher Candle-Formation',
    type: 'chart',
    options: [
      { label: 'Möglicher Long-Einstieg am Support', value: 'correct' },
      { label: 'Weiter fallend, Short-Setup', value: 'wrong_short' },
      { label: 'Kein klares Setup erkennbar', value: 'no_setup' },
      { label: 'Bin mir nicht sicher', value: 'unsure' },
    ],
    feedback: {
      correct: 'Richtig! Du erkennst Support-Zonen.',
      wrong_short: 'Die Candle-Formation deutet eher auf Long hin.',
      no_setup: 'Es gibt hier tatsächlich ein Setup – du wirst lernen, es zu sehen.',
      unsure: 'Kein Problem – genau das lernst du bei uns.',
    },
  },
  {
    id: 6,
    title: 'Du bist 2% im Minus, dein Stop liegt bei -3%. Was machst du?',
    type: 'single',
    options: [
      { label: 'Stop halten wie geplant', value: 'hold_stop' },
      { label: 'Stop anpassen, vielleicht dreht\'s noch', value: 'adjust_stop' },
      { label: 'Position vergrößern (nachkaufen)', value: 'average_down' },
      { label: 'Früher schließen aus Angst', value: 'close_early' },
      { label: 'Ich trade meistens ohne Stop', value: 'no_stop' },
    ],
  },
  {
    id: 7,
    title: 'Du bist 3% im Plus, dein Take-Profit liegt bei 5%. Der Markt zeigt erste Schwäche. Was machst du?',
    type: 'single',
    options: [
      { label: 'Plan halten, TP bei 5%', value: 'hold_plan' },
      { label: 'Gewinne sichern, Position schließen', value: 'take_profit_early' },
      { label: 'Stop nachziehen auf Break-Even', value: 'trailing_stop' },
      { label: 'Kommt drauf an (kein fester Plan)', value: 'no_plan' },
    ],
  },
  {
    id: 8,
    title: 'Was beschreibt dich am besten?',
    type: 'single',
    options: [
      { label: 'Mir fehlt eine klare Strategie', value: 'no_strategy' },
      { label: 'Ich weiß was zu tun ist, setze es aber nicht um', value: 'no_execution' },
      { label: 'Ich trade zu emotional', value: 'emotional' },
      { label: 'Ich bin noch ganz am Anfang', value: 'beginner' },
      { label: 'Ich bin schon gut, will aber besser werden', value: 'advanced' },
    ],
  },
  {
    id: 9,
    title: 'Was hast du bisher genutzt?',
    subtitle: 'Mehrfachauswahl möglich',
    type: 'multi',
    options: [
      { label: 'YouTube / Kostenlose Inhalte', value: 'youtube' },
      { label: 'Bücher', value: 'books' },
      { label: 'Online-Kurse', value: 'courses' },
      { label: 'Signalgruppen / Copy-Trading', value: 'signals' },
      { label: 'Selbst ausprobiert', value: 'self_taught' },
      { label: 'Noch nichts davon', value: 'nothing' },
    ],
  },
  {
    id: 10,
    title: 'Wie lernst du am besten?',
    type: 'single',
    options: [
      { label: 'Selbstständig durch Videos/Kurse', value: 'video' },
      { label: 'Interaktive Live-Sessions', value: 'live' },
      { label: 'Persönliches 1:1 Mentoring', value: 'mentoring' },
      { label: 'Learning by Doing mit Feedback', value: 'learning_by_doing' },
    ],
  },
  {
    id: 11,
    title: 'Was wärst du bereit monatlich zu investieren, wenn du weißt, dass es funktioniert?',
    type: 'single',
    options: [
      { label: 'Erstmal kostenlos testen', value: 'free' },
      { label: 'Bis €100/Monat', value: 'up_to_100' },
      { label: '€100-500/Monat', value: '100_500' },
      { label: '€500+/Monat', value: '500_plus' },
    ],
  },
  {
    id: 12,
    title: 'Wohin sollen wir dein Ergebnis senden?',
    type: 'contact',
  },
];

// Scoring Logik
export const calculateResult = (answers: QuizAnswers): QuizResult => {
  let score = 0;
  
  // Erfahrung (größter Faktor)
  const experience = answers['2'] as string;
  if (experience === 'never') score += 0;
  if (experience === 'months') score += 25;
  if (experience === 'year_plus') score += 50;
  if (experience === 'profitable') score += 80;
  
  // Chart-Test
  if (answers['5'] === 'correct') score += 10;
  
  // Risiko-Szenario (richtiges Verhalten)
  if (answers['6'] === 'hold_stop') score += 10;
  
  // Herausforderung
  if (answers['8'] === 'advanced') score += 15;
  
  // Level bestimmen
  let level: QuizResult['level'];
  let levelLabel: string;
  let description: string;
  let strengths: string[] = [];
  let weaknesses: string[] = [];
  
  if (score < 20) {
    level = 'einsteiger';
    levelLabel = 'Einsteiger';
    description = 'Du stehst noch am Anfang deiner Trading-Reise. Das ist der beste Zeitpunkt, um die richtigen Grundlagen zu lernen.';
    strengths = ['Motivation zum Lernen', 'Keine schlechten Gewohnheiten'];
    weaknesses = ['Grundwissen fehlt', 'Keine Strategie vorhanden'];
  } else if (score < 45) {
    level = 'fortgeschrittener_einsteiger';
    levelLabel = 'Fortgeschrittener Einsteiger';
    description = 'Du hast Grundwissen, aber kämpfst noch mit Konsistenz und emotionalen Entscheidungen.';
    strengths = ['Grundverständnis vorhanden', 'Bereit Zeit zu investieren'];
    weaknesses = ['Emotionales Trading', 'Keine feste Strategie'];
  } else if (score < 70) {
    level = 'erfahren';
    levelLabel = 'Erfahrener Trader';
    description = 'Du hast Trading-Erfahrung und möchtest deine Ergebnisse optimieren.';
    strengths = ['Technisches Verständnis', 'Praktische Erfahrung'];
    weaknesses = ['Feintuning fehlt', 'Optimierungspotenzial'];
  } else {
    level = 'fortgeschritten';
    levelLabel = 'Fortgeschrittener Trader';
    description = 'Du bist bereits profitabel und willst skalieren.';
    strengths = ['Konstante Profitabilität', 'Solides Risikomanagement'];
    weaknesses = ['Skalierung', 'Diversifikation'];
  }
  
  // Empfehlung basierend auf Level und Budget
  const budget = answers['11'] as string;
  let recommendation: QuizResult['recommendation'];
  
  if (level === 'einsteiger') {
    recommendation = { primary: 'free', secondary: 'academy' };
  } else if (level === 'fortgeschrittener_einsteiger') {
    recommendation = { primary: 'academy', secondary: null };
  } else if (level === 'erfahren') {
    if (budget === '500_plus') {
      recommendation = { primary: 'elite', secondary: 'academy' };
    } else {
      recommendation = { primary: 'academy', secondary: 'elite' };
    }
  } else {
    recommendation = { primary: 'elite', secondary: null };
  }
  
  return {
    level,
    levelLabel,
    description,
    strengths,
    weaknesses,
    recommendation,
  };
};
