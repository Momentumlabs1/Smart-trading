import { useExperienceMotion } from './useExperienceMotion';
import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode, useId } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, Play, Send } from 'lucide-react';
import gsap from 'gsap';
import desk from '@/assets/saif-desk.webp';
import { SaifVideo } from '../home/SaifVideo';
import AcademyJourney from './AcademyJourney';
import './academy-home.css';
import { ContactDialog, ExperienceFooter, ExperienceHeader, ScrollCue } from './ExperienceShared';

const MarketSculpture=lazy(()=>import('./MarketSculpture'));
function SculptureFallback() {
  const id = useId().replace(/:/g, '');
  const candles = [[78,295,52],[132,254,83],[186,270,65],[240,219,107],[294,237,83],[348,171,133],[402,188,108],[456,121,158]];
  return <svg className="sx-sculpture-fallback" viewBox="0 0 600 470" aria-hidden="true">
    <defs><linearGradient id={`${id}-gold`}><stop stopColor="#8e7542"/><stop offset=".38" stopColor="#d9c08b"/><stop offset="1" stopColor="#a18448"/></linearGradient><linearGradient id={`${id}-graphite`}><stop stopColor="#34383b"/><stop offset=".5" stopColor="#767a7c"/><stop offset="1" stopColor="#41464a"/></linearGradient><radialGradient id={`${id}-floor`}><stop stopColor="#22211c"/><stop offset="1" stopColor="#0b0d0e"/></radialGradient></defs>
    <ellipse cx="301" cy="369" rx="267" ry="67" fill={`url(#${id}-floor)`} stroke="#d5b97630"/>
    {[221,170,115].map(r=><ellipse key={r} cx="301" cy="364" rx={r} ry={r*.25} fill="none" stroke="#d5b97624"/>)}
    {candles.map(([x,y,h],i)=><g key={x}><path d={`M${x+14} ${y-21}v${h+44}`} stroke={i%2?'#c9b075':'#929590'} strokeWidth="2"/><path d={`M${x+28} ${y}l10 -5v${h}l-10 5Z`} fill={i%2?'#7d6535':'#303638'}/><rect x={x} y={y} width="28" height={h} rx="2" fill={`url(#${id}-${i%2?'gold':'graphite'})`}/><path d={`M${x} ${y}l10 -5h28l-10 5Z`} fill={i%2?'#e6d09f':'#a0a4a3'}/></g>)}
  </svg>;
}
class MarketBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return{failed:true};}render(){return this.state.failed?<SculptureFallback/>:this.props.children;}}

