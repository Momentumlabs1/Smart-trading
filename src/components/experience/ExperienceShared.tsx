import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, Menu, Send, X } from 'lucide-react';
import '../home/smart-trading.css';
import './experience.css';


// Public destinations are filled only with confirmed SAIF contact details.
const saifTargets = {
  contactEmail: import.meta.env.VITE_SAIF_CONTACT_EMAIL || '',
  contactUrl: import.meta.env.VITE_SAIF_CONTACT_URL || '',
  infoGroup: import.meta.env.VITE_SAIF_INFO_URL || '',
};

export function SaifMark() {
  return <Link className="sx-mark" to="/" aria-label="SAIF Smart Trading – Startseite"><span className="sx-monogram" aria-hidden="true">s<span>/</span></span><span>SAIF<small>SMART TRADING</small></span></Link>;
}

export function ExperienceHeader({ onContact, onGroup }: { onContact: () => void; onGroup?: () => void }) {
  const [menu,setMenu] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setMenu(false); window.scrollTo({top:0,behavior:'instant'}); }, [pathname]);
  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenu(false); document.getElementById('sx-menu')?.focus(); } };
    window.addEventListener('keydown',close); return () => window.removeEventListener('keydown',close);
  },[menu]);
  return <header className="sx-header"><div className="sx-header-inner"><SaifMark/><nav className="sx-nav" aria-label="Hauptnavigation"><a href={pathname==='/' ? '#lernweg' : '/#lernweg'}>Dein Lernweg</a><Link to="/signale" className={pathname==='/signale' ? 'is-current' : ''}>Saifs Trades <span className="sx-nav-dot"/></Link><a href={pathname==='/' ? '#saif' : '/#saif'}>Saif</a><button onClick={onContact}>Kontakt</button></nav><div className="sx-header-right"><Link to="/academy/login" className="sx-login">Login <ArrowUpRight size={14}/></Link>{pathname==='/signale'&&onGroup?<InfoGroupButton onContact={onGroup} compact/>:<Link to="/signale" className="sx-button sx-button-gold sx-button-compact">Zur Gruppe <ArrowUpRight size={16}/></Link>}<button id="sx-menu" className="sx-menu-button" aria-label={menu?'Menü schließen':'Menü öffnen'} aria-expanded={menu} aria-controls="sx-mobile-nav" onClick={() => setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div></div>{menu&&<nav id="sx-mobile-nav" className="sx-mobile-nav" aria-label="Mobile Navigation"><a href={pathname==='/'?'#lernweg':'/#lernweg'} onClick={()=>setMenu(false)}>Dein Lernweg</a><Link to="/signale">Saifs Trades</Link><a href={pathname==='/'?'#saif':'/#saif'} onClick={()=>setMenu(false)}>Saif kennenlernen</a><button onClick={()=>{setMenu(false);onContact();}}>Kontakt aufnehmen</button><Link to="/academy/login">Mitglieder-Login</Link></nav>}</header>;
}

export function ExperienceFooter({onContact}: {onContact:()=>void}) {
  return <footer className="sx-footer sx-wrap"><div className="sx-footer-top"><SaifMark/><p>DEIN WEG. DEIN SYSTEM.</p><button onClick={onContact}>Kontakt aufnehmen <ArrowUpRight size={17}/></button></div><div className="sx-footer-links"><a href="/#lernweg">Academy-Lernweg</a><Link to="/signale">Telegram-Gruppe & Basic Academy</Link><Link to="/academy/login">Mitglieder-Login</Link></div><div className="sx-footer-bottom"><p>Trading birgt Verlustrisiken. Lerninhalte und Signale sind keine Gewinngarantie.</p><span>© {new Date().getFullYear()} SAIF SMART TRADING</span></div></footer>;
}

export function ContactDialog({topic,close,returnFocus}:{topic:string|null;close:()=>void;returnFocus:HTMLElement|null}) {
  const [message,setMessage] = useState('');
  const [name,setName] = useState('');
  const [copied,setCopied] = useState(false);
  const text=`Hallo Saif,\n\nich interessiere mich für ${topic}.\n\n${message}\n\nViele Grüße\n${name}`;
  const target = saifTargets.contactEmail ? `mailto:${saifTargets.contactEmail}?subject=${encodeURIComponent('SAIF – Anfrage: '+topic)}&body=${encodeURIComponent(text)}` : saifTargets.contactUrl;
  return <Dialog.Root open={topic!==null} onOpenChange={open=>{if(!open)close();}}><Dialog.Portal><Dialog.Overlay className="sx-dialog-overlay"/><Dialog.Content className="sx-contact-dialog" onCloseAutoFocus={e=>{e.preventDefault();returnFocus?.focus();}}><Dialog.Close aria-label="Kontakt schließen" className="sx-dialog-close"><X size={21}/></Dialog.Close><span className="sx-kicker">LASS UNS SPRECHEN</span><Dialog.Title>{(topic==='Coaching'||topic==='Erstgespräch') ? 'Dein nächster Schritt. Persönlich.' : 'Dein Interesse. Direkt an Saif.'}</Dialog.Title><Dialog.Description>{(topic==='Coaching'||topic==='Erstgespräch')?'Du möchtest mit Saif sprechen? Beschreibe kurz, wo du stehst. Gemeinsam lässt sich klären, ob und wie eine Zusammenarbeit passt.':'Du interessierst dich für Saifs Telegram-Gruppe und die Basic Academy? Halte deine Fragen hier fest.'}</Dialog.Description><label>Dein Name<input value={name} onChange={e=>setName(e.target.value)} autoComplete="given-name" placeholder="Wie heißt du?"/></label><label>Worum geht es dir?<textarea value={message} onChange={e=>setMessage(e.target.value)} rows={4} placeholder="Deine Erfahrung, dein Ziel und deine Fragen …"/></label>{target?<><a href={target} className="sx-button sx-button-gold">Kontakt öffnen <ArrowUpRight size={18}/></a><small>Öffnet den Kontaktkanal. Deine Anfrage wird hier noch nicht gesendet.</small></>:<><div className="sx-contact-pending">Der direkte Kontaktkanal wird gerade eingerichtet. Du kannst deine Anfrage vorbereiten und kopieren; sie wird hier nicht versendet.</div><button className="sx-button sx-button-gold" onClick={async()=>{try{await navigator.clipboard.writeText(text);setCopied(true);}catch{setCopied(false);}}}>{copied?'Anfrage kopiert':'Anfrage kopieren'}{copied?<Check size={18}/>:<Copy size={18}/>}</button></>}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}


export function InfoGroupButton({onContact,children='Zur Infogruppe',compact=false}:{onContact:()=>void;children?:ReactNode;compact?:boolean}) {
  const className=`sx-button sx-button-gold${compact?' sx-button-compact':''}`;
  return saifTargets.infoGroup ? <a href={saifTargets.infoGroup} target="_blank" rel="noopener noreferrer" className={className}>{children}<Send size={17}/></a> : <button className={className} onClick={onContact}>Zugang anfragen <ArrowUpRight size={18}/></button>;
}

export function ScrollCue({label='SCROLL, UM WEITERZUGEHEN'}:{label?:string}) {return <span className="sx-scroll-cue"><span className="sx-scroll-line"/>{label}<ArrowDown size={13}/></span>;}
