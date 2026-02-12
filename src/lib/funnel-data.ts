// Funnel Data für smart-trading-v6
// Extrahiert aus dem standalone HTML Export

export interface FunnelNode {
  id: string;
  type: 'start' | 'video' | 'leadCapture' | 'end';
  position: { x: number; y: number };
  data: {
    label?: string;
    name?: string;
    videoUrl?: string;
    overlayText?: string;
    description?: string;
    answerType?: 'button' | 'multipleChoice' | 'yesno' | 'text' | 'email' | 'rating' | 'none';
    answers?: string[];
    buttonText?: string;
    buttonColor?: string;
    buttonHeight?: string;
    delaySeconds?: number;
    delayBeforeButtons?: number;
    timedVisibility?: boolean;
    visibilityStartTime?: number;
    visibilityDuration?: number;
    yesText?: string;
    noText?: string;
    placeholder?: string;
    nextNodes?: Record<string, string>;
    // Lead Capture
    title?: string;
    fields?: string[];
    optInText?: string;
    // End
    message?: string;
    redirectUrl?: string;
    // MC specific
    mcLayout?: string;
    mcColor_0?: string;
    mcColor_1?: string;
    mcStyle_0?: string;
    mcStyle_1?: string;
    mcButtonWidth?: string;
    mcButtonHeight?: string;
    inputWidth?: string;
    inputHeight?: string;
    submitButtonColor?: string;
    submitButtonStyle?: string;
    submitButtonWidth?: string;
    submitButtonHeight?: string;
  };
}

export interface FunnelEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export interface FunnelData {
  name: string;
  nodes: FunnelNode[];
  edges: FunnelEdge[];
}

