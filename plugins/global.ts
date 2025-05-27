import { useGlobalStore } from '~/store/globals'

export default defineNuxtPlugin((nuxtApp) => {
  const global = useGlobalStore()

  return {
    provide: {
      global: global, // Make store available globally in the app
    },
  }
})