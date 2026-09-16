import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, Compass, Layers3, Menu, Play, Send, ShieldCheck, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as Tabs from '@radix-ui/react-tabs';
import portrait from '@/assets/saif-portrait.webp';
import desk from '@/assets/saif-desk.webp';
import { SaifVideo } from './SaifVideo';
import './smart-trading.css';

const HeroScene = lazy(() => import('./HeroScene'));
gsap.registerPlugin(ScrollTrigger);

function Brand() {
  return <a className="st-brand" href="/" aria-label="SAIF Smart Trading – Startseite"><span className="st-brand-mark" aria-hidden="true"><i /><i /><i /></span><span>SAIF<small>SMART TRADING</small></span></a>;
}

const candles = [[227,207],[206,218],[217,190],[190,168],[169,184],[182,150],[151,135],[134,155],[154,128],[129,109],[110,135],[134,120],[120,88],[90,110],[110,96],[96,71],[72,94],[95,80],[80,55]];
function SampleChart({ active = 0, compact = false }: { active?: number; compact?: boolean }) {
  const levels = [{ y: 151, label: 'Einstieg', color: '#f0d150' }, { y: 234, label: 'Stop Loss', color: '#bca79e' }, { y: 68, label: 'Take Profit', color: '#cbd6b3' }];
  return <svg className="st-signal-chart" viewBox="0 0 640 300" role="img" aria-label={`Illustrativer Chart: ${levels[active].label} hervorgehoben. Kein Live-Signal.`}>
    <defs><linearGradient id={compact ? 'st-area-small' : 'st-area'} x1="0" x2="0" y1="0" y2="1"><stop stopColor={levels[active].color} stopOpacity=".15" /><stop offset="1" stopColor={levels[active].color} stopOpacity=".015" /></linearGradient></defs>
    {[40,90,140,190,240,290].map(y => <line key={y} x1="10" x2="630" y1={y} y2={y} stroke="#ffffff0a" />)}
    {[30,100,170,240,310,380,450,520,590].map(x => <line key={x} x1={x} x2={x} y1="20" y2="290" stroke="#ffffff07" />)}
    <rect x="10" y={active === 1 ? 151 : 68} width="620" height={active === 1 ? 83 : 83} fill={`url(#${compact ? 'st-area-small' : 'st-area'})`} opacity={active === 0 ? .35 : 1} />
    {candles.map(([o,c], i) => <g key={i} fill={c < o ? '#f0d150' : '#778276'}><rect x={24+i*25} y={Math.min(o,c)-9} width="1.5" height={Math.abs(o-c)+20} /><rect x={19+i*25} y={Math.min(o,c)} width="12" height={Math.abs(o-c)} rx="2" /></g>)}
    {levels.map((l,i) => <g key={l.label} opacity={active === i ? 1 : .35}><line x1="10" x2="511" y1={l.y} y2={l.y} stroke={l.color} strokeDasharray="5 6" /><rect x="511" y={l.y-14} width="118" height="28" rx="6" fill={active===i ? l.color : '#30362f'} /><text x="524" y={l.y+4} fill={active===i ? '#20271f' : '#c6ccbf'} fontSize="12" fontWeight="650">{l.label}</text></g>)}
  </svg>;
}

function StaticBoard() {
  return <div className="st-static-scene" aria-hidden="true"><div className="st-static-back" /><div className="st-static-board"><div className="st-board-heading"><strong>SAIF <small>SMART TRADING</small></strong><span>BEISPIEL</span></div><h3>Ein Signal. Ein Plan.</h3><SampleChart compact /><div className="st-static-bottom"><span>Einstieg</span><span>Absicherung</span><span>Ziel</span></div></div></div>;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <StaticBoard /> : this.props.children; }
}

