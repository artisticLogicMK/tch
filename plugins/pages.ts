import { usePagesStore } from '~/store/pages'

export default defineNuxtPlugin((nuxtApp) => {
  const pages = usePagesStore()

  return {
    provide: {
      pages: pages, // Make store available globally in the app
    },
  }
})