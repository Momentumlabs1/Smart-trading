import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ContactDialog, ExperienceFooter, ExperienceHeader } from '@/components/experience/ExperienceShared';
import { LEGAL, missing } from '@/lib/legal';

const Gap = ({ label }: { label: string }) => <mark className="sx-legal-gap">[{label} fehlt]</mark>;
const V = ({ v, label }: { v: string; label: string }) => (missing(v) ? <Gap label={label} /> : <>{v}</>);

function Page({ title, kicker, children }: { title: string; kicker: string; children: ReactNode }) {
  const lastFocus = useRef<HTMLElement | null>(null);
  const [contact, setContact] = useState<string | null>(null);
  const request = () => { lastFocus.current = document.activeElement as HTMLElement; setContact('Kontakt'); };
  useEffect(() => { document.title = `${title} — SAIF Smart Trading`; }, [title]);
  return <div className="sx-page sx-legal-page">
    <ExperienceHeader onContact={request} />
    <main className="sx-legal sx-wrap"><span className="sx-kicker"><i /> {kicker}</span><h1>{title}</h1>{children}</main>
    <ExperienceFooter onContact={request} />
    <ContactDialog key={contact || 'closed'} topic={contact} close={() => setContact(null)} returnFocus={lastFocus.current} />
  </div>;
}

export function Impressum() {
  const L = LEGAL;
  return <Page title="Impressum" kicker="ANGABEN NACH § 5 ECG UND § 25 MEDIENG">
    <section><h2>Betreiber und Medieninhaber</h2>
      <p><V v={L.owner} label="Name / Firma" />{!missing(L.legalForm) && <>, {L.legalForm}</>}<br /><V v={L.street} label="Straße und Hausnummer" /><br /><V v={L.city} label="PLZ und Ort" /><br />{L.country}</p>
      <p>E-Mail: {missing(L.email) ? <Gap label="E-Mail" /> : <a href={`mailto:${L.email}`}>{L.email}</a>}{!missing(L.phone) && <><br />Telefon: {L.phone}</>}</p>
      {!missing(L.uid) && <p>UID-Nummer: {L.uid}</p>}
      {!missing(L.register) && <p>Firmenbuch: {L.register}</p>}
      <p>Unternehmensgegenstand: {L.business}</p>
      {!missing(L.authority) && <p>Gewerbebehörde: {L.authority}</p>}
      {!missing(L.chamber) && <p>Kammerzugehörigkeit: {L.chamber}</p>}
    </section>
    <section><h2>Blattlinie</h2><p>{L.mediaLine}</p></section>
    <section><h2>Kein Anlageberatungsangebot</h2><p>Die Inhalte dieser Website, der Kennenlern-Videos, der Telegram-Gruppe und der Basic Academy dienen der Information und der Bildung. Sie sind keine Anlageberatung, keine Vermögensverwaltung und keine Aufforderung zum Kauf oder Verkauf von Finanzinstrumenten. Mehr dazu im <Link to="/risikohinweis">Risikohinweis</Link>.</p></section>
    <section><h2>Haftung für Links</h2><p>Diese Website verweist auf externe Seiten, etwa Telegram. Für deren Inhalte sind ausschließlich die jeweiligen Anbieter verantwortlich. Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte erkennbar.</p></section>
    <section><h2>Online-Streitbeilegung</h2><p>Verbraucher haben die Möglichkeit, Beschwerden an die Online-Streitbeilegungsplattform der EU zu richten: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>. Beschwerden kannst du auch direkt an die oben genannte E-Mail-Adresse richten.</p></section>
  </Page>;
}

