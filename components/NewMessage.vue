<script setup>
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import Button from '@/components/ui/button/Button.vue'

defineProps(['count'])

const { $auth } = useNuxtApp()

const isPopoverOpen = ref(false)

const msgAlert = useState('msgAlert')

const goMsg = () => {
  msgAlert.value = null
  localStorage.removeItem('lastMessageSeen')
  navigateTo(`/u/${$auth.user.username}/messages`)
}

const closeAl = () => {
  msgAlert.value = null
  localStorage.removeItem('lastMessageSeen')
}

const dontShow = () => {
  msgAlert.value = null
  localStorage.removeItem('lastMessageSeen')
  sessionStorage.setItem('popupNo', '')
}
</script>

<template>
  <Dialog v-if="$auth.isAuthenticated && msgAlert" :open="$auth.isAuthenticated && msgAlert" @update:open="isPopoverOpen = $event">
    <DialogTrigger>
      <slot />
    </DialogTrigger>

    <DialogContent :hideClose="true" class="flex flex-col max-h-full">

      <DialogHeader>
        <DialogTitle class="capitalize p-3 pb-0 leading-5">
          You have {{count}} new message{{count > 1 ? 's' : ''}}
        </DialogTitle>
      </DialogHeader>
      
      <div class="px-4 flex justify-center mb-1">
        <Button @click="goMsg" class="mr-3">
          Open Messages
        </Button>
        <Button @click="closeAl" variant="outline">
          Okay
        </Button>
      </div>
      
      <p @click="dontShow" class="text-sky-500 text-sm mb-3 text-center">Dont show this popup again</p>

    </DialogContent>
  </Dialog>
</template>