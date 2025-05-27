import { useAuthStore } from '~/store/auth'
import { useToast } from '~/components/ui/toast/use-toast'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  const today = new Date().toISOString()
  
  if (auth.isAuthenticated && (!auth.user.username || !auth.user.gender || !auth.user.country || !auth.user.secret)) {
    return navigateTo('/set-profile') // Redirect if profile not set
  }
  
  if (auth.isAuthenticated && auth.user.oldUser) {
    return navigateTo('/set-password') // Redirect to set password if user is of old forum
  }


  // If user is suspended
  if (auth.isAuthenticated && auth.user.suspended > today) {
    auth.logout()
    
    if (process.client) {
      const { toast } = useToast()
      toast({ title: 'You are suspended!', variant: 'destructive' })
    }
    
    return navigateTo('/') 
  }
  
  // If user is banned
  if (auth.isAuthenticated && auth.user.banned) {
    auth.logout()
    
    if (process.client) {
      const { toast } = useToast()
      toast({ title: 'You are banned!', variant: 'destructive' })
    }
    
    return navigateTo('/') 
  }
})