function HeroArtwork({ onPlay }: { onPlay: (clip?: number) => void }) {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  const [active, setActive] = useState(true);
  const area = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    let cancelled = false;
    const sync = () => {
      if (!media.matches) { setWebgl(false); return; }
      document.fonts.ready.then(() => { if (!cancelled) setWebgl(true); });
    };
    sync(); media.addEventListener('change', sync);
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    if (area.current) observer.observe(area.current);
    return () => { cancelled = true; media.removeEventListener('change', sync); observer.disconnect(); };
  }, []);
  return <div className="st-hero-art" ref={area}>
    <div className="st-art-orbit" aria-hidden="true" />
    <span className="st-art-note"><span /> DEIN NÄCHSTER SCHRITT. MIT PLAN.</span>
    <div className="st-scene-shadow" aria-hidden="true" />
    <div className="st-scene">
      {webgl && !reduced ? <SceneBoundary><Suspense fallback={<StaticBoard />}><HeroScene active={active} /></Suspense></SceneBoundary> : <StaticBoard />}
    </div>
    <div className="st-float-note"><span className="st-note-icon"><ShieldCheck size={21} strokeWidth={1.5} /></span><span>Risiko zuerst.<small>Dann die Entscheidung.</small></span></div>
    <button className="st-hero-portrait" onClick={() => onPlay(0)} aria-label="Saifs Begrüßung ansehen">
      <img src={portrait} alt="Saif" width="1920" height="1279" fetchPriority="high" />
      <span className="st-portrait-top">PERSÖNLICH MIT SAIF</span>
      <span className="st-portrait-bottom"><span>Hi, ich bin Saif.<small>Lern mich kennen</small></span><span className="st-play-circle"><Play size={17} fill="currentColor" /></span></span>
    </button>
    <span className="st-art-caption">Signal-Darstellung zur Veranschaulichung</span>
  </div>;
}

const signalSteps = [
  { label: 'Einstieg', number: '01', title: 'Wissen, wo der Plan beginnt.', text: 'Der Einstieg beschreibt den Bereich, in dem ein Trade interessant wird. Erst prüfen, dann bewusst entscheiden.', note: 'Ein definierter Startpunkt.' },
  { label: 'Stop Loss', number: '02', title: 'Das Risiko kommt zuerst.', text: 'Der Stop Loss legt fest, wo die ursprüngliche Idee nicht mehr gilt. Er hilft, Verluste zu begrenzen – garantiert aber keinen festen Ausführungskurs.', note: 'Vor dem Einstieg an den Ausstieg denken.' },
  { label: 'Take Profit', number: '03', title: 'Ein Ziel. Bevor es losgeht.', text: 'Take Profit bezeichnet das geplante Kursziel. Ob es erreicht wird, ist offen. Du kennst deinen Plan, bevor Emotionen ins Spiel kommen.', note: 'Eine Absicht, kein Gewinnversprechen.' },
];

function SignalExplorer() {
  const [step, setStep] = useState('0');
  const reduced = useReducedMotion();
  const current = signalSteps[+step];
  return <section id="signale" className="st-section st-signal-section">
    <div className="st-section-intro st-reveal"><div><span className="st-eyebrow">01 / KLARHEIT STATT KURSRAUSCHEN</span><h2>Versteh den Plan.<br /><span>Dann den Trade.</span></h2></div><p>Ein Signal ist mehr als ein Pfeil nach oben.<br className="st-desktop-break" /> Entdecke, was dahintersteckt.</p></div>
    <Tabs.Root className="st-explorer st-reveal" value={step} onValueChange={setStep}>
      <div className="st-explorer-chart">
        <div className="st-chart-header"><span className="st-chart-symbol"><Layers3 size={20} /></span><div><strong>Der Aufbau eines Signals</strong><small>Ein fiktives Beispiel</small></div><span className="st-example-badge">BEISPIEL</span></div>
        <SampleChart active={+step} />
        <div className="st-chart-legend"><span><i /> Kursverlauf zur Illustration</span><span>Keine Live-Daten</span></div>
      </div>
      <div className="st-explorer-detail">
        <span className="st-eyebrow">ANTIPPEN & VERSTEHEN</span>
        <Tabs.List className="st-segmented" aria-label="Bestandteile eines Signals">{signalSteps.map((item, index) => <Tabs.Trigger key={item.label} value={String(index)}>{item.label}</Tabs.Trigger>)}</Tabs.List>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={reduced ? false : { opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .18 }}>
            <Tabs.Content value={step} className="st-signal-copy"><span className="st-step-number">{current.number}</span><h3>{current.title}</h3><p>{current.text}</p><div className="st-signal-note"><Check size={16} />{current.note}</div></Tabs.Content>
          </motion.div>
        </AnimatePresence>
      </div>
    </Tabs.Root>
  </section>;
}

