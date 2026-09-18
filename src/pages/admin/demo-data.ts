// Nur für die lokale Vorschau (npm run dev, /admin?demo=1). Wird im Produktions-Build nicht geladen.
const now = Date.now();
const iso = (minAgo: number) => new Date(now - minAgo * 60000).toISOString();

const leads = [
  { id: 'd1', first_name: 'Lukas', telegram_username: 'lukas_trades', telegram_user_id: 1001, source: 'website', status: 'pitched', deposit_usd: 0, vip_granted_at: null, created_at: iso(300), message_count: 9, reply_count: 4, last_message_at: iso(12), bot_paused: false, last_text: 'Wie viel sollte ich am Anfang einzahlen?' },
  { id: 'd2', first_name: 'Selin', telegram_username: null, telegram_user_id: 1002, source: 'tiktok', status: 'deposited', deposit_usd: 250, vip_granted_at: iso(90), created_at: iso(1400), message_count: 14, reply_count: 6, last_message_at: iso(95), bot_paused: false, last_text: 'Danke, bin drin!' },
  { id: 'd3', first_name: 'Marko', telegram_username: 'marko_linz', telegram_user_id: 1003, source: 'info', status: 'waiting', deposit_usd: 0, vip_granted_at: null, created_at: iso(2000), message_count: 5, reply_count: 2, last_message_at: iso(600), bot_paused: true, last_text: 'Ich ruf dich morgen an.' },
];
const messages = [
  { id: 'm1', role: 'user', content: 'Hey, ich hab dein Video auf der Website gesehen.', created_at: iso(40) },
  { id: 'm2', role: 'assistant', content: 'Hey Lukas, schön, dass du da bist! Hast du schon Erfahrung mit Trading?', created_at: iso(39) },
  { id: 'm3', role: 'user', content: 'Ein bisschen, aber noch nichts Ernstes.', created_at: iso(20) },
  { id: 'm4', role: 'user', content: 'Wie viel sollte ich am Anfang einzahlen?', created_at: iso(12) },
];

export function demoRpc(fn: string): unknown {
  if (fn === 'partner_stats') return {
    seit: iso(7 * 1440), bot_starts: 42, leads_mit_antwort: 27, einzahlungen: 6, einzahlungen_usd: 1850, vip_freigeschaltet: 5, website_anfragen: 3, info_kanal_beitritte: null,
    bot_starts_nach_quelle: { tiktok: 21, website: 12, direkt: 9 },
    pro_tag: Array.from({ length: 7 }, (_, i) => ({ tag: new Date(now - (6 - i) * 86400000).toISOString().slice(0, 10), bot_starts: [3, 5, 2, 8, 6, 11, 7][i], einzahlungen: 0, website_anfragen: 0 })),
  };
  if (fn === 'partner_lead_overview') return leads;
  if (fn === 'partner_lead_messages') return messages;
  if (fn === 'partner_inquiries') return [
    { id: 1, created_at: iso(180), topic: 'Erstgespräch', name: 'Anna', reach: '@anna_k', message: 'Ich würde gern wissen, wie viel Zeit ich pro Tag brauche.', context: 'Einsteiger · Ziel: Mir etwas nebenbei aufbauen', page: '/', status: 'neu' },
    { id: 2, created_at: iso(3000), topic: 'Kontakt', name: 'Deniz', reach: 'deniz@example.com', message: null, context: null, page: '/signale', status: 'kontaktiert' },
  ];
  return null;
}
