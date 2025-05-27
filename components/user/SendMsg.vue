<script setup>
import Button from '@/components/ui/button/Button.vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast/use-toast'
import { PhChat } from '@phosphor-icons/vue'

const { user } = defineProps(['user'])

const { $auth } = useNuxtApp()
const { toast } = useToast()

const loading = ref(false)

const startChat = async () => {
  if (loading.value) return
  
  loading.value = true
  
  const { data } = await useFetch('/api/chat/send-new', {
    method: 'POST',
    body: {
      receiverId: user.id,
      senderId: $auth.user.id,
    },
    headers: { Authorization: `Bearer ${$auth.token}` },
  })
  
  if (data.value.success) {
    loading.value = false
    
    navigateTo(`/u/${user.username}/messages/${data.value.chatSlug}`)
  } else {
    loading.value = false
    toast({ title: 'There was a problem naviagting to chat', variant: 'destructive' })
  }
}
</script>

<template>
    <Button @click="startChat" class="text-xs p-0 px-2.5 h-7 rounded-full ml-3" :loading="loading">
      <PhChat class="text-base" /> Message
    </Button>
</template>