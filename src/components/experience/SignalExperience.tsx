import { useEffect, useId, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, Send } from 'lucide-react';
import portrait from '@/assets/saif-portrait.webp';
import { InfoGroupButton } from './ExperienceShared';
import './signal-experience.css';

const lessons = [
  {label:'Einstieg', short:'Die Idee beginnt hier.', heading:'Ein Bereich. Kein blinder Klick.', text:'Das Signal nennt den geplanten Einstiegsbereich. Du lernst, ihn im Chart zu finden und vor einer Übernahme mit deiner Plattform abzugleichen.', y:218, x:390, color:'#dcc48e'},
  {label:'Absicherung', short:'Das Risiko hat einen Platz.', heading:'Der Plan für den anderen Verlauf.', text:'Der Stop Loss gehört zur Handelsidee. In der Basic Academy lernst du seine Rolle kennen. Er garantiert keinen festen Ausführungskurs.', y:290, x:506, color:'#c8a096'},
  {label:'Ziel', short:'Eine Idee braucht eine Richtung.', heading:'Ein geplantes Ziel. Kein Versprechen.', text:'Take Profit bezeichnet das vorgesehene Kursziel. Du lernst, Ziel und Absicherung gemeinsam zu betrachten. Der Markt kann anders laufen.', y:93, x:664, color:'#bcc7aa'},
];
const closes=[268,254,265,236,247,221,231,197,215,190,202,224,210,191,207,219,201,178,190,161,171,139,152,121,139,109,128,100,112,78,90,66,84,63];

