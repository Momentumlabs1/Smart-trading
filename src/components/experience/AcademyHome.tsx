import { useExperienceMotion } from './useExperienceMotion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, Play, Send } from 'lucide-react';
import gsap from 'gsap';
import desk from '@/assets/saif-desk.webp';
import { SaifVideo } from '../home/SaifVideo';
import AcademyJourney from './AcademyJourney';
import './academy-home.css';
import { ContactDialog, ExperienceFooter, ExperienceHeader } from './ExperienceShared';
import SaifIntro from './SaifIntro';
import './spatial-hero.css';
import './trade-handoff.css';

export default function AcademyHome(){
  const root=useRef<HTMLDivElement>(null);
  const lastFocus=useRef<HTMLElement|null>(null);
  const [video,setVideo]=useState<number|null>(null);
  const [contact,setContact]=useState<string|null>(null);
  const play=(i=0)=>{lastFocus.current=document.activeElement as HTMLElement;setVideo(i);};
  const request=(topic='Erstgespräch')=>{lastFocus.current=document.activeElement as HTMLElement;setContact(topic);};
  useExperienceMotion(root);
  useEffect(()=>{
    document.title='Saif kennenlernen — Smart Trading';
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      const ctx=gsap.context(()=>{
        gsap.from('.sh-copy > *',{y:18,opacity:0,stagger:.06,duration:.7,ease:'power2.out',clearProps:'all'});
        gsap.fromTo('.sh-transition > span:first-child',{xPercent:-18},{xPercent:6,ease:'none',scrollTrigger:{trigger:'.sh-transition',start:'top bottom',end:'bottom top',scrub:.5}});
        gsap.fromTo('.sh-transition > span:last-of-type',{xPercent:18},{xPercent:-6,ease:'none',scrollTrigger:{trigger:'.sh-transition',start:'top bottom',end:'bottom top',scrub:.5}});
      },root);
      return()=>ctx.revert();
    });
    return()=>media.revert();
  },[]);
  return <div className="sx-page sx-home" ref={root}><a className="sx-skip" href="#main">Zum Inhalt</a><ExperienceHeader onContact={()=>request()}/><main id="main">
    <section className="sh-hero sh-home-hero">
      <div className="sh-aura" aria-hidden="true"/>
      <div className="sh-layout sx-wrap">
        <div className="sh-copy">
          <span className="sh-eyebrow"><i/> SMART TRADING. MIT SAIF.</span>
          <h1>Saif.<br/><em>Smart Trading.</em></h1>
          <p>Lerne den Menschen hinter Smart Trading kennen: seinen Weg, seine Sicht auf die Märkte und die Ideen hinter seinen Trades.</p>
          <div className="sh-actions"><button className="sx-button sx-button-gold" onClick={()=>play(0)}><Play size={16} fill="currentColor"/>Saif kennenlernen <ArrowUpRight size={18}/></button><button className="sh-contact" onClick={()=>request()}>Erstgespräch <ArrowUpRight size={17}/></button></div>
          <div className="sh-footnote"><span>SEIN WEG.</span><span>SEINE PERSPEKTIVE.</span><span>SMART TRADING.</span></div>
        </div>
        <SaifIntro onPlay={()=>play(0)} paused={video!==null}/>
      </div>
      <div className="sh-bottom sx-wrap"><span>DER MENSCH HINTER DEN TRADES.</span><Link to="/signale">Du suchst Saifs Trades? <ArrowUpRight size={15}/></Link></div>
    </section>
    <section className="sh-transition" aria-label="Sein Weg. Seine Perspektive."><span aria-hidden="true">SEIN WEG.</span><span aria-hidden="true">SEINE SICHT.</span><div>LERN DEN MENSCHEN DAHINTER KENNEN.<ArrowDown size={22}/></div></section>
    <section id="saif" className="sx-saif"><div className="sx-saif-image"><img src={desk} alt="Saif an seinem Trading-Arbeitsplatz" loading="lazy" width="1920" height="1279"/><div className="sx-saif-image-shade"/><span>HINTER JEDEM CHART STEHT EINE ENTSCHEIDUNG.</span></div><div className="sx-saif-content sx-wrap"><div className="sx-saif-copy sx-reveal"><span className="sx-kicker">DER MENSCH HINTER SMART TRADING</span><h2>KEIN AVATAR.<br/><em>SAIF.</em></h2><p>Ein eigener Weg. Mit Höhen, Tiefen und der Entscheidung, dranzubleiben. Lerne Saif kennen – und die Geschichte hinter Smart Trading.</p><button className="sx-play-link" onClick={()=>play(1)}><span><Play size={15} fill="currentColor"/></span>Seine Geschichte ansehen</button></div></div></section>
    <section className="sx-product-section sx-wrap"><div className="sx-section-heading sx-reveal"><span className="sx-kicker">DEIN EINSTIEG. DEINE RICHTUNG.</span><h2>Heute einsteigen.<br/><em>Schritt für Schritt weiterlernen.</em></h2></div><div className="sx-product-split"><Link className="sx-product sx-product-bot sx-reveal" to="/signale"><div className="sx-product-top"><Send size={24}/><span>TELEGRAM-GRUPPE + BASIC ACADEMY</span><ArrowUpRight size={27}/></div><h3>MIT SIGNALEN<br/><em>TRADEN LERNEN.</em></h3><p>Saif teilt die Trades. Du übernimmst sie selbst und lernst, was im Trade passiert. Der praktische Einstieg direkt an der Anwendung.</p><span className="sx-product-link">Saifs Trades entdecken <ArrowRight size={19}/></span><div className="sx-product-lines" aria-hidden="true"/></Link><a className="sx-product sx-product-academy sx-reveal" href="#lernweg"><div className="sx-product-top"><span className="sx-grid-icon" aria-hidden="true">▦</span><span>ACADEMY · IM AUFBAU</span><ArrowUpRight size={27}/></div><h3>DEIN EIGENES<br/><em>SYSTEM ENTWICKELN.</em></h3><p>Hier entsteht unser weiterführender Lernweg – von Grundlagen über Strategie zur eigenen Praxis. Aktuell ist noch kein vollständiger Kurs buchbar.</p><span className="sx-product-link">Die vier Schritte ansehen <ArrowRight size={19}/></span><span className="sx-product-04" aria-hidden="true">04</span></a></div></section>

    <AcademyJourney/>
    <section className="sx-coaching sx-wrap sx-reveal"><div><span className="sx-kicker">PERSÖNLICH WEITERKOMMEN</span><h2>DU HAST EIN ZIEL.<br/><em>LASS UNS DRÜBER REDEN.</em></h2></div><div><p>Du möchtest Saif persönlich sprechen? Erzähle ihm, wo du stehst und welche Fragen du hast. Gemeinsam könnt ihr klären, ob das aktuelle Angebot zu dir passt.</p><button className="sx-button sx-button-outline" onClick={()=>request()}>Erstgespräch anfragen <ArrowUpRight size={20}/></button><small>Unverbindliche Anfrage. Kein Kurskauf.</small></div></section>
    <section className="sx-bottom-band"><div className="sx-wrap"><span>DEIN NÄCHSTER<br/><strong>MOVE.</strong></span><Link to="/signale">Telegram-Gruppe & Basic Academy entdecken <ArrowUpRight size={38}/></Link></div></section>
  </main><ExperienceFooter onContact={()=>request()}/>{video!==null&&<SaifVideo key={video} open initialClip={video} onOpenChange={open=>{if(!open)setVideo(null);}} returnFocus={lastFocus.current}/>}<ContactDialog key={contact||'closed'} topic={contact} close={()=>setContact(null)} returnFocus={lastFocus.current}/></div>;
}
