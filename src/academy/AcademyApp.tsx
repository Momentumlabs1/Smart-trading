/**
 * SAIF Basic Academy (/academy/*): Dashboard, Lektionen, Rechner, Glossar.
 * Aufbau wie die Cosmos-Academy, Login und Mitgliedsdaten aus demselben Backend (momentum-hq).
 * Modul 01 ist ohne Einzahlung offen, der Rest wird mit der Einzahlung freigeschaltet (wie der Bot).
 */
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Calculator, Check, CheckCircle2, Circle, Home, Library, Lock, LogOut, Play, Send } from 'lucide-react';
import { cosmos, COSMOS_URL } from '@/lib/cosmos';
import { GLOSSARY, LESSONS, MODULES, lessonById, lessonsOf, type Lesson, type QuizQuestion } from './data';
import { LotCalc, RRCalc, StreakCalc, ToolFor } from './Tools';
import { DEMO, useMember, useSession, type Member } from './useMember';
import './academy.css';

const BOT_URL = 'https://t.me/SaifSmartTradingBot';
const FREE_MODULE = 'start';
const isFree = (l: Lesson) => l.module === FREE_MODULE;

type Ctx = ReturnType<typeof useMember>;

export default function AcademyApp() {
  const { ready, signedIn } = useSession();
  const m = useMember(signedIn);
  useEffect(() => {
    const meta = document.createElement('meta'); meta.name = 'robots'; meta.content = 'noindex'; document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
  if (!ready) return <div className="ac-page ac-center"><span className="ac-spinner" /></div>;
  return <Routes>
    <Route path="login" element={signedIn ? <Navigate to="/academy" replace /> : <Login />} />
    <Route path="passwort" element={<NewPassword />} />
    <Route path="*" element={signedIn ? <Shell m={m} /> : <Navigate to="/academy/login" replace />} />
  </Routes>;
}

function Mark() {
  return <Link to="/academy" className="ac-mark" aria-label="Basic Academy – Übersicht"><span className="ac-mono">s<span>/</span></span><span>SAIF<small>BASIC ACADEMY</small></span></Link>;
}

function Shell({ m }: { m: Ctx }) {
  const nav = useNavigate();
  const out = async () => { await cosmos?.auth.signOut(); nav('/academy/login'); };
  const items: [string, string, ReactNode][] = [['/academy', 'Übersicht', <Home size={18} key="h" />], ['/academy/lektionen', 'Lektionen', <BookOpen size={18} key="b" />], ['/academy/tools', 'Rechner', <Calculator size={18} key="c" />], ['/academy/glossar', 'Glossar', <Library size={18} key="g" />]];
  return <div className="ac-page ac-app">
    <aside className="ac-side">
      <Mark />
      <nav aria-label="Academy">{items.map(([to, label, icon]) => <NavLink key={to} to={to} end={to === '/academy'} className={({ isActive }) => isActive ? 'is-active' : ''}>{icon}{label}</NavLink>)}</nav>
      <div className="ac-side-foot">
        <a href={BOT_URL} target="_blank" rel="noopener noreferrer" className="ac-side-bot"><Send size={16} />Zum Bot</a>
        {m.member && <p><b>{m.member.name || m.member.email}</b><small>{m.hasAccess ? 'Freigeschaltet' : 'Noch nicht freigeschaltet'}</small></p>}
        <button onClick={out}><LogOut size={15} />Abmelden</button>
      </div>
    </aside>
    <header className="ac-top"><Mark /><button className="ac-icon" onClick={out} aria-label="Abmelden"><LogOut size={17} /></button></header>
    <main className="ac-main">
      {m.error && <p className="ac-banner">Nicht alles konnte geladen werden: {m.error}</p>}
      {!m.loaded ? <div className="ac-center ac-loading"><span className="ac-spinner" /></div> : !m.member && !DEMO ? <NoMember /> : <Routes>
        <Route index element={<Dashboard m={m} />} />
        <Route path="lektionen" element={<LessonList m={m} />} />
        <Route path="lektionen/:id" element={<LessonPage m={m} />} />
        <Route path="tools" element={<ToolsPage />} />
        <Route path="glossar" element={<Glossary />} />
        <Route path="*" element={<Navigate to="/academy" replace />} />
      </Routes>}
    </main>
    <nav className="ac-tabbar" aria-label="Academy">{items.map(([to, label, icon]) => <NavLink key={to} to={to} end={to === '/academy'} className={({ isActive }) => isActive ? 'is-active' : ''}>{icon}<span>{label}</span></NavLink>)}</nav>
  </div>;
}

function NoMember() {
  return <section className="ac-card ac-empty-state"><h1>Kein Mitgliedskonto gefunden.</h1><p>Dein Zugang zur Academy entsteht automatisch, sobald dich der Bot nach deiner Einzahlung freischaltet. Wenn du schon eingezahlt hast, schreib dem Bot kurz, er schickt dir deinen Zugangslink.</p><a className="ac-btn ac-btn-gold" href={BOT_URL} target="_blank" rel="noopener noreferrer">Zum Bot <Send size={16} /></a></section>;
}

function Progress({ value, size = 64 }: { value: number; size?: number }) {
  const r = size / 2 - 5, c = 2 * Math.PI * r;
  return <svg className="ac-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${Math.round(value * 100)} % erledigt`}>
    <circle cx={size / 2} cy={size / 2} r={r} className="ac-ring-bg" /><circle cx={size / 2} cy={size / 2} r={r} className="ac-ring-fg" strokeDasharray={`${c * value} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle">{Math.round(value * 100)}%</text>
  </svg>;
}

function greet(member: Member | null) {
  const h = new Date().getHours();
  const n = member?.name?.split(' ')[0];
  return `${h < 11 ? 'Guten Morgen' : h < 18 ? 'Hey' : 'Guten Abend'}${n ? `, ${n}` : ''}.`;
}

function Dashboard({ m }: { m: Ctx }) {
  useEffect(() => { document.title = 'Basic Academy — SAIF Smart Trading'; }, []);
  const doneCount = LESSONS.filter(l => m.done.has(l.id)).length;
  const next = LESSONS.find(l => !m.done.has(l.id) && (m.hasAccess || isFree(l))) ?? LESSONS.find(l => !m.done.has(l.id));
  return <div className="ac-dash">
    <section className="ac-hero">
      <div><span className="ac-kicker"><i /> DEINE BASIC ACADEMY</span><h1>{greet(m.member)}</h1><p>Hier lernst du, die Trades aus der Gruppe sicher zu übernehmen und zu verstehen, was in jedem Trade passiert.</p>
        {next && <Link className="ac-btn ac-btn-gold" to={`/academy/lektionen/${next.id}`}>{doneCount ? 'Weiter mit' : 'Starte mit'}: {next.title} <ArrowRight size={17} /></Link>}</div>
      <div className="ac-hero-progress"><Progress value={doneCount / LESSONS.length} size={112} /><span>{doneCount} von {LESSONS.length} Lektionen</span></div>
    </section>
    {!m.hasAccess && <section className="ac-card ac-locked-note"><Lock size={18} /><div><b>Modul 01 ist schon offen.</b><p>Alle weiteren Module schalten sich automatisch frei, sobald deine Einzahlung beim Broker angekommen ist. Den Anmeldelink bekommst du im Bot.</p></div><a className="ac-btn ac-btn-ghost" href={BOT_URL} target="_blank" rel="noopener noreferrer">Zum Bot <ArrowUpRight size={15} /></a></section>}
    {m.hasAccess && <section className="ac-card ac-vip"><CheckCircle2 size={20} /><div><b>Du bist freigeschaltet.</b><p>Deine Einladung in die VIP-Gruppe kommt vom Bot. Aktiviere die Benachrichtigungen der Gruppe, damit du kein Update verpasst.</p></div><a className="ac-btn ac-btn-ghost" href={BOT_URL} target="_blank" rel="noopener noreferrer">Zum Bot <ArrowUpRight size={15} /></a></section>}
    <section className="ac-modules">
      {MODULES.map(mod => {
        const ls = lessonsOf(mod.id); const d = ls.filter(l => m.done.has(l.id)).length; const locked = !m.hasAccess && mod.id !== FREE_MODULE;
        return <Link key={mod.id} to={`/academy/lektionen#${mod.id}`} className={`ac-module${locked ? ' is-locked' : ''}`}>
          <span className="ac-kicker">{mod.kicker}{locked && <Lock size={11} />}</span><h3>{mod.title}</h3><p>{mod.text}</p>
          <div className="ac-bar"><i style={{ width: `${(d / ls.length) * 100}%` }} /></div><small>{d} / {ls.length} erledigt</small>
        </Link>;
      })}
    </section>
    <section className="ac-tool-teasers">
      <Link to="/academy/tools" className="ac-card ac-teaser"><Calculator size={20} /><div><b>Positionsgröße ausrechnen</b><p>Wie viel Lot passt zu deinem Konto und dem Stop Loss?</p></div><ArrowRight size={17} /></Link>
      <Link to="/academy/glossar" className="ac-card ac-teaser"><Library size={20} /><div><b>Glossar</b><p>Pips, Lots, Breakeven und alle Begriffe aus der Gruppe.</p></div><ArrowRight size={17} /></Link>
    </section>
    <p className="ac-risk">Trading ist mit Verlustrisiken verbunden. Die Inhalte sind keine Anlageberatung und keine Gewinngarantie. <Link to="/risikohinweis">Risikohinweis</Link></p>
  </div>;
}

