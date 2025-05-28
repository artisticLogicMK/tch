// https://nuxt.com/docs/api/configuration/nuxt-config
import { headConfig } from "./utils/headConfig"
import { join } from 'path'

export default defineNuxtConfig({
  ssr: false,
  server: {
    host: '0.0.0.0',
    port: 3001
  },
  fileStorage: {
    mount: process.env.NODE_ENV === 'development'
      ? join(process.cwd(), 'public/uploads')
      : join(process.cwd(), '.output/uploads'),
  },
  nitro: {
    preset: 'node-server',
    publicAssets: [
      {
        dir: process.env.NODE_ENV === 'development' ? 'public' : '.output/uploads',
        baseURL: '/uploads',
      }
    ],
    routeRules: {
      '/.well-known/**': { headers: false, cache: false }
    }
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  
  modules: [
    '@prisma/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    'nuxt-file-storage',
  ],
  
  tailwindcss: {
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: "first" }],
    config: {},
    viewer: false,
    exposeConfig: false,
  },
  
  css: [
    '@/assets/css/doc.css',
    'quill/dist/quill.snow.css'
  ],
  
  app: {
    head: headConfig
  },
  
  runtimeConfig: {
    public: {
      ipinfoToken: process.env.VITE_IPINFO_TOKEN,
      googlecid: VITE_GOOGLE_CID,
      cryptokey: VITE_CRYPTO_KEY,
      tauktoken: VITE_TAUK_TOKEN
    }
  }
  
  vite: {
    resolve: {
       alias: {
         ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js"
      }
    },
  }
})