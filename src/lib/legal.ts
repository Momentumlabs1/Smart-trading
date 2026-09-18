// Pflichtangaben für Impressum und Datenschutz (Österreich: § 5 ECG, § 25 MedienG, DSGVO).
// Leere Felder erscheinen auf der Seite als deutlich markierte Lücke – vor dem Launch ausfüllen.
export const LEGAL = {
  /** Name bzw. Firmenwortlaut des Betreibers */
  // Quelle: Impressum smart-trading.at (Stand Juni 2024) und Firmenbuch (FN 650520 y, gegründet 31.03.2025)
  owner: 'Smart Trading AI GmbH',
  /** Rechtsform, z. B. Einzelunternehmen, e.U., GmbH */
  legalForm: '',
  street: 'Franzosenhausweg 41',
  city: '4030 Linz',
  country: 'Österreich',
  email: 'office@smart-trading.at',
  phone: '+43 676 4512064',
  /** Vertretungsbefugt */
  manager: '',
  /** UID-Nummer, falls vorhanden (auf smart-trading.at noch als „NEU“ geführt) */
  uid: '',
  /** Firmenbuchnummer und -gericht, falls eingetragen */
  register: 'FN 650520 y, Landesgericht Linz',
  /** Unternehmensgegenstand */
  business: 'Schulungen im Bereich des Handels, Web-Shop und sonstiger EDV-Einsatz bei Handelsbetrieben, insbesondere mit AI; Beteiligung an Unternehmen mit gleichem oder ähnlichem Geschäftszweig; Handel mit Waren aller Art',
  /** Gewerbebehörde / Mitgliedschaft */
  authority: 'Bezirkshauptmannschaft Linz',
  chamber: 'Mitglied der WKO Oberösterreich',
  /** Blattlinie nach § 25 MedienG */
  mediaLine: 'Information über Saif, seine Trading-Community und seine Lernangebote.',
  /** Stand der Datenschutzerklärung */
  updated: 'September 2026',
};

export const missing = (v: string) => !v || !v.trim();
