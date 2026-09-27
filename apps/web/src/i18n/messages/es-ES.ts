export default {
  nav: {
    docs: "Documentación",
    github: "GitHub",
    themeToggle: "Cambiar tema",
    switchLanguage: "Idioma",
  },
  hero: {
    badge: "Cero dependencias · Seguridad de tipos · Agnóstico del framework",
    title: "Internacionalización para el TypeScript moderno",
    getStarted: "Comenzar",
    github: "GitHub",
    astroBadge: "Integración con Astro disponible",
    astroIntegration: "Guía de Astro",
    tabAstro: "Component.astro",
    tabMessages: "es-ES.ts",
    tabConfig: "i18n.ts",
    tabOutput: "HTML generado",
  },
  features: {
    typeSafetyTitle: "Seguridad de tipos",
    typeSafetyDesc:
      "Proporciona inferencia de tipos TypeScript para claves de traducción, espacios de nombres y parámetros, validando la coherencia del esquema entre idiomas.",
    zeroDepTitle: "Cero dependencias en tiempo de ejecución",
    zeroDepDesc:
      "Construido sobre TypeScript y las API estándar Web Intl, sin requerir pasos de generación de código ni compilación adicional.",
    icuTitle: "Soporte para ICU Message Format",
    icuDesc:
      "Admite plurales, ordinales, ramas condicionales (select) e interpolación de etiquetas de texto enriquecido sin analizadores externos.",
    frameworkTitle: "Agnóstico del framework",
    frameworkDesc:
      "Funciona en Astro, Next.js, React, Vue, Svelte, Node.js, Bun y Cloudflare Workers.",
  },
  docs: {
    onThisPage: "En esta página",
    previousChapter: "Anterior",
    nextChapter: "Siguiente",
    chapters: "Capítulos",
  },
  footer: {
    license: "Licenciado bajo MIT",
    tagline: "Internacionalización segura en tipos y sin dependencias para TypeScript.",
  },
  playground: {
    title: "Playground",
    reset: "Restablecer",
    tabMessages: "messages.ts",
    tabApp: "App.tsx",
    previewTitle: "Vista previa en vivo",
    loading: "Cargando playground...",
  },
  benchmark: {
    badge: "Benchmark",
    title: "Benchmark del tamaño de transferencia de red",
    desc: "Mide el tamaño real de transferencia en red de todos los recursos de i18n durante el pre-renderizado inicial y la hidratación en el cliente.",
    viewFullDocs: "Ver informe completo del benchmark",
    scenario1Title: "10 idiomas · 500 mensajes",
    scenario2Title: "5 idiomas · 100 mensajes",
    totalTransferSize: "Tamaño de transferencia de red (KB)",
    modeLocaleSplitting: "División por idioma",
    modeBundled: "Empaquetado completo",
    modeMiddleware: "División con middleware",
    modeHttp: "Carga dinámica HTTP",
    takeaway1Title: "Dependencias en tiempo de ejecución y sobrecarga",
    takeaway1Desc:
      "i18next incluye motores de análisis completos y entornos de ejecución de plugins, lo que genera una sobrecarga base fija. ts-intl tiene cero dependencias en tiempo de ejecución (~2 KB en el núcleo) y, en modo de división por idioma, solo descarga el diccionario del idioma activo.",
    takeaway2Title: "Compilación frente a división en tiempo de ejecución",
    takeaway2Desc:
      "Paraglide compila cada mensaje en funciones JS y elimina mediante tree-shaking las claves no utilizadas. ts-intl es una biblioteca ligera en tiempo de ejecución que no requiere generación de código, empleando imports dinámicos estándar para evitar la acumulación de múltiples idiomas en el bundle.",
  },
} as const;
