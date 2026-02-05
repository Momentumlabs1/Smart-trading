

# Video-Funnel: Preview + Cleaner Übergang

## Problem-Analyse

### 1. Fehlendes Preview-Video
Der Platzhalter zeigt aktuell nur einen Gradient-Hintergrund mit Play-Button. Für ein echtes Preview gibt es zwei Optionen:

| Option | Beschreibung | Vorteil | Nachteil |
|--------|--------------|---------|----------|
| **A: Thumbnail-Bild** | Statisches Bild vom ersten Video-Frame | Schnell, keine Ladezeit | Du musst ein Bild bereitstellen |
| **B: Mini-Iframe** | Kleiner iframe mit dem echten Video | Echtes, interaktives Preview | Doppelte iframe-Last auf der Seite |

**Empfehlung**: Option A mit Thumbnail - bessere Performance, cleaner Look

### 2. Übergang nicht clean
Die aktuelle Dialog-Animation kombiniert mehrere Effekte gleichzeitig:
- `zoom-in-95` (Scale von 95% auf 100%)
- `slide-in-from-top-[48%]` (Bewegung von oben)
- `fade-in-0` (Fade)

Das fühlt sich "busy" an. Ein cleanerer Übergang wäre:
- Nur **Fade + leichter Scale** (von 98% auf 100%)
- Längere Duration (300-400ms statt 200ms)
- Easing: `ease-out` für natürlicheres Gefühl

---

## Technische Umsetzung

### Datei 1: `src/components/VideoFunnel.tsx`

**Änderungen:**
- Thumbnail-Bild als Hintergrund des Platzhalters hinzufügen
- Falls kein Bild vorhanden: Fallback auf aktuellen Gradient

```
┌─────────────────────┐
│  ┌───────────────┐  │
│  │  THUMBNAIL    │  │
│  │  (9:16 Bild)  │  │
│  │      ▶        │  │
│  │  Play-Button  │  │
│  └───────────────┘  │
└─────────────────────┘
```

### Datei 2: `src/components/ui/dialog.tsx`

**Änderungen am DialogContent:**
- Entferne `slide-in-from-top/left` Animationen
- Behalte nur `fade-in` + `zoom-in-98` (subtiler)
- Erhöhe Duration auf `duration-300`
- Füge `ease-out` Timing hinzu

Vorher:
```
zoom-in-95 + slide-in-from-left-1/2 + slide-in-from-top-[48%]
```

Nachher:
```
zoom-in-[0.98] + fade-in (nur diese zwei)
```

---

## Implementierungs-Details

### VideoFunnel.tsx - Thumbnail Integration

```typescript
// Importiere das Thumbnail (wenn vorhanden)
import thumbnailImage from '@/assets/video-thumbnail.webp';

// Im Platzhalter-Container:
<div className="relative w-[180px] lg:w-[240px] aspect-[9/16] ...">
  {/* Thumbnail als Hintergrund */}
  <div 
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: `url(${thumbnailImage})` }}
  />
  
  {/* Dunkler Overlay für bessere Lesbarkeit */}
  <div className="absolute inset-0 bg-black/30" />
  
  {/* Play Button bleibt */}
  ...
</div>
```

### dialog.tsx - Cleaner Animation

```typescript
// Vorher (Zeile 39):
"... data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] ..."

// Nachher:
"... duration-300 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-[0.98] ..."
```

---

## Dateien

| Datei | Änderung |
|-------|----------|
| `src/components/VideoFunnel.tsx` | Thumbnail-Bild als Preview hinzufügen |
| `src/components/ui/dialog.tsx` | Simplere, cleanere Animation |

---

## Nächster Schritt für dich

Für das Thumbnail-Bild habe ich zwei Optionen:

1. **Du lädst ein Bild hoch** - Screenshot vom ersten Frame des Videos im 9:16 Format
2. **Ich verwende den Mini-Iframe** - Der echte Video-Inhalt wird direkt im kleinen Platzhalter angezeigt (braucht mehr Ladezeit)

Welche Option bevorzugst du?

