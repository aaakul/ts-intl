export const locales: string[];
export const init: (() => Promise<void>) | undefined;
export const getLocale: () => string;
export const setLocale: (locale: string) => void;
export const middleware: any;
export const t: (key: string, params?: Record<string, any>) => string;