export default function SignalExperience({onContact}:{onContact:()=>void}) {
  const [compact,setCompact]=useState(()=>window.matchMedia('(max-width: 767px)').matches);
  useEffect(()=>{const media=window.matchMedia('(max-width: 767px)');const sync=()=>setCompact(media.matches);media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync);},[]);
  const chartWidth=compact?660:840;
  const chartStart=compact?180:0;
  const [selected,setSelected]=useState(0);
  const [visited,setVisited]=useState([true,false,false]);
  const buttons=useRef<(HTMLButtonElement|null)[]>([]);
  const id=useId().replace(/:/g,'');
  const lesson=lessons[selected];
  const select=(index:number)=>{setSelected(index);setVisited(v=>v.map((value,i)=>value||i===index));};
  return <section className="sb-hero">
    <div className="sb-heading sx-wrap">
      <div className="sb-eyebrow"><span><i/> SAIF SMART TRADING</span><span>SIGNAL BOT <b>×</b> BASIC ACADEMY</span></div>
      <div className="sb-heading-row"><h1>Sieh den Trade.<br/><em>Versteh die Idee.</em></h1><div className="sb-intro"><p>Ein Signal bringt die Handelsidee.<br/>Die Basic Academy macht sie verständlich.<br/>Lerne, was du übernimmst. Mit Saif.</p><div className="sb-hero-actions"><InfoGroupButton onContact={onContact}/><a href="#signal-lab" aria-label="Interaktives Signal-Beispiel entdecken"><ArrowDown size={19}/></a></div></div></div>
    </div>
    <div id="signal-lab" className="sb-lab sx-wrap">
      <div className="sb-lab-label"><span>VOM SIGNAL ZUM AHA-MOMENT.</span><span><span className="sb-desktop-instruction">Wähle einen Bestandteil.</span><span className="sb-mobile-instruction">Tippe auf einen Bestandteil.</span> <ArrowDown size={12}/></span></div>
      <div className="sb-instrument">
        <div className="sb-signal">
          <div className="sb-signal-brand"><span className="sb-monogram">s/</span><div><strong>SAIF Signal Bot</strong><span>Eine Nachricht. Drei Bausteine.</span></div><Send size={15}/></div>
          <div className="sb-signal-title"><span>BEISPIEL-SIGNAL</span><strong>Long<span>↗</span></strong><p>Eine Handelsidee, Schritt für Schritt.</p></div>
          <div className="sb-signal-controls" role="group" aria-label="Bestandteil des Signals erkunden">
            {lessons.map((item,i)=><button key={item.label} ref={el=>{buttons.current[i]=el;}} aria-pressed={selected===i} aria-controls="sb-lesson" onClick={()=>select(i)} onKeyDown={e=>{if(e.key==='ArrowDown'||e.key==='ArrowRight'||e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();const next=(i+(e.key==='ArrowDown'||e.key==='ArrowRight'?1:2))%3;select(next);buttons.current[next]?.focus();}}}><span>0{i+1}</span><div><strong>{item.label}</strong><small>{item.short}</small></div><ArrowUpRight size={16}/></button>)}
          </div>
          <span className="sb-signal-note"><i/>Fiktives Signal · keine Ausführung</span>
        </div>
        <div className="sb-chart-panel">
          <div className="sb-chart-top"><span>HANDELSIDEE / LONG</span><span>ÜBUNGSCHART <i/></span></div>
          <div className="sb-chart">
            <svg viewBox={`${chartStart} 0 ${chartWidth} 350`} role="img" aria-label={`Fiktiver Candlestick-Chart: ${lesson.label} hervorgehoben`}>
              <defs><linearGradient id={`${id}-candle`} x1="0" x2="1"><stop stopColor="#9a8459"/><stop offset=".5" stopColor="#e1c98e"/><stop offset="1" stopColor="#b49a67"/></linearGradient><linearGradient id={`${id}-zone`}><stop stopColor={lesson.color} stopOpacity="0"/><stop offset=".4" stopColor={lesson.color} stopOpacity=".12"/><stop offset="1" stopColor={lesson.color} stopOpacity=".04"/></linearGradient></defs>
              {[50,110,170,230,290].map(y=><line key={y} x1="15" y1={y} x2="825" y2={y} stroke="#e8dec80b"/>)}
              {[62,176,290,404,518,632,746].map(x=><line key={x} x1={x} x2={x} y1="15" y2="329" stroke="#e8dec807"/>)}
              <rect className="sb-chart-zone" x="335" y="0" style={{transform:`translateY(${lesson.y-17}px)`}} width="480" height="34" fill={`url(#${id}-zone)`}/>
              {closes.map((close,i)=>{const open=i===0?281:closes[i-1];const top=Math.min(open,close);const height=Math.max(6,Math.abs(close-open));return <g key={i} opacity={i<13?.55:1}><line x1={35+i*23} x2={35+i*23} y1={top-10-i%3*3} y2={top+height+11} stroke={close<open?'#cbb783':'#747c74'} strokeWidth="1.2"/><rect x={28+i*23} y={top} width="14" height={height} rx="1.5" fill={close<open?`url(#${id}-candle)`:'#4a534b'}/></g>;})}
              <line className="sb-chart-guide" x1="16" x2="820" y1="0" y2="0" style={{transform:`translateY(${lesson.y}px)`}} stroke={lesson.color} strokeWidth="1" strokeDasharray="5 7"/>
              {lessons.map((item,i)=><g key={item.label} className="sb-marker-visual" style={{opacity:selected===i?1:.26}}><circle cx={item.x} cy={item.y} r={selected===i?18:6} fill={item.color} fillOpacity=".12" stroke={item.color} strokeOpacity=".3"/><circle cx={item.x} cy={item.y} r="4" fill={item.color}/></g>)}
            </svg>
            {lessons.map((item,i)=><button key={item.label} className={`sb-chart-point ${selected===i?'is-selected':''}`} style={{left:`${(item.x-chartStart)/chartWidth*100}%`,top:`${item.y/350*100}%`}} onClick={()=>select(i)} aria-pressed={selected===i} aria-label={`${item.label} im Chart erklären`}><span>0{i+1}</span></button>)}
            <div className="sb-chart-active-label" style={{top:`${lesson.y/350*100}%`,color:lesson.color}}>{lesson.label}</div>
          </div>
          <div className="sb-chart-bottom"><span>01 / SIGNAL LESEN</span><span>ILLUSTRATION · KEINE LIVE-KURSE</span></div>
        </div>
      </div>
      <div id="sb-lesson" className="sb-lesson" aria-live="polite"><div className="sb-lesson-label"><BookOpen size={18}/><span>BASIC ACADEMY<small>DAS VERSTÄNDNIS DAHINTER</small></span></div><div className="sb-lesson-copy"><h2>{lesson.heading}</h2><p>{lesson.text}</p></div><div className="sb-lesson-progress"><span>{visited.filter(Boolean).length}/3 entdeckt</span><button onClick={()=>select((selected+1)%3)} aria-label="Nächsten Signal-Bestandteil erklären"><ArrowRight size={18}/></button></div></div>
    </div>
    <div className="sb-hero-foot sx-wrap"><div className="sb-saif-note"><img src={portrait} alt="Saif" width="42" height="42"/><span>Du kennst Saif aus dem Live?<small>Hier beginnt der nächste Schritt.</small></span></div><a href="#ablauf">So wird daraus dein Lernweg <ArrowDown size={16}/></a><span className="sb-explored">{visited.every(Boolean)?<><Check size={13}/> Alle drei Bausteine entdeckt</>:<>SIGNAL. ANWENDUNG. VERSTÄNDNIS.</>}</span></div>
  </section>;
}
