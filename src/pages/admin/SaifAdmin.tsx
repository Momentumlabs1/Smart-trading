/**
 * /admin — Saifs eigener Bereich: Zahlen, alle Chats seines Bots, Website-Anfragen.
 *
 * Anmeldung nur mit Passwort (Slug 'saif' bestimmt das Konto, siehe partnerAuth).
 * Alles Weitere läuft über owner-gescopte RPCs im Cosmos-Backend: Saif sieht nur Leads von Tenant 'saif'.
 * Antworten im Chat gehen über den Bot (Outbox) und pausieren den Bot für diesen Lead, bis Saif ihn zurückgibt.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowUpRight, Bot, Check, Inbox, LogOut, MessageCircle, Pause, Play, RefreshCw, Search, Send, Users } from 'lucide-react';
import { cosmos, partnerAuth, rpc, TENANT } from '@/lib/cosmos';
import { demoRpc } from './demo-data';
import './saif-admin.css';

// Lokale Vorschau mit Beispieldaten: nur im Dev-Server und nur mit ?demo=1. Im Produktions-Build ist das false.
const DEMO = import.meta.env.DEV && new URLSearchParams(window.location.search).has('demo');
const api = <T,>(fn: string, args: Record<string, unknown>): Promise<T> => (DEMO ? Promise.resolve(demoRpc(fn) as T) : rpc<T>(fn, args));

type Lead = {
  id: string; first_name: string | null; telegram_username: string | null; telegram_user_id: number | string;
  source?: string | null; status: string | null; step?: string | null; experience?: string | null;
  deposit_usd: number | null; vip_granted_at: string | null; created_at: string;
  message_count: number; reply_count: number; last_message_at: string | null; bot_paused: boolean; last_text?: string | null; last_role?: string | null;
};
type Msg = { id: string; role: 'user' | 'assistant' | 'admin' | 'outbox'; content: string; created_at: string; pending?: boolean; error?: string | null };
type Inquiry = { id: number; created_at: string; topic: string; name: string; reach: string; message: string | null; context: string | null; page: string | null; status: string };
type Stats = {
  bot_starts: number; replied: number; deposits: number; deposits_usd: number; vip: number; inquiries: number; info_joins: number | null;
  by_source: { source: string; n: number }[]; per_day: { day: string; starts: number }[];
};

const num = (v: unknown) => (typeof v === 'number' ? v : Number(v ?? 0) || 0);
/** Formt die Antwort von partner_stats in eine feste Gestalt, auch wenn Felder fehlen. */
function normalizeStats(raw: Record<string, unknown> | null): Stats {
  const r = raw ?? {};
  const pick = (...k: string[]) => { for (const key of k) if (r[key] !== undefined && r[key] !== null) return r[key]; return undefined; };
  const bySrc = (pick('bot_starts_nach_quelle', 'by_source', 'bot_starts_by_source') as { source?: string; n?: number; count?: number }[] | Record<string, number> | undefined) ?? [];
  const perDay = (pick('pro_tag', 'per_day', 'days') as { tag?: string; day?: string; date?: string; starts?: number; bot_starts?: number }[] | undefined) ?? [];
  return {
    bot_starts: num(pick('bot_starts', 'starts')), replied: num(pick('leads_mit_antwort', 'replied', 'leads_replied')),
    deposits: num(pick('einzahlungen', 'deposits', 'deposits_n')), deposits_usd: num(pick('einzahlungen_usd', 'deposits_usd', 'deposit_usd')),
    vip: num(pick('vip_freigeschaltet', 'vip', 'vip_granted')), inquiries: num(pick('website_anfragen', 'inquiries', 'website_inquiries')),
    info_joins: pick('info_kanal_beitritte', 'info_joins') === undefined ? null : num(pick('info_kanal_beitritte', 'info_joins')),
    by_source: Array.isArray(bySrc) ? bySrc.map(s => ({ source: String(s.source ?? 'direkt'), n: num(s.n ?? s.count) })) : Object.entries(bySrc).map(([source, n]) => ({ source, n: num(n) })),
    per_day: perDay.map(d => ({ day: String(d.tag ?? d.day ?? d.date), starts: num(d.bot_starts ?? d.starts) })),
  };
}