function LessonList({ m }: { m: Ctx }) {
  useEffect(() => { document.title = 'Lektionen — SAIF Basic Academy'; const id = window.location.hash.slice(1); if (id) document.getElementById(id)?.scrollIntoView({ block: 'start' }); }, []);
  return <div className="ac-list">
    <span className="ac-kicker"><i /> LEKTIONEN</span><h1>Dein Lernweg.</h1>
    {MODULES.map(mod => {
      const locked = !m.hasAccess && mod.id !== FREE_MODULE;
      return <section key={mod.id} id={mod.id} className="ac-list-module">
        <div className="ac-list-head"><span className="ac-kicker">{mod.kicker}</span><h2>{mod.title}</h2><p>{mod.text}</p></div>
        <ol>{lessonsOf(mod.id).map(l => { const done = m.done.has(l.id); return <li key={l.id}>
          <Link to={`/academy/lektionen/${l.id}`} className={`${done ? 'is-done' : ''}${locked ? ' is-locked' : ''}`}>
            <span className="ac-status">{locked ? <Lock size={16} /> : done ? <CheckCircle2 size={18} /> : <Circle size={18} />}</span>
            <span className="ac-list-main"><b>{l.title}</b><small>{l.summary}</small></span>
            <span className="ac-meta">{l.video ? <Play size={13} /> : null}{l.minutes} Min.</span>
          </Link>
        </li>; })}</ol>
      </section>;
    })}
  </div>;
}

