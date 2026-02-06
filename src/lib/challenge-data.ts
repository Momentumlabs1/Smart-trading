// Challenge content data for the 5-day Trader Challenge

export interface ChallengeDay {
  day: number;
  title: string;
  videoTitle: string;
  description: string;
  content: {
    intro: string;
    bulletPoints: string[];
    conclusion: string;
    ctaText?: string;
    ctaLink?: string;
  };
  videoUrl?: string; // Placeholder for actual video URLs
  duration: string;
}

export const challengeDays: ChallengeDay[] = [
  {
    day: 1,
    title: "Der Weg zum profitablen Trader",
    videoTitle: "Was du wirklich brauchst, um profitabel zu traden",
    description: "Am ersten Tag legst du das Fundament. Du lernst, wie du deinen Arbeitsplatz einrichtest, welche Tipps erfolgreiche Trader befolgen und wie du es dir zur Gewohnheit machst.",
    content: {
      intro: "In diesem ersten Video steigen wir gemeinsam in die Trader Challenge ein – und du bekommst direkt einen klaren Überblick:",
      bulletPoints: [
        "Wie der Alltag als profitabler Trader wirklich aussieht",
        "Warum du nicht täglich traden musst, um profitabel zu sein",
        "Mit wie wenig Startkapital du realistisch loslegen kannst",
        "Die 3 Voraussetzungen, die jeder profitable Trader erfüllen muss",
        "Und was du konkret tun kannst, um in wenigen Wochen erste Ergebnisse zu erzielen"
      ],
      conclusion: "Du bekommst einen Einblick, wie andere es geschafft haben – vom Kfz-Mechatroniker bis zum Studenten – in kurzer Zeit konstant 5.000,- und mehr zu erzielen.",
      ctaText: "Buche dir hier einen Termin",
      ctaLink: "#"
    },
    duration: "18 Min"
  },
  {
    day: 2,
    title: "Mit Risikomanagement zum Millionär",
    videoTitle: "Live-Trading Einstieg",
    description: "Am zweiten Tag steigen wir direkt in den Live-Trade ein. Du lernst am Chart, welche Indikatoren dir helfen, unnötige Verluste zu vermeiden.",
    content: {
      intro: "Heute geht es um den Teil, der die meisten Trader scheitern lässt: Das Risikomanagement.",
      bulletPoints: [
        "Warum 90% der Trader scheitern – und wie du zu den 10% gehörst",
        "Die goldene Regel des Risikomanagements",
        "Wie du mit nur 40% Gewinnquote profitabel tradest",
        "Konkrete Beispiele für Risk-Reward-Verhältnisse"
      ],
      conclusion: "Du wirst sehen: Es braucht keine Glaskugel oder Vorhersage. Es reicht ein System – das du verstehen, anwenden und wiederholen kannst.",
      ctaText: "Buche dir hier einen Termin",
      ctaLink: "#"
    },
    duration: "22 Min"
  },
  {
    day: 3,
    title: 'Wie du "Gold im Chart" findest und erntest',
    videoTitle: "Wie erkennst, wann der Markt dir Geld schenkt",
    description: "Am dritten Tag lernst du Chartmuster erkennen und gehst in die Tiefe. Du erfährst alles über die besten Setups.",
    content: {
      intro: "Im dritten Video zeig' ich dir, wie du echte Gelegenheiten im Markt erkennst – und welche Setups du besser liegen lässt.",
      bulletPoints: [
        "Wie du Trendphasen erkennst und systematisch nutzt",
        "Wie ein gutes Setup aussieht - und woran du erkennst, wann der Markt bereit ist",
        "Warum ein Trading-Journal der wichtigste Spiegel deiner Entwicklung ist",
        "Und wie Profis mit Rückschlägen und Fehlern umgehen"
      ],
      conclusion: "Ich zeig' dir LIVE am Chart, wie ein Trade entsteht – von der Planung bis zur Ausführung. Das Gute daran: Du brauchst nicht viele Trades. Du brauchst nur die richtigen.",
      ctaText: "Buche dir hier einen Termin",
      ctaLink: "#"
    },
    duration: "25 Min"
  },
  {
    day: 4,
    title: "So mangelt es dir niemals an Geld (Kapital)",
    videoTitle: "Kapital aufbauen, Denkfehler lösen – und starten",
    description: "Am vierten Tag dreht sich alles um Kapital und Prop Trading. Du lernst, wie du ohne eigenes Kapital startest.",
    content: {
      intro: "Im vierten Video geht es um den Teil, an dem viele scheitern: das Kapital.",
      bulletPoints: [
        "Warum Firmen dir freiwillig Zugriff auf 6-stellige Konten gewähren",
        "Wie viel du realistischerweise selbst brauchst, um im Trading einzusteigen",
        "Was alle erfolgreichen Trader gemeinsam haben – und warum das kein Zufall ist"
      ],
      conclusion: "Außerdem sprechen wir über stark verbreitete Denkfehler rund um Geld. Wenn du diese eliminierst, wird es dir nie an Geld mangeln – weil Kapital immer dorthin fließt, wo Menschen wissen, wie man es vermehrt.",
      ctaText: "Jetzt Termin sichern",
      ctaLink: "#"
    },
    duration: "20 Min"
  },
  {
    day: 5,
    title: "Dein Trading-Plan",
    videoTitle: "Abschluss der Challenge: Vom Wissen zur Umsetzung",
    description: "Am fünften und letzten Tag erstellst du deinen persönlichen Trading-Plan. Mit allem, was du gelernt hast.",
    content: {
      intro: "In den letzten Tagen hast du gelernt, wie profitables Trading wirklich funktioniert – ohne Bauchgefühl, ohne Glück, sondern mit System, klaren Regeln und kontrolliertem Risiko.",
      bulletPoints: [
        "Trading ist ein simpler Skill – den du Schritt für Schritt erlernen kannst",
        "Schon mit einer Trefferquote von 40 % kannst du profitabel handeln",
        "Mit Prop Trading ist der Einstieg auch ohne Eigenkapital möglich",
        "Dein Skill entscheidet, nicht dein Kontostand",
        "Die besten Chancen entstehen, wenn du Einstiege gut erkennst und nicht dauernd handelst"
      ],
      conclusion: "Jetzt kommt der entscheidende Punkt: die Umsetzung. Denn Wissen verändert nichts – erst Handeln bringt Ergebnisse.",
      ctaText: "Jetzt persönliches Gespräch buchen",
      ctaLink: "#"
    },
    duration: "28 Min"
  }
];

export const sevenStepsPlan = [
  "Trading View Account erstellen und Chartsetup einrichten.",
  "Einen Prop Trading Anbieter auswählen und Regeln verstehen.",
  "Demokonto erstellen und risikofrei testen.",
  "Handelsstrategie entwickeln und dokumentieren.",
  "Erste Live Trades mit kleiner Positionsgröße durchführen.",
  "Risikomanagement perfektionieren und Fehler analysieren.",
  "Ein solides Portfolio aufbauen und skalieren."
];
