import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  const token = useCookie('token') // Get token from cookies
  if (!token.value) {
    auth.logout()
    return navigateTo('/login') // Redirect if not authenticated
  }
})