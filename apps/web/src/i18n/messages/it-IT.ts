export default {
  nav: {
    docs: "Documentazione",
    github: "GitHub",
    themeToggle: "Cambia tema",
    switchLanguage: "Lingua",
  },
  hero: {
    badge: "Zero dipendenze · Sicurezza dei tipi · Indipendente dal framework",
    title: "Internazionalizzazione per il TypeScript moderno",
    getStarted: "Inizia",
    github: "GitHub",
    astroBadge: "Integrazione con Astro disponibile",
    astroIntegration: "Guida ad Astro",
    tabAstro: "Component.astro",
    tabMessages: "it-IT.ts",
    tabConfig: "i18n.ts",
    tabOutput: "Output HTML",
  },
  features: {
    typeSafetyTitle: "Sicurezza dei tipi",
    typeSafetyDesc:
      "Fornisce l'inferenza dei tipi TypeScript per chiavi di traduzione, namespace e parametri, validando la coerenza dello schema tra i diversi idiomi.",
    zeroDepTitle: "Zero dipendenze a runtime",
    zeroDepDesc:
      "Costruito su TypeScript e sulle API standard Web Intl, senza richiedere passaggi di generazione del codice in fase di compilazione.",
    icuTitle: "Supporto per ICU Message Format",
    icuDesc:
      "Supporta plurali, ordinali, diramazioni condizionali (select) e interpolazione di tag rich text senza dipendenze da parser esterni.",
    frameworkTitle: "Indipendente dal framework",
    frameworkDesc:
      "Funziona su Astro, Next.js, React, Vue, Svelte, Node.js, Bun e Cloudflare Workers.",
  },
  docs: {
    onThisPage: "In questa pagina",
    previousChapter: "Precedente",
    nextChapter: "Successivo",
    chapters: "Capitoli",
  },
  footer: {
    license: "Distribuito con licenza MIT",
    tagline: "Internazionalizzazione type-safe e senza dipendenze per TypeScript.",
  },
  playground: {
    title: "Playground",
    reset: "Ripristina",
    tabMessages: "messages.ts",
    tabApp: "App.tsx",
    previewTitle: "Anteprima dal vivo",
    loading: "Caricamento del playground in corso...",
  },
  benchmark: {
    badge: "Benchmark",
    title: "Benchmark sulle dimensioni del trasferimento di rete",
    desc: "Misura la dimensione effettiva del trasferimento di rete di tutti gli asset i18n durante il pre-rendering iniziale e l'idratazione lato client.",
    viewFullDocs: "Visualizza il report completo del benchmark",
    scenario1Title: "10 lingue · 500 messaggi",
    scenario2Title: "5 lingue · 100 messaggi",
    totalTransferSize: "Dimensioni trasferimento di rete (KB)",
    modeLocaleSplitting: "Suddivisione per lingua",
    modeBundled: "Bundle completo",
    modeMiddleware: "Suddivisione middleware",
    modeHttp: "Caricamento dinamico HTTP",
    takeaway1Title: "Dipendenze a runtime e ingombro",
    takeaway1Desc:
      "i18next include motori di parsing completi e runtime per i plugin, comportando un overhead di base fisso. ts-intl non ha dipendenze a runtime (~2 KB per il core) e, in modalità di suddivisione per lingua, carica unicamente il dizionario della lingua attiva.",
    takeaway2Title: "Compilatore rispetto alla suddivisione a runtime",
    takeaway2Desc:
      "Paraglide compila i messaggi in funzioni JS ed elimina le chiavi inutilizzate tramite tree-shaking. ts-intl è una libreria a runtime che non richiede alcuna generazione di codice, impiegando import dinamici standard per evitare l'accumulo di dizionari multilingua nel bundle.",
  },
} as const;
