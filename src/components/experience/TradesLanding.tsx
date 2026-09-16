import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, BookOpen, Check, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import SaifIntro from './SaifIntro';
import TradeJourney from './TradeJourney';
import { SaifVideo } from '../home/SaifVideo';
import './spatial-hero.css';
import { ContactDialog, ExperienceFooter, ExperienceHeader, InfoGroupButton } from './ExperienceShared';
import { useExperienceMotion } from './useExperienceMotion';
import './trades-landing.css';

const modules = [
  {title:'Die Trade-Nachricht verstehen',text:'Richtung, Einstieg, Stop Loss und Ziel: Du lernst, was die einzelnen Angaben bedeuten und wie sie zusammengehören.'},
  {title:'Trades selbst übernehmen',text:'Du lernst, die Angaben mit deiner Handelsplattform abzugleichen und deine Positionsgröße bewusst festzulegen.'},
  {title:'Updates richtig einordnen',text:'Du lernst, Änderungen an einem geteilten Trade zu erkennen und ihre Bedeutung für deine eigene Position zu prüfen.'},
  {title:'Am Trade dazulernen',text:'Du hältst fest, was die ursprüngliche Idee war, wie sich der Markt bewegt hat und was du aus dem Verlauf mitnimmst.'},
];

export default function TradesLanding() {
  const root=useRef<HTMLDivElement>(null);
  const lastFocus=useRef<HTMLElement|null>(null);
  const [video,setVideo]=useState(false);
  const play=()=>{lastFocus.current=document.activeElement as HTMLElement;setVideo(true);};
  const [contact,setContact]=useState<string|null>(null);
  const request=(topic='Telegram-Gruppe & Basic Academy')=>{lastFocus.current=document.activeElement as HTMLElement;setContact(topic);};
  useExperienceMotion(root);
  useEffect(()=>{
    document.title='Saifs Trades — Telegram-Gruppe & Basic Academy';
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      const ctx=gsap.context(()=>{
        gsap.from('.sh-copy > *',{y:20,opacity:0,stagger:.06,duration:.65,ease:'power2.out',clearProps:'all'});
        gsap.fromTo('.tr-academy',{clipPath:'inset(8% 7% round 80px)',y:70},{clipPath:'inset(0% 0% round 24px)',y:0,ease:'none',scrollTrigger:{trigger:'.tr-academy',start:'top 100%',end:'top 35%',scrub:.5}});
      },root);
      return()=>ctx.revert();
    });
    return()=>media.revert();
  },[]);
  return <div className="sx-page tr-page" ref={root}>
    <a className="sx-skip" href="#main">Zum Inhalt</a>
    <ExperienceHeader onContact={()=>request('Coaching')} onGroup={()=>request()}/>
    <main id="main">
      <section className="sh-hero sh-trades-hero">
        <div className="sh-aura" aria-hidden="true"/>
        <div className="sh-layout sx-wrap">
          <div className="sh-copy">
            <span className="sh-eyebrow"><i/> TELEGRAM-GRUPPE + BASIC ACADEMY</span>
            <h1>Saifs Trades.<br/><em>Direkt zu dir.</em></h1>
            <p>Saif teilt seine Trades. Du übernimmst sie selbst.<br className="sh-desktop-break"/> Die Basic Academy zeigt dir, wie.</p>
            <div className="sh-actions"><InfoGroupButton onContact={()=>request()}/><a href="#ablauf">So läuft’s <ArrowDown size={17}/></a></div>
            <div className="sh-personal"><span className="sh-personal-line"/><span>Seine Ideen. Deine Umsetzung.<br/><strong>Die Entscheidung bleibt bei dir.</strong></span></div>
          </div>
          <SaifIntro onPlay={play} paused={video} trades/>
        </div>
        <div className="sh-bottom sx-wrap"><span>ERHALTEN. SELBST UMSETZEN. DAZULERNEN.</span><a href="#ablauf">Entdecke den Ablauf <ArrowDown size={15}/></a></div>
      </section>
      <TradeJourney/>
      <section id="basic-academy" className="tr-academy sx-wrap">
        <div className="tr-academy-intro sx-reveal"><span className="tr-eyebrow"><BookOpen size={17}/>DEINE BASIC ACADEMY</span><h2>Mitmachen.<br/>Und dazulernen.</h2><p>Die Grundlagen für genau das, was du hier machst: Trades übernehmen und verstehen, was dahintersteckt.</p><div className="tr-course-note"><Check size={18}/><span>Auf die Telegram-Trades abgestimmt.</span></div><img className="tr-academy-art" src="/images/saif-academy-stilllife.png" alt="" width="1536" height="1024" loading="lazy" decoding="async"/></div>
        <div className="tr-modules sx-reveal">{modules.map((item,i)=><details key={item.title} open={i===0||undefined}><summary><span>0{i+1}</span><h3>{item.title}</h3><ChevronDown size={18}/></summary><p>{item.text}</p></details>)}</div>
      </section>
      <section className="tr-academy-distinction sx-wrap sx-reveal"><div><span className="tr-eyebrow">DU MÖCHTEST TIEFER EINSTEIGEN?</span><h2>Die große Academy<br/>geht einen Schritt weiter.</h2></div><div><p>Die Basic Academy begleitet dich beim Übernehmen der Trades. Der umfassende Academy-Lernweg beschäftigt sich mit deiner eigenen Strategie und eigenständigem Trading.</p><Link to="/#lernweg">Die vier Academy-Schritte <ArrowUpRight size={18}/></Link></div></section>
      <section className="tr-faq sx-wrap"><div className="tr-section-top"><span className="tr-eyebrow">GUT ZU WISSEN</span><h2>Deine Fragen.</h2></div><div className="tr-faq-list">
        <details><summary>Wie übernehme ich die Trades?<ChevronDown size={18}/></summary><p>Saif teilt die Trades in der Telegram-Gruppe. Du prüfst die Angaben und gibst sie selbst in deiner Handelsplattform ein. Die Entscheidung und das Risiko bleiben bei dir.</p></details>
        <details><summary>Was lerne ich in der Basic Academy?<ChevronDown size={18}/></summary><p>Du lernst, Trade-Nachrichten zu verstehen, die Angaben richtig zu übernehmen, Updates einzuordnen und aus dem Verlauf dazuzulernen. Sie ist auf diese Anwendung ausgerichtet.</p></details>
        <details><summary>Was kostet der Zugang?<ChevronDown size={18}/></summary><p>Das Zugangsmodell wird gerade finalisiert. Die verbindlichen Konditionen erhältst du vor einer Anmeldung. Eine Anfrage löst keine Zahlung aus.</p></details>
        <details><summary>Kann ich mit den Trades Geld verlieren?<ChevronDown size={18}/></summary><p>Ja. Auch geteilte Trades können Verluste verursachen. Weder die Trades noch die Basic Academy garantieren Gewinne.</p></details>
      </div></section>
      <section className="tr-invite sx-wrap sx-reveal"><div><span className="tr-eyebrow">DEIN NÄCHSTER SCHRITT</span><h2>Wir sehen uns<br/><em>in der Gruppe.</em></h2></div><div><p>Informiere dich über den Zugang zu Saifs Telegram-Gruppe und der Basic Academy.</p><InfoGroupButton onContact={()=>request()}/></div></section>
    </main>
    <ExperienceFooter onContact={()=>request('Coaching')}/>
    {video&&<SaifVideo open initialClip={0} onOpenChange={setVideo} returnFocus={lastFocus.current}/>}
    <ContactDialog key={contact||'closed'} topic={contact} close={()=>setContact(null)} returnFocus={lastFocus.current}/>
  </div>;
}
