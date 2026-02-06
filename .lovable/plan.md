
# VideoFunnel Mobile & Preview Fix

## Probleme identifiziert

### 1. Schwarzer Rand in der Preview
Das externe Embed (`vid-path-builder-65.lovable.app`) zeigt eine Navigation-Bar am oberen Rand, die in der kleinen Preview-Größe als schwarzer Balken erscheint.

### 2. Schwarzes Bild auf iOS
iFrames auf iOS/Safari haben bekannte Einschränkungen:
- `loading="lazy"` kann Probleme auf iOS verursachen
- Cross-Origin-Cookies werden standardmäßig blockiert (iOS 13+)
- Safari-spezifische Rendering-Probleme mit eingebetteten iFrames

---

## Lösung

### Alternative A: Statisches Thumbnail + Fallback (Empfohlen)

Anstatt einen Live-iframe als Preview zu verwenden, wird ein statisches Bild/Thumbnail angezeigt. Dies ist:
- Schneller (kein iframe-Load)
- Zuverlässiger auf allen Geräten
- Kein schwarzer Rand-Problem

**Änderungen an `src/components/VideoFunnel.tsx`:**

1. **Mini-iframe durch CSS-Gradient/Placeholder ersetzen**
   - Entfernt den problematischen Preview-iframe
   - Zeigt stattdessen einen ansprechenden animierten Gradient-Background
   - Optional: Screenshot/Thumbnail des Videos als Hintergrundbild

2. **iOS-spezifische Optimierungen für Modal-iframe**
   - `loading="eager"` statt `"lazy"`
   - Zusätzliche iframe-Attribute für iOS-Kompatibilität
   - `sandbox` mit erlaubten Permissions

```tsx
// VORHER (problematisch):
<iframe
  src="https://vid-path-builder-65.lovable.app/embed/smart-trading-v6"
  className="absolute inset-0 w-full h-full pointer-events-none"
  loading="lazy"
/>

// NACHHER (robust):
<div 
  className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10"
>
  {/* Animated video icon placeholder */}
  <motion.div className="absolute inset-0 flex items-center justify-center">
    <Video className="w-12 h-12 text-primary/40" />
  </motion.div>
</div>
```

3. **Modal-iframe iOS-optimiert:**
```tsx
<iframe
  src="https://vid-path-builder-65.lovable.app/embed/smart-trading-v6"
  className="w-full h-full"
  allow="camera; microphone; autoplay; fullscreen"
  allowFullScreen
  loading="eager"
  referrerPolicy="no-referrer-when-downgrade"
/>
```

---

### Alternative B: Versteckter schwarzer Rand

Falls der Live-Preview gewünscht ist, kann der schwarze Rand durch negative Margins ausgeblendet werden:

```tsx
<iframe
  src="..."
  className="absolute inset-0 w-full h-full pointer-events-none scale-[1.15] -translate-y-[8%]"
  // Vergrößert und verschiebt iframe um die schwarze Bar zu verstecken
/>
```

**Nachteil**: Funktioniert nicht auf iOS (schwarzes Bild bleibt)

---

## Empfehlung

**Alternative A** ist die beste Lösung weil:
- Funktioniert zuverlässig auf allen Geräten
- Schnellere Ladezeit (kein iframe für Preview)
- Kein schwarzer Rand mehr
- Der "echte" iframe wird erst beim Klick geladen

---

## Technische Details

**Geänderte Datei:**
- `src/components/VideoFunnel.tsx`

**Neue Imports:**
- `Video` Icon von lucide-react (optional, für animiertes Placeholder)

**Beibehaltene Features:**
- Play-Button mit Pulsing-Animation
- Corner Accents
- Hover-Glow-Effekt
- Fullscreen Modal mit Zoom-Animation
- Close-Button

