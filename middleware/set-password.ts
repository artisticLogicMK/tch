import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  
  if (auth.user.oldUser || (auth.user.googleAuth && !auth.user.password)) {
    return navigateTo('/', { replace: true })
  }
})