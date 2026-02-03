
# Hero Section Überarbeitung

## Identifizierte Probleme

Basierend auf dem Screenshot gibt es folgende Layout-Fehler:

1. **Floating Cards überlappen CTAs**: Die "Bot Performance +847%" Card überlappt mit dem "Kostenloses Erstgespräch" Button
2. **Schlechte Positionierung**: Die FloatingCards (BTC/USD, ETH/USD, Win Rate) sind schlecht platziert und stören das visuelle Gleichgewicht
3. **Zu viele schwebende Elemente**: 4 FloatingCards + CommunityAvatars + CTAs schaffen visuelles Chaos
4. **Z-Index Konflikte**: Floating Cards haben keinen klaren z-index Layer

## Geplante Änderungen

### 1. FloatingCards Repositionierung
- **Top Cards (BTC/USD, ETH/USD)**: Weiter nach außen verschieben (left 5%, right 5%) und höher positionieren
- **Bottom Cards (Bot Performance, Win Rate)**: ENTFERNEN aus dem Hauptbereich - diese werden stattdessen in eine separate Stats-Zeile unter den CTAs integriert
- Alle Cards bekommen `z-0` um unter dem Hauptcontent zu liegen

### 2. Neue Stats-Bar unter den CTAs
Anstatt schwebender Cards eine cleane horizontale Stats-Leiste:

```text
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│     +847%           73.2%           480+           12+       │
│  Bot Performance   Win Rate      Mitglieder     Jahre Exp.   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 3. Vereinfachtes Layout
- Hero-Headline bleibt zentriert
- CTA Buttons bleiben zentriert
- Stats-Bar ersetzt CommunityAvatars und schwebende Performance-Cards
- Nur 2 dezente Signal-Cards oben links/rechts (BTC, ETH) bleiben

### 4. Verbesserte Abstände
- Mehr vertikaler Abstand zwischen Headline, Subheadline, CTAs und Stats
- `mb-16` → `mb-12` für CTAs
- Stats-Bar mit `mt-16` für klare Trennung

## Technische Implementierung

### Änderungen in `Hero.tsx`:

1. **Entfernen**: 
   - FloatingCard für "Bot Performance" (Zeile 148-153)
   - FloatingCard für "Win Rate" (Zeile 155-160)
   - CommunityAvatars Komponente

2. **Anpassen**:
   - Top FloatingCards weiter nach außen positionieren
   - Nur noch als dekoratives Element, nicht überlappend

3. **Hinzufügen**:
   - Neue `StatsBar` Komponente mit 4 animierten Statistiken
   - Horizontal zentriert unter den CTAs

### Neue StatsBar Komponente:
```tsx
const StatsBar = () => {
  const stats = [
    { value: 847, suffix: '%', label: 'Bot Performance', prefix: '+' },
    { value: 73.2, suffix: '%', label: 'Win Rate', decimals: 1 },
    { value: 480, suffix: '+', label: 'Community Mitglieder' },
    { value: 12, suffix: '+', label: 'Jahre Erfahrung' },
  ];
  
  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
      {stats.map((stat, i) => (
        <motion.div key={i} className="text-center">
          <AnimatedCounter value={stat.value} ... />
          <div className="text-xs text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};
```

## Visuelles Ergebnis

```text
     [BTC/USD +2.4%]                           [ETH/USD +5.1%]

              WILLKOMMEN BEI SMART TRADING

              Die erste Adresse für
                 professionelle
              Trader-Ausbildungen

          Erlerne die Fähigkeiten zum...
          Dein Erfolg ist unsere Mission.

      [Kostenloses Erstgespräch]  [Member Login]

    ─────────────────────────────────────────────
    
        +847%      73.2%       480+       12+
     Bot Perf.   Win Rate   Mitglieder   Jahre
```

## Vorteile dieser Lösung

- Kein Überlappen mehr zwischen Elementen
- Cleanes, professionelles Layout
- Stats sind immer sichtbar und nicht versteckt in schwebenden Cards
- Mobile-friendly: Stats-Bar bricht sauber um
- Behält interaktive Animationen bei (Counter, Hover-Effekte)