function useSignedVideo(object?: string) {
  const [url, setUrl] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const load = async () => {
    if (!object || !cosmos) return;
    setState('loading');
    try {
      const { data, error } = await cosmos.functions.invoke('video-url', { body: { object } });
      if (error || !data?.url) throw error ?? new Error('keine URL');
      setUrl(data.url); setState('idle');
    } catch { setState('error'); }
  };
  return { url, state, load };
}

function LessonVideo({ lesson }: { lesson: Lesson }) {
  const { url, state, load } = useSignedVideo(lesson.video);
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { if (url) void ref.current?.play().catch(() => {}); }, [url]);
  if (!lesson.video) return <div className="ac-video ac-video-soon"><span className="ac-mono">s<span>/</span></span><p><b>Video folgt.</b> Saif nimmt diese Lektion gerade auf. Bis dahin findest du unten alles zum Nachlesen.</p></div>;
  return <div className="ac-video">
    {url ? <video ref={ref} src={url} controls playsInline preload="none" />
      : <button className="ac-video-start" onClick={load} disabled={state === 'loading'}><span><Play size={26} fill="currentColor" /></span>{state === 'loading' ? 'Lädt …' : state === 'error' ? 'Video lädt gerade nicht. Nochmal versuchen' : 'Video ansehen'}</button>}
  </div>;
}

function Quiz({ questions, onPassed }: { questions: QuizQuestion[]; onPassed: () => void }) {
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null));
  const all = answers.every(a => a !== null); const right = answers.filter((a, i) => a === questions[i].correct).length;
  const fired = useRef(false);
  useEffect(() => { if (all && right === questions.length && !fired.current) { fired.current = true; onPassed(); } }, [all, right, questions.length, onPassed]);
  return <section className="ac-quiz"><span className="ac-kicker"><i /> KURZER CHECK</span>
    {questions.map((q, qi) => <fieldset key={q.q}><legend>{q.q}</legend>
      <div>{q.options.map((o, oi) => { const picked = answers[qi] === oi; const state = answers[qi] === null ? '' : oi === q.correct ? ' is-right' : picked ? ' is-wrong' : '';
        return <button key={o} className={`ac-option${picked ? ' is-picked' : ''}${state}`} disabled={answers[qi] !== null} onClick={() => setAnswers(a => a.map((v, i) => i === qi ? oi : v))}>{o}</button>; })}</div>
      {answers[qi] !== null && <p className="ac-why">{answers[qi] === q.correct ? '✓ Richtig. ' : 'Nicht ganz. '}{q.why}</p>}
    </fieldset>)}
    {all && <p className="ac-quiz-score">{right} von {questions.length} richtig{right < questions.length && <button onClick={() => setAnswers(questions.map(() => null))}>Nochmal</button>}</p>}
  </section>;
}

