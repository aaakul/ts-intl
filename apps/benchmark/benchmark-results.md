# Benchmark Results

Summary of initial page network transfer sizes across i18n libraries, locales count, and namespace sizes under Vite SSG pre-rendering and client-side hydration.

Captured using Playwright Headless Chromium measuring successful HTTP responses until network idle.

`Locales: 5`  
`Used Messages: 100`  
`Namespace Size: 100 (1.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 56.9 KB             |
| ts-intl (locale-splitting)                           | 29.7 KB             |
| paraglide (default)                                  | 47.1 KB             |
| paraglide (experimental-middleware-locale-splitting) | 36.1 KB             |
| i18next (default)                                    | 183.3 KB            |
| i18next (http-backend)                               | 167.5 KB            |

`Locales: 5`  
`Used Messages: 100`  
`Namespace Size: 200 (2.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 89.8 KB             |
| ts-intl (locale-splitting)                           | 36.6 KB             |
| paraglide (default)                                  | 47.1 KB             |
| paraglide (experimental-middleware-locale-splitting) | 36.1 KB             |
| i18next (default)                                    | 209.4 KB            |
| i18next (http-backend)                               | 172.7 KB            |

`Locales: 5`  
`Used Messages: 100`  
`Namespace Size: 500 (5.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 188.7 KB            |
| ts-intl (locale-splitting)                           | 57.3 KB             |
| paraglide (default)                                  | 47.1 KB             |
| paraglide (experimental-middleware-locale-splitting) | 36.1 KB             |
| i18next (default)                                    | 287.8 KB            |
| i18next (http-backend)                               | 188.4 KB            |

`Locales: 5`  
`Used Messages: 100`  
`Namespace Size: 1000 (10.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 358.2 KB            |
| ts-intl (locale-splitting)                           | 91.7 KB             |
| paraglide (default)                                  | 47.1 KB             |
| paraglide (experimental-middleware-locale-splitting) | 36.1 KB             |
| i18next (default)                                    | 418.5 KB            |
| i18next (http-backend)                               | 214.6 KB            |

`Locales: 5`  
`Used Messages: 200`  
`Namespace Size: 200 (1.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 99.2 KB             |
| ts-intl (locale-splitting)                           | 44.4 KB             |
| paraglide (default)                                  | 88.0 KB             |
| paraglide (experimental-middleware-locale-splitting) | 66.0 KB             |
| i18next (default)                                    | 218.5 KB            |
| i18next (http-backend)                               | 180.6 KB            |

`Locales: 5`  
`Used Messages: 200`  
`Namespace Size: 500 (2.5x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 198.1 KB            |
| ts-intl (locale-splitting)                           | 65.0 KB             |
| paraglide (default)                                  | 88.0 KB             |
| paraglide (experimental-middleware-locale-splitting) | 66.0 KB             |
| i18next (default)                                    | 296.9 KB            |
| i18next (http-backend)                               | 196.3 KB            |

`Locales: 5`  
`Used Messages: 200`  
`Namespace Size: 1000 (5.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 367.6 KB            |
| ts-intl (locale-splitting)                           | 99.5 KB             |
| paraglide (default)                                  | 88.0 KB             |
| paraglide (experimental-middleware-locale-splitting) | 66.0 KB             |
| i18next (default)                                    | 427.6 KB            |
| i18next (http-backend)                               | 222.4 KB            |

`Locales: 10`  
`Used Messages: 100`  
`Namespace Size: 100 (1.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 91.8 KB             |
| ts-intl (locale-splitting)                           | 30.3 KB             |
| paraglide (default)                                  | 76.6 KB             |
| paraglide (experimental-middleware-locale-splitting) | 36.3 KB             |
| i18next (default)                                    | 211.5 KB            |
| i18next (http-backend)                               | 167.8 KB            |

`Locales: 10`  
`Used Messages: 100`  
`Namespace Size: 200 (2.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 157.7 KB            |
| ts-intl (locale-splitting)                           | 37.2 KB             |
| paraglide (default)                                  | 76.6 KB             |
| paraglide (experimental-middleware-locale-splitting) | 36.3 KB             |
| i18next (default)                                    | 263.7 KB            |
| i18next (http-backend)                               | 173.0 KB            |

`Locales: 10`  
`Used Messages: 100`  
`Namespace Size: 500 (5.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 360.0 KB            |
| ts-intl (locale-splitting)                           | 57.8 KB             |
| paraglide (default)                                  | 76.6 KB             |
| paraglide (experimental-middleware-locale-splitting) | 36.3 KB             |
| i18next (default)                                    | 420.4 KB            |
| i18next (http-backend)                               | 188.7 KB            |

`Locales: 10`  
`Used Messages: 100`  
`Namespace Size: 1000 (10.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 704.5 KB            |
| ts-intl (locale-splitting)                           | 92.3 KB             |
| paraglide (default)                                  | 76.6 KB             |
| paraglide (experimental-middleware-locale-splitting) | 36.4 KB             |
| i18next (default)                                    | 681.9 KB            |
| i18next (http-backend)                               | 214.8 KB            |

`Locales: 10`  
`Used Messages: 200`  
`Namespace Size: 200 (1.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 169.2 KB            |
| ts-intl (locale-splitting)                           | 44.9 KB             |
| paraglide (default)                                  | 146.6 KB            |
| paraglide (experimental-middleware-locale-splitting) | 66.2 KB             |
| i18next (default)                                    | 274.4 KB            |
| i18next (http-backend)                               | 180.8 KB            |

`Locales: 10`  
`Used Messages: 200`  
`Namespace Size: 500 (2.5x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 371.5 KB            |
| ts-intl (locale-splitting)                           | 65.6 KB             |
| paraglide (default)                                  | 146.6 KB            |
| paraglide (experimental-middleware-locale-splitting) | 66.2 KB             |
| i18next (default)                                    | 431.1 KB            |
| i18next (http-backend)                               | 196.5 KB            |

`Locales: 10`  
`Used Messages: 200`  
`Namespace Size: 1000 (5.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 716.0 KB            |
| ts-intl (locale-splitting)                           | 100.0 KB            |
| paraglide (default)                                  | 146.6 KB            |
| paraglide (experimental-middleware-locale-splitting) | 66.3 KB             |
| i18next (default)                                    | 692.6 KB            |
| i18next (http-backend)                               | 222.7 KB            |

`Locales: 20`  
`Used Messages: 100`  
`Namespace Size: 100 (1.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 161.6 KB            |
| ts-intl (locale-splitting)                           | 31.4 KB             |
| paraglide (default)                                  | 135.5 KB            |
| paraglide (experimental-middleware-locale-splitting) | 36.9 KB             |
| i18next (default)                                    | 267.7 KB            |
| i18next (http-backend)                               | 168.3 KB            |

`Locales: 20`  
`Used Messages: 100`  
`Namespace Size: 200 (2.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 295.2 KB            |
| ts-intl (locale-splitting)                           | 38.3 KB             |
| paraglide (default)                                  | 135.5 KB            |
| paraglide (experimental-middleware-locale-splitting) | 36.9 KB             |
| i18next (default)                                    | 372.3 KB            |
| i18next (http-backend)                               | 173.5 KB            |

`Locales: 20`  
`Used Messages: 100`  
`Namespace Size: 500 (5.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 708.2 KB            |
| ts-intl (locale-splitting)                           | 59.0 KB             |
| paraglide (default)                                  | 135.5 KB            |
| paraglide (experimental-middleware-locale-splitting) | 36.9 KB             |
| i18next (default)                                    | 685.7 KB            |
| i18next (http-backend)                               | 189.2 KB            |

`Locales: 20`  
`Used Messages: 100`  
`Namespace Size: 1000 (10.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 1397.2 KB           |
| ts-intl (locale-splitting)                           | 93.4 KB             |
| paraglide (default)                                  | 135.6 KB            |
| paraglide (experimental-middleware-locale-splitting) | 36.9 KB             |
| i18next (default)                                    | 1208.6 KB           |
| i18next (http-backend)                               | 215.3 KB            |

`Locales: 20`  
`Used Messages: 200`  
`Namespace Size: 200 (1.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 310.7 KB            |
| ts-intl (locale-splitting)                           | 46.1 KB             |
| paraglide (default)                                  | 265.3 KB            |
| paraglide (experimental-middleware-locale-splitting) | 66.8 KB             |
| i18next (default)                                    | 386.0 KB            |
| i18next (http-backend)                               | 181.3 KB            |

`Locales: 20`  
`Used Messages: 200`  
`Namespace Size: 500 (2.5x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 723.8 KB            |
| ts-intl (locale-splitting)                           | 66.7 KB             |
| paraglide (default)                                  | 265.3 KB            |
| paraglide (experimental-middleware-locale-splitting) | 66.8 KB             |
| i18next (default)                                    | 699.5 KB            |
| i18next (http-backend)                               | 197.0 KB            |

`Locales: 20`  
`Used Messages: 200`  
`Namespace Size: 1000 (5.0x)`

| Library                                              | Total Transfer Size |
| ---------------------------------------------------- | ------------------- |
| ts-intl (default)                                    | 1412.7 KB           |
| ts-intl (locale-splitting)                           | 101.2 KB            |
| paraglide (default)                                  | 265.3 KB            |
| paraglide (experimental-middleware-locale-splitting) | 66.8 KB             |
| i18next (default)                                    | 1222.4 KB           |
| i18next (http-backend)                               | 223.1 KB            |
