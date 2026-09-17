import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

const stages = [
  {title:'Grundlagen',headline:'Verstehe, was du siehst.',copy:'Vom ersten Candlestick zur Marktstruktur. Du lernst die Sprache des Marktes und legst das Fundament für deine Entscheidungen.',skills:['Candlesticks','Marktstruktur','Risiko verstehen'],outcome:'Der Markt bekommt eine Struktur.',label:'DEN MARKT LESEN'},
  {title:'Strategie',headline:'Gib deinem Trading Regeln.',copy:'Ein Einstieg braucht einen Grund. Du lernst, Setups zu beurteilen, Ein- und Ausstiege zu planen und deine Handelsidee zu überprüfen.',skills:['Entry & Exit','Trading-Plan','Backtesting'],outcome:'Aus einer Idee wird ein System.',label:'DEIN SYSTEM BAUEN'},
  {title:'Praxis',headline:'Bring dein Wissen in den Chart.',copy:'Du arbeitest mit Beispielen, übst im Demokonto und dokumentierst deine Entscheidungen. So wird aus Theorie nachvollziehbare Erfahrung.',skills:['Demokonto','Trade-Journal','Psychologie'],outcome:'Anwenden. Beobachten. Dazulernen.',label:'BEWUSST ANWENDEN'},
  {title:'Meisterschaft',headline:'Entwickle dich weiter.',copy:'Du hinterfragst dein Vorgehen, erkennst Muster in deinen Entscheidungen und verfeinerst dein System. Lernen endet nicht mit dem ersten guten Trade.',skills:['Auswerten','Optimieren','Disziplin'],outcome:'Dein Prozess wird zum Maßstab.',label:'DEINEN PROZESS VERFEINERN'},
];

