
## Ziel (Problem wirklich lösen)
Auf der Handy-Ansicht “verschwindet” die Video-Vorschau nicht wegen eines Render-Bugs – sondern weil wir auf Mobile aktuell **absichtlich keinen Live-Embed** zeigen, sondern nur einen **Placeholder** (Gradient + Icon). Du erwartest aber eine **echte, sichtbare Vorschau** (wie auf Desktop mit Gesicht/Frame) – nicht nur einen abstrakten Platzhalter.

Zusätzlich ist die aktuelle Mobile/Desktop-Umschaltung technisch unnötig komplex, weil sie über `useIsMobile()` (Breakpoint 768) läuft, während dein Layout über Tailwind `lg:` (Breakpoint 1024) umschaltet. Das kann zu verwirrendem Verhalten führen (Tablet/Editor-Ansichten).

## Lösung (robust + genau wie gewünscht)
Wir stellen um auf:

1) **Desktop (lg und größer): Live-Embed**
- Der iframe bleibt, inkl. “crop” Trick (`scale` + `translate-y`) um die schwarze Bar zu verstecken.
- Sichtbarkeit/Logik wird über Tailwind gesteuert: `hidden lg:block` (statt JS Hook).

2) **Mobile (< lg): echtes Thumbnail statt Placeholder**
- Statt Gradient wird ein **echtes Bild** als Thumbnail angezeigt (z.B. `src/assets/saif-phone.webp`, das ist bereits im Projekt vorhanden).
- Darüber bleibt dein Play-Overlay wie bisher (damit klar ist: antippen öffnet Video-Modal).

3) **Optionaler Bonus (Fallback auch auf Desktop)**
- Wir legen das Thumbnail als “Background” auch **unter** den iframe. Falls der iframe mal langsam lädt oder blockiert wird, sieht man trotzdem sofort ein Bild.

## Konkrete Änderungen (Dateien)
### A) `src/components/VideoFunnel.tsx`
- Entfernen: `useIsMobile` Import und `const isMobile = useIsMobile();`
- Ersetzen der Conditional-Blocks:
  - Desktop iframe Block wird: `<div className="hidden lg:block ...">...</div>`
  - Mobile Thumbnail Block wird: `<div className="lg:hidden ..."> <img .../> ... </div>`
- Thumbnail-Asset importieren:
  - `import saifThumb from "@/assets/saif-phone.webp";` (oder alternativ `saif-portrait.webp`, wenn du lieber das willst)
- Thumbnail so rendern, dass es wie eine echte Vorschau wirkt:
  - `img` mit `className="absolute inset-0 w-full h-full object-cover scale-[1.03]"` (leichtes Zoom für “Video-Look”)
  - Optional ein sehr leichter dunkler Overlay bleibt (du hast ihn ohnehin schon) damit der Play-Button gut lesbar ist.

### B) (Optional) `src/hooks/use-mobile.tsx`
- Wenn wir komplett auf CSS umstellen, wird dieser Hook hier gar nicht mehr gebraucht.
- Ich lasse ihn ansonsten unangetastet, aber die VideoFunnel-Komponente hängt dann nicht mehr davon ab.

## Warum das dein Problem exakt trifft
- In der “Handy”-Preview im Editor wird (korrekt) der Mobile-Branch aktiv. Aktuell ist das eben nur ein Gradient-Placeholder.
- Nach der Änderung siehst du in Mobile **ein echtes Bild** (keine abstrakte Fläche), was deiner Erwartung “Vorschau” entspricht.
- Die Umschaltung passiert deterministisch über Tailwind `lg:` (wie dein Hero-Layout), nicht über einen separaten JS-Breakpoint.

## Abnahmekriterien (was du danach testen solltest)
1) Editor: Handy-Icon → Video-Kachel zeigt ein echtes Thumbnail + Play-Button, darunter Buttons.
2) Desktop → Video-Kachel zeigt den Live-Embed (ohne schwarze Bar), Klick öffnet Modal.
3) iPhone Safari → Thumbnail ist sichtbar, Klick öffnet Modal (Video/Funnel lädt).

## Risiken / Edge Cases
- Der externe Funnel-Embed kann auf iOS im Modal je nach Einstellungen/Netzwerk langsam laden. Mit Thumbnail sieht es aber nie “kaputt” aus.
- Wenn du ein ganz bestimmtes Thumbnail (echter Frame aus dem Video) willst, brauchen wir dafür entweder:
  - ein von dir geliefertes Thumbnail-Bild, oder
  - wir erzeugen/hosten eins im Projekt (am einfachsten: du gibst mir ein Bild, ich lege es als Asset ab).

## Nächster Schritt
Ich implementiere das wie oben (CSS-breakpoint-gesteuert + echtes Thumbnail auf Mobile + optionaler Fallback unter dem iframe).
