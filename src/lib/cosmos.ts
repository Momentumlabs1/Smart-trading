// Verbindung zum Cosmos-Backend (momentum-hq), in dem Saifs Bot, Leads und Anfragen liegen.
// Getrennt vom alten Academy-Supabase: eigener Speicher-Schlüssel, damit sich die Sitzungen nicht in die Quere kommen.
import { createClient } from '@supabase/supabase-js';

export const COSMOS_URL = import.meta.env.VITE_COSMOS_SUPABASE_URL || 'https://qrgvltpakkubtkeukypa.supabase.co';
const COSMOS_KEY = import.meta.env.VITE_COSMOS_SUPABASE_KEY || '';
export const TENANT = 'saif';

export const cosmos = COSMOS_KEY
  ? createClient(COSMOS_URL, COSMOS_KEY, { auth: { storageKey: 'saif-admin-auth', persistSession: true, autoRefreshToken: true } })
  : null;

/** Anmeldung über die partner-admin-Funktion: der Slug bestimmt das Konto, der Browser sieht nie eine E-Mail. */
export async function partnerAuth(action: 'login' | 'accept', payload: { password: string; token?: string }) {
  const res = await fetch(`${COSMOS_URL}/functions/v1/partner-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, slug: TENANT, ...payload }),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string; session?: { access_token: string; refresh_token: string } };
  if (!res.ok || !data.session) throw new Error(data.error || 'Anmeldung fehlgeschlagen');
  if (!cosmos) throw new Error('Backend nicht konfiguriert');
  const { error } = await cosmos.auth.setSession(data.session);
  if (error) throw error;
}

/** RPC-Aufruf mit lesbarer Fehlermeldung. */
export async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  if (!cosmos) throw new Error('Backend nicht konfiguriert');
  const call = cosmos.rpc.bind(cosmos) as unknown as (f: string, a: Record<string, unknown>) => Promise<{ data: T; error: { message: string } | null }>;
  const { data, error } = await call(fn, args);
  if (error) throw new Error(error.message);
  return data;
}