const SOURCE_LABEL: Record<string, string> = { website: 'Website', web: 'Website', info: 'Info-Kanal', channel: 'Info-Kanal', tiktok: 'TikTok', instagram: 'Instagram', direkt: 'Direkt', direct: 'Direkt', null: 'Direkt' };
const sourceLabel = (s?: string | null) => (s ? SOURCE_LABEL[s.toLowerCase()] ?? s : 'Direkt');
const dt = (s: string) => new Date(s).toLocaleString('de-AT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
function ago(s: string | null) {
  if (!s) return '—';
  const m = Math.round((Date.now() - new Date(s).getTime()) / 60000);
  if (m < 1) return 'gerade eben'; if (m < 60) return `vor ${m} Min.`;
  const h = Math.round(m / 60); if (h < 24) return `vor ${h} Std.`;
  return `vor ${Math.round(h / 24)} T.`;
}
const STATUS_LABEL: Record<string, string> = { new: 'Neu', neu: 'Neu', started: 'Gestartet', qualified: 'Qualifiziert', pitched: 'Broker-Link geschickt', waiting: 'Wartet auf Einzahlung', deposited: 'Eingezahlt', vip: 'VIP', lost: 'Kein Interesse', optout: 'Abgemeldet' };
const statusLabel = (s: string | null) => (s ? STATUS_LABEL[s.toLowerCase()] ?? s : '—');
const leadName = (l: Lead) => l.first_name || (l.telegram_username ? `@${l.telegram_username}` : `ID ${l.telegram_user_id}`);
const usd = (n: number) => n.toLocaleString('de-AT', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function SaifAdmin() {
  const [state, setState] = useState<'checking' | 'out' | 'in'>('checking');
  useEffect(() => {
    document.title = 'Admin — SAIF Smart Trading';
    const meta = document.createElement('meta'); meta.name = 'robots'; meta.content = 'noindex, nofollow'; document.head.appendChild(meta);
    if (DEMO) { setState('in'); return () => meta.remove(); }
    if (!cosmos) { setState('out'); return () => meta.remove(); }
    cosmos.auth.getSession().then(({ data }) => setState(data.session ? 'in' : 'out'));
    const { data: sub } = cosmos.auth.onAuthStateChange((_e, session) => setState(session ? 'in' : 'out'));
    return () => { sub.subscription.unsubscribe(); meta.remove(); };
  }, []);
  if (state === 'checking') return <div className="sa-page sa-center"><RefreshCw className="sa-spin" size={20} /></div>;
  return state === 'in' ? <Dashboard /> : <Login />;
}

function Mark() {
  return <span className="sa-mark"><span className="sa-mono">s<span>/</span></span><span>SAIF<small>ADMIN</small></span></span>;
}

function Login() {
  const invite = new URLSearchParams(window.location.search).get('invite') ?? undefined;
  const [pw, setPw] = useState(''); const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false); const [err, setErr] = useState<string | null>(null);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr(null);
    if (invite && (pw.length < 10 || pw !== pw2)) { setErr(pw.length < 10 ? 'Mindestens 10 Zeichen.' : 'Die Passwörter stimmen nicht überein.'); return; }
    setBusy(true);
    try {
      await partnerAuth(invite ? 'accept' : 'login', { password: pw, token: invite });
      if (invite) window.history.replaceState(null, '', '/admin');
    } catch (x) { setErr(x instanceof Error && x.message !== 'Anmeldung fehlgeschlagen' ? x.message : 'Das hat nicht geklappt. Passwort prüfen.'); }
    finally { setBusy(false); }
  };
  return <div className="sa-page sa-center">
    <form className="sa-login" onSubmit={submit}>
      <Mark />
      <h1>{invite ? 'Willkommen, Saif.' : 'Dein Bereich.'}</h1>
      <p>{invite ? 'Leg dein Passwort fest. Danach kommst du hier jederzeit mit diesem Passwort rein.' : 'Chats, Zahlen und Anfragen rund um deine Gruppe.'}</p>
      {!cosmos && <p className="sa-error">Das Backend ist noch nicht verbunden.</p>}
      <label>Passwort<input type="password" value={pw} onChange={e => setPw(e.target.value)} autoComplete={invite ? 'new-password' : 'current-password'} autoFocus required /></label>
      {invite && <label>Passwort wiederholen<input type="password" value={pw2} onChange={e => setPw2(e.target.value)} autoComplete="new-password" required /></label>}
      {err && <p className="sa-error" role="alert">{err}</p>}
      <button className="sa-btn sa-btn-gold" disabled={busy || !cosmos}>{busy ? 'Einen Moment …' : invite ? 'Passwort speichern' : 'Anmelden'} <ArrowUpRight size={17} /></button>
    </form>
  </div>;
}

