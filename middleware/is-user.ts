import { useAuthStore } from '~/store/auth'
import { useToast } from '~/components/ui/toast/use-toast'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()

  if (to.params.username !== auth.user.username) {
    if (process.client) {
      const { toast } = useToast()
      toast({ title: 'Access Denied!', variant: 'destructive' })
    }

    // Prevent infinite redirect: Only navigate back if it's a different route
    if (from.fullPath && from.fullPath !== to.fullPath) {
      return navigateTo(from.fullPath)
    }

    // Fallback: If no previous path, go to home
    return navigateTo('/')
  }
})