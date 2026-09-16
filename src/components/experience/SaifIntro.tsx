import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { ArrowUpRight, BookOpen, Pause, Play, Send } from 'lucide-react';
import gsap from 'gsap';
import './saif-intro.css';

/** A real video in a spatial frame. Its controls remain in the flat page plane. */
export default function SaifIntro({ onPlay, paused = false, trades = false }: { onPlay: () => void; paused?: boolean; trades?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [preview, setPreview] = useState(true);
  useEffect(() => {
    const el = root.current;
    const player = video.current;
    if (!el || !player) return;
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
    let visible = false;
    const sync = () => {
      if (visible && preview && !paused && motion.matches && !document.hidden) void player.play().catch(() => {});
      else player.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .15 });
    observer.observe(el);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); motion.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); player.pause(); };
  }, [paused, preview]);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.from('.si-entrance', { y: 55, opacity: 0, duration: 1.1, ease: 'power3.out', clearProps: 'opacity,transform' });
        const timeline = gsap.timeline({ scrollTrigger: { trigger: root.current?.closest('section'), start: 'top top', end: 'bottom top', scrub: .6 } });
        timeline.to('.si-rig', { rotateY: 13, rotateZ: 5, rotateX: -6, y: 65, ease: 'none' }, 0)
          .to('.si-orbit', { rotateZ: 80, rotateY: 38, ease: 'none' }, 0)
          .fromTo('.si-note', { '--si-light': '-65%' }, { '--si-light': '140%', ease: 'none' }, 0)
          .to('.si-pass', { x: 55, y: -75, rotateZ: 13, ease: 'none' }, 0)
          .to('.si-note', { x: -35, y: 55, rotateZ: -12, ease: 'none' }, 0);
      }, root);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);
  const point = (event: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--si-x', `${((event.clientY - rect.top) / rect.height - .5) * -6}deg`);
    event.currentTarget.style.setProperty('--si-y', `${((event.clientX - rect.left) / rect.width - .5) * 9}deg`);
  };
  return <div className="si-scene" ref={root} onMouseMove={point} onMouseLeave={e => { e.currentTarget.style.setProperty('--si-x', '0deg'); e.currentTarget.style.setProperty('--si-y', '0deg'); }}>
    <div className="si-orbit" aria-hidden="true" />
    <div className="si-entrance">
      <div className="si-pointer"><div className="si-rig"><div className="si-frame">
        <video ref={video} src="/videos/saif-preview.mp4" poster="/images/saif-intro.jpg" muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />
        <div className="si-video-shade" />
        <span className="si-frame-top"><i /> SAIF. PERSÖNLICH.</span>
        <button className="si-video-open" onClick={onPlay} aria-label="Saifs Begrüßung mit Ton ansehen"><span className="si-play"><Play size={22} fill="currentColor" /></span><span>Hi, ich bin Saif.<small>TON AN · LERN MICH KENNEN</small></span><ArrowUpRight size={21} /></button>
      </div></div></div>
      <div className="si-note" aria-hidden="true"><span className="si-note-icon"><BookOpen size={22} /></span><div><small>{trades ? 'BASIC ACADEMY' : 'DEIN LERNWEG'}</small><strong>{trades ? 'Verstehen.' : 'Schritt für Schritt.'}<br />{trades ? 'Selbst umsetzen.' : 'Mit einem Plan.'}</strong></div><span className="si-note-index">{trades ? '+' : '04'}</span></div>
      <div className="si-pass" aria-hidden="true"><Send size={23} /><span>SAIF SMART TRADING</span><strong>{trades ? 'Die Trades.' : 'Dein Einstieg.'}<br />{trades ? 'Direkt zu dir.' : 'Beginnt hier.'}</strong><div><span>{trades ? 'TELEGRAM-GRUPPE' : 'WISSEN → ANWENDUNG'}</span><ArrowUpRight size={20} /></div></div>
    </div>
    <div className="si-scene-bottom"><span>ECHTER MENSCH. EIGENER WEG.</span><button onClick={() => setPreview(v => !v)} aria-label={preview ? 'Videovorschau pausieren' : 'Videovorschau abspielen'} aria-pressed={!preview}>{preview ? <Pause size={12} /> : <Play size={12} />}<span>Vorschau</span></button></div>
  </div>;
}
