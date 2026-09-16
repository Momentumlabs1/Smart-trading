import { useExperienceMotion } from './useExperienceMotion';
import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, Play, Send, VolumeX } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portrait from '@/assets/saif-portrait.webp';
import desk from '@/assets/saif-desk.webp';
import { SaifVideo } from '../home/SaifVideo';
import AcademyJourney from './AcademyJourney';
import { ContactDialog, ExperienceFooter, ExperienceHeader, ScrollCue } from './ExperienceShared';

const MarketSculpture=lazy(()=>import('./MarketSculpture'));
function SculptureFallback(){return <div className="sx-sculpture-fallback" aria-hidden="true">{[42,66,51,87,75,115,94,138].map((h,i)=><i key={i} style={{height:h+'px'}}/>)}</div>;}
class MarketBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return{failed:true};}render(){return this.state.failed?<SculptureFallback/>:this.props.children;}}

export default function AcademyHome(){
  const root=useRef<HTMLDivElement>(null);
  const hero=useRef<HTMLElement>(null);
  const clip=useRef<HTMLVideoElement>(null);
  const progress=useRef(0);
  const lastFocus=useRef<HTMLElement|null>(null);
  const reduced=useReducedMotion();
  const [active,setActive]=useState(true);
  const [allow3d,setAllow3d]=useState(false);
  const [video,setVideo]=useState<number|null>(null);
  const [contact,setContact]=useState<string|null>(null);
  const play=(i=0)=>{lastFocus.current=document.activeElement as HTMLElement;setVideo(i);};
  const request=(topic='Coaching')=>{lastFocus.current=document.activeElement as HTMLElement;setContact(topic);};
  useExperienceMotion(root);
  useEffect(()=>{
    document.title='SAIF Smart Trading — Dein Weg zum eigenen Trading-System';
    const query=window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const sync=()=>setAllow3d(query.matches);sync();query.addEventListener('change',sync);
    const observer=new IntersectionObserver(([entry])=>setActive(entry.isIntersecting));
    if(hero.current)observer.observe(hero.current);
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference) and (min-height: 701px)',()=>{
      const ctx=gsap.context(()=>{
        gsap.from('.sx-hero-copy h1>span',{yPercent:110,rotate:3,stagger:.11,duration:1.1,ease:'power4.out',clearProps:'all'});
        const tl=gsap.timeline({scrollTrigger:{trigger:hero.current,start:'top top',end:'bottom bottom',scrub:.8,onUpdate:self=>{progress.current=self.progress;}}});
        tl.to('.sx-hero-copy',{y:-110,autoAlpha:0,scale:.94,duration:.45},0)
          .to('.sx-hero-art',{xPercent:8,scale:1.16,yPercent:-5,duration:1},0)
          .to('.sx-hero-watermark',{xPercent:-14,duration:1},0)
          .fromTo('.sx-hero-statement',{y:65,opacity:0},{y:0,opacity:1,duration:.4},.48)
          .to('.sx-hero-scroll',{opacity:0,duration:.2},0);
      },root);
      return()=>ctx.revert();
    });
    return()=>{query.removeEventListener('change',sync);observer.disconnect();media.revert();};
  },[]);
  useEffect(()=>{
    if(!clip.current)return;
    if(active&&!reduced&&video===null){clip.current.play().catch(()=>{});}else clip.current.pause();
  },[active,reduced,video]);
  return <div className="sx-page sx-home" ref={root}><a className="sx-skip" href="#main">Zum Inhalt</a><ExperienceHeader onContact={()=>request()}/><main id="main">
    <section className="sx-hero-track" ref={hero}><div className="sx-hero-sticky"><div className="sx-hero-grid"/><span className="sx-hero-watermark" aria-hidden="true">SMART</span>
      <div className="sx-hero-copy"><span className="sx-kicker"><i/>SMART TRADING. MIT SAIF.</span><h1><span>TRADING</span><span>IST EIN <em>SKILL.</em></span></h1><p>Vom ersten Chart zum eigenen System.<br/>Lerne den Markt verstehen. Schritt für Schritt.</p><div className="sx-hero-ctas"><a href="#lernweg" className="sx-button sx-button-gold">Deinen Weg entdecken <ArrowDown size={19}/></a><button className="sx-play-link" onClick={()=>play()}><span><Play size={13} fill="currentColor"/></span>Saif kennenlernen</button></div><span className="sx-hero-caption">WISSEN. STRATEGIE. PRAXIS. DU.</span></div>
      <div className="sx-hero-art"><div className="sx-market-scene">{allow3d&&!reduced?<MarketBoundary><Suspense fallback={<SculptureFallback/>}><MarketSculpture progress={progress} active={active}/></Suspense></MarketBoundary>:<SculptureFallback/>}</div><div className="sx-video-orbit"/><button className="sx-hero-film" onClick={()=>play()} aria-label="Saifs Begrüßung ansehen"><video ref={clip} src="/videos/saif-v1-begruessung.mp4" poster={portrait} muted loop playsInline preload="metadata" aria-hidden="true"/><span className="sx-film-top">MIT SAIF<VolumeX size={13}/></span><span className="sx-film-bottom"><strong>Dein nächster<br/>Schritt beginnt hier.</strong><span><Play size={19} fill="currentColor"/></span></span></button><div className="sx-art-coordinate"><span>ST / 01</span><i/><span>DEIN POTENZIAL.<br/>DEIN PROZESS.</span></div></div>
      <div className="sx-hero-statement" aria-hidden="true"><span className="sx-kicker">DAS ZIEL IST DEINS.</span><p>WIR GEBEN<br/>DEM WEG<br/><em>STRUKTUR.</em></p><a href="#lernweg" aria-label="Zum Academy-Lernweg" tabIndex={-1}><ArrowDown size={25}/></a></div><div className="sx-hero-scroll"><ScrollCue/><span>ACADEMY · SIGNALS · COMMUNITY</span></div>
    </div></section>
    <section className="sx-manifesto sx-wrap"><span className="sx-kicker">KEIN SKILL ENTSTEHT ÜBER NACHT.</span><p className="sx-text-reveal">Ein Chart ist der Anfang.<br/>Was du daraus machst,<br/>verändert deinen Weg.</p><span className="sx-manifesto-aside">LERNEN IST<br/>DEIN ERSTER TRADE.<ArrowDown size={21}/></span></section>
    <AcademyJourney/>
    <section className="sx-product-section sx-wrap"><div className="sx-section-heading sx-reveal"><span className="sx-kicker">DEIN EINSTIEG. DEINE RICHTUNG.</span><h2>Ein Markt.<br/><em>Zwei Wege, ihn zu lernen.</em></h2></div><div className="sx-product-split"><Link className="sx-product sx-product-bot sx-reveal" to="/bot"><div className="sx-product-top"><Send size={24}/><span>SIGNAL BOT + BASIC ACADEMY</span><ArrowUpRight size={27}/></div><h3>MIT SIGNALEN<br/><em>TRADEN LERNEN.</em></h3><p>Signale erhalten, kontrolliert übernehmen und verstehen, was im Trade passiert. Der praktische Einstieg direkt an der Anwendung.</p><span className="sx-product-link">Den Signal Bot entdecken <ArrowRight size={19}/></span><div className="sx-product-lines" aria-hidden="true"/></Link><a className="sx-product sx-product-academy sx-reveal" href="#lernweg"><div className="sx-product-top"><span className="sx-grid-icon" aria-hidden="true">▦</span><span>DIE GROSSE ACADEMY</span><ArrowUpRight size={27}/></div><h3>DEIN EIGENES<br/><em>SYSTEM ENTWICKELN.</em></h3><p>Von Grundlagen über Strategie und Praxis zur Weiterentwicklung. Der umfassende Lernweg für eigenständiges Trading.</p><span className="sx-product-link">Die vier Schritte ansehen <ArrowRight size={19}/></span><span className="sx-product-04" aria-hidden="true">04</span></a></div></section>
    <section id="saif" className="sx-saif"><div className="sx-saif-image"><img src={desk} alt="Saif an seinem Trading-Arbeitsplatz" loading="lazy" width="1920" height="1279"/><div className="sx-saif-image-shade"/><span>HINTER JEDEM CHART STEHT EINE ENTSCHEIDUNG.</span></div><div className="sx-saif-content sx-wrap"><div className="sx-saif-copy sx-reveal"><span className="sx-kicker">DER MENSCH HINTER SMART TRADING</span><h2>KEIN AVATAR.<br/><em>SAIF.</em></h2><p>Ein eigener Weg. Mit Höhen, Tiefen und der Entscheidung, dranzubleiben. Lerne Saif kennen – und die Geschichte hinter Smart Trading.</p><button className="sx-play-link" onClick={()=>play(1)}><span><Play size={15} fill="currentColor"/></span>Seine Geschichte ansehen</button></div></div></section>
    <section className="sx-coaching sx-wrap sx-reveal"><div><span className="sx-kicker">PERSÖNLICH WEITERKOMMEN</span><h2>DU HAST EIN ZIEL.<br/><em>LASS UNS DRÜBER REDEN.</em></h2></div><div><p>Du interessierst dich für individuelles Coaching? Erzähle Saif, wo du stehst und was du erreichen möchtest. Ob und wie eine Begleitung passt, klärt ihr persönlich.</p><button className="sx-button sx-button-outline" onClick={()=>request()}>Coaching anfragen <ArrowUpRight size={20}/></button><small>Unverbindliche Anfrage. Kein festes Coaching-Paket.</small></div></section>
    <section className="sx-bottom-band"><div className="sx-wrap"><span>DEIN NÄCHSTER<br/><strong>MOVE.</strong></span><Link to="/bot">Signal Bot & Basic Academy entdecken <ArrowUpRight size={38}/></Link></div></section>
  </main><ExperienceFooter onContact={()=>request()}/>{video!==null&&<SaifVideo key={video} open initialClip={video} onOpenChange={open=>{if(!open)setVideo(null);}} returnFocus={lastFocus.current}/>}<ContactDialog key={contact||'closed'} topic={contact} close={()=>setContact(null)} returnFocus={lastFocus.current}/></div>;
}