const paths = [
  { label: 'Ich starte gerade', heading: 'Dein Fundament. Schritt für Schritt.', description: 'Begriffe einordnen, Zusammenhänge verstehen und mit einem klaren Blick starten.', steps: ['Deinen Wissensstand einschätzen', 'Die Trading-Grundlagen kennenlernen', 'Signale und Risiken verstehen'], tag: 'ERST VERSTEHEN. DANN ANWENDEN.', Icon: BookOpen },
  { label: 'Ich habe Erfahrung', heading: 'Mehr Struktur für deinen nächsten Schritt.', description: 'Du kennst die Basics. Finde heraus, wo du stehst und was deinem Trading noch fehlt.', steps: ['Erfahrung und Ziele einordnen', 'Wissenslücken sichtbar machen', 'Einen passenden Lernweg finden'], tag: 'WISSEN VERTIEFEN. KLARER ENTSCHEIDEN.', Icon: Compass },
  { label: 'Mich interessieren Signale', heading: 'Ein Signal ist der Anfang. Verstehen zählt.', description: 'Lerne, wie Einstieg, Absicherung und Ziel zusammengehören, bevor du Signale für dich bewertest.', steps: ['Den Signal-Aufbau erkunden', 'Das eigene Wissen überprüfen', 'Den weiteren Einstieg finden'], tag: 'MIT KONTEXT. MIT EIGENER ENTSCHEIDUNG.', Icon: Send },
];

function PersonalPath() {
  const [path, setPath] = useState('0');
  const selected = paths[+path];
  const Icon = selected.Icon;
  return <section id="dein-einstieg" className="st-section st-path-section">
    <div className="st-section-intro st-reveal"><div><span className="st-eyebrow">02 / DEIN WEG IST PERSÖNLICH</span><h2>Wo stehst du?<br /><span>Da fangen wir an.</span></h2></div><p>Ein guter Einstieg passt zu dir.<br /> Wähle, was dich gerade beschreibt.</p></div>
    <Tabs.Root value={path} onValueChange={setPath} className="st-path st-reveal">
      <Tabs.List className="st-path-options" aria-label="Deine Trading-Erfahrung">{paths.map((item, i) => <Tabs.Trigger value={String(i)} key={item.label}><span className="st-path-radio" /><span>{item.label}</span><ArrowUpRight size={20} /></Tabs.Trigger>)}</Tabs.List>
      <Tabs.Content value={path} className="st-path-panel">
        <div className="st-path-icon" aria-hidden="true"><Icon size={33} strokeWidth={1.3} /></div>
        <div className="st-path-body"><span className="st-eyebrow">{selected.tag}</span><h3>{selected.heading}</h3><p>{selected.description}</p><ol>{selected.steps.map((text,i) => <li key={text}><span>0{i+1}</span>{text}</li>)}</ol><Link className="st-button st-button-dark" to={`/einstieg?profil=${path}`}>Meinen Einstieg finden <ArrowRight size={18} /></Link><span className="st-path-footnote">Kostenloser Einstiegs-Check · Ohne Anmeldung</span></div>
      </Tabs.Content>
    </Tabs.Root>
  </section>;
}

