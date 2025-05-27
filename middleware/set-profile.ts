import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  
  if (auth.isAuthenticated && (auth.user.username && auth.user.gender && auth.user.country)) {
    return navigateTo('/', { replace: true }) // Redirect if profile not set
  }
})