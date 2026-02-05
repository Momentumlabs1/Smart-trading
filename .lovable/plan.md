

# Fix: Video-Funnel Click-Handler reparieren

## Problem identifiziert

Der Video-Funnel funktioniert - das Widget unten rechts öffnet das Video korrekt. Aber der Klick auf den Platzhalter im Hero ruft `window.openFunnel()` auf, was **nicht existiert**.

Das Embed-Script registriert seine Funktion wahrscheinlich unter einem anderen Namen oder als Teil eines Objekts.

---

## Lösung

### Strategie 1: Widget-Button programmatisch klicken

Da der blaue Button unten rechts funktioniert, können wir dessen Click-Event auslösen:

```typescript
const handleClick = () => {
  // Finde den Widget-Button und klicke ihn
  const widgetButton = document.querySelector('[data-funnel-widget]') 
    || document.querySelector('.funnel-widget-button')
    || document.querySelector('div[style*="position: fixed"][style*="bottom"]');
  
  if (widgetButton instanceof HTMLElement) {
    widgetButton.click();
  }
};
```

### Strategie 2: Iframe direkt öffnen (Fallback)

Falls das Widget als iframe eingebettet wird:

```typescript
const handleClick = () => {
  // Versuche verschiedene mögliche API-Methoden
  if (typeof window.openFunnel === 'function') {
    window.openFunnel();
  } else if (typeof (window as any).FunnelWidget?.open === 'function') {
    (window as any).FunnelWidget.open();
  } else {
    // Fallback: Widget-Element finden und klicken
    const widget = document.getElementById('funnel-widget-root')
      || document.querySelector('[class*="funnel"]');
    if (widget instanceof HTMLElement) {
      widget.click();
    }
  }
};
```

---

## Technische Änderungen

### `src/components/VideoFunnel.tsx`

```typescript
const handleClick = () => {
  // Methode 1: Standard openFunnel Funktion
  if (typeof window.openFunnel === 'function') {
    window.openFunnel();
    return;
  }
  
  // Methode 2: Widget-Button finden und klicken
  // Der Embed erstellt einen Button unten rechts - wir simulieren dessen Klick
  const widgetRoot = document.getElementById('funnel-widget-root');
  if (widgetRoot) {
    const button = widgetRoot.querySelector('button') || widgetRoot;
    if (button instanceof HTMLElement) {
      button.click();
      return;
    }
  }
  
  // Methode 3: Alle fixed position Elemente durchsuchen
  const fixedElements = document.querySelectorAll('[style*="position: fixed"]');
  fixedElements.forEach((el) => {
    if (el.getAttribute('style')?.includes('bottom') && el instanceof HTMLElement) {
      el.click();
    }
  });
};
```

---

## Dateien

| Datei | Änderung |
|-------|----------|
| `src/components/VideoFunnel.tsx` | Click-Handler mit Fallback-Strategien |

---

## Alternative: autoOpen aktivieren

Falls gewünscht können wir das Widget auch so konfigurieren, dass es automatisch öffnet:

```typescript
window.FUNNEL_EMBED_CONFIG = {
  funnelId: "smart-trading-v6",
  type: "widget",
  position: "bottom-right",
  autoOpen: true  // ← Öffnet automatisch beim Laden
};
```

Aber das ist wahrscheinlich nicht gewünscht, da der User zuerst die Seite sehen sollte.

