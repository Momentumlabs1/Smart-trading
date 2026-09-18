// Anfragen von der SAIF-Website (Erstgespräch, Zugang, Kontakt).
// Leitet an submit_website_inquiry() im Cosmos-Supabase weiter: speichert die Anfrage und meldet sie
// in die Admin-Telegram-Gruppe. Der Publishable Key ist öffentlich; der Bot-Token bleibt in der Datenbank.

const LEADS_URL = process.env.LEADS_SUPABASE_URL || 'https://qrgvltpakkubtkeukypa.supabase.co';
const LEADS_KEY = process.env.LEADS_SUPABASE_KEY || '';
const TENANT = 'saif';

// eslint-disable-next-line no-control-regex -- Steuerzeichen sollen gezielt entfernt werden
const CONTROL = /[\x00-\x1f\x7f]/g;
// eslint-disable-next-line no-control-regex
const CONTROL_KEEP_NEWLINE = /[\x00-\x09\x0b-\x1f\x7f]/g;

const clean = (v: unknown, max: number, lines = false) =>
  typeof v === 'string' ? v.replace(lines ? CONTROL_KEEP_NEWLINE : CONTROL, ' ').trim().slice(0, max) : '';

type Req = { method?: string; body?: unknown };
type Res = { status: (code: number) => { json: (body: unknown) => void } };

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  let body: Record<string, unknown> = {};
  try { body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body as Record<string, unknown>) || {}; } catch { return res.status(400).json({ ok: false }); }
  if (clean(body.website, 200)) return res.status(200).json({ ok: true }); // Honeypot: Bots bekommen ein stilles Ok

  if (!LEADS_KEY) return res.status(503).json({ ok: false });
  const name = clean(body.name, 80), reach = clean(body.reach, 120);
  if (name.length < 2 || reach.length < 4) return res.status(400).json({ ok: false });

  try {
    const r = await fetch(`${LEADS_URL}/rest/v1/rpc/submit_website_inquiry`, {
      method: 'POST',
      headers: { apikey: LEADS_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        p_tenant: TENANT,
        p_topic: clean(body.topic, 80) || 'Kontakt',
        p_name: name,
        p_reach: reach,
        p_message: clean(body.message, 1500, true),
        p_context: clean(body.context, 400),
        p_page: clean(body.page, 80),
      }),
    });
    const stored = r.ok && (await r.json()) === true;
    if (!r.ok) console.error('submit_website_inquiry', r.status, await r.text());
    return res.status(stored ? 200 : 503).json({ ok: stored });
  } catch (e) {
    console.error('submit_website_inquiry', e);
    return res.status(503).json({ ok: false });
  }
}