type Tab = 'overview' | 'chats' | 'inquiries';

function Dashboard() {
  // Die Meldungen in der Admin-Gruppe verlinken direkt auf einen Chat: /admin?lead=<id>
  const deepLead = new URLSearchParams(window.location.search).get('lead');
  const [tab, setTab] = useState<Tab>(deepLead ? 'chats' : 'overview');
  const [days, setDays] = useState(7);
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const results = await Promise.allSettled([
      api<Record<string, unknown>>('partner_stats', { p_slug: TENANT, p_days: days }),
      api<Lead[]>('partner_lead_overview', { p_slug: TENANT }),
      api<Inquiry[]>('partner_inquiries', { p_slug: TENANT }),
    ]);
    const [s, l, q] = results;
    if (s.status === 'fulfilled') setStats(normalizeStats(s.value));
    if (l.status === 'fulfilled') setLeads([...(l.value ?? [])].sort((a, b) => (b.last_message_at ?? b.created_at).localeCompare(a.last_message_at ?? a.created_at)));
    if (q.status === 'fulfilled') setInquiries(q.value ?? []);
    const failed = results.find(r => r.status === 'rejected') as PromiseRejectedResult | undefined;
    setErr(failed ? String(failed.reason?.message ?? failed.reason) : null);
  }, [days]);
  useEffect(() => { void load(); const t = window.setInterval(load, 20000); return () => window.clearInterval(t); }, [load]);

  const openInquiries = inquiries?.filter(i => i.status === 'neu').length ?? 0;
  return <div className="sa-page">
    <header className="sa-top">
      <Mark />
      <nav className="sa-tabs" aria-label="Bereiche">
        <button aria-current={tab === 'overview' ? 'page' : undefined} onClick={() => setTab('overview')}><Users size={16} />Übersicht</button>
        <button aria-current={tab === 'chats' ? 'page' : undefined} onClick={() => setTab('chats')}><MessageCircle size={16} />Chats{leads ? <em>{leads.length}</em> : null}</button>
        <button aria-current={tab === 'inquiries' ? 'page' : undefined} onClick={() => setTab('inquiries')}><Inbox size={16} />Anfragen{openInquiries ? <em className="is-new">{openInquiries}</em> : null}</button>
      </nav>
      <button className="sa-icon" onClick={() => cosmos?.auth.signOut()} aria-label="Abmelden" title="Abmelden"><LogOut size={17} /></button>
    </header>
    {err && <p className="sa-banner" role="status">Einige Daten konnten nicht geladen werden: {err}</p>}
    <main className="sa-main">
      {tab === 'overview' && <Overview stats={stats} days={days} setDays={setDays} leads={leads} onOpenChats={() => setTab('chats')} />}
      {tab === 'chats' && <Chats leads={leads} reload={load} initialLead={deepLead} />}
      {tab === 'inquiries' && <Inquiries items={inquiries} reload={load} />}
    </main>
  </div>;
}

