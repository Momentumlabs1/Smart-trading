import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, BookOpen, Check, ChevronRight, Maximize2, MousePointer2, Send, X } from 'lucide-react';
import './journey-preview.css';

// Shared illustrative values, never live quotes or a claimed historical SAIF trade.
// Order semantics: https://www.metatrader5.com/en/terminal/help/trading/general_concept
const fields = [
  { label: 'Einstieg', value: '4.342,50', text: 'Der Einstieg beschreibt den vorgesehenen Preis oder Bereich. Prüfe die genaue Anweisung und den aktuellen Kurs, bevor du einen Trade übernimmst.', orderText: 'Prüfe zuerst Kurs und Orderart: Eine Marktorder wird zum verfügbaren Kurs ausgeführt. Bei einer Pending Order legst du eine Preisbedingung fest. Die Einstiegsangabe ist kein zugesicherter Ausführungspreis.' },
  { label: 'Stop Loss', value: '4.346,50', text: 'Der Stop Loss bezeichnet die vorgesehene Ausstiegsmarke bei einem ungünstigen Verlauf. Er ist keine Garantie für einen bestimmten Ausführungspreis.', orderText: 'Die Stop-Loss-Angabe gehört in das entsprechende Feld deiner Order. Gleiche Instrument, Richtung und Wert mit der Nachricht ab. Positionsgröße und Risiko bestimmst du selbst.' },
  { label: 'Ziel', value: '4.334,50', text: 'Das Ziel beschreibt den geplanten Ausstieg bei günstigem Verlauf. Ob der Markt diesen Preis erreicht, steht nicht fest.', orderText: 'Die Zielangabe gehört in das Take-Profit-Feld deiner Order. Gleiche Instrument, Richtung und Wert mit der Nachricht ab. Positionsgröße und Risiko bestimmst du selbst.' },
];
const previews = [
  { title: 'Eine Nachricht. Die Angaben.', caption: 'Trade-Nachricht', badge: 'Formatbeispiel', icon: Send },
  { title: 'Von der Nachricht in deine Order.', caption: 'Selbst übernehmen', badge: 'Ablaufbeispiel', icon: MousePointer2 },
  { title: 'Ein Blick in die Lerninhalte.', caption: 'Basic Academy', badge: 'Lernvorschau', icon: BookOpen },
];

function MessagePreview() {
  return <div className="jp-message-view">
    <div className="jp-message-avatar" aria-hidden="true">s/</div>
    <div className="jp-message-bubble">
      <div className="jp-message-meta"><strong>Trade-Nachricht</strong><Send size={12} /></div>
      <div className="jp-instrument"><strong>XAUUSD</strong><span>SELL</span><small>Gold / US-Dollar</small></div>
      <div className="jp-levels">{fields.map(field => <div key={field.label}><span>{field.label}</span><strong>{field.value}</strong></div>)}</div>
    </div>
  </div>;
}

function OrderPreview({ selected = -1 }: { selected?: number }) {
  return <div className="jp-order-view">
    <div className="jp-order-head"><span>TRADE-NACHRICHT</span><ArrowRight size={14}/><span>DEINE ORDER</span></div>
    {fields.map((field, i) => <div className={`jp-order-row${selected === i ? ' is-highlighted' : ''}`} key={field.label}>
      <span><small>{field.label}</small><strong>{field.value}</strong></span><ArrowRight size={13}/><span><small>{i === 0 ? 'Kurs / Orderart' : field.label}</small><strong>{i === 0 ? 'Prüfen' : field.value}</strong>{i === 0 ? <MousePointer2 size={12}/> : <Check size={12}/>}</span>
    </div>)}
  </div>;
}

function AcademyPreview() {
  return <div className="jp-academy-view">
    <div className="jp-lesson-cover"><span>01 / LERNVORSCHAU</span><strong>Einen Trade<br/>lesen lernen.</strong><div><span>Einstieg</span><span>Stop Loss</span><span>Ziel</span></div></div>
    <div className="jp-lesson-list"><span>DEINE LERNTHEMEN</span>{['Nachricht verstehen', 'Trade übernehmen', 'Updates einordnen'].map((title, i) => <div className={i === 0 ? 'is-current' : ''} key={title}><small>0{i+1}</small><span>{title}</span><ChevronRight size={11}/></div>)}</div>
  </div>;
}

/** Small honest previews; the expanded view adds detail without crowding the scroll stage. */
export default function JourneyPreview({ index }: { index: number }) {
  const [field, setField] = useState(0);
  const meta = previews[index];
  const Icon = meta.icon;
  return <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className={`jp-preview jp-preview-${index}`} aria-label={`${meta.caption}: Vorschau vergrößern`}>
        <span className="jp-preview-heading"><span><Icon size={13}/>{meta.caption}</span><span>{meta.badge}<Maximize2 size={12}/></span></span>
        <div className="jp-preview-content" aria-hidden="true">{index === 0 ? <MessagePreview/> : index === 1 ? <OrderPreview/> : <AcademyPreview/>}</div>
        <span className="jp-preview-footer"><span>{index === 0 ? 'Beispielwerte · kein aktueller Trade' : index === 1 ? 'Die Angaben überträgst du selbst.' : 'Öffne eine kurze, interaktive Lernvorschau.'}</span><ArrowRight size={13}/></span>
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="jp-overlay"/>
      <Dialog.Content className="jp-dialog" onOpenAutoFocus={() => setField(0)}>
        <Dialog.Close className="jp-close" aria-label="Vorschau schließen"><X size={21}/></Dialog.Close>
        <span className="jp-dialog-eyebrow"><Icon size={15}/>{meta.badge}</span>
        <Dialog.Title>{meta.title}</Dialog.Title>
        <Dialog.Description>{index === 0 ? 'So sind Instrument, Richtung und Preisangaben in einer Trade-Nachricht zugeordnet. Dies ist ein Formatbeispiel, kein Original-Screenshot.' : index === 1 ? 'Du prüfst die Nachricht und trägst die Angaben in deiner Handelsplattform ein. Wähle einen Bestandteil, um die Zuordnung zu sehen.' : 'Lerne die drei Angaben einer Trade-Nachricht kennen. Wähle einen Begriff und sieh, was er bedeutet.'}</Dialog.Description>
        <div className={`jp-dialog-example jp-example-${index}`}>{index === 0 ? <MessagePreview/> : index === 1 ? <OrderPreview selected={field}/> : <AcademyPreview/>}</div>
        {index > 0 && <><div className="jp-field-buttons" role="group" aria-label="Bestandteil auswählen">{fields.map((item, i) => <button key={item.label} aria-pressed={field === i} onClick={() => setField(i)}>{item.label}</button>)}</div><div className="jp-field-explanation" aria-live="polite"><strong>{fields[field].label}</strong><p>{index === 2 ? fields[field].text : fields[field].orderText}</p></div></>}
        <div className="jp-example-note">{index === 2 ? 'Diese Lernvorschau ist ein erster Einblick, kein vollständiger Kurs.' : 'Illustrative Beispielwerte. Es wird kein Trade kopiert oder ausgeführt.'}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
