// SAIF Basic Academy: Inhalte. Aufgebaut wie die Cosmos-Academy (Module → Lektionen → Lernziele/Quiz),
// aber auf das ausgerichtet, was Mitglieder hier tun: Trades aus der Gruppe verstehen, selbst übernehmen, dazulernen.
// Videos: `video` = Objektname im privaten Bucket (academy-videos, Präfix saif/), ausgeliefert über video-url.
// Solange eine Lektion kein Video hat, trägt sie Text, Beispiel und Werkzeug allein.

export type ToolKey = 'lots' | 'rr' | 'streak';

export interface QuizQuestion { q: string; options: string[]; correct: number; why: string }

export interface Lesson {
  id: string;
  module: string;
  title: string;
  summary: string;
  minutes: number;
  video?: string;
  objectives: string[];
  /** Absätze; **fett** ist erlaubt */
  body: string[];
  tool?: ToolKey;
  quiz?: QuizQuestion[];
}

export interface Module { id: string; title: string; kicker: string; text: string }

export const MODULES: Module[] = [
  { id: 'start', kicker: 'MODUL 01', title: 'Dein Start', text: 'Wie die Gruppe funktioniert und was du vor dem ersten Trade einrichtest.' },
  { id: 'nachricht', kicker: 'MODUL 02', title: 'Die Trade-Nachricht verstehen', text: 'Richtung, Einstieg, Stop Loss, Ziel und was Pips und Lots bei Gold bedeuten.' },
  { id: 'umsetzen', kicker: 'MODUL 03', title: 'Trades selbst übernehmen', text: 'Vom Handy in deine Order, mit einer Positionsgröße, die zu deinem Konto passt.' },
  { id: 'updates', kicker: 'MODUL 04', title: 'Updates richtig einordnen', text: 'Breakeven, Teilgewinne, Stop nachziehen und warum Verlustserien dazugehören.' },
  { id: 'lernen', kicker: 'MODUL 05', title: 'Am Trade dazulernen', text: 'Journal, Emotionen und der Schritt von „kopieren“ zu „verstehen“.' },
];

