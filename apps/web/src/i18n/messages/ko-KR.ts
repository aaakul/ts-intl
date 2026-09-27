export default {
  nav: {
    docs: "문서",
    github: "GitHub",
    themeToggle: "테마 전환",
    switchLanguage: "언어",
  },
  hero: {
    badge: "무의존성 · 타입 안전성 · 프레임워크 무관",
    title: "모던 TypeScript를 위한 국제화 솔루션",
    getStarted: "시작하기",
    github: "GitHub",
    astroBadge: "Astro 공식 통합 지원",
    astroIntegration: "Astro 연동 가이드",
    tabAstro: "Component.astro",
    tabMessages: "ko-KR.ts",
    tabConfig: "i18n.ts",
    tabOutput: "출력 HTML",
  },
  features: {
    typeSafetyTitle: "타입 안전성",
    typeSafetyDesc:
      "번역 키, 네임스페이스 및 매개변수에 대한 TypeScript 타입 추론을 제공하며, 로케일 간 스키마 일관성을 검증합니다.",
    zeroDepTitle: "런타임 의존성 제로",
    zeroDepDesc:
      "TypeScript와 웹 표준 Intl API를 기반으로 제작되어 별도의 코드 생성 빌드 과정이 필요하지 않습니다.",
    icuTitle: "ICU Message Format 지원",
    icuDesc:
      "외부 파서 의존성 없이 복수형, 서수, 조건부 분기(select) 및 리치 텍스트 태그 보간을 지원합니다.",
    frameworkTitle: "프레임워크 무관",
    frameworkDesc:
      "Astro, Next.js, React, Vue, Svelte, Node.js, Bun 및 Cloudflare Workers 등 다양한 환경에서 원활히 동작합니다.",
  },
  docs: {
    onThisPage: "이 페이지의 목차",
    previousChapter: "이전",
    nextChapter: "다음",
    chapters: "챕터",
  },
  footer: {
    license: "MIT 라이선스",
    tagline: "TypeScript를 위한 의존성 없는 타입 안전 국제화 솔루션.",
  },
  playground: {
    title: "플레이그라운드",
    reset: "초기화",
    tabMessages: "messages.ts",
    tabApp: "App.tsx",
    previewTitle: "실시간 미리보기",
    loading: "플레이그라운드를 불러오는 중...",
  },
  benchmark: {
    badge: "벤치마크",
    title: "네트워크 전송 크기 벤치마크",
    desc: "초기 사전 렌더링 및 클라이언트 측 수화(Hydration) 과정에서 브라우저가 실제로 다운로드하는 모든 i18n 리소스의 네트워크 전송 크기를 측정합니다.",
    viewFullDocs: "전체 벤치마크 리포트 보기",
    scenario1Title: "10개 언어 · 500개 메시지",
    scenario2Title: "5개 언어 · 100개 메시지",
    totalTransferSize: "네트워크 전송 크기 (KB)",
    modeLocaleSplitting: "로케일 분할 로딩",
    modeBundled: "전체 번들링",
    modeMiddleware: "미들웨어 분할",
    modeHttp: "HTTP 동적 로딩",
    takeaway1Title: "런타임 의존성 및 번들 크기 비교",
    takeaway1Desc:
      "i18next는 자체 파서 엔진과 플러그인 런타임을 포함하여 기본적인 오버헤드가 발생합니다. 반면 ts-intl은 외부 런타임 의존성이 전혀 없으며(코어 약 2 KB), 로케일 분할 모드에서는 현재 활성화된 언어의 딕셔너리 청크만 전송합니다.",
    takeaway2Title: "컴파일 방식 vs 런타임 분할 방식",
    takeaway2Desc:
      "Paraglide는 각 메시지를 JS 함수로 컴파일하여 사용하지 않는 키를 트리쉐이킹합니다. ts-intl은 코드 생성이 필요 없는 런타임 라이브러리로서, 표준 동적 import를 활용해 여러 언어의 사전 데이터가 번들에 누적되는 것을 방지합니다.",
  },
} as const;
