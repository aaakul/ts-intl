export default {
  nav: {
    docs: "Documentation",
    github: "GitHub",
    themeToggle: "Changer de thème",
    switchLanguage: "Langue",
  },
  hero: {
    badge: "Zéro dépendance · Sécurité de typage · Indépendant du framework",
    title: "L'internationalisation pour le TypeScript moderne",
    getStarted: "Commencer",
    github: "GitHub",
    astroBadge: "Intégration Astro disponible",
    astroIntegration: "Guide Astro",
    tabAstro: "Component.astro",
    tabMessages: "fr-FR.ts",
    tabConfig: "i18n.ts",
    tabOutput: "HTML généré",
  },
  features: {
    typeSafetyTitle: "Sécurité de typage",
    typeSafetyDesc:
      "Fournit l'inférence de types TypeScript pour les clés de traduction, les espaces de noms et les paramètres, tout en validant la cohérence du schéma entre les langues.",
    zeroDepTitle: "Zéro dépendance à l'exécution",
    zeroDepDesc:
      "Conçu sur TypeScript et les API standards Web Intl, sans nécessiter d'étape de génération de code lors du build.",
    icuTitle: "Support du ICU Message Format",
    icuDesc:
      "Prend en charge les pluriels, les ordinaux, les sélections conditionnelles (select) et l'interpolation de balises de texte enrichi sans aucun parseur externe.",
    frameworkTitle: "Indépendant du framework",
    frameworkDesc:
      "Fonctionne avec Astro, Next.js, React, Vue, Svelte, Node.js, Bun et Cloudflare Workers.",
  },
  docs: {
    onThisPage: "Sur cette page",
    previousChapter: "Précédent",
    nextChapter: "Suivant",
    chapters: "Chapitres",
  },
  footer: {
    license: "Sous licence MIT",
    tagline: "L'internationalisation sans dépendance et sûre au typage pour TypeScript.",
  },
  playground: {
    title: "Playground",
    reset: "Réinitialiser",
    tabMessages: "messages.ts",
    tabApp: "App.tsx",
    previewTitle: "Aperçu en direct",
    loading: "Chargement du playground...",
  },
  benchmark: {
    badge: "Benchmark",
    title: "Benchmark de taille de transfert réseau",
    desc: "Mesure la taille réelle de transfert réseau de toutes les ressources i18n lors du pré-rendu initial et de l'hydratation côté client.",
    viewFullDocs: "Voir le rapport complet du benchmark",
    scenario1Title: "10 langues · 500 messages",
    scenario2Title: "5 langues · 100 messages",
    totalTransferSize: "Taille du transfert réseau (Ko)",
    modeLocaleSplitting: "Découpage par langue",
    modeBundled: "Bundle complet",
    modeMiddleware: "Découpage middleware",
    modeHttp: "Chargement dynamique HTTP",
    takeaway1Title: "Dépendances d'exécution et empreinte",
    takeaway1Desc:
      "i18next intègre des moteurs de parsing complets et des runtimes de plugins, engendrant une surcharge de base incontournable. ts-intl ne comporte aucune dépendance d'exécution (~2 Ko pour le cœur) et, en mode découpage, ne charge que le dictionnaire de la langue active.",
    takeaway2Title: "Compilateur vs découpage à l'exécution",
    takeaway2Desc:
      "Paraglide compile les messages en fonctions JS et élimine par tree-shaking les clés inutilisées. ts-intl est une bibliothèque d'exécution sans génération de code, utilisant des imports dynamiques standards pour éviter l'accumulation de dictionnaires multi-langues dans le bundle.",
  },
} as const;
