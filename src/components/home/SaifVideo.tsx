import { useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const clips = [
  { title: 'Hi, ich bin Saif.', label: 'Die Begrüßung', file: 'saif-v1-begruessung.mp4', time: '0:19' },
  { title: 'Meine Geschichte.', label: 'Saif kennenlernen', file: 'saif-v2a-story.mp4', time: '1:27' },
  { title: 'Direkt zum Punkt.', label: 'Der schnelle Einstieg', file: 'saif-v2b-direkt.mp4', time: '0:11' },
];

export function SaifVideo({ open, onOpenChange, initialClip = 0, returnFocus }: {
  open: boolean; onOpenChange: (open: boolean) => void; initialClip?: number; returnFocus: HTMLElement | null;
}) {
  const [clip, setClip] = useState(initialClip);
  const [failed, setFailed] = useState(false);
  const [ended, setEnded] = useState(false);
  const chooseClip = (index: number) => { setClip(index); setFailed(false); setEnded(false); };
  const video = useRef<HTMLVideoElement>(null);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="st-video-overlay" />
        <Dialog.Content className="st-video-dialog" onCloseAutoFocus={event => { event.preventDefault(); returnFocus?.focus(); }}>
          <Dialog.Close className="st-video-close" aria-label="Video schließen"><X size={22} /></Dialog.Close>
          <div className="st-video-screen">
            <video ref={video} key={clip} src={`/videos/${clips[clip].file}`} controls autoPlay playsInline preload="metadata" onEnded={() => setEnded(true)} onPlay={() => setEnded(false)} onError={() => setFailed(true)} />
            {ended && <div className="st-video-next" aria-live="polite"><span>DU ENTSCHEIDEST, WIE ES WEITERGEHT.</span><h3>{clip === 0 ? 'Was interessiert dich?' : 'Dein nächster Schritt.'}</h3>{clip === 0 ? <><button onClick={() => chooseClip(1)}>Saifs Geschichte <span>1:27 <ArrowRight size={17}/></span></button><button onClick={() => chooseClip(2)}>Direkt zum Einstieg <span>0:11 <ArrowRight size={17}/></span></button></> : <><Link to="/signale" onClick={() => onOpenChange(false)}>Saifs Trades & Basic Academy <ArrowRight size={17}/></Link><Link to="/#lernweg" onClick={() => { onOpenChange(false); window.setTimeout(() => document.getElementById('lernweg')?.scrollIntoView({behavior:'instant'}), 100); }}>Der Academy-Lernweg <ArrowRight size={17}/></Link><button onClick={() => { if(video.current){video.current.currentTime=0;void video.current.play().catch(()=>{});} }}>Noch einmal ansehen <Play size={15}/></button></>}</div>}
            {failed && <p className="st-video-error">Das Video konnte nicht geladen werden. <button onClick={() => { setFailed(false); video.current?.load(); }}>Erneut laden</button></p>}
          </div>
          <div className="st-video-info">
            <span className="st-eyebrow">SAIF · PERSÖNLICH</span>
            <Dialog.Title>{clips[clip].title}</Dialog.Title>
            <Dialog.Description>Du entscheidest, was du als Nächstes sehen möchtest.</Dialog.Description>
            <div className="st-video-chapters">
              {clips.map((item, index) => <button key={item.file} aria-pressed={clip === index} onClick={() => chooseClip(index)}><Play size={15} /><span>{item.label}</span><small>{item.time}</small></button>)}
            </div>
            <Link className="st-video-trades-link" to="/signale" onClick={() => onOpenChange(false)}>Saifs Trades & Basic Academy <ArrowRight size={18}/></Link>
            <Link className="st-button st-button-yellow" to="/#lernweg" onClick={() => { onOpenChange(false); window.setTimeout(() => document.getElementById("lernweg")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }), 100); }}>Deinen Lernweg entdecken <ArrowRight size={18} /></Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
