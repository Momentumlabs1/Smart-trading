import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { ArrowDownLeft, ArrowUpRight, Check, MousePointer2, Send } from 'lucide-react';
import gsap from 'gsap';
import portrait from '@/assets/saif-portrait.webp';
import './trade-handoff.css';

/** A product illustration: no live signal, order entry or automatic execution. */
export default function TradeHandoff() {
  const root = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState(0);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.from('.th-arrival', { opacity: 0, y: 45, duration: 1.15, ease: 'power3.out', clearProps: 'all' });
        gsap.to('.th-rig', { rotateX: 7, rotateY: 12, y: 45, ease: 'none', scrollTrigger: { trigger: root.current?.closest('section'), start: 'top top', end: 'bottom top', scrub: .7 } });
        gsap.to('.th-rail', { rotateZ: 18, rotateY: 24, ease: 'none', scrollTrigger: { trigger: root.current?.closest('section'), start: 'top top', end: 'bottom top', scrub: .7 } });
      }, root);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);
  const point = (e: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--th-x', `${((e.clientY-r.top)/r.height-.5)*-5}deg`);
    e.currentTarget.style.setProperty('--th-y', `${((e.clientX-r.left)/r.width-.5)*8}deg`);
  };
  return <div className={`th-scene${side === 1 ? ' is-yours' : ''}`} ref={root} onMouseMove={point} onMouseLeave={e => { e.currentTarget.style.setProperty('--th-x','0deg'); e.currentTarget.style.setProperty('--th-y','0deg'); }}>
    <div className="th-art th-arrival" aria-hidden="true">
      <div className="th-rail"/><div className="th-floor"/>
      <div className="th-pointer"><div className="th-rig">
        <div className="th-signal-card">
          <div className="th-signal-header"><img src={portrait} alt=""/><span>SAIF<small>TEILT DEN TRADE</small></span><Send size={23}/></div>
          <div className="th-signal-title"><span>DIE NACHRICHT</span><strong>Eine Idee.<br/>Klare Angaben.</strong></div>
          <div className="th-signal-fields">{['Einstieg','Stop Loss','Ziel'].map((label,i)=><div key={label}><span>0{i+1}</span><strong>{label}</strong><ArrowUpRight size={16}/></div>)}</div>
          <div className="th-card-foot"><span>IN DEINER TELEGRAM-GRUPPE</span><i/></div>
        </div>
        <div className="th-action-card">
          <div className="th-action-header"><span>DEINE ENTSCHEIDUNG</span><MousePointer2 size={30} fill="currentColor"/></div>
          <strong>Dein Konto.<br/>Dein Trade.</strong>
          <div className="th-action-checks"><span><Check size={13}/> Angaben prüfen</span><span><Check size={13}/> Risiko festlegen</span><span><Check size={13}/> Selbst übernehmen</span></div>
          <div className="th-action-foot"><span>AUF DEINER HANDELSPLATTFORM</span><ArrowDownLeft size={21}/></div>
        </div>
      </div></div>
      <span className="th-edge-label">EINE NACHRICHT. DEINE ENTSCHEIDUNG.</span>
    </div>
    <div className="th-controls" role="group" aria-label="Perspektive auf den Trade wechseln"><button aria-pressed={side===0} onClick={()=>setSide(0)}><Send size={14}/>Saif teilt.</button><span aria-hidden="true">→</span><button aria-pressed={side===1} onClick={()=>setSide(1)}><MousePointer2 size={14}/>Du übernimmst.</button></div>
    <p className="th-caption" aria-live="polite">{side===0 ? 'Die Trade-Idee kommt als Nachricht zu dir.' : 'Du prüfst die Angaben und setzt den Trade selbst um.'}</p>
  </div>;
}
