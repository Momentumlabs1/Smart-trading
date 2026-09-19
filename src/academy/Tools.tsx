// Rechner für den Alltag in der Gruppe: Positionsgröße, Risiko/Ziel, Verlustserie.
// Alles rechnet lokal im Browser; es wird nichts gespeichert oder gesendet.
import { useMemo, useState } from 'react';
import { PIP_VALUE_PER_LOT, type ToolKey } from './data';

const de = (n: number, d = 2) => n.toLocaleString('de-AT', { minimumFractionDigits: d, maximumFractionDigits: d });
const usd = (n: number) => `${de(n, 2)} $`;
/** Liest „4.342,50“, „4342,50“, „4342.50“ und „1.000“ gleichermaßen. */
const parse = (v: string) => {
  const s = String(v).trim().replace(/\s/g, '');
  if (s.includes(',')) return Number(s.replace(/\./g, '').replace(',', '.'));
  if (/^\d{1,3}(\.\d{3})+$/.test(s)) return Number(s.replace(/\./g, ''));
  return Number(s);
};

function Field({ label, value, onChange, suffix, hint }: { label: string; value: string; onChange: (v: string) => void; suffix?: string; hint?: string }) {
  return <label className="ac-field"><span>{label}</span><div><input inputMode="decimal" value={value} onChange={e => onChange(e.target.value)} />{suffix && <em>{suffix}</em>}</div>{hint && <small>{hint}</small>}</label>;
}

export function LotCalc() {
  const [balance, setBalance] = useState('1000');
  const [risk, setRisk] = useState('1');
  const [sl, setSl] = useState('40');
  const r = useMemo(() => {
    const b = parse(balance), p = parse(risk), s = parse(sl);
    if (!(b > 0 && p > 0 && s > 0)) return null;
    const riskUsd = (b * p) / 100;
    const raw = riskUsd / (s * PIP_VALUE_PER_LOT);
    const lots = Math.floor(raw * 100) / 100;
    const real = lots * s * PIP_VALUE_PER_LOT;
    return { riskUsd, lots, real, tooSmall: lots < 0.01 };
  }, [balance, risk, sl]);
  return <div className="ac-tool">
    <div className="ac-tool-head"><span className="ac-kicker"><i /> RECHNER</span><h3>Positionsgröße für Gold</h3><p>Wie viel Lot passt zu deinem Konto und dem Stop Loss aus der Nachricht?</p></div>
    <div className="ac-fields">
      <Field label="Kontostand" value={balance} onChange={setBalance} suffix="$" />
      <Field label="Risiko pro Trade" value={risk} onChange={setRisk} suffix="%" hint="Üblich: 1–2 %" />
      <Field label="Abstand zum Stop Loss" value={sl} onChange={setSl} suffix="Pips" hint="1 $ Goldpreis = 10 Pips" />
    </div>
    <div className="ac-result" aria-live="polite">
      {!r ? <p>Bitte alle Felder mit Zahlen füllen.</p> : r.tooSmall
        ? <p><b>Unter 0,01 Lot.</b> Mit diesem Konto und Stop ist selbst die kleinste Position größer als dein Risiko ({usd(r.riskUsd)}). Warte auf einen engeren Stop oder riskiere diesen Trade nicht.</p>
        : <><div><span>Deine Positionsgröße</span><strong>{de(r.lots)} Lot</strong></div><div><span>Verlust, wenn der Stop greift</span><strong>{usd(r.real)}</strong></div><div><span>Geplantes Risiko</span><strong>{usd(r.riskUsd)}</strong></div></>}
    </div>
    <p className="ac-note">Annahme: Konto in US-Dollar, 1,00 Lot = 100 Unzen (1 Pip ≈ 10 $). Kosten wie Spread sind nicht eingerechnet. Prüf die Kontraktgröße einmal in MetaTrader.</p>
  </div>;
}

