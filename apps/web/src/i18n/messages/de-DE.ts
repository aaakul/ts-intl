export default {
  nav: {
    docs: "Dokumentation",
    github: "GitHub",
    themeToggle: "Design umschalten",
    switchLanguage: "Sprache",
  },
  hero: {
    badge: "Keine Abhängigkeiten · Typsicherheit · Framework-agnostisch",
    title: "Internationalisierung für modernes TypeScript",
    getStarted: "Erste Schritte",
    github: "GitHub",
    astroBadge: "Astro-Integration verfügbar",
    astroIntegration: "Astro-Leitfaden",
    tabAstro: "Component.astro",
    tabMessages: "de-DE.ts",
    tabConfig: "i18n.ts",
    tabOutput: "HTML-Ausgabe",
  },
  features: {
    typeSafetyTitle: "Typsicherheit",
    typeSafetyDesc:
      "Bietet TypeScript-Typinferenz für Übersetzungsschlüssel, Namespaces und Parameter und validiert die Konsistenz der Schemata über alle Sprachen hinweg.",
    zeroDepTitle: "Keine Laufzeitabhängigkeiten",
    zeroDepDesc:
      "Basiert auf TypeScript und Web-Standard-Intl-APIs, ohne dass Codegenerierungs-Buildschritte erforderlich sind.",
    icuTitle: "ICU Message Format Unterstützung",
    icuDesc:
      "Unterstützt Pluralregeln, Ordinalzahlen, Select-Verzweigungen und Rich-Text-Tag-Interpolation ohne externe Parser-Abhängigkeiten.",
    frameworkTitle: "Framework-agnostisch",
    frameworkDesc:
      "Läuft nahtlos in Astro, Next.js, React, Vue, Svelte, Node.js, Bun und Cloudflare Workers.",
  },
  docs: {
    onThisPage: "Auf dieser Seite",
    previousChapter: "Zurück",
    nextChapter: "Weiter",
    chapters: "Kapitel",
  },
  footer: {
    license: "Lizenziert unter MIT",
    tagline: "Abhängigkeitsfreie, typsichere Internationalisierung für TypeScript.",
  },
  playground: {
    title: "Playground",
    reset: "Zurücksetzen",
    tabMessages: "messages.ts",
    tabApp: "App.tsx",
    previewTitle: "Live-Vorschau",
    loading: "Playground wird geladen...",
  },
  benchmark: {
    badge: "Benchmark",
    title: "Benchmark der Netzwerk-Übertragungsgröße",
    desc: "Misst die tatsächliche Netzwerk-Übertragungsgröße aller i18n-Assets während des initialen Vorab-Renderings und der clientseitigen Hydratisierung.",
    viewFullDocs: "Vollständigen Benchmark-Bericht ansehen",
    scenario1Title: "10 Sprachen · 500 Nachrichten",
    scenario2Title: "5 Sprachen · 100 Nachrichten",
    totalTransferSize: "Netzwerk-Übertragungsgröße (KB)",
    modeLocaleSplitting: "Locale-Splitting",
    modeBundled: "Vollständig gebündelt",
    modeMiddleware: "Middleware-Splitting",
    modeHttp: "HTTP-Dynamik",
    takeaway1Title: "Laufzeitabhängigkeiten & Overhead",
    takeaway1Desc:
      "i18next bündelt vollständige Parser-Engines und Plugin-Laufzeiten, was zu einem festen Basis-Overhead führt. ts-intl hat keinerlei Laufzeitabhängigkeiten (~2 KB Kern) und lädt im Locale-Splitting-Modus nur das Wörterbuch der aktiven Sprache.",
    takeaway2Title: "Compiler- vs. Laufzeit-Aufteilung",
    takeaway2Desc:
      "Paraglide kompiliert Nachrichten in JS-Funktionen und entfernt ungenutzte Schlüssel via Tree-Shaking. ts-intl ist eine leichtgewichtige Laufzeitbibliothek ohne Codegenerierung, die standardmäßige dynamische Imports nutzt, um die Bündelung mehrerer Sprachen zu verhindern.",
  },
} as const;
