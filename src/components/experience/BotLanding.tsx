import { useExperienceMotion } from './useExperienceMotion';
import { useEffect, useRef, useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Check, ChevronDown, LockKeyhole, Send, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SignalExperience from './SignalExperience';
import { ContactDialog, ExperienceFooter, ExperienceHeader, InfoGroupButton, ScrollCue } from './ExperienceShared';

const flow=[
  {word:'ERHALTEN.',title:'Eine Handelsidee. Klar aufgebaut.',text:'Der Telegram-Bot bringt dir das Signal. Richtung, Einstieg, Stop Loss und Ziel bilden den Rahmen der Handelsidee.',tag:'01 / DAS SIGNAL',note:'Du weißt, was die Idee hinter dem Trade ist.'},
  {word:'ÜBERNEHMEN.',title:'Prüfen kommt vor Kopieren.',text:'Du lernst, die Angaben mit deiner Handelsplattform abzugleichen und die Positionsgröße selbst festzulegen. Ein Signal ist kein Autopilot.',tag:'02 / DEIN CHECK',note:'Die Entscheidung und das Risiko bleiben bei dir.'},
  {word:'VERSTEHEN.',title:'Du siehst mehr als Zahlen.',text:'In der Basic Academy lernst du, was Einstieg, Absicherung und Ziel bedeuten – direkt an den Signalen, mit denen du arbeitest.',tag:'03 / DIE BASIC ACADEMY',note:'Tippe im Beispiel auf einen Bestandteil.'},
  {word:'ANALYSIEREN.',title:'Aus dem Trade wird ein Lernmoment.',text:'Was war die Idee? Wie hat sich der Markt bewegt? Was lief nach Plan? Du lernst, den Verlauf einzuordnen und deine Beobachtungen festzuhalten.',tag:'04 / DEIN VERSTÄNDNIS',note:'Nicht nur das Ergebnis zählt. Auch der Weg dorthin.'},
];

function PhoneChart({selected=0}:{selected?:number}){
  const id=useId();const y=[145,209,76][selected];
  return <svg className="sx-phone-chart" viewBox="0 0 300 240" role="img" aria-label={`Fiktiver Chart – ${['Einstieg','Stop Loss','Ziel'][selected]} hervorgehoben`}><defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop stopColor="#dcbc61" stopOpacity=".2"/><stop offset="1" stopColor="#dcbc61" stopOpacity="0"/></linearGradient></defs>{[45,90,135,180,225].map(n=><line key={n} x1="10" x2="290" y1={n} y2={n} stroke="#ffffff0b"/>)}<path d="M12 188 L34 169 L54 183 L74 140 L96 158 L117 121 L139 145 L162 102 L184 118 L205 83 L228 102 L249 62 L278 76 L288 50 L288 229 L12 229Z" fill={`url(#${id})`}/><path d="M12 188 L34 169 L54 183 L74 140 L96 158 L117 121 L139 145 L162 102 L184 118 L205 83 L228 102 L249 62 L278 76 L288 50" stroke="#e6c371" strokeWidth="2" fill="none"/><line x1="10" x2="289" y1={y} y2={y} stroke={selected===1?'#c79688':'#f1d58d'} strokeDasharray="4 4"/><circle cx="139" cy={y} r="4" fill="#f0cd77"/></svg>;
}

function SignalPhone({step=0,interactive=false}:{step?:number;interactive?:boolean}){
  const [checks,setChecks]=useState<boolean[]>([false,false,false,false]);
  const [selected,setSelected]=useState(0);
  const explanations=['Der Bereich, in dem der Einstieg vorgesehen ist.','Die geplante Absicherung. Sie garantiert keinen festen Ausführungskurs.','Das geplante Kursziel. Es muss nicht erreicht werden.'];
  return <div className="sx-phone"><div className="sx-phone-camera"/><div className="sx-phone-status"><span>SAIF</span><span>SMART TRADING</span></div><div className="sx-phone-header"><span className="sx-phone-avatar">s/</span><div><strong>SAIF Signal Bot</strong><small>Signale & Wissen</small></div><Send size={19}/></div><div className="sx-phone-content">
    <span className="sx-phone-example">ILLUSTRATIVES BEISPIEL</span>
    {step===0&&<div className="sx-message"><span className="sx-message-label">DEIN SIGNAL</span><h3>Eine Idee.<br/>Ein klarer Rahmen.</h3><PhoneChart/><div className="sx-signal-values"><div><span>Richtung</span><strong>Long · Beispiel</strong></div><div><span>Einstieg</span><strong>Definierter Bereich</strong></div><div><span>Stop Loss</span><strong>Vorab festgelegt</strong></div><div><span>Take Profit</span><strong>Geplantes Ziel</strong></div></div></div>}
    {step===1&&<div className="sx-phone-check"><ShieldCheck size={30}/><h3>Dein Check.<br/>Deine Entscheidung.</h3><p>Eine kleine Übung: Was prüfst du, bevor du ein Signal übernimmst?</p><div>{['Handelsrichtung abgleichen','Einstiegsbereich prüfen','Positionsgröße selbst festlegen','Stop Loss und Ziel kontrollieren'].map((text,i)=><button key={text} disabled={!interactive} aria-pressed={checks[i]} onClick={()=>setChecks(checks.map((v,n)=>n===i?!v:v))}><span>{checks[i]&&<Check size={12}/>}</span>{text}</button>)}</div><small>{checks.every(Boolean)?'Alle vier Punkte geprüft. Es wurde kein Trade ausgelöst.':`${checks.filter(Boolean).length} von 4 Punkten geprüft · Nur eine Übung`}</small></div>}
    {step===2&&<div className="sx-phone-learn"><span className="sx-message-label">BASIC ACADEMY / SIGNAL-LESEN</span><h3>Was steckt<br/>hinter dem Signal?</h3><PhoneChart selected={selected}/><div className="sx-phone-tabs" role="group" aria-label="Signal-Bestandteil wählen">{['Einstieg','Stop Loss','Ziel'].map((label,i)=><button key={label} disabled={!interactive} onClick={()=>setSelected(i)} aria-pressed={selected===i}>{label}</button>)}</div><p aria-live="polite">{explanations[selected]}</p></div>}
    {step===3&&<div className="sx-phone-reflect"><BookOpen size={28}/><h3>Der Trade endet.<br/>Das Lernen bleibt.</h3><span>DEIN REFLEXIONS-RASTER</span>{['Was war die ursprüngliche Idee?','Was hat der Markt tatsächlich gemacht?','Habe ich meinen Plan eingehalten?','Was nehme ich für mich mit?'].map((text,i)=><div key={text}><b>0{i+1}</b><p>{text}</p></div>)}</div>}
  </div><div className="sx-phone-home"/></div>;
}

function BotFlow(){
  const root=useRef<HTMLElement>(null);const phone=useRef<HTMLDivElement>(null);const trigger=useRef<ScrollTrigger|null>(null);
  const [step,setStep]=useState(0);const [driven,setDriven]=useState(false);
  useEffect(()=>{
    const media=gsap.matchMedia();media.add('(prefers-reduced-motion: no-preference) and (min-height: 701px)',()=>{
      setDriven(true);const st=ScrollTrigger.create({trigger:root.current,start:'top top',end:'bottom bottom',onUpdate:self=>{
        const p=self.progress*3;setStep(Math.min(3,Math.round(p)));gsap.set(phone.current,{rotationY:-16+self.progress*30,rotationZ:-5+self.progress*10,y:Math.sin(self.progress*Math.PI)*-18});
      }});trigger.current=st;return()=>{st.kill();trigger.current=null;setDriven(false);gsap.set(phone.current,{clearProps:'all'});};
    });return()=>media.revert();
  },[]);
  const select=(i:number)=>{if(driven&&trigger.current)window.scrollTo({top:trigger.current.start+(trigger.current.end-trigger.current.start)*i/3,behavior:'smooth'});else setStep(i);};
  return <section id="ablauf" ref={root} className="sx-bot-flow-track"><div className="sx-bot-flow-sticky sx-wrap"><div className="sx-bot-flow-copy"><span className="sx-kicker">SO GREIFT ALLES INEINANDER</span><div className="sx-flow-words" aria-label="Der Ablauf">{flow.map((item,i)=><button key={item.word} aria-pressed={step===i} onClick={()=>select(i)}>{item.word}<span>0{i+1}</span></button>)}</div><div className="sx-flow-description" aria-live="polite"><span className="sx-chapter">{flow[step].tag}</span><h3>{flow[step].title}</h3><p>{flow[step].text}</p><small>{flow[step].note}</small></div><ScrollCue label={driven?'DER ABLAUF FOLGT DEINEM SCROLLEN':'SCHRITT AUSWÄHLEN'}/></div><div className="sx-flow-phone-stage"><span className="sx-phone-stage-number" aria-hidden="true">0{step+1}</span><div className="sx-flow-phone" ref={phone}><SignalPhone step={step} interactive/></div><span className="sx-phone-stage-note">PRODUKT-VORSCHAU · KEIN LIVE-SIGNAL</span></div></div></section>;
}

const modules=[
  {title:'Den Bot & die Signale bedienen',text:'Wie du ein Signal liest, Änderungen erkennst und die Angaben mit deiner Handelsplattform abgleichst.',topics:['Aufbau einer Signal-Nachricht','Einstieg, Stop Loss und Take Profit','Updates und Änderungen nachvollziehen']},
  {title:'Trades bewusst übernehmen',text:'Wie du vor einer Übernahme alle Angaben prüfst und die Positionsgröße zu deiner eigenen Entscheidung machst.',topics:['Richtung und Kursbereich abgleichen','Positionsgröße und eigenes Risiko einordnen','Fehler beim Übertragen erkennen']},
  {title:'Am laufenden Trade lernen',text:'Wie sich ein Signal im Chart wiederfindet und was der aktuelle Kursverlauf über die ursprüngliche Idee zeigt.',topics:['Die Idee im Chart nachvollziehen','Marktbewegungen beobachten','Plan und tatsächlichen Verlauf vergleichen']},
  {title:'Auswerten statt nur abhaken',text:'Wie du Beobachtungen festhältst, deine Entscheidungen reflektierst und aus jedem Beispiel Verständnis mitnimmst.',topics:['Ein einfaches Trade-Journal führen','Eigene Entscheidungen nachvollziehen','Fragen für den nächsten Lernschritt festhalten']},
];

export default function BotLanding(){
  const root=useRef<HTMLDivElement>(null);const lastFocus=useRef<HTMLElement|null>(null);const [contact,setContact]=useState<string|null>(null);
  const request=(topic='Signal Bot & Basic Academy')=>{lastFocus.current=document.activeElement as HTMLElement;setContact(topic);};
  useExperienceMotion(root);
  useEffect(()=>{document.title='SAIF Signal Bot + Basic Academy — Mit Signalen traden lernen';},[]);
  return <div className="sx-page sx-bot-page" ref={root}><a className="sx-skip" href="#main">Zum Inhalt</a><ExperienceHeader onContact={()=>request('Coaching')}/><main id="main">
    <SignalExperience onContact={()=>request()}/>
    <BotFlow/>
    <section id="basic-academy" className="sx-basic sx-wrap"><div className="sx-basic-heading sx-reveal"><span className="sx-kicker">DIE BASIC ACADEMY ZUM BOT</span><h2>Wissen, das du<br/><em>wirklich anwendest.</em></h2><p>Ein zusammenhängender Lernweg rund um die Signale. Damit du die Anwendung verstehst und am echten Marktgeschehen dazulernen kannst.</p><span className="sx-basic-stamp"><BookOpen size={18}/> SIGNAL-BEZOGENES LERNEN</span></div><div className="sx-curriculum sx-reveal">{modules.map((item,i)=><details key={item.title} open={i===0||undefined}><summary><span>0{i+1}</span><h3>{item.title}</h3><ChevronDown size={18}/></summary><div><p>{item.text}</p><ul>{item.topics.map(t=><li key={t}><Check size={13}/>{t}</li>)}</ul></div></details>)}</div></section>
    <section className="sx-difference sx-wrap sx-reveal"><span className="sx-kicker">KLARER FOKUS. KLARE ABGRENZUNG.</span><h2>Ein Einstieg, der zu dir passt.<br/><em>Ein Lernweg, der weiterführt.</em></h2><div className="sx-difference-grid"><div><span>BOT + BASIC ACADEMY</span><h3>Mit den Signalen lernen.</h3><p>Die Technik bedienen, Trades kontrolliert übernehmen, die Handelsidee verstehen und den Verlauf reflektieren.</p><strong>Anwendung & Verständnis</strong></div><div><span>DIE GROSSE ACADEMY</span><h3>Eigenständig weiterkommen.</h3><p>Marktstruktur vertiefen, eine eigene Strategie entwickeln und das eigene Trading systematisch ausbauen.</p><Link to="/#lernweg">Den Academy-Lernweg ansehen <ArrowUpRight size={17}/></Link></div></div></section>
    <section className="sx-bot-faq sx-wrap"><span className="sx-kicker">NOCH EINE FRAGE?</span><div><details><summary>Handelt der Telegram-Bot automatisch für mich?<ChevronDown size={18}/></summary><p>Hier geht es um den Zugang zu Signalen und darum, ihre Anwendung zu lernen. Eine automatische Ausführung in deinem Handelskonto wird auf dieser Seite nicht angeboten.</p></details><details><summary>Ist die Basic Academy die komplette Trading-Ausbildung?<ChevronDown size={18}/></summary><p>Sie konzentriert sich auf das Arbeiten mit dem Bot und den Signalen. Die große Academy geht darüber hinaus: Sie behandelt den Aufbau eines eigenen, eigenständigen Trading-Systems.</p></details><details><summary>Was kostet der Zugang?<ChevronDown size={18}/></summary><p>Das Zugangsmodell wird gerade finalisiert. Die verbindlichen Konditionen erhältst du vor einer Anmeldung. Über eine Anfrage entsteht keine Zahlungsverpflichtung.</p></details><details><summary>Garantieren Signale Gewinne?<ChevronDown size={18}/></summary><p>Nein. Auch Signale können zu Verlusten führen. Trading birgt Risiken bis hin zum Verlust des eingesetzten Kapitals. Die Basic Academy soll das Verständnis verbessern; sie beseitigt diese Risiken nicht.</p></details></div></section>
    <section className="sx-bot-final sx-reveal"><div className="sx-wrap"><span className="sx-kicker">DER NÄCHSTE SCHRITT</span><h2>Dein nächster Schritt.<br/><em>Mit einem klaren Verständnis.</em></h2><InfoGroupButton onContact={()=>request()}/><span className="sx-bot-final-note"><LockKeyhole size={13}/> Erst informieren. Dann bewusst entscheiden.</span></div></section>
  </main><ExperienceFooter onContact={()=>request('Coaching')}/><ContactDialog key={contact||'closed'} topic={contact} close={()=>setContact(null)} returnFocus={lastFocus.current}/></div>;
}
