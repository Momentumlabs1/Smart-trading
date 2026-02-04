

# Video-Funnel Vorschau im Hero-Bereich

## Problem

Der aktuelle VideoFunnel zeigt nur einen abstrakten Platzhalter mit Play-Button, aber keine echte Video-Vorschau. Das liegt daran, dass der Embed als `widget` konfiguriert ist - dieser erscheint erst nach dem Klick als Overlay.

## Lösung

### Option A: Thumbnail-Vorschau hinzufügen (Empfohlen)

Da der Funnel-Service kein automatisches Thumbnail bereitstellt, fügen wir ein eigenes Vorschaubild hinzu:

1. **Thumbnail erstellen**: Screenshot vom ersten Video des Funnels als Bild speichern
2. **VideoFunnel.tsx anpassen**: Das Thumbnail als Hintergrundbild im Platzhalter anzeigen
3. **Visueller Effekt**: Leichter Overlay + Play-Button darüber

```text
+---------------------------+
|   [Video Thumbnail]       |
|                           |
|       [ ▶ Play ]          |
|                           |
|   "Video starten"         |
+---------------------------+
        ↓ Klick
    Funnel Widget öffnet
```

### Option B: Inline-Embed (Falls unterstützt)

Falls der Funnel-Service einen Inline-Modus hat:

```typescript
window.FUNNEL_EMBED_CONFIG = {
  funnelId: "smart-trading-v6",
  type: "inline",           // Statt "widget"
  containerId: "funnel-container"
};
```

Das Video würde dann direkt im Platzhalter erscheinen.

---

## Empfohlene Umsetzung (Option A)

### Dateien

| Datei | Änderung |
|-------|----------|
| `src/assets/funnel-thumbnail.webp` | Neues Vorschaubild |
| `src/components/VideoFunnel.tsx` | Thumbnail als Hintergrund |

### Code-Änderung

```typescript
// VideoFunnel.tsx
import funnelThumbnail from '@/assets/funnel-thumbnail.webp';

// Im return:
<div className="relative w-[180px] lg:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden">
  {/* Video Thumbnail als Hintergrund */}
  <img 
    src={funnelThumbnail} 
    alt="Video Vorschau"
    className="absolute inset-0 w-full h-full object-cover"
  />
  
  {/* Dunkler Overlay für bessere Lesbarkeit */}
  <div className="absolute inset-0 bg-black/30" />
  
  {/* Play Button */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
      <Play className="w-6 h-6 text-white" />
    </div>
  </div>
</div>
```

---

## Nächster Schritt

Bitte lade ein Thumbnail-Bild hoch (Screenshot vom ersten Video des Funnels im 9:16 Format), dann kann ich die Implementierung durchführen.

Alternativ: Falls der Funnel-Service einen Inline-Embed-Modus unterstützt, teile mir die entsprechenden Konfigurationsoptionen mit.