const faqs = [
  ['Brauche ich bereits Trading-Erfahrung?', 'Nein. Der Einstiegs-Check hilft dir, deine Erfahrung und Interessen einzuordnen. Du kannst zunächst die Grundlagen kennenlernen und dir den Aufbau eines Signals hier auf der Seite in Ruhe ansehen.'],
  ['Was ist der Unterschied zwischen Academy und Signalen?', 'In der Academy geht es um Wissen und Verständnis. Ein Signal beschreibt dagegen eine konkrete Handelsidee mit Einstieg, Absicherung und Ziel. Beides ersetzt nicht deine eigene Entscheidung und ein bewusstes Risikomanagement.'],
  ['Wie finde ich den passenden Einstieg?', 'Wähle oben deine Erfahrung aus und starte anschließend den kostenlosen Einstiegs-Check. Dafür brauchst du keinen Account. Wenn du schon Mitglied bist, erreichst du deinen Lernbereich über den Login.'],
  ['Sind Gewinne garantiert?', 'Nein. Trading ist mit Risiken verbunden, bis hin zum Verlust des eingesetzten Kapitals. Ein Signal und ein Stop Loss beseitigen diese Risiken nicht. Die Charts auf dieser Seite sind illustrative Beispiele und keine Handelsempfehlungen.'],
];