function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return <p>{parts.map((p, i) => p.startsWith('**') ? <b key={i}>{p.slice(2, -2)}</b> : p)}</p>;
}

function LessonPage({ m }: { m: Ctx }) {
  const { id } = useParams();
  const lesson = id ? lessonById(id) : undefined;
  const idx = lesson ? LESSONS.indexOf(lesson) : -1;
  const mod = lesson ? MODULES.find(x => x.id === lesson.module) : undefined;
  useEffect(() => { window.scrollTo({ top: 0 }); if (lesson) document.title = `${lesson.title} — SAIF Basic Academy`; }, [lesson]);
  const markDone = useMemo(() => () => { if (lesson) void m.markDone(lesson.id); }, [lesson, m]);
  if (!lesson) return <Navigate to="/academy/lektionen" replace />;
  const locked = !m.hasAccess && !isFree(lesson);
  const prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
  const done = m.done.has(lesson.id);
  return <article className="ac-lesson">
    <Link to="/academy/lektionen" className="ac-back"><ArrowLeft size={16} />Alle Lektionen</Link>
    <span className="ac-kicker"><i /> {mod?.kicker} · {mod?.title.toUpperCase()}</span>
    <h1>{lesson.title}</h1><p className="ac-lead">{lesson.summary} · {lesson.minutes} Min.</p>
    {locked ? <section className="ac-card ac-locked-note"><Lock size={18} /><div><b>Diese Lektion ist nach deiner Einzahlung offen.</b><p>Modul 01 kannst du schon jetzt ansehen. Den Anmeldelink für dein Handelskonto bekommst du im Bot.</p></div><a className="ac-btn ac-btn-gold" href={BOT_URL} target="_blank" rel="noopener noreferrer">Zum Bot <Send size={15} /></a></section> : <>
      <LessonVideo lesson={lesson} />
      <section className="ac-card ac-objectives"><h2>Nach dieser Lektion …</h2><ul>{lesson.objectives.map(o => <li key={o}><Check size={16} />{o}</li>)}</ul></section>
      <section className="ac-body">{lesson.body.map(t => <Rich key={t} text={t} />)}</section>
      {lesson.tool && <ToolFor tool={lesson.tool} />}
      {lesson.quiz && <Quiz questions={lesson.quiz} onPassed={markDone} />}
      <div className="ac-done-row">{done ? <span className="ac-done"><CheckCircle2 size={18} />Erledigt</span> : <button className="ac-btn ac-btn-ghost" onClick={markDone}><Check size={16} />Als erledigt markieren</button>}</div>
    </>}
    <nav className="ac-pager" aria-label="Weitere Lektionen">
      {prev ? <Link to={`/academy/lektionen/${prev.id}`}><ArrowLeft size={16} /><span><small>Zurück</small>{prev.title}</span></Link> : <span />}
      {next ? <Link to={`/academy/lektionen/${next.id}`} className="is-next"><span><small>Weiter</small>{next.title}</span><ArrowRight size={16} /></Link> : <Link to="/academy" className="is-next"><span><small>Geschafft</small>Zur Übersicht</span><ArrowRight size={16} /></Link>}
    </nav>
  </article>;
}

function ToolsPage() {
  useEffect(() => { document.title = 'Rechner — SAIF Basic Academy'; }, []);
  return <div className="ac-tools-page"><span className="ac-kicker"><i /> RECHNER</span><h1>Rechnen statt schätzen.</h1><p className="ac-lead">Vor jedem Trade in zehn Sekunden: Positionsgröße, Risiko und was eine Verlustserie kostet.</p><LotCalc /><RRCalc /><StreakCalc /></div>;
}

function Glossary() {
  const [q, setQ] = useState('');
  const list = GLOSSARY.filter(g => (g.term + g.text).toLowerCase().includes(q.toLowerCase()));
  useEffect(() => { document.title = 'Glossar — SAIF Basic Academy'; }, []);
  return <div className="ac-glossary"><span className="ac-kicker"><i /> GLOSSAR</span><h1>Alle Begriffe aus der Gruppe.</h1>
    <input className="ac-search" value={q} onChange={e => setQ(e.target.value)} placeholder="Begriff suchen …" aria-label="Glossar durchsuchen" />
    <dl>{list.map(g => <div key={g.term}><dt>{g.term}</dt><dd>{g.text}</dd></div>)}</dl>
  </div>;
}

