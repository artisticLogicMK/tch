<script setup>
import { useAuthStore } from '~/store/auth'
import { usePagesStore } from '@/store/pages'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useToast } from '~/components/ui/toast/use-toast'
import { PhUser, PhGearSix, PhSignOut, PhShieldChevron, PhChatsCircle } from '@phosphor-icons/vue'

const auth = useAuthStore()
const pagesStore = usePagesStore()

const { toast } = useToast()

const route = useRoute()
const isPopoverOpen = ref(false)

const closePopover = () => {
  isPopoverOpen.value = false
}

const logout = () => {
  auth.logout()
  pagesStore.$reset()
  
  toast({ title: 'Signed Out!' })
      
  navigateTo('/')
}

// Watch for route changes and close the popup
watch(route, () => {
  isPopoverOpen.value = false
})

const userImg = auth.user?.picture.startsWith('http') || auth.user?.picture.startsWith('/assets') ? auth.user.picture : `/api${auth.user.picture}`
</script>

<template>
  <Popover :open="isPopoverOpen" @update:open="isPopoverOpen = $event">
    
    <PopoverTrigger @click="isPopoverOpen = !isPopoverOpen">
      <img :src="userImg" class="shrink-0 w-8 h-8 object-cover object-center rounded-full border bdr" />
    </PopoverTrigger>


    <PopoverContent class="p-3 rounded-xl">
      <slot />
      <div class="usetab">
        <NuxtLink :to="`/u/${auth.user.username}`">
          <PhUser /> Profile Info
        </NuxtLink>
        <NuxtLink :to="`/u/${auth.user.username}/messages`">
          <PhChatsCircle /> Messages
        </NuxtLink>
        <NuxtLink :to="`/u/${auth.user.username}/preferences`">
          <PhGearSix /> Preferences
        </NuxtLink>
        <NuxtLink v-if="auth.isAuthenticated && auth.user.admin" to="/mod/forums">
          <PhShieldChevron /> Admin/Moderator
        </NuxtLink>
        <a href="https://old.dreamstorchlight.org" target="_blank">
          Visit Old Forum
        </a>
        
        <ConfirmDialog title="Are you sure to Logout?" @accept="logout">
          <button>
            <PhSignOut /> Sign Out
          </button>
        </ConfirmDialog>
      </div>
    </PopoverContent>
    
  </Popover>
</template>

<style>
.usetab a, .usetab button {
  @apply flex items-center w-full text-sm text-slate-600 dark:text-slate-300 block px-3 py-2.5 rounded-md hover:bg-slate-200/80 dark:hover:bg-slate-800/90
}
.usetab a svg, .usetab button svg {
  @apply mr-2 text-lg
}

.usetab.perms button, .usetab.perms a {
  @apply px-2 py-1.5
}
</style>