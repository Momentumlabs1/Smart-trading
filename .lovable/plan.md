
## Ziel
Wenn der User im iFrame auf "Jetzt starten" klickt, soll die Website das erkennen und automatisch das Modal (Vollbild-Ansicht) öffnen.

## Technische Umsetzung

### Datei: `src/components/VideoFunnel.tsx`

### Änderung 1: postMessage Listener hinzufügen
```tsx
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data?.type === 'funnel_started') {
      setIsOpen(true);
    }
  };
  
  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);
```

### Änderung 2: iFrame interaktiv machen
- `pointer-events-none` entfernen vom iFrame
- Play-Button Overlay entfernen (User klickt direkt im iFrame)
- Container-onClick entfernen

### Änderung 3: Overlay aufräumen
Entfernen:
- Pulsing Ring Animation
- Play Button
- "Jetzt ansehen" Text
- Dark Gradient (oder reduzieren)

Behalten:
- Corner Accents (dekorativ)
- Thumbnail als Fallback
- Modal mit Zoom-Animation

## Ablauf nach Umsetzung

```text
Mobile/Desktop:
1. User sieht kleine Preview-Kachel mit Live-iFrame
2. User tippt auf "Jetzt starten" (Button im iFrame)
3. Video startet sofort (iOS: Geste erkannt)
4. iFrame sendet postMessage
5. Website empfängt → Modal öffnet sich (Zoom-Animation)
6. Video läuft im großen Modal weiter
```

## Voraussetzung
Das andere Projekt (Funnel) muss diesen Code haben:
```tsx
window.parent.postMessage({ type: 'funnel_started' }, '*');
```
(Du hast gesagt, das wird dort hinzugefügt)

## Ergebnis
- iOS: Video startet mit Ton (Klick im iFrame = User-Geste)
- Handy: Automatisch Vollbild nach Start
- Desktop: Automatisch größeres Modal nach Start
