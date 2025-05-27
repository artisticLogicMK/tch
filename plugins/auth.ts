import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuthStore()

  return {
    provide: {
      auth: auth, // Make store available globally in the app
    },
  }
})