export const LESSONS: Lesson[] = [
  {
    id: 'saif-01', module: 'start', title: 'So funktioniert die Gruppe', minutes: 4,
    summary: 'Was in der VIP-Gruppe passiert und was deine Aufgabe ist.',
    objectives: ['Du weißt, welche Nachrichten in der Gruppe kommen', 'Du weißt, dass du jeden Trade selbst übernimmst und selbst entscheidest', 'Du kennst die drei Schritte: erhalten, umsetzen, verstehen'],
    body: [
      'In der VIP-Gruppe kommen die Trades live rein. Jede Trade-Nachricht nennt **das Instrument, die Richtung, den Einstieg, den Stop Loss und ein oder mehrere Ziele**. Dazu kommen Updates, wenn sich an einem laufenden Trade etwas ändert.',
      'Niemand handelt für dich. Du liest die Nachricht, prüfst sie und gibst den Trade **selbst** in deinem Handelskonto ein. Wie viel du riskierst, entscheidest du. Genau dafür ist diese Academy da.',
      'Merk dir die drei Schritte: **Erhalten** (die Nachricht lesen), **Umsetzen** (sauber in deine Order übertragen), **Verstehen** (nachvollziehen, was im Trade passiert ist). Wer nur kopiert, bleibt abhängig. Wer versteht, wird mit jedem Trade sicherer.',
    ],
    quiz: [
      { q: 'Wer gibt den Trade in deinem Handelskonto ein?', options: ['Die Gruppe automatisch', 'Du selbst', 'Der Broker'], correct: 1, why: 'Du übernimmst jeden Trade selbst. Die Nachricht ist eine Vorlage, die Entscheidung und das Risiko liegen bei dir.' },
      { q: 'Was steht in einer vollständigen Trade-Nachricht?', options: ['Nur die Richtung', 'Instrument, Richtung, Einstieg, Stop Loss und Ziel', 'Ein Gewinnversprechen'], correct: 1, why: 'Ohne Einstieg, Stop Loss und Ziel ist ein Trade nicht sauber planbar.' },
    ],
  },
  {
    id: 'saif-02', module: 'start', title: 'Dein Handelskonto einrichten', minutes: 6,
    summary: 'Konto bei VT Markets, Einzahlung und MetaTrader auf dem Handy.',
    objectives: ['Dein Konto ist eröffnet und verifiziert', 'Deine Einzahlung liegt auf dem Handelskonto', 'MetaTrader ist installiert und mit deinem Konto verbunden'],
    body: [
      'Du handelst auf deinem **eigenen Konto** bei unserem Partner-Broker VT Markets. Das Geld liegt bei dir, nicht bei uns. Den Anmeldelink bekommst du vom Bot, damit dein Konto richtig zugeordnet ist.',
      'Nach der Anmeldung verifizierst du dein Konto (Ausweis und Wohnsitz). Danach zahlst du im Kundenbereich ein und achtest darauf, dass das Geld **auf dem Handelskonto** landet. Sobald die Einzahlung da ist, schaltet dich der Bot für die VIP-Gruppe frei.',
      'Zum Handeln installierst du **MetaTrader** (MT4 oder MT5, je nachdem, welches Konto du eröffnet hast) auf dem Handy und meldest dich mit den Zugangsdaten deines Handelskontos an. Suche dort das Symbol für Gold, meist **XAUUSD**.',
      '**Tipp:** Übe die ersten Orders mit der kleinsten Positionsgröße (0,01 Lot), bis jeder Handgriff sitzt.',
    ],
    quiz: [
      { q: 'Wo liegt dein Geld?', options: ['Bei der Gruppe', 'Auf deinem eigenen Konto beim Broker', 'Bei Saif'], correct: 1, why: 'Du zahlst auf dein eigenes Handelskonto ein. Nur du kannst darüber verfügen.' },
    ],
  },
  {
    id: 'saif-03', module: 'nachricht', title: 'Richtung, Einstieg, Stop Loss, Ziel', minutes: 5,
    summary: 'Jede Angabe der Trade-Nachricht Schritt für Schritt.',
    objectives: ['Du liest BUY und SELL richtig', 'Du verstehst Einstieg als Preis oder Bereich', 'Du weißt, warum der Stop Loss immer zuerst kommt', 'Du kennst mehrere Ziele (TP1, TP2)'],
    body: [
      '**BUY** heißt: Du kaufst und profitierst, wenn der Preis steigt. **SELL** heißt: Du verkaufst und profitierst, wenn der Preis fällt. Bei Gold ist beides gleich einfach.',
      'Der **Einstieg** ist der Preis oder Bereich, zu dem der Trade geplant ist. Steht der Kurs schon deutlich daneben, steigst du nicht blind hinterher. Ein späterer Einstieg verändert das Verhältnis von Risiko zu Ziel.',
      'Der **Stop Loss** ist die Marke, an der der Trade beendet wird, wenn er nicht aufgeht. Er begrenzt deinen Verlust. Ein Trade ohne Stop Loss ist kein Plan, sondern Hoffnung.',
      'Das **Ziel** (Take Profit, TP) ist die Marke, an der der Gewinn mitgenommen wird. Stehen mehrere Ziele da (TP1, TP2), wird oft ein Teil früher geschlossen und der Rest weiterlaufen gelassen.',
    ],
    tool: 'rr',
    quiz: [
      { q: 'Ein SELL-Trade gewinnt, wenn der Preis …', options: ['steigt', 'fällt', 'gleich bleibt'], correct: 1, why: 'Beim Verkaufen (Short) profitierst du von fallenden Kursen.' },
      { q: 'Wozu dient der Stop Loss?', options: ['Er erhöht den Gewinn', 'Er begrenzt den Verlust, wenn der Trade nicht aufgeht', 'Er ist optional'], correct: 1, why: 'Der Stop Loss schützt dein Konto. Er kommt immer zuerst.' },
    ],
  },
  {
    id: 'saif-04', module: 'nachricht', title: 'Pips, Punkte und Lots bei Gold', minutes: 6,
    summary: 'Was ein Pip bei Gold wert ist und wie groß eine Position ist.',
    objectives: ['1 Punkt Goldpreis = 10 Pips', 'Bei 1,00 Lot ist 1 Pip rund 10 $ wert, bei 0,01 Lot rund 0,10 $', 'Du kannst ausrechnen, was ein Stop Loss in Dollar kostet'],
    body: [
      'Bei Gold (XAUUSD) wird der Preis mit zwei Nachkommastellen notiert, zum Beispiel 4.342,50. Bewegt sich der Preis um **1,00 $**, sind das **10 Pips**. Ein Pip ist also 0,10 $ Preisbewegung.',
      'Die Positionsgröße heißt **Lot**. 1,00 Lot Gold entspricht meist 100 Unzen. Dann ist **ein Pip rund 10 $** wert. Bei 0,10 Lot sind es rund 1 $, bei 0,01 Lot rund 0,10 $ pro Pip.',
      '**Beispiel:** Stop Loss 40 Pips entfernt, Position 0,05 Lot. Das Risiko sind 40 × 0,50 $ = **20 $**. Genau diese Rechnung machst du vor jedem Trade, dann gibt es keine Überraschung.',
      'Die Kontraktgröße kann je nach Konto abweichen. Prüf sie einmal in MetaTrader in der Symbolspezifikation von XAUUSD.',
    ],
    tool: 'lots',
    quiz: [
      { q: 'Gold steigt von 4.340,00 auf 4.343,00. Wie viele Pips sind das?', options: ['3', '30', '300'], correct: 1, why: '3,00 $ Preisbewegung × 10 = 30 Pips.' },
      { q: 'Was kostet ein 40-Pip-Stop bei 0,10 Lot ungefähr?', options: ['4 $', '40 $', '400 $'], correct: 1, why: '0,10 Lot ≈ 1 $ pro Pip, also 40 × 1 $ = 40 $.' },
    ],
  },
  {
    id: 'saif-05', module: 'umsetzen', title: 'Die Order in MetaTrader eingeben', minutes: 7,
    summary: 'Sofort-Order oder Pending Order, Schritt für Schritt.',
    objectives: ['Du unterscheidest Sofort-Order und Pending Order', 'Du trägst Stop Loss und Take Profit direkt beim Eröffnen ein', 'Du kontrollierst jede Order nach dem Absenden'],
    body: [
      '**Sofort-Order (Market):** Der Kurs steht am Einstieg. Du öffnest XAUUSD, tippst auf Handeln, wählst die Lot-Größe, trägst **Stop Loss und Take Profit** ein und tippst auf Buy oder Sell.',
      '**Pending Order:** Der Einstieg liegt noch vom Kurs entfernt. Dann wählst du den passenden Typ: **Buy Limit** (kaufen unter dem Kurs), **Sell Limit** (verkaufen über dem Kurs), **Buy Stop** (kaufen über dem Kurs) oder **Sell Stop** (verkaufen unter dem Kurs). Die Order wartet, bis der Preis erreicht ist.',
      'Trag Stop Loss und Take Profit **sofort** ein, nicht später. Kontrolliere danach im Reiter Handel: Richtung, Lot-Größe, SL und TP. Ein Tippfehler bei der Lot-Größe ist der teuerste Fehler, den es gibt.',
      'Gibt es mehrere Ziele, kannst du die Position auf zwei Orders aufteilen, zum Beispiel die Hälfte mit TP1 und die Hälfte mit TP2.',
    ],
    quiz: [
      { q: 'Der Einstieg für einen BUY liegt unter dem aktuellen Kurs. Welche Order passt?', options: ['Buy Stop', 'Buy Limit', 'Sell Limit'], correct: 1, why: 'Ein Buy Limit kauft günstiger als der aktuelle Kurs, sobald der Preis dorthin zurückkommt.' },
      { q: 'Wann trägst du den Stop Loss ein?', options: ['Direkt beim Eröffnen', 'Wenn der Trade im Minus ist', 'Gar nicht'], correct: 0, why: 'Der Stop gehört vom ersten Moment an in die Order.' },
    ],
  },
  {
    id: 'saif-06', module: 'umsetzen', title: 'Die richtige Positionsgröße', minutes: 6,
    summary: 'Warum 1 bis 2 % Risiko pro Trade dein Konto am Leben halten.',
    objectives: ['Du legst dein Risiko in Prozent des Kontos fest', 'Du rechnest die Lot-Größe aus dem Stop-Abstand aus', 'Du verstehst, warum größere Positionen mehr Risiko bedeuten'],
    body: [
      'Die wichtigste Entscheidung triffst nicht du beim Einstieg, sondern bei der **Positionsgröße**. Profis riskieren pro Trade meist **1 bis 2 %** ihres Kontos. So übersteht das Konto auch eine Serie von Verlusten.',
      'Die Rechnung: **Risiko in $ ÷ (Stop-Abstand in Pips × Pip-Wert pro Lot) = Lots.** Bei 1.000 $ Konto und 1 % Risiko sind das 10 $. Liegt der Stop 40 Pips entfernt, sind das 10 ÷ (40 × 10) = 0,025, also **0,02 Lot** (immer abrunden).',
      'Der Rechner unten nimmt dir das ab. Nutze ihn vor jedem Trade, bis du die Größen im Gefühl hast.',
    ],
    tool: 'lots',
    quiz: [
      { q: 'Konto 2.000 $, Risiko 1 %, Stop 50 Pips. Welche Lot-Größe passt?', options: ['0,04', '0,40', '4,00'], correct: 0, why: '20 $ ÷ (50 × 10 $) = 0,04 Lot.' },
    ],
  },
  {
    id: 'saif-07', module: 'updates', title: 'Breakeven, Teilgewinn, Stop nachziehen', minutes: 5,
    summary: 'Was die Updates in der Gruppe für deine Position bedeuten.',
    objectives: ['Du setzt den Stop auf Breakeven, wenn es angesagt wird', 'Du schließt Teilgewinne mit der passenden Menge', 'Du reagierst auf Updates zeitnah'],
    body: [
      '**Breakeven (BE):** Der Stop Loss wird auf den Einstiegspreis gesetzt. Läuft der Trade danach zurück, schließt er ohne Verlust. Du änderst dafür in MetaTrader den Stop Loss deiner offenen Position.',
      '**Teilgewinn (TP1 erreicht):** Ein Teil der Position wird geschlossen, der Rest läuft weiter. In MetaTrader schließt du dafür nur einen Teil des Volumens.',
      '**Stop nachziehen:** Der Stop wandert mit, um schon erreichte Gewinne abzusichern.',
      'Updates wirken nur, wenn du sie umsetzt. Aktiviere die Benachrichtigungen der Gruppe, damit du nichts verpasst.',
    ],
    quiz: [
      { q: 'Was bedeutet „Stop auf Breakeven“?', options: ['Den Trade sofort schließen', 'Den Stop Loss auf den Einstiegspreis setzen', 'Den Stop Loss entfernen'], correct: 1, why: 'Damit kann der Trade nicht mehr mit Verlust enden (abgesehen von Kosten und Kurslücken).' },
    ],
  },
  {
    id: 'saif-08', module: 'updates', title: 'Wenn ein Trade verliert', minutes: 5,
    summary: 'Verlustserien sind normal. Entscheidend ist, dass sie klein bleiben.',
    objectives: ['Du rechnest mit Verlusttrades', 'Du weißt, wie sich eine Verlustserie auf dein Konto auswirkt', 'Du erhöhst nach Verlusten nicht die Positionsgröße'],
    body: [
      'Auch gut geplante Trades verlieren. Wer das nicht einplant, macht nach zwei Stops den teuersten Fehler: **größer handeln, um es zurückzuholen**.',
      'Mit 1 % Risiko pro Trade kostet dich selbst eine Serie von fünf Verlusten weniger als 5 % deines Kontos. Mit 10 % Risiko wäre schon fast die Hälfte weg. Der Rechner unten zeigt dir den Unterschied.',
      'Bleib bei deiner Positionsgröße, halte dich an den Stop Loss und bewerte Ergebnisse über Wochen und Monate, nicht nach einem einzelnen Tag.',
    ],
    tool: 'streak',
    quiz: [
      { q: 'Nach zwei Verlusten hintereinander solltest du …', options: ['die Position verdoppeln', 'bei deiner Positionsgröße bleiben', 'den Stop Loss weglassen'], correct: 1, why: 'Gleichbleibendes Risiko schützt dein Konto vor dem Absturz.' },
    ],
  },
  {
    id: 'saif-09', module: 'lernen', title: 'Dein Trading-Journal', minutes: 5,
    summary: 'Aus jedem Trade etwas mitnehmen, in drei Minuten.',
    objectives: ['Du notierst jeden Trade kurz', 'Du erkennst deine eigenen Fehler beim Umsetzen', 'Du schaust einmal pro Woche auf deine Zahlen'],
    body: [
      'Notiere pro Trade: **Datum, Instrument, Richtung, Einstieg, Stop, Ziel, deine Lot-Größe, das Ergebnis** und eine Zeile, wie du dich dabei gefühlt hast.',
      'Nach ein paar Wochen siehst du Muster: Steigst du oft zu spät ein? Schließt du Gewinner zu früh? Hältst du dich an die Updates? Das sind die Stellen, an denen du besser wirst.',
      'Einmal pro Woche fünf Minuten: Was lief sauber, was nicht, und was machst du nächste Woche anders?',
    ],
    quiz: [
      { q: 'Wozu dient ein Trading-Journal vor allem?', options: ['Zum Angeben', 'Um eigene Muster und Fehler zu erkennen', 'Es ist nicht nötig'], correct: 1, why: 'Nur was du festhältst, kannst du verbessern.' },
    ],
  },
  {
    id: 'saif-10', module: 'lernen', title: 'Die vier Emotionen, die Konten kosten', minutes: 6,
    summary: 'Angst, Gier, Hoffnung und Frust erkennen und kontrollieren.',
    objectives: ['Du erkennst Angst, Gier, Hoffnung und Frust an deinem Verhalten', 'Du hast für jede Emotion eine feste Regel', 'Du verstehst, warum Regeln wichtiger sind als Gefühl'],
    body: [
      '**Angst:** Gewinner zu früh schließen, gute Trades auslassen. Regel: Wenn der Plan steht, setzt du ihn um.',
      '**Gier:** Nach Gewinnen zu groß handeln oder Verluste sofort zurückholen wollen. Regel: Die Positionsgröße ändert sich nicht nach Gefühl.',
      '**Hoffnung:** Den Stop Loss verschieben oder entfernen. Regel: Der Stop wird nie weiter weg gesetzt.',
      '**Frust:** Nach einer Verlustserie aufgeben oder wild traden. Regel: Ergebnisse zählen über Monate, nicht über einen Tag.',
    ],
    quiz: [
      { q: 'Welche Emotion steckt hinter „Stop Loss weiter weg setzen“?', options: ['Hoffnung', 'Angst', 'Langeweile'], correct: 0, why: 'Man hofft, dass der Markt dreht, und riskiert dabei immer mehr.' },
    ],
  },
];

