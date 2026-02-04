

# Plan: Video-Funnel Integration & Quiz-Überarbeitung

## Zusammenfassung
Die Hero-Buttons werden zum Video-Funnel geleitet und das bestehende Quiz wird visuell aufgewertet. Zusätzlich wird ein eigener Homepage-Funnel-Einstiegs-Komponente erstellt.

---

## 1. Neue Komponente: HomepageQuizTeaser

Eine eigenständige Komponente für die Homepage, die als visuell ansprechender Einstieg in den Quiz-Funnel dient.

**Datei:** `src/components/sections/HomepageQuizTeaser.tsx`

**Funktionen:**
- Glassmorphism-Karte mit animiertem Hintergrund
- Kurzer Teaser-Text: "Finde in 3 Minuten heraus, welches Programm zu dir passt"
- Animierte Trading-Level-Vorschau (Einsteiger -> Fortgeschritten -> Profi)
- Großer CTA-Button zum Quiz
- Trust-Elemente: "3 Min", "Kostenlos", "Keine Anmeldung"

---

## 2. Hero-Buttons Anpassung

**Datei:** `src/components/sections/Hero.tsx`

**Änderungen:**
- "Wie gut kannst du traden?" Button: Bleibt, führt zu `/quiz`
- "Member Login" Button: Bleibt, führt zu `/login`
- Der Video-Platzhalter (9:16) wird klickbar und führt ebenfalls zum Quiz (später Video-Funnel)

---

## 3. QuizLanding visuell überarbeiten

**Datei:** `src/components/quiz/QuizLanding.tsx`

**Verbesserungen:**
- Animierte Trading-Level-Badges die durch die 4 Levels rotieren
- Glassmorphism-Karte statt nur Text
- 3 Trust-Badges nebeneinander (Dauer, Kostenlos, Personalisiert)
- Subtile Chart-Pattern im Hintergrund
- Animierte Unterstrich-Linie unter "Trading-Level"
- Sanftere Farbverläufe

---

## 4. QuizQuestion visuell aufwerten

**Datei:** `src/components/quiz/QuizQuestion.tsx`

**Verbesserungen:**
- Bessere Hover-States mit Gold-Akzent
- Subtile Glassmorphism-Effekte verstärken
- Animierte Checkmarks bei Auswahl
- Chart-Frage: Echtes Chart-Bild statt Emoji-Platzhalter
- Progress-Indikator mit Glow-Effekt

---

## 5. QuizProgress aufwerten

**Datei:** `src/components/quiz/QuizProgress.tsx`

**Verbesserungen:**
- Animierte Progress-Bar mit Gold-Gradient
- Schritt-Nummern mit subtiler Animation
- "Frage X von Y" Text dezenter

---

## 6. Homepage Integration

**Datei:** `src/pages/Index.tsx`

Die neue `HomepageQuizTeaser`-Komponente wird als separate Sektion eingefügt (optional nach Features oder vor Pricing).

---

## Technische Details

### HomepageQuizTeaser Struktur:
```text
+---------------------------------------+
|   Glassmorphism Card                  |
|                                       |
|   [Trading-Level Animation]           |
|   Einsteiger -> Profi                 |
|                                       |
|   "Finde in 3 Min heraus..."          |
|                                       |
|   [=== Wie gut tradest du? ===]       |
|                                       |
|   3 Min • Kostenlos • Personalisiert  |
+---------------------------------------+
```

### QuizLanding Neues Layout:
```text
+---------------------------------------+
|   Subtle Chart Background Pattern     |
|                                       |
|   [Level Badge Animation]             |
|   Einsteiger ▸ Fortgeschritten ▸ Pro  |
|                                       |
|   "Welches Programm passt zu dir?"    |
|   ~~~~~~~~~~~~~~~                     |
|                                       |
|   [=== Analyse starten ===]           |
|                                       |
|   🕐 3 Min  •  ✓ Kostenlos  •  🎯     |
+---------------------------------------+
```

### Bestehende Quiz-Logik:
- Die 12 Fragen und Scoring-Logik in `quiz-data.ts` bleiben unverändert
- Nur visuelle Komponenten werden aufgewertet

---

## Dateien die erstellt werden:
1. `src/components/sections/HomepageQuizTeaser.tsx` (neu)

## Dateien die bearbeitet werden:
1. `src/components/sections/Hero.tsx` - Video-Platzhalter klickbar machen
2. `src/components/quiz/QuizLanding.tsx` - Visuelles Upgrade
3. `src/components/quiz/QuizQuestion.tsx` - Visuelles Upgrade
4. `src/components/quiz/QuizProgress.tsx` - Visuelles Upgrade
5. `src/pages/Index.tsx` - HomepageQuizTeaser optional einbinden