function Overview({ stats, days, setDays, leads, onOpenChats }: { stats: Stats | null; days: number; setDays: (d: number) => void; leads: Lead[] | null; onOpenChats: () => void }) {
  const tiles: [string, string, string?][] = stats ? [
    ['Bot-Starts', String(stats.bot_starts)],
    ['Mit Antwort', String(stats.replied), stats.bot_starts ? `${Math.round((stats.replied / stats.bot_starts) * 100)} % der Starts` : undefined],
    ['Einzahlungen', String(stats.deposits), stats.deposits_usd ? usd(stats.deposits_usd) : undefined],
    ['VIP freigeschaltet', String(stats.vip)],
    ['Website-Anfragen', String(stats.inquiries)],
    ...(stats.info_joins !== null ? [['Info-Kanal neu', String(stats.info_joins)] as [string, string]] : []),
  ] : [];
  const maxSrc = Math.max(1, ...(stats?.by_source.map(s => s.n) ?? [1]));
  const maxDay = Math.max(1, ...(stats?.per_day.map(d => d.starts) ?? [1]));
  const recent = (leads ?? []).slice(0, 6);
  return <div className="sa-overview">
    <div className="sa-head-row">
      <div><span className="sa-kicker"><i /> DEINE GRUPPE</span><h1>Übersicht</h1></div>
      <div className="sa-seg" role="group" aria-label="Zeitraum">{[7, 30, 90].map(d => <button key={d} aria-pressed={days === d} onClick={() => setDays(d)}>{d} Tage</button>)}</div>
    </div>
    <section className="sa-tiles">
      {stats ? tiles.map(([label, value, sub]) => <div className="sa-tile" key={label}><span>{label}</span><strong>{value}</strong>{sub && <small>{sub}</small>}</div>)
        : Array.from({ length: 5 }, (_, i) => <div className="sa-tile sa-skel" key={i} />)}
    </section>
    <div className="sa-grid2">
      <section className="sa-card">
        <h2>Bot-Starts pro Tag</h2>
        {stats && stats.per_day.length ? <div className="sa-days" role="img" aria-label={`Bot-Starts pro Tag, letzte ${days} Tage`}>
          {stats.per_day.map(d => <div key={d.day} className="sa-day" title={`${new Date(d.day).toLocaleDateString('de-AT', { weekday: 'short', day: '2-digit', month: '2-digit' })}: ${d.starts} Starts`}>
            <i style={{ height: `${Math.max(d.starts ? 4 : 0, (d.starts / maxDay) * 100)}%` }} /></div>)}
        </div> : <p className="sa-empty">Noch keine Starts im Zeitraum.</p>}
        {stats && stats.per_day.length > 0 && <div className="sa-days-axis"><span>{new Date(stats.per_day[0].day).toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit' })}</span><span>heute</span></div>}
      </section>
      <section className="sa-card">
        <h2>Woher die Leute kommen</h2>
        {stats && stats.by_source.length ? <ul className="sa-sources">
          {stats.by_source.sort((a, b) => b.n - a.n).map(s => <li key={s.source}><span>{sourceLabel(s.source)}</span><div><i style={{ width: `${(s.n / maxSrc) * 100}%` }} /></div><b>{s.n}</b></li>)}
        </ul> : <p className="sa-empty">Noch keine Daten.</p>}
      </section>
    </div>
    <section className="sa-card">
      <div className="sa-card-head"><h2>Neueste Chats</h2><button className="sa-link" onClick={onOpenChats}>Alle Chats <ArrowUpRight size={15} /></button></div>
      {leads === null ? <p className="sa-empty">Lädt …</p> : recent.length ? <ul className="sa-mini-list">{recent.map(l => <li key={l.id}><span className="sa-avatar">{leadName(l).slice(0, 1).toUpperCase()}</span><div><b>{leadName(l)}</b><small>{l.last_text || stepLabel(l)}</small></div><time>{ago(l.last_message_at ?? l.created_at)}</time></li>)}</ul> : <p className="sa-empty">Noch keine Chats. Sobald jemand deinen Bot startet, erscheint er hier.</p>}
    </section>
  </div>;
}

function stepLabel(l: Lead) {
  if (l.vip_granted_at) return 'VIP freigeschaltet';
  if (num(l.deposit_usd) > 0) return `Eingezahlt: ${usd(num(l.deposit_usd))}`;
  return l.status ? statusLabel(l.status) : 'Bot gestartet';
}

function Chats({ leads, reload, initialLead }: { leads: Lead[] | null; reload: () => Promise<void>; initialLead?: string | null }) {
  const [q, setQ] = useState('');
  const [activeId, setActiveId] = useState<string | null>(initialLead ?? null);
  const [filter, setFilter] = useState<'alle' | 'offen' | 'eingezahlt' | 'pausiert'>('alle');
  const list = useMemo(() => (leads ?? []).filter(l => {
    if (filter === 'eingezahlt' && !(num(l.deposit_usd) > 0)) return false;
    if (filter === 'pausiert' && !l.bot_paused) return false;
    if (filter === 'offen' && (num(l.deposit_usd) > 0 || l.vip_granted_at)) return false;
    const s = q.trim().toLowerCase();
    return !s || [l.first_name, l.telegram_username, String(l.telegram_user_id)].some(v => v?.toLowerCase().includes(s));
  }), [leads, q, filter]);
  const active = leads?.find(l => l.id === activeId) ?? null;
  return <div className={`sa-chats${active ? ' has-active' : ''}`}>
    <aside className="sa-list">
      <div className="sa-search"><Search size={16} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Name oder @username" aria-label="Chats durchsuchen" /></div>
      <div className="sa-filter" role="group" aria-label="Filter">{(['alle', 'offen', 'eingezahlt', 'pausiert'] as const).map(f => <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f[0].toUpperCase() + f.slice(1)}</button>)}</div>
      {leads === null ? <p className="sa-empty">Lädt …</p> : list.length === 0 ? <p className="sa-empty">Keine Chats gefunden.</p> :
        <ul>{list.map(l => <li key={l.id}><button className={l.id === activeId ? 'is-active' : ''} onClick={() => setActiveId(l.id)}>
          <span className="sa-avatar">{leadName(l).slice(0, 1).toUpperCase()}</span>
          <span className="sa-list-main"><b>{leadName(l)}</b><small>{l.last_text ? `${l.last_role === 'user' ? '' : l.last_role === 'admin' ? 'Du: ' : 'Bot: '}${l.last_text}` : stepLabel(l)}</small>
            <span className="sa-chips">{l.source && <i>{sourceLabel(l.source)}</i>}{num(l.deposit_usd) > 0 && <i className="is-good">{usd(num(l.deposit_usd))}</i>}{l.vip_granted_at && <i className="is-good">VIP</i>}{l.bot_paused && <i className="is-warn">Du schreibst</i>}</span></span>
          <time>{ago(l.last_message_at ?? l.created_at)}</time>
        </button></li>)}</ul>}
    </aside>
    <section className="sa-thread">{active ? <Thread lead={active} onBack={() => setActiveId(null)} reload={reload} /> : <p className="sa-empty sa-thread-empty"><MessageCircle size={22} />Wähl links einen Chat aus.</p>}</section>
  </div>;
}

function Thread({ lead, onBack, reload }: { lead: Lead; onBack: () => void; reload: () => Promise<void> }) {
  const [msgs, setMsgs] = useState<Msg[] | null>(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const load = useCallback(async () => {
    try {
      const rows = await api<Record<string, unknown>[]>('partner_lead_messages', { p_lead_id: lead.id });
      setMsgs((rows ?? []).map(r => ({
        id: String(r.id), role: r.role as Msg['role'], content: String(r.content ?? ''), created_at: String(r.created_at),
        pending: r.pending === true, error: (r.error as string | null) ?? null,
      })).sort((a, b) => a.created_at.localeCompare(b.created_at)));
    } catch (x) { setErr(x instanceof Error ? x.message : String(x)); }
  }, [lead.id]);
  useEffect(() => { setMsgs(null); void load(); const t = window.setInterval(load, 8000); return () => window.clearInterval(t); }, [load]);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [msgs?.length]);
  const send = async (e: FormEvent) => {
    e.preventDefault(); if (!text.trim() || busy) return;
    setBusy(true); setErr(null);
    try { await api('partner_send', { p_lead_id: lead.id, p_text: text.trim() }); setText(''); await Promise.all([load(), reload()]); }
    catch (x) { setErr(x instanceof Error ? x.message : String(x)); } finally { setBusy(false); }
  };
  const togglePause = async () => {
    setBusy(true); setErr(null);
    try { await api('partner_set_paused', { p_lead_id: lead.id, p_paused: !lead.bot_paused }); await reload(); }
    catch (x) { setErr(x instanceof Error ? x.message : String(x)); } finally { setBusy(false); }
  };
  const tg = lead.telegram_username ? `https://t.me/${lead.telegram_username}` : `tg://user?id=${lead.telegram_user_id}`;
  return <>
    <div className="sa-thread-head">
      <button className="sa-icon sa-back" onClick={onBack} aria-label="Zurück zur Liste"><ArrowLeft size={18} /></button>
      <span className="sa-avatar">{leadName(lead).slice(0, 1).toUpperCase()}</span>
      <div><b>{leadName(lead)}</b><small>{lead.telegram_username ? `@${lead.telegram_username}` : `ID ${lead.telegram_user_id}`} · seit {dt(lead.created_at)}{lead.source ? ` · über ${sourceLabel(lead.source)}` : ''}</small></div>
      <div className="sa-thread-actions">
        <a className="sa-btn sa-btn-ghost" href={tg} target="_blank" rel="noopener noreferrer" title={lead.telegram_username ? undefined : 'Ohne @username öffnet das nur in der Telegram-App am Handy oder Desktop.'}>In Telegram öffnen <ArrowUpRight size={15} /></a>
        <button className={`sa-btn ${lead.bot_paused ? 'sa-btn-gold' : 'sa-btn-ghost'}`} onClick={togglePause} disabled={busy}>{lead.bot_paused ? <><Play size={14} />Bot wieder übernehmen lassen</> : <><Pause size={14} />Bot pausieren</>}</button>
      </div>
    </div>
    <div className="sa-facts">
      <span>Status <b>{statusLabel(lead.status)}</b></span>{lead.experience && <span>Erfahrung <b>{lead.experience}</b></span>}
      <span>Einzahlung <b>{num(lead.deposit_usd) > 0 ? usd(num(lead.deposit_usd)) : '—'}</b></span>
      <span>VIP <b>{lead.vip_granted_at ? `seit ${dt(lead.vip_granted_at)}` : 'nein'}</b></span>
    </div>
    <div className="sa-msgs" aria-live="polite">
      {msgs === null ? <p className="sa-empty">Lädt …</p> : msgs.length === 0 ? <p className="sa-empty">Noch keine Nachrichten.</p> :
        msgs.map(m => <div key={m.id} className={`sa-msg sa-msg-${m.role === 'user' ? 'in' : 'out'}${m.role === 'admin' || m.role === 'outbox' ? ' is-you' : ''}`}>
          <span className="sa-msg-who">{m.role === 'user' ? leadName(lead) : m.role === 'assistant' ? <><Bot size={12} /> Bot</> : 'Du'}</span>
          <p>{m.content}</p>
          <time>{dt(m.created_at)}{m.pending ? ' · wird gesendet …' : ''}{m.error ? ` · Fehler: ${m.error}` : ''}</time>
        </div>)}
      <div ref={end} />
    </div>
    <form className="sa-compose" onSubmit={send}>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={2} placeholder={lead.bot_paused ? 'Deine Nachricht …' : 'Deine Nachricht … (Bot pausiert dann hier)'} maxLength={4000}
        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) void send(e as unknown as FormEvent); }} />
      <button className="sa-btn sa-btn-gold" disabled={busy || !text.trim()} aria-label="Als Bot senden"><Send size={16} /><span>Senden</span></button>
    </form>
    {err && <p className="sa-error" role="alert">{err}</p>}
  </>;
}