export const GLOSSARY: { term: string; text: string }[] = [
  { term: 'BUY / Long', text: 'Kaufen. Du profitierst, wenn der Preis steigt.' },
  { term: 'SELL / Short', text: 'Verkaufen. Du profitierst, wenn der Preis fällt.' },
  { term: 'Einstieg (Entry)', text: 'Preis oder Bereich, zu dem der Trade geplant ist.' },
  { term: 'Stop Loss (SL)', text: 'Marke, an der der Trade mit begrenztem Verlust beendet wird.' },
  { term: 'Take Profit (TP)', text: 'Marke, an der der Gewinn mitgenommen wird. TP1, TP2 = mehrere Ziele.' },
  { term: 'Pip', text: 'Kleinste übliche Preiseinheit. Bei Gold 0,10 $ Preisbewegung; 1 Punkt = 10 Pips.' },
  { term: 'Lot', text: 'Positionsgröße. 1,00 Lot Gold ≈ 100 Unzen, 1 Pip ≈ 10 $. 0,01 Lot ≈ 0,10 $ pro Pip.' },
  { term: 'Breakeven (BE)', text: 'Stop Loss auf dem Einstiegspreis: Der Trade kann nicht mehr mit Verlust enden (Kosten und Kurslücken ausgenommen).' },
  { term: 'Teilgewinn', text: 'Ein Teil der Position wird geschlossen, der Rest läuft weiter.' },
  { term: 'Pending Order', text: 'Wartende Order, die erst bei einem bestimmten Preis ausgeführt wird (Buy/Sell Limit, Buy/Sell Stop).' },
  { term: 'Spread', text: 'Unterschied zwischen Kauf- und Verkaufspreis. Er ist Teil deiner Kosten.' },
  { term: 'Hebel', text: 'Erlaubt große Positionen mit wenig Kapital. Er vergrößert Gewinne und Verluste gleichermaßen.' },
  { term: 'Risiko pro Trade', text: 'Wie viel Prozent deines Kontos du verlierst, wenn der Stop Loss erreicht wird. Üblich: 1–2 %.' },
  { term: 'Drawdown', text: 'Rückgang des Kontos vom letzten Höchststand. Ein Maß dafür, wie tief eine Verlustphase geht.' },
];

export const PIP_VALUE_PER_LOT = 10; // USD pro Pip bei 1,00 Lot XAUUSD (Kontraktgröße 100)
export const lessonById = (id: string) => LESSONS.find(l => l.id === id);
export const lessonsOf = (moduleId: string) => LESSONS.filter(l => l.module === moduleId);
