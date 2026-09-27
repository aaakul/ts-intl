export default {
  nav: {
    docs: "Документация",
    github: "GitHub",
    themeToggle: "Переключить тему",
    switchLanguage: "Язык",
  },
  hero: {
    badge: "Ноль зависимостей · Безопасность типов · Не зависит от фреймворка",
    title: "Интернационализация для современного TypeScript",
    getStarted: "Начать",
    github: "GitHub",
    astroBadge: "Доступна интеграция с Astro",
    astroIntegration: "Руководство по Astro",
    tabAstro: "Component.astro",
    tabMessages: "ru-RU.ts",
    tabConfig: "i18n.ts",
    tabOutput: "Результат HTML",
  },
  features: {
    typeSafetyTitle: "Безопасность типов",
    typeSafetyDesc:
      "Обеспечивает вывод типов TypeScript для ключей перевода, пространств имён и параметров, проверяя согласованность схемы между локалями.",
    zeroDepTitle: "Ноль зависимостей во время выполнения",
    zeroDepDesc:
      "Построен на базе TypeScript и стандартных Web API Intl, не требует этапа генерации кода при сборке.",
    icuTitle: "Поддержка ICU Message Format",
    icuDesc:
      "Поддерживает формы множественного числа, порядковые числительные, ветвление select и интерполяцию тегов форматированного текста без внешних парсеров.",
    frameworkTitle: "Не зависит от фреймворка",
    frameworkDesc:
      "Работает в Astro, Next.js, React, Vue, Svelte, Node.js, Bun и Cloudflare Workers.",
  },
  docs: {
    onThisPage: "На этой странице",
    previousChapter: "Предыдущая",
    nextChapter: "Следующая",
    chapters: "Главы",
  },
  footer: {
    license: "Лицензия MIT",
    tagline: "Типобезопасная интернационализация без зависимостей для TypeScript.",
  },
  playground: {
    title: "Песочница",
    reset: "Сбросить",
    tabMessages: "messages.ts",
    tabApp: "App.tsx",
    previewTitle: "Интерактивный просмотр",
    loading: "Загрузка песочницы...",
  },
  benchmark: {
    badge: "Бенчмарк",
    title: "Бенчмарк размера передачи по сети",
    desc: "Измеряет реальный объем сетевого трафика всех ресурсов i18n при начальном предрендеринге и гидратации на стороне клиента.",
    viewFullDocs: "Посмотреть полный отчёт",
    scenario1Title: "10 языков · 500 сообщений",
    scenario2Title: "5 языков · 100 сообщений",
    totalTransferSize: "Объем сетевой передачи (КБ)",
    modeLocaleSplitting: "Разделение по локалям",
    modeBundled: "Полный бандл",
    modeMiddleware: "Через middleware",
    modeHttp: "HTTP-загрузка",
    takeaway1Title: "Зависимости во время выполнения и размер",
    takeaway1Desc:
      "i18next содержит полноценные парсеры и рантайм плагинов, создавая ощутимый базовый оверхед. В ts-intl нет сторонних зависимостей (ядро ~2 КБ), а в режиме разделения локалей передается словарь только активного языка.",
    takeaway2Title: "Компиляция против динамического разделения",
    takeaway2Desc:
      "Paraglide компилирует сообщения в JS-функции и удаляет неиспользуемые ключи через tree-shaking. ts-intl является библиотекой времени выполнения без генерации кода и использует стандартный динамический import, предотвращая накопление словарей разных языков в бандле.",
  },
} as const;
