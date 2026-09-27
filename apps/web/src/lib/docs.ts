import type { SupportedLanguage } from "@/i18n";

export interface DocChapter {
  slug: string;
  order: number;
  title: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
}

export const docChapters: DocChapter[] = [
  {
    slug: "overview-and-installation",
    order: 1,
    title: {
      "en-US": "Overview & Installation",
      "zh-Hans": "概述与安装",
      "ja-JP": "概要とインストール",
      "zh-Hant": "概述與安裝",
      "ko-KR": "개요 및 설치",
      "es-ES": "Descripción general e instalación",
      "de-DE": "Übersicht & Installation",
      "fr-FR": "Présentation et installation",
      "ru-RU": "Обзор и установка",
      "it-IT": "Panoramica e installazione",
    },
    description: {
      "en-US":
        "Introduction to ts-intl, core design principles, and setup instructions.",
      "zh-Hans": "ts-intl 简介、设计原则与安装配置指南。",
      "ja-JP": "ts-intl の紹介、設計原則、および導入ガイド。",
      "zh-Hant": "ts-intl 簡介、核心設計原則與安裝設定指南。",
      "ko-KR": "ts-intl 소개, 핵심 설계 원칙 및 설치 설정 가이드.",
      "es-ES":
        "Introducción a ts-intl, principios de diseño fundamentales e instrucciones de configuración.",
      "de-DE":
        "Einführung in ts-intl, zentrale Designprinzipien und Installationsanleitung.",
      "fr-FR":
        "Introduction à ts-intl, principes de conception fondamentaux et instructions d'installation.",
      "ru-RU":
        "Введение в ts-intl, основные принципы архитектуры и руководство по установке.",
      "it-IT":
        "Introduzione a ts-intl, principi di progettazione fondamentali e istruzioni di installazione.",
    },
  },
  {
    slug: "type-safety-and-validation",
    order: 2,
    title: {
      "en-US": "Type Inference & Validation",
      "zh-Hans": "类型推断与校验",
      "ja-JP": "型推論とバリデーション",
      "zh-Hant": "型別推導與驗證",
      "ko-KR": "타입 추론 및 유효성 검증",
      "es-ES": "Inferencia de tipos y validación",
      "de-DE": "Typinferenz & Validierung",
      "fr-FR": "Inférence de types et validation",
      "ru-RU": "Вывод типов и валидация",
      "it-IT": "Inferenza dei tipi e convalida",
    },
    description: {
      "en-US":
        "Compile-time strict type checking, parameter constraints, and cross-language dictionary structure alignment validation.",
      "zh-Hans": "编译期严格类型检查、参数约束与多语言词典结构对齐校验。",
      "ja-JP":
        "コンパイル時の厳格な型チェック、パラメータ制約、多言語辞書の構造整合性検証。",
      "zh-Hant":
        "編譯期嚴格型別檢查、參數約束條件與多語言詞典結構對齊驗證。",
      "ko-KR":
        "컴파일 타임 엄격한 타입 검사, 매개변수 제약 조건 및 다국어 딕셔너리 구조 정합성 검증.",
      "es-ES":
        "Comprobación estricta de tipos en tiempo de compilación, restricciones de parámetros y validación de alineación de estructura en diccionarios multilingües.",
      "de-DE":
        "Strikte Typprüfung zur Kompilierzeit, Parameterbeschränkungen und Validierung der Wörterbuchstrukturen über alle Sprachen hinweg.",
      "fr-FR":
        "Vérification stricte des types à la compilation, contraintes sur les paramètres et validation de l'alignement structurel des dictionnaires multilingues.",
      "ru-RU":
        "Строгая проверка типов на этапе компиляции, ограничения параметров и проверка соответствия структуры многоязычных словарей.",
      "it-IT":
        "Controllo rigoroso dei tipi in fase di compilazione, vincoli sui parametri e convalida dell'allineamento della struttura dei dizionari multilingua.",
    },
  },
  {
    slug: "namespaces",
    order: 3,
    title: {
      "en-US": "Namespaces & Scoping",
      "zh-Hans": "命名空间与作用域",
      "ja-JP": "名前空間とスコープ",
      "zh-Hant": "命名空間與作用域",
      "ko-KR": "네임스페이스 및 스코프",
      "es-ES": "Espacios de nombres y alcance",
      "de-DE": "Namespaces & Scoping",
      "fr-FR": "Espaces de noms et portée",
      "ru-RU": "Пространства имён и области видимости",
      "it-IT": "Namespace e ambito",
    },
    description: {
      "en-US":
        "Organizing translation dictionaries using namespaces and data extraction methods.",
      "zh-Hans": "通过命名空间组织翻译字典与数据提取方式。",
      "ja-JP": "名前空間による翻訳辞書の整理とデータ抽出方法。",
      "zh-Hant": "透過命名空間組織翻譯字典與資料擷取方式。",
      "ko-KR": "네임스페이스를 통한 번역 딕셔너리 구조화 및 데이터 추출 방식.",
      "es-ES":
        "Organización de diccionarios de traducción mediante espacios de nombres y métodos de extracción de datos.",
      "de-DE":
        "Strukturierung von Übersetzungswörterbüchern mit Namespaces und Datenextraktionsmethoden.",
      "fr-FR":
        "Organisation des dictionnaires de traduction avec les espaces de noms et méthodes d'extraction de données.",
      "ru-RU":
        "Организация словарей перевода с использованием пространств имён и методы извлечения данных.",
      "it-IT":
        "Organizzazione dei dizionari di traduzione tramite namespace e metodi di estrazione dei dati.",
    },
  },
  {
    slug: "icu-syntax",
    order: 4,
    title: {
      "en-US": "ICU Syntax & Rich Text Rendering",
      "zh-Hans": "ICU 语法与富文本渲染",
      "ja-JP": "ICU 構文とリッチテキスト描画",
      "zh-Hant": "ICU 語法與富文字渲染",
      "ko-KR": "ICU 문법 및 서식 있는 텍스트 렌더링",
      "es-ES": "Sintaxis ICU y renderizado de texto enriquecido",
      "de-DE": "ICU-Syntax & Rich-Text-Rendering",
      "fr-FR": "Syntaxe ICU et rendu de texte enrichi",
      "ru-RU": "Синтаксис ICU и рендеринг форматированного текста",
      "it-IT": "Sintassi ICU e rendering rich text",
    },
    description: {
      "en-US":
        "Plural rules, ordinals, conditional branches, and rich text component rendering syntax.",
      "zh-Hans": "复数规则、序数词、条件分支与富文本组件渲染语法。",
      "ja-JP":
        "複数形ルール、序数詞、条件分岐、およびリッチテキストコンポーネント描画構文。",
      "zh-Hant": "複數規則、序數詞、條件分支與富文字組件渲染語法。",
      "ko-KR":
        "복수형 규칙, 서수, 조건부 분기 및 서식 있는 텍스트 컴포넌트 렌더링 문법.",
      "es-ES":
        "Reglas de plurales, ordinales, ramas condicionales y sintaxis de renderizado para componentes de texto enriquecido.",
      "de-DE":
        "Pluralregeln, Ordinalzahlen, Bedingungsverzweigungen und Syntax für das Rendern von Rich-Text-Komponenten.",
      "fr-FR":
        "Règles de pluriel, ordinaux, branches conditionnelles et syntaxe de rendu des composants de texte enrichi.",
      "ru-RU":
        "Правила множественного числа, порядковые числительные, условные ветвления и синтаксис компонентов форматированного текста.",
      "it-IT":
        "Regole per plurali, ordinali, diramazioni condizionali e sintassi di rendering per componenti rich text.",
    },
  },
  {
    slug: "formatters",
    order: 5,
    title: {
      "en-US": "Web Intl Formatters",
      "zh-Hans": "Web Intl 格式化器",
      "ja-JP": "Web Intl フォーマッター",
      "zh-Hant": "Web Intl 格式化工具",
      "ko-KR": "Web Intl 포매터",
      "es-ES": "Formateadores Web Intl",
      "de-DE": "Web-Intl-Formatierer",
      "fr-FR": "Formateurs Web Intl",
      "ru-RU": "Форматтеры Web Intl",
      "it-IT": "Formattatori Web Intl",
    },
    description: {
      "en-US":
        "Type-safe wrappers and instance-cached formatters based on Web Intl APIs.",
      "zh-Hans": "基于 Web Intl API 的类型安全封装与实例缓存格式化器。",
      "ja-JP":
        "Web Intl API に基づく型安全なラッパーとインスタンスキャッシュフォーマッター。",
      "zh-Hant": "基於 Web Intl API 的型別安全封裝與實例快取格式化工具。",
      "ko-KR":
        "Web Intl API 기반의 타입 안전한 래퍼 및 인스턴스 캐싱 포매터.",
      "es-ES":
        "Envoltorios seguros en tipos y formateadores con caché de instancias basados en las API Web Intl.",
      "de-DE":
        "Typsichere Wrapper und instanzgecachte Formatierer basierend auf den Web-Intl-APIs.",
      "fr-FR":
        "Encapsulations sécurisées au typage et formateurs avec mise en cache d'instances basés sur les API Web Intl.",
      "ru-RU":
        "Типобезопасные обёртки и форматтеры с кэшированием экземпляров на базе стандартных Web API Intl.",
      "it-IT":
        "Wrapper type-safe e formattatori con memorizzazione nella cache delle istanze basati sulle API Web Intl.",
    },
  },
  {
    slug: "framework-integration",
    order: 6,
    title: {
      "en-US": "Error Handling & Fallback",
      "zh-Hans": "错误处理与回退",
      "ja-JP": "エラー処理とフォールバック",
      "zh-Hant": "錯誤處理與備援回退",
      "ko-KR": "오류 처리 및 폴백",
      "es-ES": "Gestión de errores y fallback",
      "de-DE": "Fehlerbehandlung & Fallback",
      "fr-FR": "Gestion des erreurs et repli",
      "ru-RU": "Обработка ошибок и резервные варианты",
      "it-IT": "Gestione degli errori e fallback",
    },
    description: {
      "en-US": "Configure error handling and fallback.",
      "zh-Hans": "配置错误处理与回退。",
      "ja-JP": "エラー処理とフォールバックの設定。",
      "zh-Hant": "設定錯誤處理與回退策略。",
      "ko-KR": "오류 처리 및 누락된 메시지 폴백 전략 구성.",
      "es-ES": "Configurar la gestión de errores y las estrategias de respaldo.",
      "de-DE": "Konfiguration von Fehlerbehandlung und Fallback-Strategien.",
      "fr-FR": "Configurer la gestion des erreurs et les stratégies de repli.",
      "ru-RU": "Настройка обработки ошибок и резервных вариантов.",
      "it-IT": "Configurazione della gestione degli errori e del fallback.",
    },
  },
  {
    slug: "astro-integration",
    order: 7,
    title: {
      "en-US": "Astro Integration",
      "zh-Hans": "Astro 集成",
      "ja-JP": "Astro 統合",
      "zh-Hant": "Astro 整合",
      "ko-KR": "Astro 통합",
      "es-ES": "Integración con Astro",
      "de-DE": "Astro-Integration",
      "fr-FR": "Intégration Astro",
      "ru-RU": "Интеграция с Astro",
      "it-IT": "Integrazione con Astro",
    },
    description: {
      "en-US":
        "Context-based and middleware-driven internationalization for Astro using ts-intl-astro, eliminating prop drilling across components.",
      "zh-Hans":
        "使用 ts-intl-astro 为 Astro 项目提供基于上下文与中间件的国际化支持，避免组件层级中的属性透传。",
      "ja-JP":
        "ts-intl-astro によるコンポーネント階層の Props バケツリレー回避、コンテキストとミドルウェアに基づく Astro 向け国際化対応。",
      "zh-Hant":
        "使用 ts-intl-astro 為 Astro 專案提供基於上下文與中介軟體的國際化支援，避免組件層級間的屬性透傳。",
      "ko-KR":
        "ts-intl-astro를 사용하여 컴포넌트 간 Props 드릴링 없이 컨텍스트 및 미들웨어 기반의 Astro 국제화 기능을 제공합니다.",
      "es-ES":
        "Internacionalización basada en contexto y middleware para Astro mediante ts-intl-astro, eliminando el traspaso manual de props entre componentes.",
      "de-DE":
        "Kontext- und Middleware-gestützte Internationalisierung für Astro mit ts-intl-astro, wodurch Prop-Drilling über Komponenten hinweg entfällt.",
      "fr-FR":
        "Internationalisation basée sur le contexte et les middlewares pour Astro via ts-intl-astro, éliminant le passage de props entre composants.",
      "ru-RU":
        "Контекстная и middleware-интернационализация для Astro с помощью ts-intl-astro без сквозной передачи пропсов между компонентами.",
      "it-IT":
        "Internazionalizzazione basata su contesto e middleware per Astro tramite ts-intl-astro, eliminando il passaggio manuale delle props tra componenti.",
    },
  },
  {
    slug: "benchmark",
    order: 8,
    title: {
      "en-US": "Benchmark & Performance",
      "zh-Hans": "基准测试与性能",
      "ja-JP": "ベンチマークと性能",
      "zh-Hant": "基準測試與效能",
      "ko-KR": "벤치마크 및 성능",
      "es-ES": "Benchmark y rendimiento",
      "de-DE": "Benchmark & Leistung",
      "fr-FR": "Benchmark et performances",
      "ru-RU": "Бенчмарк и производительность",
      "it-IT": "Benchmark e prestazioni",
    },
    description: {
      "en-US":
        "Measures the network transfer size of i18n assets during SSG pre-rendering and client-side hydration across libraries.",
      "zh-Hans":
        "模拟首屏预渲染与客户端水合（Hydration）场景，测量不同国际化库的真实网络传输开销。",
      "ja-JP":
        "事前レンダリングとクライアント側のハイドレーション環境における各 i18n ライブラリの実転送サイズ比較。",
      "zh-Hant":
        "模擬首頁預先渲染與客戶端注水（Hydration）情境，測量不同國際化程式庫的真實網路傳輸開銷。",
      "ko-KR":
        "SSG 사전 렌더링 및 클라이언트 측 수화(Hydration) 환경에서 각 i18n 라이브러리의 실제 네트워크 전송 비용을 측정합니다.",
      "es-ES":
        "Mide el tamaño de transferencia de red de los recursos i18n durante el pre-renderizado SSG y la hidratación en el cliente entre diferentes bibliotecas.",
      "de-DE":
        "Misst die Netzwerk-Übertragungsgröße von i18n-Ressourcen während des SSG-Pre-Renderings und der Client-Hydratisierung im Bibliotheksvergleich.",
      "fr-FR":
        "Mesure la taille du transfert réseau des ressources i18n lors du pré-rendu SSG et de l'hydratation côté client entre différentes bibliothèques.",
      "ru-RU":
        "Измерение объема сетевого трафика ресурсов i18n при пререндеринге SSG и гидратации на клиенте в сравнении различных библиотек.",
      "it-IT":
        "Misura le dimensioni del trasferimento di rete degli asset i18n durante il pre-rendering SSG e l'idratazione lato client tra diverse librerie.",
    },
  },
];