export function Datenschutz() {
  const L = LEGAL;
  return <Page title="Datenschutz" kicker={`DATENSCHUTZERKLÄRUNG · STAND ${L.updated.toUpperCase()}`}>
    <section><h2>1. Verantwortlich</h2><p><V v={L.owner} label="Name / Firma" />, <V v={L.street} label="Straße" />, <V v={L.city} label="PLZ und Ort" />, {L.country}. E-Mail: {missing(L.email) ? <Gap label="E-Mail" /> : <a href={`mailto:${L.email}`}>{L.email}</a>}</p></section>
    <section><h2>2. Kurz gesagt</h2><p>Wir verwenden keine Werbe- oder Analyse-Cookies und kein Tracking. Schriften und Videos liegen auf unserem eigenen Server. Personenbezogene Daten verarbeiten wir nur, wenn du uns selbst eine Anfrage schickst oder dich als Mitglied anmeldest.</p></section>
    <section><h2>3. Hosting und Server-Protokolle</h2><p>Die Website wird bei Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, USA) gehostet. Beim Aufruf verarbeitet der Server technisch notwendige Daten wie IP-Adresse, Zeitpunkt, aufgerufene Seite und Browserkennung, um die Seite auszuliefern und vor Missbrauch zu schützen (Art. 6 Abs. 1 lit. f DSGVO). Vercel ist nach dem EU-US Data Privacy Framework zertifiziert; ergänzend gelten Standardvertragsklauseln.</p></section>
    <section><h2>4. Kennenlern-Video</h2><p>Deine Antworten im interaktiven Video („Wo stehst du?“, „Was ist dein Ziel?“) werden nur in deinem Browser verarbeitet. Sie werden nicht gespeichert und nicht übertragen – außer du schickst uns am Ende freiwillig eine Anfrage; dann werden sie ihr beigefügt.</p></section>
    <section><h2>5. Anfragen über das Formular</h2><p>Wenn du uns über das Formular schreibst, verarbeiten wir deinen Namen, deine Kontaktmöglichkeit (Telegram, Telefon oder E-Mail), deine Nachricht und gegebenenfalls deine Antworten aus dem Kennenlern-Video, um deine Anfrage zu beantworten (Art. 6 Abs. 1 lit. a und b DSGVO). Die Daten werden bei Supabase Inc. auf Servern in der EU gespeichert und unserem Team zur Bearbeitung angezeigt; dafür kann eine Benachrichtigung über Telegram (Telegram Messenger Inc.) verwendet werden. Wir löschen Anfragen spätestens 12 Monate nach dem letzten Kontakt, sofern keine Geschäftsbeziehung entsteht. Deine Einwilligung kannst du jederzeit per E-Mail widerrufen.</p></section>
    <section><h2>6. Telegram-Gruppe</h2><p>Die Links zur Telegram-Gruppe führen zu Telegram. Dort gilt die Datenschutzerklärung von Telegram. Wenn du der Gruppe beitrittst oder unserem Bot schreibst, sehen wir deinen Telegram-Namen und die Nachrichten, die du uns schickst, und verarbeiten sie, um dir den Zugang einzurichten (Art. 6 Abs. 1 lit. b DSGVO).</p></section>
    <section><h2>7. Mitglieder-Login</h2><p>Für den Mitgliederbereich verarbeiten wir deine E-Mail-Adresse und Anmeldedaten, um dir den Zugang bereitzustellen (Art. 6 Abs. 1 lit. b DSGVO). Dafür wird ein technisch notwendiger Speicher im Browser verwendet.</p></section>
    <section><h2>8. Deine Rechte</h2><p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Schreib uns dafür eine E-Mail. Du kannst dich außerdem bei der österreichischen Datenschutzbehörde beschweren: Barichgasse 40–42, 1030 Wien, <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer">dsb.gv.at</a>.</p></section>
  </Page>;
}

export function Risikohinweis() {
  return <Page title="Risikohinweis" kicker="BITTE LIES DAS VOR DEINEM ERSTEN TRADE">
    <section><h2>Trading ist mit Verlustrisiken verbunden</h2><p>Der Handel mit Finanzinstrumenten wie Devisen, Rohstoffen, Indizes oder CFDs ist mit erheblichen Risiken verbunden und kann zum Verlust des eingesetzten Kapitals führen. CFDs sind komplexe Instrumente; wegen der Hebelwirkung verliert ein großer Teil der Privatkunden damit Geld. Überlege dir, ob du verstehst, wie diese Produkte funktionieren, und ob du es dir leisten kannst, dein Geld zu verlieren.</p></section>
    <section><h2>Keine Anlageberatung</h2><p>Saif teilt in der Telegram-Gruppe seine eigenen Trade-Ideen mit Einstieg, Stop Loss und Ziel. Diese Beiträge richten sich an alle Mitglieder gleichermaßen und berücksichtigen weder deine finanzielle Situation noch deine Ziele oder deine Erfahrung. Sie sind keine persönliche Anlageberatung und keine Empfehlung, einen bestimmten Trade einzugehen. Ob und in welcher Größe du einen Trade umsetzt, entscheidest ausschließlich du selbst.</p></section>
    <section><h2>Keine Gewinngarantie</h2><p>Vergangene Ergebnisse sind kein verlässlicher Hinweis auf künftige Ergebnisse. Auch gut geplante Trades können verlieren. Setze nur Geld ein, dessen Verlust du verkraften kannst, und beginne nach Möglichkeit mit einem Demokonto.</p></section>
    <section><h2>Broker</h2><p>Die Umsetzung erfolgt über einen Broker deiner Wahl bzw. über den empfohlenen Partner-Broker. Für das Handelskonto gelten ausschließlich dessen Bedingungen. Wir können für die Vermittlung eine Vergütung erhalten; für dich entstehen dadurch keine zusätzlichen Kosten.</p></section>
  </Page>;
}

export default function Legal() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/datenschutz')) return <Datenschutz />;
  if (pathname.startsWith('/risikohinweis')) return <Risikohinweis />;
  return <Impressum />;
}
