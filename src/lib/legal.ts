// Pflichtangaben für Impressum und Datenschutz (Österreich: § 5 ECG, § 25 MedienG, DSGVO).
// Leere Felder erscheinen auf der Seite als deutlich markierte Lücke – vor dem Launch ausfüllen.
export const LEGAL = {
  /** Name bzw. Firmenwortlaut des Betreibers */
  owner: '',
  /** Rechtsform, z. B. Einzelunternehmen, e.U., GmbH */
  legalForm: '',
  street: '',
  city: '',
  country: 'Österreich',
  email: '',
  phone: '',
  /** UID-Nummer, falls vorhanden */
  uid: '',
  /** Firmenbuchnummer und -gericht, falls eingetragen */
  register: '',
  /** Unternehmensgegenstand */
  business: 'Trading-Bildung und Community rund um das Trading an den Finanzmärkten',
  /** Gewerbebehörde / Mitgliedschaft */
  authority: '',
  chamber: '',
  /** Blattlinie nach § 25 MedienG */
  mediaLine: 'Information über Saif, seine Trading-Community und seine Lernangebote.',
  /** Stand der Datenschutzerklärung */
  updated: 'September 2026',
};

export const missing = (v: string) => !v || !v.trim();
