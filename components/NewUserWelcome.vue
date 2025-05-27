<script setup>
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import Button from '@/components/ui/button/Button.vue'

const { $global, $auth } = useNuxtApp()

const isPopoverOpen = ref(false)

onMounted(async () => {
  await nextTick()
  if ($auth.isAuthenticated && !$auth.user.welcomed && $global.meta?.welcome && localStorage.getItem(`dontShowWelcome-${$auth.user.id}`) === null) {
    setTimeout(() => isPopoverOpen.value = true, 5000)
  }
})

watch(isPopoverOpen, async (newValue) => {
  if (!newValue) {
    await useFetch('/api/welcomed', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${$auth.token}`
      },
    })
  }
})

const dontShow = () => {
  localStorage.setItem(`dontShowWelcome-${$auth.user.id}`, "1")
  isPopoverOpen.value = false
}
</script>

<template>
  <Dialog v-if="isPopoverOpen" :open="isPopoverOpen" @update:open="isPopoverOpen = $event">
    <DialogTrigger>
      <slot />
    </DialogTrigger>

    <DialogContent class="flex flex-col max-h-full p-0">

      <DialogHeader>
        <DialogTitle class="capitalize p-3 pb-0 leading-5">
          Welcome to<br>DreamsTorchlight Forum
        </DialogTitle>
      </DialogHeader>
      
      <p class="text-slate-700 dark:text-slate-200 text-sm leading-tight whitespace-pre grow overflow-y-auto p-3 xs:p-4">
         {{ $global.meta.welcome }}
      </p>
      
      <div class="px-4 flex justify-center pb-7">
        <Button @click="dontShow" class="max-w-fit">
          Dont show this again.
        </Button>
      </div>

    </DialogContent>
  </Dialog>
</template>