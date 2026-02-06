
# AboutSaif Mobile Layout Fix

## Problem
Auf Mobilgeräten wird Saifs Bild ganz unten angezeigt (nach dem gesamten Text), weil:
- Das Bild `order-2` hat (erscheint als zweites)
- Der Text `order-1` hat (erscheint als erstes)

Dies unterbricht den visuellen Fluss und die persönliche Verbindung, die das Bild herstellen soll.

## Lösung

### Option A: Bild oben auf Mobile (Empfohlen)
Das Bild wird auf Mobile oben angezeigt, mit einem kompakteren Format.

**Änderungen an `src/components/sections/AboutSaif.tsx`:**

1. **Order-Klassen anpassen:**
   - Bild: `order-1 lg:order-1` (immer zuerst auf Mobile, links auf Desktop)
   - Text: `order-2 lg:order-2` (immer danach)

2. **Mobiles Bild-Format optimieren:**
   - Kompakteres Aspect-Ratio auf Mobile: `aspect-[3/2] sm:aspect-[4/5]`
   - Bild wird breiter und kürzer auf Mobile (weniger Scroll nötig)
   - Floating Cards auf Mobile dezenter positionieren

3. **Text-Bereich kompakter:**
   - Headline auf Mobile etwas kleiner
   - Achievement-Grid bleibt kompakt

### Visuelle Änderung

**Vorher (Mobile):**
```text
┌─────────────────────────┐
│ "Über den Gründer"      │
│ Headline                │
│ Text...                 │
│ Achievement Grid        │
│ Name                    │
│ Buttons                 │
├─────────────────────────┤
│                         │
│   [Saif Bild - unten]   │
│                         │
└─────────────────────────┘
```

**Nachher (Mobile):**
```text
┌─────────────────────────┐
│   [Saif Bild - oben]    │
│   (kompakter 3:2)       │
├─────────────────────────┤
│ "Über den Gründer"      │
│ Headline                │
│ Text...                 │
│ Achievement Grid        │
│ Name + Buttons          │
└─────────────────────────┘
```

## Technische Umsetzung

```tsx
{/* Image - jetzt order-1 auf Mobile */}
<motion.div
  className="relative order-1"  // Entfernt: order-2 lg:order-1
>
  <motion.div 
    className="relative aspect-[3/2] sm:aspect-[4/5] rounded-3xl overflow-hidden"
    // Kompakteres Bild auf Mobile (3:2 statt 4:5)
  >
    ...
  </motion.div>

  {/* Floating Cards nur auf Desktop */}
  <motion.div className="hidden sm:block absolute -bottom-4 -right-4 ...">
    ...
  </motion.div>
</motion.div>

{/* Content - jetzt order-2 */}
<motion.div
  className="order-2"  // Entfernt: order-1 lg:order-2
>
  ...
</motion.div>
```

## Zusätzliche Optimierungen

1. **Floating Achievement Cards auf Mobile ausblenden** (`hidden sm:block`)
   - Vermeidet Überlappungsprobleme
   - Achievement-Grid im Text-Bereich zeigt dieselben Infos

2. **Section Padding reduzieren auf Mobile:**
   - `py-16 sm:py-24` statt nur `py-24`

## Ergebnis

- Saifs Bild ist sofort sichtbar beim Scrollen
- Persönliche Verbindung wird früher hergestellt
- Kompakteres Bild-Format spart vertikalen Platz
- Konsistentes Layout mit dem Rest der Seite
