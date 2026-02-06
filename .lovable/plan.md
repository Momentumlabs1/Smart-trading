

# VideoFunnel Fix: Live (Desktop) + Thumbnail (Mobile)

## Problem
Die aktuelle Preview zeigt nur einen sehr schwachen animierten Gradient, der im dunklen Hero-Hintergrund praktisch unsichtbar ist (siehe Screenshot). Der Fehler entstand, weil ich den Live-iframe komplett durch einen zu dezenten Placeholder ersetzt hatte.

## Lösung: Hybrid-Ansatz

### Desktop (ab 1024px / lg)
- **Live-iframe** mit CSS-Transform, um die schwarze Nav-Bar auszublenden
- `scale-[1.2]` vergrößert den iframe
- `-translate-y-[10%]` verschiebt ihn nach oben
- Container mit `overflow-hidden` schneidet die Bar ab

### Mobile (unter 1024px)
- **Statisches Thumbnail** mit sichtbarem Gradient + prominentem Video-Icon
- Höhere Kontrast-Farben: `from-primary/40` statt `/20`
- Größeres Icon: `w-16 h-16` statt `w-10 h-10`
- Deutlicher sichtbarer Text: "Jetzt ansehen"

## Technische Umsetzung

**Datei: `src/components/VideoFunnel.tsx`**

```tsx
import { useIsMobile } from '@/hooks/use-mobile';

export const VideoFunnel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <motion.div ...>
        <motion.div onClick={() => setIsOpen(true)} ...>
          
          {/* DESKTOP: Live-iframe Preview (versteckte Nav-Bar) */}
          {!isMobile && (
            <div className="absolute inset-0 overflow-hidden">
              <iframe
                src="https://vid-path-builder-65.lovable.app/embed/smart-trading-v6"
                className="absolute inset-0 w-full h-full pointer-events-none scale-[1.2] -translate-y-[10%]"
                title="Video Preview"
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}

          {/* MOBILE: Statisches Thumbnail mit prominentem Icon */}
          {isMobile && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-background/80 to-primary/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Video className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
          )}

          {/* Dark Overlay + Play Button (bleibt gleich) */}
          ...
        </motion.div>
      </motion.div>

      {/* Modal (bleibt gleich, bereits iOS-optimiert) */}
      ...
    </>
  );
};
```

## Änderungen im Detail

| Bereich | Vorher | Nachher |
|---------|--------|---------|
| Desktop-Preview | Animierter Gradient (unsichtbar) | Live-iframe mit Crop |
| Mobile-Preview | Animierter Gradient (unsichtbar) | Sichtbarer Gradient + großes Icon |
| Gradient-Stärke | `from-primary/20` | `from-primary/40` |
| Icon-Farbe | `text-primary/30` | `text-primary` (100%) |
| Icon-Größe | `w-10 h-10` | `w-16 h-16` mit Hintergrund-Kreis |

## Ergebnis

- **Desktop**: Echte Live-Video-Vorschau ohne schwarze Bar
- **Mobile**: Klarer, sichtbarer Placeholder mit prominentem Play-Button
- **Beide**: Modal öffnet sich beim Klick mit dem echten Video

