import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, Menu, Send, X } from 'lucide-react';
import '../home/smart-trading.css';
import './experience.css';


// Public destinations are filled only with confirmed SAIF contact details.
export const saifTargets = {
  contactEmail: import.meta.env.VITE_SAIF_CONTACT_EMAIL || 'office@smart-trading.at',
  contactUrl: import.meta.env.VITE_SAIF_CONTACT_URL || '',
  infoGroup: import.meta.env.VITE_SAIF_INFO_URL || 'https://t.me/+VvI5JkawmB45YThk', // Einladungslink „SAIF Website“: Beitritte über die Website sind so zählbar
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
  return <header className="sx-header"><div className="sx-header-inner"><SaifMark/><nav className="sx-nav" aria-label="Hauptnavigation"><a href={pathname==='/' ? '#lernweg' : '/#lernweg'}>Dein Lernweg</a><Link to="/signale" className={pathname==='/signale' ? 'is-current' : ''}>Saifs Trades <span className="sx-nav-dot"/></Link><a href={pathname==='/' ? '#saif' : '/#saif'}>Saif</a><button onClick={onContact}>Kontakt</button></nav><div className="sx-header-right"><Link to="/academy" className="sx-login">Login <ArrowUpRight size={14}/></Link>{pathname==='/signale'&&onGroup?<InfoGroupButton onContact={onGroup} compact/>:<Link to="/signale" className="sx-button sx-button-gold sx-button-compact">Zur Gruppe <ArrowUpRight size={16}/></Link>}<button id="sx-menu" className="sx-menu-button" aria-label={menu?'Menü schließen':'Menü öffnen'} aria-expanded={menu} aria-controls="sx-mobile-nav" onClick={() => setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div></div>{menu&&<nav id="sx-mobile-nav" className="sx-mobile-nav" aria-label="Mobile Navigation"><a href={pathname==='/'?'#lernweg':'/#lernweg'} onClick={()=>setMenu(false)}>Dein Lernweg</a><Link to="/signale">Saifs Trades</Link><a href={pathname==='/'?'#saif':'/#saif'} onClick={()=>setMenu(false)}>Saif kennenlernen</a><button onClick={()=>{setMenu(false);onContact();}}>Kontakt aufnehmen</button><Link to="/academy">Mitglieder-Login</Link></nav>}</header>;
}

export function ExperienceFooter({onContact}: {onContact:()=>void}) {
  return <footer className="sx-footer sx-wrap"><div className="sx-footer-top"><SaifMark/><p>DEIN WEG. DEIN SYSTEM.</p><button onClick={onContact}>Kontakt aufnehmen <ArrowUpRight size={17}/></button></div><div className="sx-footer-links"><a href="/#lernweg">Academy-Lernweg</a><Link to="/signale">Telegram-Gruppe & Basic Academy</Link><Link to="/about">Saifs Geschichte</Link><Link to="/academy">Mitglieder-Login</Link></div><div className="sx-footer-legal"><Link to="/impressum">Impressum</Link><Link to="/datenschutz">Datenschutz</Link><Link to="/risikohinweis">Risikohinweis</Link></div><div className="sx-footer-bottom"><p>Trading birgt Verlustrisiken. Saifs Trades und Lerninhalte sind keine Anlageberatung und keine Gewinngarantie. <Link to="/risikohinweis">Risikohinweis</Link></p><span>© {new Date().getFullYear()} SAIF SMART TRADING</span></div></footer>;
}

export function ContactDialog({topic,close,returnFocus,context=''}:{topic:string|null;close:()=>void;returnFocus:HTMLElement|null;context?:string}) {
  const [name,setName] = useState('');
  const [reach,setReach] = useState('');
  const [message,setMessage] = useState('');
  const [consent,setConsent] = useState(false);
  const [trap,setTrap] = useState('');
  const [state,setState] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [copied,setCopied] = useState(false);
  const personal = topic==='Coaching'||topic==='Erstgespräch';
  const text=`Hallo Saif,\n\nich interessiere mich für: ${topic}.${context?`\n\nMeine Antworten: ${context}`:''}\n\n${message}\n\nViele Grüße\n${name}\nErreichbar unter: ${reach}`;
  const valid = name.trim().length>1 && reach.trim().length>3 && consent;
  const send = async (e: FormEvent) => {
    e.preventDefault(); if(!valid||state==='sending') return;
    setState('sending');
    try {
      const res = await fetch('/api/anfrage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({topic,name,reach,message,context,page:window.location.pathname,website:trap})});
      setState(res.ok?'sent':'error');
    } catch { setState('error'); }
  };
  return <Dialog.Root open={topic!==null} onOpenChange={open=>{if(!open)close();}}><Dialog.Portal><Dialog.Overlay className="sx-dialog-overlay"/><Dialog.Content className="sx-contact-dialog" onCloseAutoFocus={e=>{e.preventDefault();returnFocus?.focus();}}><Dialog.Close aria-label="Kontakt schließen" className="sx-dialog-close"><X size={21}/></Dialog.Close>
    <span className="sx-kicker">{personal?'LASS UNS SPRECHEN':'DEIN ZUGANG'}</span>
    {state==='sent' ? <div className="sx-contact-done" role="status"><span className="sx-contact-check"><Check size={24}/></span><Dialog.Title>Danke{name?`, ${name.split(' ')[0]}`:''}. Deine Anfrage ist da.</Dialog.Title><Dialog.Description>Saif oder sein Team melden sich persönlich bei dir unter <strong>{reach}</strong>.</Dialog.Description><button className="sx-button sx-button-gold" onClick={close}>Fertig <Check size={18}/></button></div> : <form onSubmit={send}>
      <Dialog.Title>{personal ? 'Dein nächster Schritt. Persönlich.' : 'Dein Interesse. Direkt an Saif.'}</Dialog.Title>
      <Dialog.Description>{personal?'Erzähl Saif kurz, wo du stehst. Gemeinsam klärt ihr, ob und wie eine Zusammenarbeit passt.':'Du interessierst dich für Saifs Telegram-Gruppe und die Basic Academy? Hinterlass kurz deine Daten, Saif meldet sich bei dir.'}</Dialog.Description>
      {context&&<p className="sx-contact-context"><span>DEINE ANTWORTEN</span>{context}</p>}
      <label>Dein Name<input value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="Wie heißt du?" required maxLength={80}/></label>
      <label>Wo erreichen wir dich?<input value={reach} onChange={e=>setReach(e.target.value)} autoComplete="email" placeholder="Telegram @name, WhatsApp-Nummer oder E-Mail" required maxLength={120}/></label>
      <label>Worum geht es dir? <small>(optional)</small><textarea value={message} onChange={e=>setMessage(e.target.value)} rows={3} maxLength={1500} placeholder="Deine Erfahrung, dein Ziel, deine Fragen …"/></label>
      <input className="sx-hp" tabIndex={-1} autoComplete="off" value={trap} onChange={e=>setTrap(e.target.value)} aria-hidden="true" name="website"/>
      <label className="sx-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Ich bin einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage gespeichert werden. Mehr in der <Link to="/datenschutz" onClick={close}>Datenschutzerklärung</Link>.</span></label>
      <button type="submit" className="sx-button sx-button-gold" disabled={!valid||state==='sending'}>{state==='sending'?'Wird gesendet …':'Anfrage senden'} <ArrowUpRight size={18}/></button>
      {state==='error'&&<div className="sx-contact-pending" role="alert">Das Senden hat gerade nicht geklappt. {saifTargets.contactEmail?<a href={`mailto:${saifTargets.contactEmail}?subject=${encodeURIComponent('SAIF – Anfrage: '+topic)}&body=${encodeURIComponent(text)}`}>Per E-Mail senden</a>:<button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(text);setCopied(true);}catch{setCopied(false);}}}>{copied?'Anfrage kopiert':'Anfrage kopieren'}{copied?<Check size={14}/>:<Copy size={14}/>}</button>}</div>}
      <small>Unverbindlich. Kein Kauf, kein Abo.</small>
    </form>}
  </Dialog.Content></Dialog.Portal></Dialog.Root>;
}


export function InfoGroupButton({onContact,children='Zur Infogruppe',compact=false}:{onContact:()=>void;children?:ReactNode;compact?:boolean}) {
  const className=`sx-button sx-button-gold${compact?' sx-button-compact':''}`;
  return saifTargets.infoGroup ? <a href={saifTargets.infoGroup} target="_blank" rel="noopener noreferrer" className={className}>{children}<Send size={17}/></a> : <button className={className} onClick={onContact}>Zugang anfragen <ArrowUpRight size={18}/></button>;
}

export function ScrollCue({label='SCROLL, UM WEITERZUGEHEN'}:{label?:string}) {return <span className="sx-scroll-cue"><span className="sx-scroll-line"/>{label}<ArrowDown size={13}/></span>;}