export default function SmartTradingHome() {
  const page = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);
  const [video, setVideo] = useState<number | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const play = (clip = 0) => { lastFocus.current = document.activeElement as HTMLElement; setVideo(clip); };
  useEffect(() => {
    document.title = 'SAIF Smart Trading — Trading mit einem klaren Plan';
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.from('.st-hero-copy > *', { y: 22, opacity: 0, duration: .8, stagger: .085, ease: 'power3.out', clearProps: 'all' });
        gsap.utils.toArray<HTMLElement>('.st-reveal').forEach(element => {
          gsap.from(element, { y: 30, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 94%', once: true }, clearProps: 'all' });
        });
        gsap.to('.st-saif-photo img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.st-saif', start: 'top bottom', end: 'bottom top', scrub: 1 } });
      }, page);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);
  useEffect(() => {
    if (!menu) return;
    const closeOnEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(false); document.getElementById('st-menu-button')?.focus(); } };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menu]);
  return <div className="st-page" ref={page}>
    <a className="st-skip" href="#inhalt">Zum Inhalt springen</a>
    <header className="st-header"><div className="st-header-inner"><Brand /><nav className="st-nav" aria-label="Hauptnavigation"><a href="#signale">Das Prinzip</a><a href="#dein-einstieg">Dein Einstieg</a><a href="#saif">Über Saif</a></nav><div className="st-header-actions"><Link className="st-login" to="/academy/login">Login <ArrowUpRight size={14} /></Link><a className="st-button st-button-small st-button-dark" href="#dein-einstieg">Jetzt entdecken <ArrowRight size={15} /></a><button id="st-menu-button" className="st-menu-button" aria-label={menu ? 'Menü schließen' : 'Menü öffnen'} aria-expanded={menu} aria-controls="st-mobile-nav" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div></div>{menu && <nav id="st-mobile-nav" className="st-mobile-nav" aria-label="Mobile Navigation"><a href="#signale" onClick={() => setMenu(false)}>Das Prinzip</a><a href="#dein-einstieg" onClick={() => setMenu(false)}>Dein Einstieg</a><a href="#saif" onClick={() => setMenu(false)}>Über Saif</a><Link to="/academy/login">Mitglieder-Login</Link></nav>}</header>
    <main id="inhalt">
      <section className="st-hero st-container">
        <div className="st-hero-copy"><span className="st-eyebrow"><span className="st-yellow-line" /> SMART TRADING. MIT SAIF.</span><h1>Trading.<br />Mit einem<br /><span>klaren Plan.</span></h1><p>Signale verstehen. Wissen aufbauen.<br />Deinen eigenen Weg am Markt finden.</p><div className="st-hero-buttons"><a className="st-button st-button-yellow" href="#dein-einstieg">Finde deinen Einstieg <ArrowUpRight size={20} /></a><button className="st-text-button" onClick={() => play()}><span className="st-mini-play"><Play size={12} fill="currentColor" /></span>Saif kennenlernen</button></div><div className="st-hero-bottom"><span>WISSEN GIBT RICHTUNG.</span><a href="#signale" aria-label="Das Prinzip entdecken"><ArrowDown size={16} /></a></div></div>
        <HeroArtwork onPlay={play} />
      </section>
      <div className="st-principles st-container"><div><span>01</span><p>Signale mit <strong>Kontext.</strong></p></div><div><span>02</span><p>Wissen mit <strong>Struktur.</strong></p></div><div><span>03</span><p>Trading mit <strong>Verantwortung.</strong></p></div></div>
      <div className="st-container"><SignalExplorer /><PersonalPath /></div>
      <section id="saif" className="st-saif st-container st-reveal"><div className="st-saif-photo"><img src={desk} alt="Saif an seinem Arbeitsplatz mit Trading-Charts" width="1920" height="1279" loading="lazy" /><span className="st-photo-caption">EIN BLICK HINTER DIE CHARTS.</span><button className="st-photo-play" onClick={() => play(1)} aria-label="Saifs Geschichte ansehen"><Play size={22} fill="currentColor" /></button></div><div className="st-saif-copy"><span className="st-eyebrow">03 / DER MENSCH DAHINTER</span><h2>Charts sind Zahlen.<br /><span>Trading ist persönlich.</span></h2><p>Hinter Smart Trading steht Saif. Lerne ihn kennen und erfahre in seinen eigenen Worten, wie sein Weg ins Trading begonnen hat.</p><button className="st-text-button" onClick={() => play(1)}>Saifs Geschichte ansehen <ArrowUpRight size={19} /></button><div className="st-saif-signature">Saif<span>SMART TRADING</span></div></div></section>
      <section className="st-faq st-container st-section"><div className="st-reveal"><span className="st-eyebrow">GUT ZU WISSEN</span><h2>Klare Fragen.<br /><span>Klare Antworten.</span></h2></div><div className="st-faq-list st-reveal">{faqs.map(([question,answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div></section>
      <section className="st-final st-container st-reveal"><div className="st-final-inner"><span className="st-eyebrow">DEIN NÄCHSTER SCHRITT</span><h2>Mehr Klarheit.<br /><span>Beginnt mit dir.</span></h2><Link className="st-button st-button-yellow" to="/einstieg">Meinen Einstieg finden <ArrowUpRight size={20} /></Link><p>Kostenloser Einstiegs-Check. Ohne Anmeldung.</p><div className="st-final-rings" aria-hidden="true"><i /><i /><i /><i /></div></div></section>
    </main>
    <footer className="st-footer st-container"><div className="st-footer-top"><Brand /><span>Wissen gibt Richtung.</span><a href="#inhalt">Zurück nach oben <ArrowUpRight size={15} /></a></div><p>Trading birgt Risiken bis hin zum Verlust des eingesetzten Kapitals. Die Inhalte dienen der Information und Weiterbildung. Die gezeigten Charts sind Beispiele, keine Live-Signale oder Gewinnversprechen.</p><div className="st-footer-bottom"><span>© {new Date().getFullYear()} SAIF Smart Trading</span><Link to="/academy/login">Mitglieder-Login <ArrowUpRight size={13} /></Link></div></footer>
    {video !== null && <SaifVideo key={video} open initialClip={video} onOpenChange={open => { if (!open) setVideo(null); }} returnFocus={lastFocus.current} />}
  </div>;
}
