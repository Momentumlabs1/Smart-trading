import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, BookOpen, MousePointer2, Send } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './trade-journey.css';
gsap.registerPlugin(ScrollTrigger);
const TradeObjects=lazy(()=>import('./TradeObjects'));
const steps=[
  {word:'Erhalten.',label:'Saif teilt den Trade.',text:'Du erhältst die Trades über die Telegram-Gruppe. Einstieg, Stop Loss und Ziel findest du direkt in der Nachricht.',note:'DIREKT IN DEINER TELEGRAM-GRUPPE',icon:Send},
  {word:'Umsetzen.',label:'Du übernimmst ihn selbst.',text:'Du prüfst die Angaben und setzt den Trade auf deiner eigenen Handelsplattform um. Du bestimmst Positionsgröße und Risiko.',note:'DEINE PLATTFORM. DEINE ENTSCHEIDUNG.',icon:MousePointer2},
  {word:'Verstehen.',label:'Du lernst dabei dazu.',text:'Die Basic Academy zeigt dir, wie du Trades überträgst, die Angaben verstehst und aus dem Verlauf dazulernst.',note:'MIT DER PASSENDEN BASIC ACADEMY',icon:BookOpen},
];
function ObjectFallback({index}:{index:number}) { const Icon=steps[index].icon;return <div className="tj-object-fallback" aria-hidden="true"><Icon strokeWidth={1.15}/></div>; }
class SceneBoundary extends Component<{children:ReactNode;index:number},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return{failed:true};}render(){return this.state.failed?<ObjectFallback index={this.props.index}/>:this.props.children;}}
export default function TradeJourney(){
  const root=useRef<HTMLElement>(null);
  const trigger=useRef<ScrollTrigger|null>(null);
  const progress=useRef(0);
  const current=useRef(0);
  const [index,setIndex]=useState(0);
  const [scrollDriven,setScrollDriven]=useState(false);
  const [active,setActive]=useState(false);
  const [seen,setSeen]=useState(false);
  const [motion,setMotion]=useState(false);
  useEffect(()=>{
    const query=window.matchMedia('(prefers-reduced-motion: no-preference)');
    const sync=()=>setMotion(query.matches);sync();query.addEventListener('change',sync);
    const observer=new IntersectionObserver(([entry])=>{setActive(entry.isIntersecting);if(entry.isIntersecting)setSeen(true);},{rootMargin:'200px'});
    if(root.current)observer.observe(root.current);
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference) and (min-height: 740px)',()=>{
      const section=root.current;if(!section)return;
      section.classList.add('is-driven');setScrollDriven(true);
      const playhead={value:0};
      const tween=gsap.to(playhead,{value:2,duration:2,ease:'none',scrollTrigger:{trigger:section,start:'top top',end:'bottom bottom',scrub:.45,invalidateOnRefresh:true},onUpdate:()=>{
        const base=Math.min(1,Math.floor(playhead.value));
        const fraction=gsap.utils.clamp(0,1,(playhead.value-base-.26)/.48);
        progress.current=base+fraction*fraction*(3-2*fraction);
        const next=Math.round(progress.current);if(next!==current.current){current.current=next;setIndex(next);}
      }});
      trigger.current=tween.scrollTrigger!;
      return()=>{tween.scrollTrigger?.kill();tween.kill();trigger.current=null;section.classList.remove('is-driven');setScrollDriven(false);};
    });
    return()=>{observer.disconnect();query.removeEventListener('change',sync);media.revert();gsap.killTweensOf(progress);};
  },[]);
  const choose=(i:number)=>{
    if(trigger.current){window.scrollTo({top:trigger.current.start+(trigger.current.end-trigger.current.start)*i/2,behavior:'smooth'});}
    else{current.current=i;setIndex(i);gsap.to(progress,{current:i,duration:motion ? .8 : 0,ease:'power2.inOut',overwrite:true});}
  };
  return <section className="tj-track" id="ablauf" ref={root}>
    <div className="tj-sticky">
      <div className="tj-top sx-wrap"><span className="tr-eyebrow">DREI SCHRITTE. DU BEHÄLTST DIE KONTROLLE.</span><span className="tj-counter">0{index+1}<span> / 03</span></span></div>
      <div className="tj-body sx-wrap">
        <div className="tj-copy" aria-live="polite"><div className="tj-word-window"><div className="tj-word-rail" style={{transform:`translateY(-${index*100/3}%)`}} aria-hidden="true">{steps.map(step=><span key={step.word}>{step.word}</span>)}</div><h2 className="sr-only">{steps[index].word}</h2></div><div className="tj-explanation" key={index}><h3>{steps[index].label}</h3><p>{steps[index].text}</p><span className="tj-note">{steps[index].note}</span></div></div>
        <div className="tj-visual"><div className="tj-orbit"/><span className="tj-ghost-number" aria-hidden="true">0{index+1}</span><div className="tj-canvas">{seen&&motion?<SceneBoundary index={index}><Suspense fallback={<ObjectFallback index={index}/>}><TradeObjects progress={progress} active={active}/></Suspense></SceneBoundary>:<ObjectFallback index={index}/>}</div><span className="tj-visual-label" aria-hidden="true">SAIF / {['TELEGRAM','DEINE UMSETZUNG','BASIC ACADEMY'][index]}</span></div>
      </div>
      <div className="tj-bottom sx-wrap"><nav aria-label="Schritte beim Übernehmen der Trades">{steps.map((step,i)=><button key={step.word} aria-pressed={i===index} onClick={()=>choose(i)}><span>0{i+1}</span>{step.word}<i/></button>)}</nav><span>{scrollDriven?'WEITERSCROLLEN':'SCHRITT AUSWÄHLEN'}<ArrowDown size={14}/></span></div>
    </div>
  </section>;
}