export const FUNNEL_DATA: FunnelData = {
  "name": "smart-trading-v6",
  "nodes": [
    {
      "id": "start",
      "type": "start",
      "position": { "x": 0, "y": -200 },
      "data": { "label": "Start" }
    },
    {
      "id": "v1-begruessung",
      "type": "video",
      "position": { "x": -73.82, "y": -14.76 },
      "data": {
        "name": "V1: Begrüßung",
        "answers": ["Saif kennenlernen", "Überspringen"],
        "mcLayout": "vertical",
        "videoUrl": "https://rqjwroreqihyqyktucvj.supabase.co/storage/v1/object/public/videos/videos/7c913196-f67a-416c-8272-8da3eba77fd2.mp4",
        "mcColor_0": "orange",
        "mcColor_1": "orange",
        "mcStyle_0": "gradient",
        "mcStyle_1": "gradient",
        "answerType": "multipleChoice",
        "buttonText": "Weiter",
        "description": "Hey ich bin Saif - Mehr Info? Ja/Nein",
        "overlayText": "Willst du erstmal mehr über mich wissen? Oder sollen wir direkt zum Trading-Part?",
        "delaySeconds": 7,
        "mcButtonWidth": "2xl",
        "mcButtonHeight": "3xl",
        "timedVisibility": false,
        "visibilityStartTime": 0
      }
    },
    {
      "id": "v2a-story",
      "type": "video",
      "position": { "x": 711.56, "y": -224.84 },
      "data": {
        "name": "V2a: Saif Story",
        "videoUrl": "https://rqjwroreqihyqyktucvj.supabase.co/storage/v1/object/public/videos/videos/8fd4dfcf-fd37-4359-a9c2-828c1d557ca0.mp4",
        "answerType": "text",
        "buttonText": "Weiter",
        "inputWidth": "large",
        "description": "Meine Geschichte - 10 Jahre Trading, 2 Jahre Katastrophe, dann der Durchbruch",
        "inputHeight": "3xl",
        "overlayText": "",
        "delaySeconds": 0,
        "submitButtonColor": "green",
        "submitButtonStyle": "solid",
        "submitButtonWidth": "3xl",
        "submitButtonHeight": "xl"
      }
    },
    {
      "id": "v2b-direkt",
      "type": "video",
      "position": { "x": 525.47, "y": 557.33 },
      "data": {
        "name": "V2b: Direkt los",
        "videoUrl": "https://rqjwroreqihyqyktucvj.supabase.co/storage/v1/object/public/videos/videos/59d33b35-a9bd-4710-9a3e-c66d33f8a559.mp4",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Okay okay – da hats jemand eilig!",
        "overlayText": "",
        "delaySeconds": 15
      }
    },
    {
      "id": "v3b-ueberleitung",
      "type": "video",
      "position": { "x": 1020.96, "y": 571.78 },
      "data": {
        "name": "V3b: Überleitung Direkt",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Also, sag mir: Wo stehst du gerade?",
        "overlayText": "",
        "delaySeconds": 10
      }
    },
    {
      "id": "v4-level-frage",
      "type": "video",
      "position": { "x": 1704, "y": 696 },
      "data": {
        "name": "V4: Level-Frage",
        "answers": ["🟢 Ich fang gerade erst an", "🟡 Ich trade schon, aber noch nicht profitabel"],
        "videoUrl": "",
        "answerType": "multipleChoice",
        "buttonText": "Weiter",
        "description": "Anfänger oder schon dabei? Die große Weiche.",
        "overlayText": "Fängst du gerade erst an mit Trading? Oder tradest du schon?",
        "delaySeconds": 20
      }
    },
    {
      "id": "a1-level",
      "type": "video",
      "position": { "x": 2180, "y": 800 },
      "data": {
        "name": "A1: Level auffangen",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Du fängst gerade erst an – perfekt. Das ist ein Vorteil.",
        "overlayText": "",
        "delaySeconds": 20
      }
    },
    {
      "id": "a2-motivation",
      "type": "video",
      "position": { "x": -500, "y": 1392 },
      "data": {
        "name": "A2: Frage Motivation",
        "answers": ["Nebeneinkommen 500-2000€", "Finanzielle Freiheit", "Erstmal verstehen"],
        "videoUrl": "",
        "answerType": "multipleChoice",
        "buttonText": "Weiter",
        "description": "Was willst du mit Trading erreichen?",
        "overlayText": "Was ist dein Ziel?",
        "delaySeconds": 15
      }
    },
    {
      "id": "a3a-nebeneinkommen",
      "type": "video",
      "position": { "x": -24, "y": 1392 },
      "data": {
        "name": "A3a: Nebeneinkommen",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "500-2000€ extra – solider Plan, realistisch, machbar.",
        "overlayText": "",
        "delaySeconds": 25
      }
    },
    {
      "id": "a3b-freiheit",
      "type": "video",
      "position": { "x": 976, "y": 1392 },
      "data": {
        "name": "A3b: Finanzielle Freiheit",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Großes Ziel. Respekt. Ist möglich – ich leb davon.",
        "overlayText": "",
        "delaySeconds": 25
      }
    },
    {
      "id": "a3c-verstehen",
      "type": "video",
      "position": { "x": 1452, "y": 1392 },
      "data": {
        "name": "A3c: Verstehen",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Bester Startpunkt überhaupt. Keine Gier, keine unrealistischen Erwartungen.",
        "overlayText": "",
        "delaySeconds": 25
      }
    },
    {
      "id": "a4-blockade",
      "type": "video",
      "position": { "x": 3356, "y": 1496 },
      "data": {
        "name": "A4: Frage Blockade",
        "answers": ["Angst vor Verlusten", "Überforderung", "Keine Zeit", "Vertraue keinem Coach"],
        "videoUrl": "",
        "answerType": "multipleChoice",
        "buttonText": "Weiter",
        "description": "Was hält dich aktuell zurück?",
        "overlayText": "Was ist die Blockade?",
        "delaySeconds": 15
      }
    },
    {
      "id": "a5a-angst",
      "type": "video",
      "position": { "x": -725, "y": 2088 },
      "data": {
        "name": "A5a: Angst",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Angst ist berechtigt. Du WIRST verlieren – aber kontrolliert.",
        "overlayText": "",
        "delaySeconds": 35
      }
    },
    {
      "id": "a5b-ueberforderung",
      "type": "video",
      "position": { "x": -249, "y": 2088 },
      "data": {
        "name": "A5b: Überforderung",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "10 Mio YouTube Videos die sich widersprechen. Du brauchst EINEN Pfad.",
        "overlayText": "",
        "delaySeconds": 35
      }
    },
    {
      "id": "a5c-zeit",
      "type": "video",
      "position": { "x": 227, "y": 2088 },
      "data": {
        "name": "A5c: Zeit",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Swing Trading: 30 Min am Tag reichen. Morgens oder abends Charts checken.",
        "overlayText": "",
        "delaySeconds": 35
      }
    },
    {
      "id": "a5d-vertrauen",
      "type": "video",
      "position": { "x": 703, "y": 2088 },
      "data": {
        "name": "A5d: Vertrauen",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Gut so. Trading-Industrie voll mit Betrügern. Ich muss mir dein Vertrauen verdienen.",
        "overlayText": "",
        "delaySeconds": 35
      }
    },
    {
      "id": "a6-ressourcen",
      "type": "video",
      "position": { "x": 3083, "y": 2192 },
      "data": {
        "name": "A6: Frage Ressourcen",
        "answers": ["Klein – wenig Zeit, wenig Geld", "Mittel – paar Stunden, bisschen Kapital", "All-in – ich bin ready"],
        "videoUrl": "",
        "answerType": "multipleChoice",
        "buttonText": "Weiter",
        "description": "Wie viel Zeit und Geld könntest du investieren?",
        "overlayText": "Klein starten, mittel, oder all-in?",
        "delaySeconds": 15
      }
    },
    {
      "id": "a7a-klein",
      "type": "video",
      "position": { "x": 4035, "y": 2192 },
      "data": {
        "name": "A7a: Klein",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Absolut okay. Erstmal Demo, kostet nichts. 30 Min am Tag reichen.",
        "overlayText": "",
        "delaySeconds": 25
      }
    },
    {
      "id": "a7b-mittel",
      "type": "video",
      "position": { "x": 4511, "y": 2192 },
      "data": {
        "name": "A7b: Mittel",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Perfekte Ausgangslage. Genug zum Lernen, nicht genug um alles zu verlieren.",
        "overlayText": "",
        "delaySeconds": 25
      }
    },
    {
      "id": "a7c-allin",
      "type": "video",
      "position": { "x": 4987, "y": 2192 },
      "data": {
        "name": "A7c: All-in",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Liebe die Energie. ABER: Auch mit viel Ressourcen – langsam aufbauen.",
        "overlayText": "",
        "delaySeconds": 25
      }
    },
    {
      "id": "a8-loesung",
      "type": "video",
      "position": { "x": 6891, "y": 2200 },
      "data": {
        "name": "A8: Lösung",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Zeig mir die Lösung",
        "description": "Zusammenfassung: Grundlagen, simple Strategie, Demo-zu-Live Plan.",
        "overlayText": "",
        "delaySeconds": 40
      }
    },
    {
      "id": "a9-produkt",
      "type": "video",
      "position": { "x": -500, "y": 2784 },
      "data": {
        "name": "A9: Produkt",
        "answers": ["Zeig mir das Starter-Programm", "Erstmal kostenloser E-Mail-Kurs", "Ich hab noch Fragen"],
        "videoUrl": "",
        "answerType": "multipleChoice",
        "buttonText": "Auswählen",
        "description": "Starter Programm + kostenloser 5-Tage E-Mail-Kurs",
        "overlayText": "",
        "delaySeconds": 45
      }
    },
    {
      "id": "f1-level",
      "type": "video",
      "position": { "x": 2656, "y": 800 },
      "data": {
        "name": "F1: Level auffangen",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Du tradest schon, bist aber noch nicht profitabel. Die härteste Phase.",
        "overlayText": "",
        "delaySeconds": 25
      }
    },
    {
      "id": "f2-situation",
      "type": "video",
      "position": { "x": 500, "y": 1392 },
      "data": {
        "name": "F2: Frage Situation",
        "answers": ["Ich verliere mehr als ich gewinne", "Break-Even – mal plus, mal minus", "Komplett inkonsistent"],
        "videoUrl": "",
        "answerType": "multipleChoice",
        "buttonText": "Weiter",
        "description": "Wie siehts bei dir gerade aus?",
        "overlayText": "Verlierst du, Break-Even, oder random?",
        "delaySeconds": 15
      }
    },
    {
      "id": "f3a-verlust",
      "type": "video",
      "position": { "x": 1928, "y": 1496 },
      "data": {
        "name": "F3a: Verlust",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Hart aber gut – es gibt ein KLARES Problem das wir finden können.",
        "overlayText": "",
        "delaySeconds": 30
      }
    },
    {
      "id": "f3b-breakeven",
      "type": "video",
      "position": { "x": 2404, "y": 1496 },
      "data": {
        "name": "F3b: Break-Even",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Du bist besser als 80% der Trader. Oft nur ein kleiner Shift nötig.",
        "overlayText": "",
        "delaySeconds": 30
      }
    },
    {
      "id": "f3c-inkonsistent",
      "type": "video",
      "position": { "x": 2880, "y": 1496 },
      "data": {
        "name": "F3c: Inkonsistent",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Keine klare Strategie oder du hältst dich nicht dran. Beides lösbar.",
        "overlayText": "",
        "delaySeconds": 30
      }
    },
    {
      "id": "f4-problem",
      "type": "video",
      "position": { "x": 3832, "y": 1496 },
      "data": {
        "name": "F4: Frage Problem",
        "answers": ["Strategie – hab keine die funktioniert", "Emotionen – halt mich nicht an Regeln", "Risk Management – verlier zu viel", "Weiß ich nicht"],
        "videoUrl": "",
        "answerType": "multipleChoice",
        "buttonText": "Weiter",
        "description": "Was ist dein größtes Problem?",
        "overlayText": "Strategie, Emotionen, oder Risk Management?",
        "delaySeconds": 15
      }
    },
    {
      "id": "f5a-strategie",
      "type": "video",
      "position": { "x": 1179, "y": 2088 },
      "data": {
        "name": "F5a: Strategie",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Du springst von System zu System. Du brauchst EIN System.",
        "overlayText": "",
        "delaySeconds": 35
      }
    },
    {
      "id": "f5b-emotionen",
      "type": "video",
      "position": { "x": 1655, "y": 2192 },
      "data": {
        "name": "F5b: Emotionen",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Das HÄRTESTE Problem. Du brauchst Accountability.",
        "overlayText": "",
        "delaySeconds": 35
      }
    },
    {
      "id": "f5c-risk",
      "type": "video",
      "position": { "x": 2131, "y": 2192 },
      "data": {
        "name": "F5c: Risk Management",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Der EINFACHSTE Fix. Klare Regeln, konsequent durchziehen.",
        "overlayText": "",
        "delaySeconds": 35
      }
    },
    {
      "id": "f5d-weissnicht",
      "type": "video",
      "position": { "x": 2607, "y": 2192 },
      "data": {
        "name": "F5d: Weiß nicht",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Blinder Fleck. Mit Blick von außen oft in 5 Min klar.",
        "overlayText": "",
        "delaySeconds": 35
      }
    },
    {
      "id": "f6-ziel",
      "type": "video",
      "position": { "x": 3559, "y": 2192 },
      "data": {
        "name": "F6: Frage Ziel",
        "answers": ["Endlich profitabel werden", "Prop-Firm Challenge bestehen", "Trading zum Hauptjob machen"],
        "videoUrl": "",
        "answerType": "multipleChoice",
        "buttonText": "Weiter",
        "description": "Was ist dein Ziel für die nächsten 12 Monate?",
        "overlayText": "Profitabel, Prop-Firm, oder Vollzeit?",
        "delaySeconds": 15
      }
    },
    {
      "id": "f7a-profitabel",
      "type": "video",
      "position": { "x": 5463, "y": 2192 },
      "data": {
        "name": "F7a: Profitabel",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Der Klassiker. Komplett erreichbar mit Strategie und Disziplin.",
        "overlayText": "",
        "delaySeconds": 25
      }
    },
    {
      "id": "f7b-propfirm",
      "type": "video",
      "position": { "x": 5939, "y": 2192 },
      "data": {
        "name": "F7b: Prop-Firm",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Smarter Move. ABER: Challenges sind designed damit du scheiterst.",
        "overlayText": "",
        "delaySeconds": 25
      }
    },
    {
      "id": "f7c-vollzeit",
      "type": "video",
      "position": { "x": 6415, "y": 2192 },
      "data": {
        "name": "F7c: Vollzeit",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Weiter",
        "description": "Großer Schritt. Mind. 12 Monate profitabel + 6 Monate Rücklagen.",
        "overlayText": "",
        "delaySeconds": 25
      }
    },
    {
      "id": "f8-loesung",
      "type": "video",
      "position": { "x": 7367, "y": 2200 },
      "data": {
        "name": "F8: Lösung",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Zeig mir die Lösung",
        "description": "Du brauchst: EIN System, Feedback, Accountability.",
        "overlayText": "",
        "delaySeconds": 40
      }
    },
    {
      "id": "f9-produkt",
      "type": "video",
      "position": { "x": 500, "y": 2784 },
      "data": {
        "name": "F9: Produkt",
        "answers": ["Zeig mir das Coaching", "Zum kostenlosen Workshop", "Ich will erstmal reden"],
        "videoUrl": "",
        "answerType": "multipleChoice",
        "buttonText": "Auswählen",
        "description": "8-Wochen Coaching + kostenloser Live-Workshop",
        "overlayText": "",
        "delaySeconds": 50
      }
    },
    {
      "id": "abschluss",
      "type": "video",
      "position": { "x": 0, "y": 2800 },
      "data": {
        "name": "Abschluss",
        "videoUrl": "",
        "answerType": "button",
        "buttonText": "Fertig ✅",
        "description": "Willkommen bei Smart Trading. Check deine Mails. DMs sind offen.",
        "overlayText": "Schon profitabel und willst aufs nächste Level? Schreib mir direkt.",
        "delaySeconds": 35
      }
    },
    {
      "id": "lead-capture",
      "type": "leadCapture",
      "position": { "x": 0, "y": 3496 },
      "data": {
        "label": "Lead Capture",
        "title": "Deine Trading-Analyse 📊",
        "fields": ["firstName", "lastName", "email", "phone"],
        "optInText": "Ich möchte weitere Informationen erhalten",
        "description": "Trag dich ein – ich schau mir deine Antworten persönlich an."
      }
    },
    {
      "id": "end",
      "type": "end",
      "position": { "x": 416, "y": 3496 },
      "data": {
        "label": "Ende",
        "title": "Check deine Mails! 📧",
        "message": "Wenn ich Potential sehe, melde ich mich persönlich. DMs sind offen – bis bald!",
        "redirectUrl": ""
      }
    }
  ],
  "edges": [
    { "id": "e-start-v1", "source": "start", "target": "v1-begruessung", "type": "custom" },
    { "id": "e-v1-v2a", "source": "v1-begruessung", "target": "v2a-story", "type": "custom" },
    { "id": "e-v1-v2b", "source": "v1-begruessung", "target": "v2b-direkt", "type": "custom" },
    { "id": "e-v2a-v4", "source": "v2a-story", "target": "v4-level-frage", "type": "custom" },
    { "id": "e-v2b-v3b", "source": "v2b-direkt", "target": "v3b-ueberleitung", "type": "custom" },
    { "id": "e-v3b-v4", "source": "v3b-ueberleitung", "target": "v4-level-frage", "type": "custom" },
    { "id": "e-v4-a1", "source": "v4-level-frage", "target": "a1-level", "type": "custom" },
    { "id": "e-a1-a2", "source": "a1-level", "target": "a2-motivation", "type": "custom" },
    { "id": "e-a2-a3a", "source": "a2-motivation", "target": "a3a-nebeneinkommen", "type": "custom" },
    { "id": "e-a2-a3b", "source": "a2-motivation", "target": "a3b-freiheit", "type": "custom" },
    { "id": "e-a2-a3c", "source": "a2-motivation", "target": "a3c-verstehen", "type": "custom" },
    { "id": "e-a3a-a4", "source": "a3a-nebeneinkommen", "target": "a4-blockade", "type": "custom" },
    { "id": "e-a3b-a4", "source": "a3b-freiheit", "target": "a4-blockade", "type": "custom" },
    { "id": "e-a3c-a4", "source": "a3c-verstehen", "target": "a4-blockade", "type": "custom" },
    { "id": "e-a4-a5a", "source": "a4-blockade", "target": "a5a-angst", "type": "custom" },
    { "id": "e-a4-a5b", "source": "a4-blockade", "target": "a5b-ueberforderung", "type": "custom" },
    { "id": "e-a4-a5c", "source": "a4-blockade", "target": "a5c-zeit", "type": "custom" },
    { "id": "e-a4-a5d", "source": "a4-blockade", "target": "a5d-vertrauen", "type": "custom" },
    { "id": "e-a5a-a6", "source": "a5a-angst", "target": "a6-ressourcen", "type": "custom" },
    { "id": "e-a5b-a6", "source": "a5b-ueberforderung", "target": "a6-ressourcen", "type": "custom" },
    { "id": "e-a5c-a6", "source": "a5c-zeit", "target": "a6-ressourcen", "type": "custom" },
    { "id": "e-a5d-a6", "source": "a5d-vertrauen", "target": "a6-ressourcen", "type": "custom" },
    { "id": "e-a6-a7a", "source": "a6-ressourcen", "target": "a7a-klein", "type": "custom" },
    { "id": "e-a6-a7b", "source": "a6-ressourcen", "target": "a7b-mittel", "type": "custom" },
    { "id": "e-a6-a7c", "source": "a6-ressourcen", "target": "a7c-allin", "type": "custom" },
    { "id": "e-a7a-a8", "source": "a7a-klein", "target": "a8-loesung", "type": "custom" },
    { "id": "e-a7b-a8", "source": "a7b-mittel", "target": "a8-loesung", "type": "custom" },
    { "id": "e-a7c-a8", "source": "a7c-allin", "target": "a8-loesung", "type": "custom" },
    { "id": "e-a8-a9", "source": "a8-loesung", "target": "a9-produkt", "type": "custom" },
    { "id": "e-v4-f1", "source": "v4-level-frage", "target": "f1-level", "type": "custom" },
    { "id": "e-f1-f2", "source": "f1-level", "target": "f2-situation", "type": "custom" },
    { "id": "e-f2-f3a", "source": "f2-situation", "target": "f3a-verlust", "type": "custom" },
    { "id": "e-f2-f3b", "source": "f2-situation", "target": "f3b-breakeven", "type": "custom" },
    { "id": "e-f2-f3c", "source": "f2-situation", "target": "f3c-inkonsistent", "type": "custom" },
    { "id": "e-f3a-f4", "source": "f3a-verlust", "target": "f4-problem", "type": "custom" },
    { "id": "e-f3b-f4", "source": "f3b-breakeven", "target": "f4-problem", "type": "custom" },
    { "id": "e-f3c-f4", "source": "f3c-inkonsistent", "target": "f4-problem", "type": "custom" },
    { "id": "e-f4-f5a", "source": "f4-problem", "target": "f5a-strategie", "type": "custom" },
    { "id": "e-f4-f5b", "source": "f4-problem", "target": "f5b-emotionen", "type": "custom" },
    { "id": "e-f4-f5c", "source": "f4-problem", "target": "f5c-risk", "type": "custom" },
    { "id": "e-f4-f5d", "source": "f4-problem", "target": "f5d-weissnicht", "type": "custom" },
    { "id": "e-f5a-f6", "source": "f5a-strategie", "target": "f6-ziel", "type": "custom" },
    { "id": "e-f5b-f6", "source": "f5b-emotionen", "target": "f6-ziel", "type": "custom" },
    { "id": "e-f5c-f6", "source": "f5c-risk", "target": "f6-ziel", "type": "custom" },
    { "id": "e-f5d-f6", "source": "f5d-weissnicht", "target": "f6-ziel", "type": "custom" },
    { "id": "e-f6-f7a", "source": "f6-ziel", "target": "f7a-profitabel", "type": "custom" },
    { "id": "e-f6-f7b", "source": "f6-ziel", "target": "f7b-propfirm", "type": "custom" },
    { "id": "e-f6-f7c", "source": "f6-ziel", "target": "f7c-vollzeit", "type": "custom" },
    { "id": "e-f7a-f8", "source": "f7a-profitabel", "target": "f8-loesung", "type": "custom" },
    { "id": "e-f7b-f8", "source": "f7b-propfirm", "target": "f8-loesung", "type": "custom" },
    { "id": "e-f7c-f8", "source": "f7c-vollzeit", "target": "f8-loesung", "type": "custom" },
    { "id": "e-f8-f9", "source": "f8-loesung", "target": "f9-produkt", "type": "custom" },
    { "id": "e-a9-abschluss", "source": "a9-produkt", "target": "abschluss", "type": "custom" },
    { "id": "e-f9-abschluss", "source": "f9-produkt", "target": "abschluss", "type": "custom" },
    { "id": "e-abschluss-lead", "source": "abschluss", "target": "lead-capture", "type": "custom" },
    { "id": "e-lead-end", "source": "lead-capture", "target": "end", "type": "custom" }
  ]
};

// Node order for sequential fallback
export const NODE_ORDER = [
  "v2a-story", "v1-begruessung", "v2b-direkt", "v3b-ueberleitung",
  "v4-level-frage", "a1-level", "f1-level", "a2-motivation", "a3a-nebeneinkommen",
  "f2-situation", "a3b-freiheit", "a3c-verstehen", "f3a-verlust", "f3b-breakeven",
  "f3c-inkonsistent", "a4-blockade", "f4-problem", "a5a-angst", "a5b-ueberforderung",
  "a5c-zeit", "a5d-vertrauen", "f5a-strategie", "f5b-emotionen", "f5c-risk",
  "f5d-weissnicht", "a6-ressourcen", "f6-ziel", "a7a-klein", "a7b-mittel",
  "a7c-allin", "f7a-profitabel", "f7b-propfirm", "f7c-vollzeit", "a8-loesung",
  "f8-loesung", "a9-produkt", "f9-produkt", "abschluss", "lead-capture", "end"
];
