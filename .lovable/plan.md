

## Ziel

Integration des Funnel-Embed-Scripts mit `inline`-Modus für iOS-kompatibles Video-Playback, kombiniert mit unserem eigenen Zoom-Modal.

## Technische Umsetzung

### Schritt 1: Embed-Script in index.html laden

```html
<!-- In index.html vor </body> -->
<script src="https://vid-path-builder-65.lovable.app/embed.js"></script>
```

### Schritt 2: VideoFunnel.tsx umbauen

**Neuer Aufbau:**

```text
Preview-Tile (klein)
├── Container mit id="funnel-preview"
│   └── Inline-iFrame (vom embed.js erstellt)
├── Corner Accents (Deko)
└── Optional: Leichter Overlay für visuellen Effekt

Modal (groß) - UNSER eigenes
├── Fullscreen Container
└── iFrame mit Funnel
```

### Schritt 3: Event-Listener für Funnel-Events

```tsx
useEffect(() => {
  // Inline-Embed initialisieren
  if (window.FunnelEmbed) {
    window.FunnelEmbed.init({
      funnelId: "smart-trading-v6",
      type: "inline",
      container: "funnel-preview"
    });
  }

  // Auf Funnel-Start hören
  const handleFunnelEvent = (event: CustomEvent) => {
    if (event.detail?.funnelId === "smart-trading-v6") {
      setIsOpen(true); // Unser Zoom-Modal öffnen
    }
  };

  window.addEventListener('funnel_started', handleFunnelEvent);
  
  // Auch postMessage abfangen
  const handleMessage = (event: MessageEvent) => {
    if (event.data?.type === 'funnel_started') {
      setIsOpen(true);
    }
  };
  window.addEventListener('message', handleMessage);

  return () => {
    window.removeEventListener('funnel_started', handleFunnelEvent);
    window.removeEventListener('message', handleMessage);
  };
}, []);
```

### Schritt 4: TypeScript Typen

```tsx
// Type declarations für embed.js
declare global {
  interface Window {
    FunnelEmbed?: {
      init: (config: FunnelConfig) => void;
      open: () => void;
      close: () => void;
    };
    FUNNEL_EMBED_CONFIG?: FunnelConfig;
  }
}

interface FunnelConfig {
  funnelId: string;
  type: 'widget' | 'modal' | 'inline' | 'fullscreen';
  container?: string;
  height?: string;
  position?: string;
  autoOpen?: boolean;
}
```

## Ablauf nach Umsetzung

```text
User Journey (iOS + Desktop):
1. User sieht Preview-Tile mit Live-Funnel (inline iFrame)
2. User tippt auf "Jetzt starten" DIREKT im iFrame
   → iOS: User-Geste erkannt ✓
   → Video startet mit Sound ✓
3. Funnel sendet Event (postMessage oder CustomEvent)
4. Website empfängt Event
5. Zoom-Modal öffnet sich mit Animation
6. Video läuft im großen Modal weiter
7. Nach Funnel-Ende: Weiterleitung zu Terminbuchung
```

## Dateien die geändert werden

| Datei | Änderung |
|-------|----------|
| `index.html` | Script-Tag für embed.js hinzufügen |
| `src/components/VideoFunnel.tsx` | Komplett umbauen für inline-Embed + Event-Listener |

## Voraussetzung im Funnel-Projekt

Das andere Projekt muss bei Video-Start diesen Code ausführen:

```tsx
window.parent.postMessage({ type: 'funnel_started' }, '*');
// ODER
window.dispatchEvent(new CustomEvent('funnel_started', { 
  detail: { funnelId: 'smart-trading-v6' } 
}));
```

## Vorteile dieser Lösung

- iOS-kompatibel (erster Klick im iFrame = User-Geste)
- Kein doppeltes Klicken nötig
- Eigene Zoom-Animation behalten
- Daten-Events für spätere Weiterleitung nutzbar
- Saubere Integration ohne Hacks