export default function AcademyHome(){
  const root=useRef<HTMLDivElement>(null);
  const hero=useRef<HTMLElement>(null);
  const progress=useRef(0);
  const lastFocus=useRef<HTMLElement|null>(null);
  const [active,setActive]=useState(true);
  const [allow3d,setAllow3d]=useState(false);
  const [video,setVideo]=useState<number|null>(null);
  const [contact,setContact]=useState<string|null>(null);
  const play=(i=0)=>{lastFocus.current=document.activeElement as HTMLElement;setVideo(i);};
  const request=(topic='Coaching')=>{lastFocus.current=document.activeElement as HTMLElement;setContact(topic);};
  useExperienceMotion(root);
  useEffect(()=>{
    document.title='SAIF Smart Trading — Dein Weg zum eigenen Trading-System';
    const query=window.matchMedia('(min-width: 960px) and (prefers-reduced-motion: no-preference)');
    const sync=()=>setAllow3d(query.matches);sync();query.addEventListener('change',sync);
    const observer=new IntersectionObserver(([entry])=>setActive(entry.isIntersecting));
    if(hero.current)observer.observe(hero.current);
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      const ctx=gsap.context(()=>{
        gsap.from('.sx-hero-copy > *',{y:18,opacity:0,stagger:.06,duration:.7,ease:'power2.out',clearProps:'all'});
        gsap.to(progress,{current:1,ease:'none',scrollTrigger:{trigger:hero.current,start:'top top',end:'bottom top',scrub:.35}});
        gsap.to('.sx-hero-art',{y:24,ease:'none',scrollTrigger:{trigger:hero.current,start:'top top',end:'bottom top',scrub:.35}});
      },root);
      return()=>ctx.revert();
    });
    return()=>{query.removeEventListener('change',sync);observer.disconnect();media.revert();};
  },[]);
  return <div className="sx-page sx-home" ref={root}><a className="sx-skip" href="#main">Zum Inhalt</a><ExperienceHeader onContact={()=>request()}/><main id="main">
    <section className="sx-hero-track" ref={hero}>
      <div className="sx-hero-grid" aria-hidden="true"/>
      <div className="sx-hero-layout sx-wrap">
        <div className="sx-hero-copy">
          <span className="sx-kicker"><i/>SMART TRADING. MIT SAIF.</span>
          <h1><span>TRADING</span><span>IST EIN <em>SKILL.</em></span></h1>
          <p>Vom ersten Chart zum eigenen System.<br/>Lerne den Markt verstehen. Schritt für Schritt.</p>
          <div className="sx-hero-ctas"><a href="#lernweg" className="sx-button sx-button-gold">Deinen Weg entdecken <ArrowDown size={18}/></a><Link to="/bot" className="sx-link-arrow">Signal Bot <ArrowUpRight size={18}/></Link></div>
          <div className="sx-hero-signature"><span>01 — WISSEN</span><i/><span>02 — PRAXIS</span><i/><span>03 — DEIN SYSTEM</span></div>
        </div>
        <div className="sx-hero-art" aria-hidden="true">
          <div className="sx-art-caption"><span>DER MARKT HAT EINE SPRACHE.</span><span>LERN SIE.</span></div>
          <div className="sx-market-scene">{allow3d?<MarketBoundary><Suspense fallback={<SculptureFallback/>}><MarketSculpture progress={progress} active={active}/></Suspense></MarketBoundary>:<SculptureFallback/>}</div>
          <div className="sx-art-footer"><span>SAIF / SMART TRADING</span><span>ILLUSTRATION · KEINE KURSDATEN</span></div>
        </div>
      </div>
      <div className="sx-hero-scroll sx-wrap"><ScrollCue label="DEIN WEG BEGINNT MIT VERSTÄNDNIS"/><a href="#lernweg">Die vier Schritte <ArrowDown size={14}/></a></div>
    </section>
    <section className="sx-manifesto sx-wrap"><span className="sx-kicker">KEIN SKILL ENTSTEHT ÜBER NACHT.</span><p className="sx-text-reveal">Ein Chart ist der Anfang.<br/>Was du daraus machst,<br/>verändert deinen Weg.</p><span className="sx-manifesto-aside">LERNEN IST<br/>DEIN ERSTER TRADE.<ArrowDown size={21}/></span></section>
    <AcademyJourney/>
    <section className="sx-product-section sx-wrap"><div className="sx-section-heading sx-reveal"><span className="sx-kicker">DEIN EINSTIEG. DEINE RICHTUNG.</span><h2>Ein Markt.<br/><em>Zwei Wege, ihn zu lernen.</em></h2></div><div className="sx-product-split"><Link className="sx-product sx-product-bot sx-reveal" to="/bot"><div className="sx-product-top"><Send size={24}/><span>SIGNAL BOT + BASIC ACADEMY</span><ArrowUpRight size={27}/></div><h3>MIT SIGNALEN<br/><em>TRADEN LERNEN.</em></h3><p>Signale erhalten, kontrolliert übernehmen und verstehen, was im Trade passiert. Der praktische Einstieg direkt an der Anwendung.</p><span className="sx-product-link">Den Signal Bot entdecken <ArrowRight size={19}/></span><div className="sx-product-lines" aria-hidden="true"/></Link><a className="sx-product sx-product-academy sx-reveal" href="#lernweg"><div className="sx-product-top"><span className="sx-grid-icon" aria-hidden="true">▦</span><span>DIE GROSSE ACADEMY</span><ArrowUpRight size={27}/></div><h3>DEIN EIGENES<br/><em>SYSTEM ENTWICKELN.</em></h3><p>Von Grundlagen über Strategie und Praxis zur Weiterentwicklung. Der umfassende Lernweg für eigenständiges Trading.</p><span className="sx-product-link">Die vier Schritte ansehen <ArrowRight size={19}/></span><span className="sx-product-04" aria-hidden="true">04</span></a></div></section>
    <section id="saif" className="sx-saif"><div className="sx-saif-image"><img src={desk} alt="Saif an seinem Trading-Arbeitsplatz" loading="lazy" width="1920" height="1279"/><div className="sx-saif-image-shade"/><span>HINTER JEDEM CHART STEHT EINE ENTSCHEIDUNG.</span></div><div className="sx-saif-content sx-wrap"><div className="sx-saif-copy sx-reveal"><span className="sx-kicker">DER MENSCH HINTER SMART TRADING</span><h2>KEIN AVATAR.<br/><em>SAIF.</em></h2><p>Ein eigener Weg. Mit Höhen, Tiefen und der Entscheidung, dranzubleiben. Lerne Saif kennen – und die Geschichte hinter Smart Trading.</p><button className="sx-play-link" onClick={()=>play(1)}><span><Play size={15} fill="currentColor"/></span>Seine Geschichte ansehen</button></div></div></section>
    <section className="sx-coaching sx-wrap sx-reveal"><div><span className="sx-kicker">PERSÖNLICH WEITERKOMMEN</span><h2>DU HAST EIN ZIEL.<br/><em>LASS UNS DRÜBER REDEN.</em></h2></div><div><p>Du interessierst dich für individuelles Coaching? Erzähle Saif, wo du stehst und was du erreichen möchtest. Ob und wie eine Begleitung passt, klärt ihr persönlich.</p><button className="sx-button sx-button-outline" onClick={()=>request()}>Coaching anfragen <ArrowUpRight size={20}/></button><small>Unverbindliche Anfrage. Kein festes Coaching-Paket.</small></div></section>
    <section className="sx-bottom-band"><div className="sx-wrap"><span>DEIN NÄCHSTER<br/><strong>MOVE.</strong></span><Link to="/bot">Signal Bot & Basic Academy entdecken <ArrowUpRight size={38}/></Link></div></section>
  </main><ExperienceFooter onContact={()=>request()}/>{video!==null&&<SaifVideo key={video} open initialClip={video} onOpenChange={open=>{if(!open)setVideo(null);}} returnFocus={lastFocus.current}/>}<ContactDialog key={contact||'closed'} topic={contact} close={()=>setContact(null)} returnFocus={lastFocus.current}/></div>;
}
