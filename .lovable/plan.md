

## Problem-Analyse

Das `embed.js` mit `type: "inline"` lädt den kompletten Funnel direkt in den kleinen Container - es gibt keine eingebaute "Preview mit Play-Button" Funktion.

## Lösung: Eigener Preview-Layer + Verzögertes Laden

Wir behalten einen statischen Preview-Screen mit Play-Button. Erst beim Klick auf den Play-Button öffnet sich das Fullscreen-Modal und lädt den Funnel.

## Ablauf

```text
User Journey:
1. User sieht Preview-Tile mit Thumbnail + Play-Button
2. User klickt auf Play-Button
3. Zoom-Animation startet
4. Fullscreen-Modal öffnet sich
5. iFrame mit Funnel wird geladen
6. User durchläuft Funnel im Vollbild
```

## Technische Umsetzung

### VideoFunnel.tsx - Komplett neu aufbauen

```text
Preview-Tile
├── Thumbnail-Bild (saif-trading.webp)
├── Dunkler Gradient-Overlay
├── Play-Button (klickbar)
│   ├── Pulsierender Ring
│   └── Play-Icon
├── "Jetzt ansehen" Label
└── Corner Accents (Deko)

Modal (bei isOpen = true)
├── Fullscreen Container
├── iFrame mit Funnel-URL
└── Close-Button
```

### Code-Änderungen

```tsx
export const VideoFunnel = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Kein embed.js mehr nötig - wir laden den iFrame nur im Modal

  return (
    <>
      {/* Preview-Tile mit Thumbnail + Play Button */}
      <motion.div ...>
        <div 
          onClick={() => setIsOpen(true)}
          className="relative ... cursor-pointer group"
        >
          {/* Thumbnail */}
          <img 
            src={saifThumb} 
            alt="Video Preview" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative">
              {/* Pulsing Ring */}
              <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
              {/* Button */}
              <div className="w-14 h-14 rounded-full bg-primary/90 ...">
                <Play className="w-6 h-6 ..." />
              </div>
            </div>
            <span className="mt-3 text-xs font-medium text-white/90">
              Jetzt ansehen
            </span>
          </div>
          
          {/* Corner Accents */}
          ...
        </div>
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isOpen && (
          <Dialog...>
            <iframe 
              src="https://vid-path-builder-65.lovable.app/embed/smart-trading-v6"
              ...
            />
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};
```

## Änderungen an Dateien

| Datei | Änderung |
|-------|----------|
| `src/components/VideoFunnel.tsx` | Zurück zum Preview-Bild + Play-Button; embed.js nicht mehr inline nutzen |
| `index.html` | embed.js Script kann bleiben (schadet nicht) oder entfernt werden |

## Wichtig: iOS-Kompatibilität

Da das Video erst im Modal geladen wird und der User dort nochmal auf "Play" im Funnel selbst klickt, ist das iOS-kompatibel:

1. **Klick auf Preview** → Öffnet Modal (kein Video-Start)
2. **Klick auf "Jetzt starten" im Funnel** → Startet Video mit Ton (User-Geste im iFrame = OK für iOS)

## Vorteile

- Klarer visueller Einstiegspunkt (Play-Button)
- Schnelleres Laden der Seite (kein iFrame im Preview)
- iOS-kompatibel (User-Geste passiert im iFrame)
- Saubere Zoom-Animation
- Funnel komplett durchlaufbar im Fullscreen

