<script setup>
import { PhCaretDown, PhCaretUp } from '@phosphor-icons/vue'

const { $auth } = useNuxtApp()
const open = ref(true)
const neww = ref(false)

onMounted(() => {
  if ($auth.isAuthenticated && Number(sessionStorage.warnings) !== $auth.user.warnings) neww.value = true
  
  if ($auth.isAuthenticated) sessionStorage.warnings = String($auth.user.warnings)
})
</script>

<template>
  <div v-if="$auth.isAuthenticated && $auth.user.warnings > 0" class="bg-orange-600 dark:bg-orange-500 text-white dark:text-black/90 text-bsm xs:text-sm" :class="{'warncl' : !open}">
    <div class="flex items-center justify-between px-3 xs:px-4 py-2 border-b border-black/10">
      <h1 class="font-semibold">
        Warning
        <span v-if="neww" class="animate-pulse bg-white text-orange-600 dark:bg-black/90 dark:text-orange-500 rounded-full text-xs px-2 ml-2" :class="{'tecl' : !open}">New</span>
      </h1>
      
      <button @click="open = !open">
        <PhCaretUp v-if="open" class="text-xl" />
        <PhCaretDown v-else class="text-xl" />
      </button>
    </div>
    
    <div v-if="open && $auth.user.warn_text" class="p-3 xs:p-4">
      {{ $auth.user.warn_text }}
    </div>
  </div>
</template>

<style>
.warncl {
  @apply bg-white text-orange-600
}
.tecl {
  @apply bg-orange-600 text-white
}
</style>