const STATUS: { id: string; label: string }[] = [{ id: 'neu', label: 'Neu' }, { id: 'kontaktiert', label: 'Kontaktiert' }, { id: 'erledigt', label: 'Erledigt' }, { id: 'spam', label: 'Spam' }];

function Inquiries({ items, reload }: { items: Inquiry[] | null; reload: () => Promise<void> }) {
  const [err, setErr] = useState<string | null>(null);
  const setStatus = async (id: number, status: string) => {
    setErr(null);
    try { await api('partner_set_inquiry_status', { p_id: id, p_status: status }); await reload(); }
    catch (x) { setErr(x instanceof Error ? x.message : String(x)); }
  };
  const reachLink = (r: string) => r.startsWith('@') ? `https://t.me/${r.slice(1)}` : r.includes('@') ? `mailto:${r}` : /^[+\d][\d\s/-]{6,}$/.test(r) ? `https://wa.me/${r.replace(/[^\d]/g, '')}` : null;
  return <div className="sa-inquiries">
    <div className="sa-head-row"><div><span className="sa-kicker"><i /> VON DEINER WEBSITE</span><h1>Anfragen</h1></div></div>
    {err && <p className="sa-error" role="alert">{err}</p>}
    {items === null ? <p className="sa-empty">Lädt …</p> : items.length === 0 ? <p className="sa-empty">Noch keine Anfragen. Sie kommen über „Erstgespräch“ und „Kontakt“ auf deiner Website.</p> :
      <ul>{items.map(i => { const link = reachLink(i.reach); return <li key={i.id} className={`sa-card sa-inq is-${i.status}`}>
        <div className="sa-inq-top"><b>{i.name}</b><span className="sa-chips"><i>{i.topic}</i></span><time>{dt(i.created_at)}</time></div>
        <p className="sa-inq-reach">{link ? <a href={link} target="_blank" rel="noopener noreferrer">{i.reach} <ArrowUpRight size={13} /></a> : i.reach}</p>
        {i.context && <p className="sa-inq-ctx">{i.context}</p>}
        {i.message && <p className="sa-inq-msg">{i.message}</p>}
        <div className="sa-seg" role="group" aria-label="Status">{STATUS.map(s => <button key={s.id} aria-pressed={i.status === s.id} onClick={() => setStatus(i.id, s.id)}>{i.status === s.id && <Check size={13} />}{s.label}</button>)}</div>
      </li>; })}</ul>}
  </div>;
}
