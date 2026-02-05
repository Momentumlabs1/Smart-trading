
# SmartTrading Academy - Finalisierungsplan

## Status-Übersicht

### Bereits implementiert
- **Backend (100% fertig)**
  - 24 Datenbank-Tabellen mit RLS Policies
  - Alle API Services in `src/lib/api.ts`
  - TypeScript-Typen in `src/lib/supabase.ts`
  - Auth-Trigger für automatische Profilerstellung

- **Academy Pages (4 von 10 fertig)**
  - Login, Register, Dashboard, CourseList

### Noch zu implementieren

| Priorität | Page | Beschreibung |
|-----------|------|--------------|
| 1 | CoursePlayer | Video-Player mit Progress-Tracking |
| 1 | Pricing | 3-Tier Pricing Cards |
| 2 | Settings | Profil, Account, Benachrichtigungen |
| 2 | Community | Forum mit Posts & Comments |
| 3 | TelegramBot | Bot-Info & Connection |
| 3 | BotDownload | Bot-Verkaufsseite |
| 3 | Auth Protection | Route Guards |

---

## Phase 1: Course Player (Kern-Funktionalität)

### `src/pages/academy/CoursePlayer.tsx`
**Features:**
- Video-Embed mit automatischem Progress-Tracking
- Kurs-Sidebar mit Modulen & Lektionen
- Fortschrittsanzeige pro Lektion (nicht gestartet/in Bearbeitung/abgeschlossen)
- Navigation zur nächsten/vorherigen Lektion
- Resume-Funktion (letzte Position)
- 90%-Regel für Completion

**API-Nutzung:**
```typescript
courseService.getCourseDetails(slug)
progressService.updateVideoProgress(...)
progressService.markLessonComplete(...)
```

---

## Phase 2: Pricing Page

### `src/pages/academy/Pricing.tsx`
**Features:**
- 3 Premium Cards (Starter/Academy/Elite)
- Animierte Feature-Listen mit Checkmarks
- "Beliebt" Badge für Academy
- Tier-Vergleichstabelle
- CTA Buttons mit Hover-Effekten
- Responsive Grid (3-2-1 Spalten)

**Preisstruktur:**
| Tier | Preis | Features |
|------|-------|----------|
| Starter | Kostenlos | 7 Videos, 10 Bot-Anfragen/Tag |
| Academy | 99€/Monat | 50+ Videos, Unlimited Bot, Community |
| Elite | 1.950€ | 1:1 Mentoring, WhatsApp, Office |

---

## Phase 3: Settings Page

### `src/pages/academy/Settings.tsx`
**Tabs:**
1. **Profil** - Avatar, Name, Bio
2. **Account** - Email, Passwort ändern
3. **Benachrichtigungen** - Email/Telegram Toggles
4. **Billing** - Aktueller Plan, Upgrade-Buttons

**API-Nutzung:**
```typescript
profileService.updateProfile(...)
authService.updateEmail(...)
authService.updatePassword(...)
```

---

## Phase 4: Community Forum

### `src/pages/academy/Community.tsx`
**Features:**
- Post-Liste mit Author, Upvotes, Comments
- "Neuer Post" Modal mit Formular
- Filter: Neu, Beliebt, Meine Posts
- Post-Detail mit Kommentaren
- Tier-Check (nur Academy/Elite)

**API-Nutzung:**
```typescript
communityService.getPosts()
communityService.createPost()
communityService.addComment()
```

---

## Phase 5: Telegram Bot Page

### `src/pages/academy/TelegramBot.tsx`
**Features:**
- Feature-Showcase (Chart-Analyse, 24/7)
- Connection-Anleitung
- Rate-Limit Anzeige (Starter: X/10)
- Upgrade-CTA für Starter

---

## Phase 6: Bot Download Page

### `src/pages/academy/BotDownload.tsx`
**Features:**
- Product Landing Section
- Backtesting-Ergebnisse
- Preis-Card (497€)
- Nach Kauf: License Key + Download

---

## Phase 7: Route Protection & Auth Context

### `src/contexts/AuthContext.tsx`
**Features:**
- Globaler Auth-State
- `useAuth()` Hook
- Auto-Redirect bei fehlender Session

### `src/components/ProtectedRoute.tsx`
**Features:**
- Wrapper für geschützte Routes
- Loading-State während Auth-Check
- Redirect zu Login

---

## Phase 8: Finale Routing Updates

### `src/App.tsx` Updates
```text
/academy/courses/:slug     → CoursePlayer
/academy/courses/:slug/:lessonId → CoursePlayer (spezifische Lektion)
/academy/pricing           → Pricing
/academy/settings          → Settings
/academy/community         → Community
/academy/telegram          → TelegramBot
/academy/bot               → BotDownload
```

---

## Technische Details

### Styling (konsistent mit bestehenden Pages)
- Glass-Morphism Cards
- Primary Color für CTAs
- Motion Animationen
- Responsive Grid-Layouts

### Komponenten-Struktur
```text
src/pages/academy/
├── Login.tsx ✓
├── Register.tsx ✓
├── Dashboard.tsx ✓
├── CourseList.tsx ✓
├── CoursePlayer.tsx (neu)
├── Pricing.tsx (neu)
├── Settings.tsx (neu)
├── Community.tsx (neu)
├── TelegramBot.tsx (neu)
└── BotDownload.tsx (neu)

src/contexts/
└── AuthContext.tsx (neu)

src/components/
└── ProtectedRoute.tsx (neu)
```

---

## Geschätzte Implementierungszeit

| Phase | Komponenten | Zeit |
|-------|-------------|------|
| 1 | CoursePlayer | Komplex |
| 2 | Pricing | Mittel |
| 3 | Settings | Mittel |
| 4 | Community | Mittel |
| 5 | TelegramBot | Einfach |
| 6 | BotDownload | Einfach |
| 7 | Auth Context | Mittel |
| 8 | Routing | Einfach |

---

## Ergebnis nach Implementierung

- Vollständige Academy-Plattform mit 10 Pages
- User-Authentication mit Session-Management
- Kurs-System mit Video-Progress-Tracking
- Community-Forum für Academy/Elite User
- 3-Tier Pricing mit Upgrade-Flow
- Telegram Bot Integration
- Trading Bot Verkaufsseite
- Responsive Design für alle Viewports
