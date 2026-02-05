
# Video-Funnel mit Fullscreen-Modal

## Konzept

Das Widget bleibt klein und elegant im Hero-Bereich. Beim Klick öffnet sich ein großes Modal (ähnlich wie YouTube Fullscreen), das den gesamten Bildschirm einnimmt und das interaktive Video zeigt.

```text
VORHER (Hero):                    NACHHER (Modal):
┌──────────────────┐              ┌────────────────────────────┐
│  ┌────┐          │              │                            │
│  │ ▶  │  Text... │  ──KLICK──▶  │    ┌──────────────────┐    │
│  │    │          │              │    │                  │    │
│  └────┘          │              │    │   VIDEO IFRAME   │    │
│                  │              │    │   (Fullscreen)   │    │
└──────────────────┘              │    │                  │    │
                                  │    └──────────────────┘    │
                                  │                        [X] │
                                  └────────────────────────────┘
```

---

## Technische Umsetzung

### `src/components/VideoFunnel.tsx`

**Änderungen:**
- State `isOpen` für Modal-Steuerung hinzufügen
- Klick auf Platzhalter setzt `isOpen = true`
- Dialog-Komponente mit dem iframe einbetten
- Iframe lädt erst wenn Modal geöffnet wird (Performance)

```typescript
import { Dialog, DialogContent } from '@/components/ui/dialog';

export const VideoFunnel = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Kleiner Platzhalter im Hero */}
      <motion.div onClick={() => setIsOpen(true)} className="cursor-pointer">
        <div className="relative w-[180px] lg:w-[240px] aspect-[9/16] rounded-2xl ...">
          {/* Play Button & Preview */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="w-12 h-12" />
            <span>Video starten</span>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] h-[90vh] p-0">
          <iframe
            src="https://vid-path-builder-65.lovable.app/embed/smart-trading-v6"
            className="w-full h-full"
            allow="camera; microphone; autoplay"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
```

---

## Styling des Modals

- **Größe:** 95% Viewport-Breite, 90% Viewport-Höhe
- **Hintergrund:** Dunkler Overlay (bereits in Dialog-Komponente)
- **Schließen:** X-Button oben rechts + Klick außerhalb
- **Animation:** Fade-in/Zoom (bereits in Dialog-Komponente)
- **Mobile:** Responsive, passt sich an Bildschirmgröße an

---

## Dateien

| Datei | Änderung |
|-------|----------|
| `src/components/VideoFunnel.tsx` | Modal-State + Dialog mit iframe |

---

## Vorteile

1. **Kompaktes Hero-Layout** - Video nimmt nicht zu viel Platz ein
2. **Immersive Erfahrung** - Fullscreen-Video bei Interaktion
3. **Performance** - iframe lädt erst bei Bedarf
4. **Bekanntes UX-Pattern** - User kennen das von YouTube/Netflix
