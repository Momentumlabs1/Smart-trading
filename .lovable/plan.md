

# Video-Vorschau Fix

## Problem
Die Video-Vorschau zeigt nichts an, weil die Video-URL (`rqjwroreqihyqyktucvj.supabase.co/...`) moeglicherweise nicht erreichbar ist (anderes Projekt, CORS, 404). Es fehlt ausserdem jegliches Error-Handling.

## Loesung

### 1. Robustes Video-Preview mit Fallback
Die `VideoFunnel.tsx` bekommt:
- **`onError` Handler**: Wenn das Video nicht laedt, wird automatisch das statische Vorschaubild (`funnel-preview.webp`) angezeigt, das bereits im Projekt liegt
- **`poster` Attribut**: Das Vorschaubild wird als Poster gesetzt, damit sofort etwas sichtbar ist waehrend das Video laedt
- **Ladeindikator**: Ein subtiler Shimmer-Effekt solange weder Video noch Poster geladen sind

### 2. Kein GIF noetig
Muted Autoplay (`autoPlay muted loop playsInline`) funktioniert auf allen modernen Mobile-Browsern (iOS Safari, Android Chrome). Ein GIF wuerde nur unnoetig Bandbreite verbrauchen und schlechter aussehen.

## Technische Details

### Datei: `src/components/VideoFunnel.tsx`

Aenderungen:
- `useState` fuer `videoError` hinzufuegen
- `funnel-preview.webp` wieder als Fallback importieren
- `<video>` Element bekommt `poster={funnelPreview}` und `onError={() => setVideoError(true)}`
- Bei `videoError === true` wird statt dem Video das statische Bild angezeigt (wie vorher)
- Falls `previewVideoUrl` leer ist, wird direkt das Bild verwendet

```text
Logik:
previewVideoUrl vorhanden?
  JA  --> <video> mit poster + onError
           |
           Video laedt? --> Autoplay Loop (auch Mobile)
           Video Error? --> Fallback auf <img funnel-preview.webp>
  NEIN --> <img funnel-preview.webp>
```

| Datei | Aenderung |
|-------|-----------|
| `src/components/VideoFunnel.tsx` | onError-Fallback, poster-Attribut, funnel-preview.webp als Sicherheitsnetz |

