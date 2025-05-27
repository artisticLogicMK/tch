import { defineStore } from 'pinia'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    categories: null,
    meta: {},
    timezone: null,
    statistics: null,
    loading: false,
    loaded: false,
    error: null as any,
    lastFetched: 0, // Timestamp for cache validation
  }),

  actions: {
    async fetchData() {
      const now = Date.now()
      const cacheDuration = 3 * 60 * 60 * 1000 // 3 hours in milliseconds

      // If cached data is still valid, stop there
      if (this.categories && now - this.lastFetched < cacheDuration) {
        return
      }
      
      this.loading = true
      const { data, error } = await useAsyncData(
        'globalFetch', // Unique cache key
        () => $fetch(`/api/globalFetch?nocache=${Date.now()}`),
      )

      if (error.value) {
        this.error = error.value
        toast({
          title: 'There was a problem fetching contents. Check Network.',
          variant: 'destructive',
        })
      } else if (data.value) {
        this.categories = data.value.global.categories
        this.meta = data.value.global.meta
        //this.timezone = data.value.global.timezone
        this.statistics = data.value.global.statistics
        this.lastFetched = now
        this.loaded = true
      }
      
      /*try {
        const token = import.meta.env.VITE_IPINFO_TOKEN
        const ipinfo = await $fetch(`https://ipinfo.io?token=${token}`)
        //console.log(ipinfo)
        this.timezone = ipinfo.timezone
      } catch (e) {
        this.timezone = "UTC"
      }*/
      
      this.loading = false
    },
    
    toastIt(string, variant = true) {
      toast({
        title: string,
        ...(!variant ? {variant: 'destructive'} : {})
      })
    }
  },
})