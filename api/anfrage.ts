// Anfragen von der SAIF-Website (Erstgespräch, Zugang, Kontakt).
// Speichert in Supabase (website_inquiries) und/oder meldet in eine Telegram-Admin-Gruppe.
// Beides ist per Umgebungsvariable schaltbar; ohne beides antwortet die Funktion 503 und die Seite bietet Kopieren/E-Mail an.

// eslint-disable-next-line no-control-regex -- Steuerzeichen sollen gezielt entfernt werden
const CONTROL = /[\x00-\x1f\x7f]/g;
// eslint-disable-next-line no-control-regex
const CONTROL_KEEP_NEWLINE = /[\x00-\x09\x0b-\x1f\x7f]/g;

const clean = (v: unknown, max: number, lines = false) =>
  typeof v === 'string' ? v.replace(lines ? CONTROL_KEEP_NEWLINE : CONTROL, ' ').trim().slice(0, max) : '';

type Req = { method?: string; body?: unknown; headers?: Record<string, string | string[] | undefined> };
type Res = { status: (code: number) => { json: (body: unknown) => void } };

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  let body: Record<string, unknown> = {};
  try { body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body as Record<string, unknown>) || {}; } catch { return res.status(400).json({ ok: false }); }
  if (clean(body.website, 200)) return res.status(200).json({ ok: true }); // Honeypot: Bots bekommen ein stilles Ok

  const lead = {
    tenant_slug: 'saif-smart-trading',
    topic: clean(body.topic, 80) || 'Kontakt',
    name: clean(body.name, 80),
    reach: clean(body.reach, 120),
    message: clean(body.message, 1500, true),
    context: clean(body.context, 400),
    page: clean(body.page, 80),
    user_agent: clean(req.headers?.['user-agent'], 200),
  };
  if (lead.name.length < 2 || lead.reach.length < 4) return res.status(400).json({ ok: false });

  let stored = false, notified = false;
  const url = process.env.LEADS_SUPABASE_URL, key = process.env.LEADS_SUPABASE_SERVICE_KEY;
  if (url && key) {
    try {
      const r = await fetch(`${url}/rest/v1/website_inquiries`, {
        method: 'POST',
        headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(lead),
      });
      stored = r.ok;
      if (!r.ok) console.error('website_inquiries', r.status, await r.text());
    } catch (e) { console.error('website_inquiries', e); }
  }
  const bot = process.env.NOTIFY_TELEGRAM_BOT_TOKEN, chat = process.env.NOTIFY_TELEGRAM_CHAT_ID;
  if (bot && chat) {
    const text = ['🟡 Neue Anfrage · SAIF-Website', `Thema: ${lead.topic}`, `Name: ${lead.name}`, `Erreichbar: ${lead.reach}`,
      lead.context && `Funnel: ${lead.context}`, lead.message && `Nachricht: ${lead.message}`, `Seite: ${lead.page}`].filter(Boolean).join('\n');
    try {
      const r = await fetch(`https://api.telegram.org/bot${bot}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
      });
      notified = r.ok;
      if (!r.ok) console.error('telegram', r.status, await r.text());
    } catch (e) { console.error('telegram', e); }
  }
  if (!stored && !notified) return res.status(503).json({ ok: false });
  return res.status(200).json({ ok: true, stored, notified });
}