export function JourneyDiagram({index=0}:{index?:number}) {
  const bars=[55,81,61,118,105,148,135,192,175,223,198,250];
  return <svg viewBox="0 0 600 360" className="sx-journey-diagram" aria-hidden="true">
    <defs><linearGradient id={`sx-gold-${index}`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#ffe3a1"/><stop offset=".45" stopColor="#d4a22a"/><stop offset="1" stopColor="#776021"/></linearGradient><linearGradient id={`sx-fade-${index}`} x1="0" x2="0" y1="0" y2="1"><stop stopColor="#eaca6b" stopOpacity=".18"/><stop offset="1" stopColor="#eaca6b" stopOpacity="0"/></linearGradient></defs>
    {[60,120,180,240,300].map(y=><line key={y} x1="35" x2="565" y1={y} y2={y} stroke="#ffffff0c"/>)}
    {[70,150,230,310,390,470,550].map(x=><line key={x} x1={x} x2={x} y1="30" y2="325" stroke="#ffffff08"/>)}
    {index===0&&<>{bars.map((h,i)=><g key={i} fill={i%3===0?'#6c7378':`url(#sx-gold-${index})`}><rect x={57+i*40} y={290-h-20} width="2" height={65+i%3*8}/><rect x={48+i*40} y={290-h} width="20" height={30+i%3*8} rx="2"/></g>)}<path d="M 40 298 L 210 212 L 365 177 L 560 87" stroke="#f7d16b" strokeWidth="2" fill="none" strokeDasharray="6 7"/><text x="42" y="345">CHARTS VERSTEHEN</text></>}
    {index===1&&<><rect x="320" y="61" width="215" height="143" fill="#d6b04c15" stroke="#d6b04c44"/><rect x="320" y="204" width="215" height="80" fill="#fff1" stroke="#fff2"/><path d="M35 254 L88 220 L118 244 L156 188 L188 214 L226 172 L263 186 L301 204 L354 159 L397 173 L454 109 L492 127 L548 65" fill="none" stroke={`url(#sx-gold-${index})`} strokeWidth="4"/><line x1="35" x2="555" y1="204" y2="204" stroke="#d6b04c" strokeDasharray="5 5"/><circle cx="301" cy="204" r="9" fill="#e5ba46"/><text x="341" y="85">ZIEL</text><text x="341" y="229">RISIKO</text><text x="42" y="345">REGELN VOR EMOTIONEN</text></>}
    {index===2&&<><path d="M40 257 L89 213 L136 229 L188 144 L227 187 L273 156 L318 173 L365 109 L407 133 L455 71 L508 112 L559 57 L559 310 L40 310Z" fill={`url(#sx-fade-${index})`}/><path d="M40 257 L89 213 L136 229 L188 144 L227 187 L273 156 L318 173 L365 109 L407 133 L455 71 L508 112 L559 57" fill="none" stroke="#efc65d" strokeWidth="3"/><circle cx="365" cy="109" r="55" fill="#101214dd" stroke="#cfaa50"/><path d="M344 110 l14 14 27-31" fill="none" stroke="#edcb71" strokeWidth="4"/><text x="42" y="345">ÜBEN · DOKUMENTIEREN · REFLEKTIEREN</text></>}
    {index===3&&<><circle cx="300" cy="174" r="124" fill="none" stroke="#c4a75b35"/><circle cx="300" cy="174" r="92" fill="none" stroke="#c4a75b66"/><circle cx="300" cy="174" r="59" fill={`url(#sx-fade-${index})`} stroke="#edd088"/><path d="M267 185 l23-37 22 27 29-44" fill="none" stroke="#e8c36d" strokeWidth="4"/>{[[300,50],[424,174],[300,298],[176,174]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="23" fill="#181b1e" stroke="#b79b50"/><text x={x-7} y={y+5}>{i+1}</text></g>)}<text x="42" y="345">EIN SYSTEM, DAS MIT DIR WÄCHST</text></>}
  </svg>;
}

export default function AcademyJourney() {
  const root=useRef<HTMLElement>(null);
  const decks=useRef<(HTMLDivElement|null)[]>([]);
  const progress=useRef<ScrollTrigger|null>(null);
  const current=useRef(0);
  const [active,setActive]=useState(0);
  const [scrollDriven,setScrollDriven]=useState(false);
  useEffect(()=>{
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference) and (min-width: 900px) and (min-height: 680px), (prefers-reduced-motion: no-preference) and (max-width: 899px) and (min-height: 780px)',()=>{
      const section=root.current;
      if(!section)return;
      // One clipped, flat plane: opaque cards never intersect in 3D space.
      section.classList.add('is-scroll-driven');
      setScrollDriven(true);
      const playhead={value:0};
      const paint=()=>{
        const base=Math.min(2,Math.floor(playhead.value));
        const fraction=Math.max(0,Math.min(1,(playhead.value-base-.18)/.64));
        const position=base+fraction*fraction*(3-2*fraction);
        decks.current.forEach((el,i)=>gsap.set(el,{yPercent:(i-position)*108}));
        const next=Math.min(3,Math.round(position));
        if(next!==current.current){current.current=next;setActive(next);}
      };
      const timeline=gsap.timeline({scrollTrigger:{trigger:section,start:'top top',end:'bottom bottom',scrub:.3,invalidateOnRefresh:true}});
      timeline.to(playhead,{value:3,duration:3,ease:'none',onUpdate:paint});
      progress.current=timeline.scrollTrigger!;
      paint();
      // Fonts may finish after the first layout, especially on a direct anchor visit.
      let alive=true;
      document.fonts.ready.then(()=>{if(alive)timeline.scrollTrigger?.refresh();});
      return()=>{
        alive=false;timeline.scrollTrigger?.kill();timeline.kill();progress.current=null;
        section.classList.remove('is-scroll-driven');setScrollDriven(false);
        decks.current.forEach(el=>gsap.set(el,{clearProps:'transform'}));
      };
    });
    return()=>media.revert();
  },[]);
  const choose=(i:number)=>{
    if(scrollDriven&&progress.current){window.scrollTo({top:progress.current.start+(progress.current.end-progress.current.start)*(i/3),behavior:'smooth'});}
    else{current.current=i;setActive(i);}
  };
  const stage=stages[active];
  return <section id="lernweg" className="sx-journey-track" ref={root}>
    <div className="sx-journey-sticky">
      <div className="sx-journey-top sx-wrap"><div><span className="sx-kicker">ACADEMY · IM AUFBAU</span><h2>Von null auf <em>profitabel.</em></h2></div><p>Ein Ausblick auf den Lernweg, den wir aufbauen.<br/> Noch kein vollständig buchbarer Kurs.</p></div>
      <div className="sx-journey-body sx-wrap">
        <div className="sx-journey-copy" aria-live="polite"><span className="sx-chapter">KAPITEL 0{active+1} / 04</span><h3>{stage.title}<span>.</span></h3><h4>{stage.headline}</h4><p>{stage.copy}</p><div className="sx-skills">{stage.skills.map(skill=><span key={skill}>{skill}</span>)}</div><span className="sx-outcome"><ArrowUpRight size={18}/>{stage.outcome}</span></div>
        <div className="sx-deck-scene" aria-label={`Illustration: ${stage.title}`}>
          <div className="sx-deck-backing" aria-hidden="true"/>
          <div className="sx-deck-viewport">
            {stages.map((item,i)=><div key={item.title} ref={el=>{decks.current[i]=el;}} className={`sx-journey-card ${active===i?'is-active':''}`} aria-hidden={active!==i}>
              <div className="sx-card-meta"><span>SAIF / ACADEMY</span><span>MODUL 0{i+1}</span></div>
              <div className="sx-card-heading"><span>{item.label}</span><strong>0{i+1}</strong></div>
              <JourneyDiagram index={i}/>
              <div className="sx-card-bottom"><span>{item.title.toUpperCase()}</span><span>WISSEN → ANWENDUNG</span></div>
            </div>)}
          </div>
        </div>
      </div>
      <div className="sx-journey-bottom sx-wrap"><div className="sx-stage-nav" aria-label="Schritte des Academy-Lernwegs">{stages.map((item,i)=><button key={item.title} onClick={()=>choose(i)} aria-pressed={active===i}><span>0{i+1}</span>{item.title}<i/></button>)}</div><span className="sx-journey-hint">{scrollDriven?'WEITERSCROLLEN':'KAPITEL AUSWÄHLEN'}<ArrowDown size={12}/></span></div>
    </div>
  </section>;
}