function AuthFrame({ children }: { children: ReactNode }) {
  return <div className="ac-page ac-center"><div className="ac-auth"><Mark />{children}</div><p className="ac-auth-foot"><Link to="/">Zur Website</Link> · <Link to="/impressum">Impressum</Link> · <Link to="/datenschutz">Datenschutz</Link></p></div>;
}

function Login() {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false); const [err, setErr] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'reset' | 'sent'>('login');
  useEffect(() => { document.title = 'Login — SAIF Basic Academy'; }, []);
  const login = async (e: FormEvent) => {
    e.preventDefault(); if (!cosmos) return; setBusy(true); setErr(null);
    const { error } = await cosmos.auth.signInWithPassword({ email: email.trim(), password: pw });
    setBusy(false); if (error) setErr('E-Mail oder Passwort stimmen nicht.');
  };
  const reset = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setErr(null);
    try { await fetch(`${COSMOS_URL}/functions/v1/password-reset`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), tenant: 'saif' }) }); setMode('sent'); }
    catch { setErr('Das hat gerade nicht geklappt. Versuch es gleich nochmal.'); } finally { setBusy(false); }
  };
  return <AuthFrame>
    {mode === 'sent' ? <><h1>Schau in dein Postfach.</h1><p>Wenn es zu dieser Adresse ein Konto gibt, bekommst du gleich einen Link, mit dem du dein Passwort festlegst.</p><button className="ac-link" onClick={() => setMode('login')}>Zurück zum Login</button></>
      : mode === 'reset' ? <form onSubmit={reset}><h1>Passwort festlegen.</h1><p>Gib die E-Mail-Adresse ein, mit der du beim Broker registriert bist. Du bekommst einen Link, mit dem du dein Passwort festlegst.</p>
        <label>E-Mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></label>
        {err && <p className="ac-error" role="alert">{err}</p>}
        <button className="ac-btn ac-btn-gold" disabled={busy}>{busy ? 'Einen Moment …' : 'Link schicken'} <ArrowRight size={16} /></button>
        <button type="button" className="ac-link" onClick={() => setMode('login')}>Zurück zum Login</button></form>
      : <form onSubmit={login}><h1>Willkommen zurück.</h1><p>Deine Basic Academy: Trades verstehen, sicher übernehmen, dazulernen.</p>
        {!cosmos && <p className="ac-error">Die Anmeldung ist gerade nicht verfügbar.</p>}
        <label>E-Mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></label>
        <label>Passwort<input type="password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" required /></label>
        {err && <p className="ac-error" role="alert">{err}</p>}
        <button className="ac-btn ac-btn-gold" disabled={busy || !cosmos}>{busy ? 'Einen Moment …' : 'Anmelden'} <ArrowRight size={16} /></button>
        <button type="button" className="ac-link" onClick={() => setMode('reset')}>Noch kein Passwort oder vergessen?</button>
        <p className="ac-auth-hint">Noch kein Zugang? Der Bot schaltet dich nach deiner Einzahlung frei und schickt dir deinen Zugangslink. <a href={BOT_URL} target="_blank" rel="noopener noreferrer">Zum Bot</a></p></form>}
  </AuthFrame>;
}

function NewPassword() {
  const [pw, setPw] = useState(''); const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false); const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();
  const save = async (e: FormEvent) => {
    e.preventDefault(); if (!cosmos) return;
    if (pw.length < 8) { setErr('Mindestens 8 Zeichen.'); return; }
    if (pw !== pw2) { setErr('Die Passwörter stimmen nicht überein.'); return; }
    setBusy(true); setErr(null);
    const { error } = await cosmos.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) setErr('Der Link ist abgelaufen oder wurde schon benutzt. Fordere unter „Passwort vergessen“ einen neuen an.');
    else nav('/academy', { replace: true });
  };
  return <AuthFrame><form onSubmit={save}><h1>Neues Passwort.</h1><p>Leg dein Passwort für die Basic Academy fest.</p>
    <label>Neues Passwort<input type="password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="new-password" required /></label>
    <label>Wiederholen<input type="password" value={pw2} onChange={e => setPw2(e.target.value)} autoComplete="new-password" required /></label>
    {err && <p className="ac-error" role="alert">{err}</p>}
    <button className="ac-btn ac-btn-gold" disabled={busy}>{busy ? 'Einen Moment …' : 'Speichern'} <ArrowRight size={16} /></button></form></AuthFrame>;
}
