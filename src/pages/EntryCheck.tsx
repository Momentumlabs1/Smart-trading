import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Compass, RotateCcw } from 'lucide-react';
import '@/components/home/smart-trading.css';
import '@/components/home/entry-check.css';

const questions = [
  { label: 'DEIN AUSGANGSPUNKT', title: 'Wie viel Erfahrung bringst du mit?', options: [['new','Ich fange gerade an.','Ich möchte erst einmal verstehen, wie Trading funktioniert.'],['some','Die Grundlagen kenne ich.','Ich habe schon erste Erfahrungen gesammelt.'],['experienced','Ich beschäftige mich länger damit.','Ich möchte mein Vorgehen gezielt weiterentwickeln.']] },
  { label: 'DEIN INTERESSE', title: 'Was möchtest du besser verstehen?', options: [['basics','Die Grundlagen','Begriffe, Charts und Zusammenhänge.'],['structure','Mein eigenes Vorgehen','Mehr Struktur und ein bewusster Umgang mit Entscheidungen.'],['signals','Den Umgang mit Signalen','Einstieg, Absicherung und Ziel richtig einordnen.']] },
  { label: 'DEIN LERNSTIL', title: 'Wie lernst du am liebsten?', options: [['video','Mit kurzen Videos','Schritt für Schritt erklärt.'],['examples','An konkreten Beispielen','Zusammenhänge direkt im Chart entdecken.'],['practice','Durch eigenes Ausprobieren','Erst verstehen, dann das Gelernte in Ruhe üben.']] },
];

export default function EntryCheck() {
  const [params] = useSearchParams();
  const profile = params.get('profil');
  const [answers,setAnswers] = useState<Record<number,string>>(() => profile==='0' ? {0:'new'} : profile==='1' ? {0:'some'} : profile==='2' ? {1:'signals'} : {});
  const [step,setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const ready = step === questions.length;
  const question = questions[step];
  useEffect(() => { document.title='Dein Einstieg — SAIF Smart Trading'; }, []);
  useEffect(() => { heading.current?.focus({ preventScroll:true }); window.scrollTo({top:0,behavior:'instant'}); }, [step]);
  const beginner = answers[0] === 'new';
  const signals = answers[1] === 'signals';
  const outcome = beginner ? {
    title:'Dein Fundament kommt zuerst.',
    text:'Du stehst am Anfang. Ein guter nächster Schritt ist, die Begriffe und Zusammenhänge kennenzulernen, bevor du Handelsideen bewertest.',
    steps:['Die wichtigsten Trading-Begriffe kennenlernen','Einstieg, Stop Loss und Ziel auseinanderhalten','Das Gelernte an Beispielen nachvollziehen'],
  } : signals ? {
    title:'Gib jedem Signal einen Kontext.',
    text:'Dich interessieren Signale. Vertiefe zuerst, wie eine Handelsidee aufgebaut ist und welche Informationen du für deine eigene Beurteilung brauchst.',
    steps:['Den Aufbau eines Signals bewusst lesen','Die Rolle von Absicherung und Ziel verstehen','Unklare Begriffe und offene Fragen festhalten'],
  } : {
    title:'Mehr Struktur für dein Wissen.',
    text:'Du bringst bereits Erfahrung mit. Nutze sie, um dein Verständnis zu überprüfen und gezielt an den Stellen weiterzulernen, die noch unklar sind.',
    steps:['Deinen aktuellen Wissensstand reflektieren','Offene Fragen nach Themen ordnen','Ein Thema nach dem anderen vertiefen'],
  };
  const learning = answers[2]==='video' ? 'Für deinen Lernstil: Beginne mit Saifs Videos und halte deine offenen Fragen fest.' : answers[2]==='examples' ? 'Für deinen Lernstil: Nutze den interaktiven Signal-Erklärer auf der Startseite.' : 'Für deinen Lernstil: Arbeite zunächst mit fiktiven Beispielen und notiere deine Überlegungen.';
  return <div className="st-page st-entry-page">
    <header className="st-entry-header"><Link to="/" className="st-entry-wordmark">SAIF<span>SMART TRADING</span></Link><Link to="/"><ArrowLeft size={15}/> Zur Website</Link></header>
    <main className="st-entry-main">
      {!ready ? <>
        <div className="st-entry-progress"><span>DEIN PERSÖNLICHER EINSTIEG</span><span>{step+1} / {questions.length}</span><progress aria-label="Fortschritt im Einstiegs-Check" max={questions.length} value={step+1} /></div>
        <div className="st-entry-title"><span className="st-eyebrow">{question.label}</span><h1 ref={heading} tabIndex={-1}>{question.title}</h1><p>Drei kurze Fragen. Ein erster Wegweiser für dich.</p></div>
        <fieldset className="st-entry-options"><legend className="sr-only">{question.title}</legend>{question.options.map(([value,label,description]) => <label key={value} className={answers[step]===value ? 'is-selected' : ''}><input type="radio" name={`question-${step}`} value={value} checked={answers[step]===value} onChange={() => setAnswers({...answers,[step]:value})}/><span className="st-entry-radio" aria-hidden="true">{answers[step]===value && <Check size={13}/>}</span><span><strong>{label}</strong><small>{description}</small></span></label>)}</fieldset>
        <div className="st-entry-controls"><button className="st-text-button" disabled={step===0} onClick={() => setStep(step-1)}><ArrowLeft size={16}/> Zurück</button><button className="st-button st-button-dark" disabled={!answers[step]} onClick={() => setStep(step+1)}>{step===questions.length-1 ? 'Meinen Weg ansehen' : 'Weiter'}<ArrowRight size={18}/></button></div>
      </> : <div className="st-entry-result"><span className="st-entry-compass"><Compass size={33} strokeWidth={1.3}/></span><span className="st-eyebrow">DEIN ERSTER WEGWEISER</span><h1 ref={heading} tabIndex={-1}>{outcome.title}</h1><p>{outcome.text}</p><ol>{outcome.steps.map((text,i) => <li key={text}><span>0{i+1}</span>{text}</li>)}</ol><div className="st-entry-learning">{learning}</div><Link className="st-button st-button-yellow" to="/">Smart Trading entdecken <ArrowRight size={17}/></Link><button className="st-text-button" onClick={() => setStep(0)}><RotateCcw size={15}/> Antworten ändern</button><small>Eine Orientierung zum Lernen auf Basis deiner Angaben. Keine Bewertung deiner Handelseignung.</small></div>}
      <p className="st-entry-privacy">Ohne Anmeldung. Deine Auswahl bleibt in dieser Sitzung und wird nicht übermittelt.</p>
    </main>
  </div>;
}
