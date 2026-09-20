// Saifs eigene Geschichte, in seinen eigenen Worten (Wortlaut unverändert).
// Läuft jetzt auf der SAIF-Hülle statt auf dem alten Lovable-Gerüst mit fremden Social-Links.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ContactDialog, ExperienceFooter, ExperienceHeader } from '@/components/experience/ExperienceShared';

const STORY = [
  'Mein Name kennst du ja bereits.',
  'Ich wohne in Linz, hergekommen bin ich damals als Flüchtling und hatte dadurch einen Kaltstart ins Leben.',
  'Durch unsere damalige Situation hab ich den Wert von Geld kennengelernt, weshalb ich mich schon früh selbständig machte weil ich dachte dass das der Ausweg ist.',
  'Nach Jahren in der Gastro, Shisha Bar... verstand ich aber irgendwann, dass ich niemals frei sein werde wenn ich meine begrenzte Lebenszeit gegen Geld eintausche das durch die großen Player gleichzeitig immer mehr an Wert verliert.',
  'Das Warum war nun klar, nur noch nicht das Wie, bis ich durch meinen damaligen Mentor auf Trading gestoßen bin.',
  'Das Verständnis darüber dass ich mit genug Wissen, Zeit und dem richtigen Plan das Doppelte, Fünf- oder Zehnfache im Monat verdienen kann wie ein Arzt, hat mich nicht losgelassen.',
  'Also startete ich meine 10-jährige Trading-Reise die mich durch viele Höhen und Tiefen geführt hat bis ich durch das richtige System und Beharrlichkeit profitabel geworden bin und nun mein Geld für mich arbeiten lasse.',
  'Und genau diese Werte vermitteln wir hier auf Smart Trading.',
];

export default function About() {
  const lastFocus = useRef<HTMLElement | null>(null);
  const [contact, setContact] = useState<string | null>(null);
  const request = (topic = 'Kontakt') => { lastFocus.current = document.activeElement as HTMLElement; setContact(topic); };
  useEffect(() => { document.title = 'Saif kennenlernen — SAIF Smart Trading'; }, []);

  return <div className="sx-page sx-legal-page">
    <ExperienceHeader onContact={() => request()} />
    <main className="sx-legal sx-story sx-wrap">
      <span className="sx-kicker"><i /> SAIF PERSÖNLICH</span>
      <h1>Okey dann komm mal mit!</h1>
      {STORY.map(t => <p key={t}>{t}</p>)}
      <p className="sx-story-turn">Aber jetzt genug von mir.<br />Du bist wieder an der Reihe!</p>
      <div className="sx-story-cta">
        <p>Als erstes würde mich interessieren: <b>Fängst du gerade erst mit Trading an?</b></p>
        <div>
          <a className="sx-button sx-button-gold" href="/#saif">Sag es mir im Video <ArrowUpRight size={16} /></a>
          <Link className="sx-button sx-button-outline" to="/signale">Saifs Trades ansehen</Link>
        </div>
      </div>
    </main>
    <ExperienceFooter onContact={() => request()} />
    <ContactDialog key={contact || 'closed'} topic={contact} close={() => setContact(null)} returnFocus={lastFocus.current} />
  </div>;
}
