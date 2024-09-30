// https://nuxt.com/docs/api/configuration/nuxt-config
import ViteWorkerPlugin from 'worker-plugin'; // worker导入第三方包
import { visualizer } from 'rollup-plugin-visualizer';
import { addAnalyticsScript } from './vite-plugins/analytics';
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  ssr: import.meta.env.VITE_CSR !== 'true',

  sourcemap: {
    client: true,
    server: false,
  },

  app: {
    head: {
      title: 'Mastodon',
      script: addAnalyticsScript(),
      link: [
        {
          rel: 'manifest',
          href: '/manifestPWA.json',
        },
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1.0,user-scalable=no,viewport-fit=cover' },
      ],
    },
  },

  routeRules: {
    '/settings/**': { ssr: false },
    '/about': { ssr: false },
  },

  modules: [
    'arco-design-nuxt-module',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-icon',
    'dayjs-nuxt',
    '@nuxt/image',
    '@vant/nuxt',
    '@vueuse/nuxt',
    'nuxt-proxy-request',
    'nuxt-icons',
  ],

  proxy: {
    options: [
      {
        pathFilter: ['/sitemap.xml'],
        target: 'https://api.good.news',
        changeOrigin: true,
      },
      {
        pathFilter: ['/embed', '/_api', '/api', '/users', '/.well-known', '/oauth'],
        target: 'https://api.good.news',
        changeOrigin: true,
      },
    ],
  },

  plugins: ['~/plugins/global-components.ts'],

  dayjs: {
    locales: ['zh-cn', 'en', 'fr'],
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultLocale: 'zh-cn',
    defaultTimezone: 'Asia/Shanghai',
  },

  imports: {},

  pinia: {
    storesDirs: ['./stores/**'],
  },

  arco: {
    importPrefix: 'A',
    hookPrefix: 'Arco',
    locales: ['getLocale'],
    localePrefix: 'Arco',
  },

  runtimeConfig: {
    public: {
      baseURL: import.meta.env.VITE_BASE_API,
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/styles/mixin.scss";@import "@/assets/styles/basic.scss";`,
        },
      },
    },
    plugins: [ViteWorkerPlugin()],
    build: {
      // 提取css
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('vue')) {
                return 'vue';
              }
            }
            return null;
          },
        },
      },
    },
    esbuild: {
      drop: import.meta.env.VITE_ENV === 'prod' ? ['console', 'debugger'] : [],
    },
    define: {
      // By default, Vite doesn't include shims for NodeJS/
      // necessary for segment analytics lib to work
      global: {},
    },
  },

  image: {
    domains: ['file.aaaaa.bet', 'pbs.twimg.com'],
  },

  i18n: {
    locales: ['en', 'zh'],
    strategy: 'no_prefix',
    defaultLocale: 'zh',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'all',
      fallbackLocale: 'zh',
    },
    vueI18n: './locales/index.ts',
  },

  vant: {
    lazyload: {
      lazyComponent: true,
    },
  },

  features: {
    devLogs: false,
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      autoSubfolderIndex: false,
    },
  },

  compatibilityDate: '2024-09-19',
});
