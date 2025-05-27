<script setup>
definePageMeta({
  layout: "mod-layout",
  middleware: ["auth", "is-valid-user", "is-admin"]
})

useHead({
  title: "Alerts & Announcements - Dashboard",
})

useSeoMeta({
  robots: 'noindex, nofollow'
})

import { useAuthStore } from '~/store/auth'
import { useToast } from '@/components/ui/toast/use-toast'
import Button from '~/components/ui/button/Button.vue'
import Checkbox from '~/components/ui/checkbox/Checkbox.vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '~/components/ui/dialog'

const auth = useAuthStore()
const { toast } = useToast()

const loading = ref(false)

const hide = useState('hide', () => false)
const welcome = useState('welcome', () => '')
const announcement = useState('announcement', () => '')

const setAlerts = async (mode) => {
  if (loading.value) return
  
  loading.value = mode

  const { data } = await useFetch('/api/mod/set-alerts', {
    method: 'POST',
    body: {
      mode, welcome, announcement, hide, time: Math.floor(Date.now() / 1000)
    },
    headers: {
      Authorization: `Bearer ${auth.token}`
    },
    server: false
  })

  if (data.value.success) {
    loading.value = false
    
    toast({ title: 'Content Updated!' })
  } else {
    loading.value = false
    toast({
      title: `${data.value.message}`,
      variant: 'destructive'
    })
  }
}


const metaFetch = async () => {
  const { data } = await useFetch('/api/mod/alerts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${auth.token}`
    },
    server: false
  })
  
  if (data.value.success) {
    welcome.value = data.value.meta.welcome
    announcement.value = data.value.meta.announcement
    hide.value = data.value.meta.hide
  } else {
    toast({
      title: `Failed to fetch data.`,
      variant: 'destructive'
    })
  }
}

onMounted(async () => {
  if (process.client) {
    await nextTick()
    
    metaFetch()
  }
})
</script>

<template>

    <div class="p-4 sm:p-8">

      <h1 class="text-base font-semibold text-slate-500 dark:text-slate-400 mb-4">Set Forum Announcement</h1>
  
      <form @submit.prevent="setAlerts('announcement')" class="text-sm border-b bdr mb-8">
        
        <div class="mb-6">
          <textarea class="input" v-model="announcement" placeholder="Content..." rows="7" required></textarea>
        </div>
        
        <div class="flex items-center text-sm mb-4">
          <Checkbox id="ha" v-model:checked="hide" />
          <label for="ha" class="text-600 ml-2">Hide Announcement</label>
        </div>
        
        <div class="flex justify-center mb-4">
          <Button :loading="loading === 'announcement'">Update</Button>
        </div>
      </form>
      
      
      <h1 class="text-base font-semibold text-slate-500 dark:text-slate-400 mb-3">New User Welcome</h1>
      
      <form @submit.prevent="setAlerts('welcome')" class="text-sm">
        
        <div class="mb-6">
          <textarea class="input" v-model="welcome" placeholder="Content..." rows="7" required></textarea>
        </div>
    
        
        <div class="flex justify-end sm:justify-start">
          <Button :loading="loading === 'welcome'">Update</Button>
        </div>
      </form>
  
    </div>

</template>