export function RRCalc() {
  const [side, setSide] = useState<'BUY' | 'SELL'>('SELL');
  const [entry, setEntry] = useState('4342,50');
  const [sl, setSl] = useState('4346,50');
  const [tp, setTp] = useState('4334,50');
  const [lots, setLots] = useState('0,02');
  const r = useMemo(() => {
    const e = parse(entry), s = parse(sl), t = parse(tp), l = parse(lots);
    if (!(e > 0 && s > 0 && t > 0 && l > 0)) return null;
    const riskPts = side === 'BUY' ? e - s : s - e;
    const rewardPts = side === 'BUY' ? t - e : e - t;
    if (riskPts <= 0) return { err: side === 'BUY' ? 'Bei BUY muss der Stop Loss unter dem Einstieg liegen.' : 'Bei SELL muss der Stop Loss über dem Einstieg liegen.' };
    if (rewardPts <= 0) return { err: side === 'BUY' ? 'Bei BUY muss das Ziel über dem Einstieg liegen.' : 'Bei SELL muss das Ziel unter dem Einstieg liegen.' };
    const riskPips = riskPts * 10, rewardPips = rewardPts * 10;
    return { riskPips, rewardPips, ratio: rewardPts / riskPts, riskUsd: riskPips * PIP_VALUE_PER_LOT * l, rewardUsd: rewardPips * PIP_VALUE_PER_LOT * l };
  }, [side, entry, sl, tp, lots]);
  return <div className="ac-tool">
    <div className="ac-tool-head"><span className="ac-kicker"><i /> RECHNER</span><h3>Risiko und Ziel eines Trades</h3><p>Trag die Werte aus der Nachricht ein und sieh sofort, was auf dem Spiel steht.</p></div>
    <div className="ac-seg" role="group" aria-label="Richtung">{(['BUY', 'SELL'] as const).map(s => <button key={s} aria-pressed={side === s} onClick={() => setSide(s)}>{s}</button>)}</div>
    <div className="ac-fields ac-fields-4">
      <Field label="Einstieg" value={entry} onChange={setEntry} />
      <Field label="Stop Loss" value={sl} onChange={setSl} />
      <Field label="Ziel (TP)" value={tp} onChange={setTp} />
      <Field label="Deine Lot-Größe" value={lots} onChange={setLots} suffix="Lot" />
    </div>
    <div className="ac-result" aria-live="polite">
      {!r ? <p>Bitte alle Felder mit Zahlen füllen.</p> : 'err' in r ? <p><b>Prüf die Werte:</b> {r.err}</p> : <>
        <div><span>Stop Loss</span><strong>{de(r.riskPips, 0)} Pips · −{usd(r.riskUsd!)}</strong></div>
        <div><span>Ziel</span><strong>{de(r.rewardPips, 0)} Pips · +{usd(r.rewardUsd!)}</strong></div>
        <div><span>Verhältnis Risiko zu Ziel</span><strong>1 : {de(r.ratio!, 1)}</strong></div>
      </>}
    </div>
    <p className="ac-note">Rechenbeispiel ohne Spread und Kommission. Ob ein Ziel erreicht wird, steht nie fest.</p>
  </div>;
}

export function StreakCalc() {
  const [risk, setRisk] = useState('1');
  const [n, setN] = useState('5');
  const r = useMemo(() => {
    const p = parse(risk) / 100, k = Math.min(30, Math.max(1, Math.round(parse(n))));
    if (!(p > 0 && p < 1) || !k) return null;
    const rows = Array.from({ length: k }, (_, i) => ({ i: i + 1, left: Math.pow(1 - p, i + 1) * 100 }));
    const compare = [1, 2, 5, 10].map(x => ({ x, left: Math.pow(1 - x / 100, k) * 100 }));
    return { rows, compare, k };
  }, [risk, n]);
  return <div className="ac-tool">
    <div className="ac-tool-head"><span className="ac-kicker"><i /> RECHNER</span><h3>Was eine Verlustserie kostet</h3><p>So viel bleibt von deinem Konto nach mehreren Stops hintereinander.</p></div>
    <div className="ac-fields">
      <Field label="Risiko pro Trade" value={risk} onChange={setRisk} suffix="%" />
      <Field label="Verluste hintereinander" value={n} onChange={setN} />
    </div>
    {r && <div className="ac-result ac-streak" aria-live="polite">
      <div className="ac-bars" role="img" aria-label={`Kontostand nach ${r.k} Verlusten`}>{r.rows.map(x => <span key={x.i} title={`Nach ${x.i} Verlust${x.i > 1 ? 'en' : ''}: ${de(x.left, 1)} %`}><i style={{ height: `${x.left}%` }} /></span>)}</div>
      <p>Nach {r.k} Verlusten hast du noch <b>{de(r.rows[r.rows.length - 1].left, 1)} %</b> deines Kontos.</p>
      <ul className="ac-compare">{r.compare.map(c => <li key={c.x}><span>{c.x} % Risiko</span><b>{de(c.left, 1)} %</b></li>)}</ul>
    </div>}
    <p className="ac-note">Vereinfachte Rechnung: gleiches Risiko in Prozent vom jeweils aktuellen Kontostand.</p>
  </div>;
}

export function ToolFor({ tool }: { tool: ToolKey }) {
  if (tool === 'lots') return <LotCalc />;
  if (tool === 'rr') return <RRCalc />;
  return <StreakCalc />;
}
