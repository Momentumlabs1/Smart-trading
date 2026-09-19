// Angemeldetes Mitglied (momentum-hq): Sitzung, members-Zeile und Lernfortschritt.
// Alles RLS-gescopt: members über auth_user_id, lesson_progress nur eigene Zeilen.
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { cosmos } from '@/lib/cosmos';

export interface Member {
  id: string; name: string; email: string; deposit: number; active: boolean; accessRevoked: boolean;
  tierOverride: string | null; referredBy: string | null; joinedAt: string | null;
}

export const DEMO = import.meta.env.DEV && typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('demo');
const DEMO_LOCKED = DEMO && new URLSearchParams(window.location.search).get('demo') === 'gesperrt';
const DEMO_MEMBER: Member = { id: 'demo', name: 'Lukas', email: 'demo@saif.test', deposit: DEMO_LOCKED ? 0 : 250, active: true, accessRevoked: false, tierOverride: null, referredBy: 'saif', joinedAt: new Date().toISOString() };

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (DEMO) { setReady(true); return; }
    if (!cosmos) { setReady(true); return; }
    cosmos.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = cosmos.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  return { session, ready, signedIn: DEMO || !!session };
}

export function useMember(signedIn: boolean) {
  const [member, setMember] = useState<Member | null>(DEMO ? DEMO_MEMBER : null);
  const [done, setDone] = useState<Set<string>>(new Set(DEMO ? ['saif-01'] : []));
  const [loaded, setLoaded] = useState(DEMO);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (DEMO || !cosmos || !signedIn) return;
    const { data: u } = await cosmos.auth.getUser();
    if (!u.user) { setLoaded(true); return; }
    const { data, error: e } = await cosmos.from('members')
      .select('id, name, email, deposit, active, access_revoked, tier_override, referred_by_tenant, joined_at')
      .eq('auth_user_id', u.user.id).maybeSingle();
    if (e) setError(e.message);
    if (data) {
      setMember({
        id: String(data.id), name: String(data.name ?? ''), email: String(data.email ?? u.user.email ?? ''),
        deposit: Number(data.deposit ?? 0), active: data.active !== false, accessRevoked: data.access_revoked === true,
        tierOverride: (data.tier_override as string | null) ?? null, referredBy: (data.referred_by_tenant as string | null) ?? null,
        joinedAt: (data.joined_at as string | null) ?? null,
      });
      const { data: prog } = await cosmos.from('lesson_progress').select('lesson_id').eq('member_id', data.id);
      setDone(new Set((prog ?? []).map(p => String(p.lesson_id))));
    }
    setLoaded(true);
  }, [signedIn]);
  useEffect(() => { void load(); }, [load]);

  // Der Updater von setState läuft erst beim Rendern; ob die Lektion neu ist, entscheidet deshalb ein Ref.
  const doneRef = useRef(done);
  doneRef.current = done;
  const markDone = useCallback(async (lessonId: string) => {
    if (doneRef.current.has(lessonId)) return;
    const next = new Set(doneRef.current).add(lessonId);
    doneRef.current = next; setDone(next);
    if (DEMO || !cosmos || !member) return;
    const { error: e } = await cosmos.from('lesson_progress').upsert({ member_id: member.id, lesson_id: lessonId }, { onConflict: 'member_id,lesson_id', ignoreDuplicates: true });
    if (e) setError(e.message);
  }, [member]);

  /** Zugang: eingezahlt (oder Freibrief) und nicht gesperrt. */
  const hasAccess = !!member && member.active && !member.accessRevoked && (member.deposit > 0 || !!member.tierOverride);
  return { member, done, loaded, error, markDone, hasAccess, reload: load };
}
