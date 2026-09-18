import { useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, ArrowUpRight, RotateCcw, Send, Volume2, VolumeX, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import portrait from '@/assets/saif-portrait.webp';
import { FUNNEL, STAGES, VIDEO_BASE, type FunnelAnswer, type FunnelNode } from './saif-funnel-data';
import { saifTargets } from '../experience/ExperienceShared';
import './saif-funnel.css';

export type FunnelAnswers = Partial<Record<NonNullable<FunnelNode['answerKey']>, string>>;

/** Fasst die Antworten für die Anfrage an Saif in einer Zeile zusammen. */
export function summarize(answers: FunnelAnswers) {
  return [answers.level, answers.anlass && `Auslöser: ${answers.anlass}`, answers.ziel && `Ziel: ${answers.ziel}`, answers.baustelle && `Baustelle: ${answers.baustelle}`].filter(Boolean).join(' · ');
}

export default function SaifFunnel({ start, open, onClose, onContact, returnFocus }: {
  start: string; open: boolean; onClose: () => void; returnFocus: HTMLElement | null;
  onContact: (topic: string, answers: FunnelAnswers) => void;
}) {
  const [path, setPath] = useState<string[]>([start]);
  const [answers, setAnswers] = useState<FunnelAnswers>({});
  const node = FUNNEL[path[path.length - 1]];
  const stageIndex = STAGES.findIndex(s => s.id === node.stage);

  const choose = (a: FunnelAnswer) => {
    if (node.answerKey) setAnswers(prev => ({ ...prev, [node.answerKey!]: a.value ?? a.label }));
    setPath(p => [...p, a.next]);
  };
  const back = () => setPath(p => (p.length > 1 ? p.slice(0, -1) : p));

  return <Dialog.Root open={open} onOpenChange={o => { if (!o) onClose(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="sf-overlay" />
      <Dialog.Content className={`sf-dialog sf-kind-${node.kind}`} onCloseAutoFocus={e => { e.preventDefault(); returnFocus?.focus(); }} aria-describedby={undefined}>
        <div className="sf-top">
          <button className="sf-icon" onClick={back} disabled={path.length < 2} aria-label="Einen Schritt zurück"><ArrowLeft size={18} /></button>
          <ol className="sf-steps" aria-label="Dein Weg durch das Kennenlernen">
            {STAGES.map((s, i) => <li key={s.id} className={i < stageIndex ? 'is-done' : i === stageIndex ? 'is-now' : ''} aria-current={i === stageIndex ? 'step' : undefined}><span>{s.label}</span></li>)}
          </ol>
          <Dialog.Close className="sf-icon" aria-label="Kennenlernen schließen"><X size={19} /></Dialog.Close>
        </div>
        {node.kind === 'video' && <VideoStep key={node.id} node={node} onChoose={choose} />}
        {node.kind === 'card' && <CardStep key={node.id} node={node} onChoose={choose} />}
        {node.kind === 'result' && <ResultStep key="ergebnis" answers={answers} onContact={t => onContact(t, answers)} onClose={onClose} onRestart={() => { setAnswers({}); setPath([start]); }} />}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

function Answers({ node, onChoose, ready }: { node: FunnelNode; onChoose: (a: FunnelAnswer) => void; ready: boolean }) {
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (ready) first.current?.focus({ preventScroll: true }); }, [ready]);
  if (!node.answers) return null;
  return <div className={`sf-answers${ready ? ' is-ready' : ''}`} aria-hidden={!ready}>
    <p className="sf-question">{node.question}</p>
    <div className="sf-answer-list">
      {node.answers.map((a, i) => <button key={a.label} ref={i === 0 ? first : undefined} tabIndex={ready ? 0 : -1} onClick={() => onChoose(a)}>
        <span className="sf-answer-key">{String.fromCharCode(65 + i)}</span><span>{a.label}</span><ArrowUpRight size={17} />
      </button>)}
    </div>
  </div>;
}

function VideoStep({ node, onChoose }: { node: FunnelNode; onChoose: (a: FunnelAnswer) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const v = video.current; if (!v) return;
    v.muted = false;
    v.play().catch(() => { v.muted = true; setMuted(true); v.play().catch(() => setBlocked(true)); });
  }, []);
  const tick = () => {
    const v = video.current; if (!v || !v.duration) return;
    setProgress(v.currentTime / v.duration);
    if (!ready && node.askAt !== undefined && v.currentTime >= node.askAt) setReady(true);
  };
  const replay = () => { const v = video.current; if (!v) return; v.currentTime = 0; setEnded(false); void v.play(); };
  return <div className="sf-stage">
    <div className="sf-screen">
      <video ref={video} src={`${VIDEO_BASE}${node.video}.mp4`} poster={`${VIDEO_BASE}${node.video}.jpg`} playsInline preload="auto"
        onTimeUpdate={tick} onEnded={() => { setEnded(true); setReady(true); setProgress(1); }} onError={() => setFailed(true)}
        onClick={e => { const v = e.currentTarget; if (v.paused) void v.play(); else v.pause(); }} />
      <div className="sf-bar" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>
      <div className="sf-screen-tools">
        <button className="sf-icon sf-icon-glass" onClick={() => { const v = video.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); }} aria-label={muted ? 'Ton einschalten' : 'Ton ausschalten'}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button>
        {ended && <button className="sf-icon sf-icon-glass" onClick={replay} aria-label="Noch einmal ansehen"><RotateCcw size={16} /></button>}
      </div>
      {(blocked || (muted && !ended)) && <button className="sf-unmute" onClick={() => { const v = video.current; if (!v) return; v.muted = false; setMuted(false); setBlocked(false); void v.play(); }}><Volume2 size={16} /> Ton an</button>}
      {failed && <p className="sf-error">Das Video lädt gerade nicht. <button onClick={() => { setFailed(false); video.current?.load(); void video.current?.play(); }}>Erneut laden</button></p>}
      <div className="sf-shade" aria-hidden="true" />
    </div>
    <aside className="sf-side">
      <span className="sf-kicker"><i /> SAIF · PERSÖNLICH</span>
      <Dialog.Title className="sf-title">{node.title}</Dialog.Title>
      <Answers node={node} onChoose={onChoose} ready={ready} />
      {!ready && <p className="sf-wait">Hör kurz zu – gleich entscheidest du, wie es weitergeht.</p>}
    </aside>
  </div>;
}

function CardStep({ node, onChoose }: { node: FunnelNode; onChoose: (a: FunnelAnswer) => void }) {
  const [shown, setShown] = useState(0);
  const lines = node.lines ?? [];
  useEffect(() => {
    if (shown >= lines.length) return;
    const t = window.setTimeout(() => setShown(s => s + 1), shown === 0 ? 450 : 1300);
    return () => window.clearTimeout(t);
  }, [shown, lines.length]);
  return <div className="sf-stage">
    <div className="sf-screen sf-card-screen">
      <img src={portrait} alt="" className="sf-card-bg" />
      <div className="sf-chat" aria-live="polite">
        <div className="sf-chat-head"><img src={portrait} alt="" /><span>Saif<small>schreibt dir</small></span></div>
        {lines.slice(0, shown).map(l => <p key={l} className="sf-bubble">{l}</p>)}
        {shown < lines.length && <p className="sf-bubble sf-typing" aria-label="Saif schreibt"><i /><i /><i /></p>}
      </div>
      <div className="sf-shade" aria-hidden="true" />
    </div>
    <aside className="sf-side">
      <span className="sf-kicker"><i /> SAIF · PERSÖNLICH</span>
      <Dialog.Title className="sf-title">{node.title}</Dialog.Title>
      <Answers node={node} onChoose={onChoose} ready={shown >= lines.length} />
    </aside>
  </div>;
}

function ResultStep({ answers, onContact, onClose, onRestart }: { answers: FunnelAnswers; onContact: (topic: string) => void; onClose: () => void; onRestart: () => void }) {
  const beginner = answers.level !== 'Tradet schon';
  const summary = useMemo(() => summarize(answers), [answers]);
  const steps = beginner
    ? [['Trades erhalten', 'Saif teilt seine Trades in der Telegram-Gruppe: Einstieg, Stop Loss und Ziel.'],
       ['Selbst umsetzen', 'Du übernimmst sie auf deiner eigenen Plattform, mit einem Risiko, das zu dir passt.'],
       ['Dabei verstehen', 'Die Basic Academy erklärt dir Schritt für Schritt, was im Trade passiert.']]
    : [['Mitlesen', 'Du siehst, wo Saif einsteigt, wo er absichert und wo sein Ziel liegt.'],
       ['Vergleichen', 'Lege seine Trades neben deine eigene Analyse und finde die Unterschiede.'],
       ['Dranbleiben', 'Die Basic Academy hilft dir, daraus feste Regeln für dich zu machen.']];
  return <div className="sf-stage sf-result">
    <div className="sf-result-hero">
      <img src={portrait} alt="Saif" />
      <div>
        <span className="sf-kicker"><i /> DEIN WEG MIT SAIF</span>
        <Dialog.Title className="sf-title">{beginner ? <>Lerne an echten Trades.<br /><em>Mit Saif an deiner Seite.</em></> : <>Schärfe deinen Blick.<br /><em>An Saifs Trades.</em></>}</Dialog.Title>
        {summary && <p className="sf-summary">{summary}</p>}
      </div>
    </div>
    <ol className="sf-plan">{steps.map(([t, d], i) => <li key={t}><span>0{i + 1}</span><strong>{t}</strong><p>{d}</p></li>)}</ol>
    <div className="sf-result-actions">
      {saifTargets.infoGroup
        ? <a className="sf-cta" href={saifTargets.infoGroup} target="_blank" rel="noopener noreferrer">In Saifs Telegram-Gruppe <Send size={18} /></a>
        : <Link className="sf-cta" to="/signale" onClick={onClose}>Saifs Trades & Basic Academy <ArrowUpRight size={18} /></Link>}
      <button className="sf-secondary" onClick={() => onContact('Erstgespräch')}>Lieber persönlich sprechen <ArrowUpRight size={17} /></button>
    </div>
    <div className="sf-result-foot"><button onClick={onRestart}><RotateCcw size={14} /> Von vorn</button><small>Trading birgt Verlustrisiken. Saifs Trades sind keine Anlageberatung und keine Gewinngarantie.</small></div>
  </div>;
}
