<script setup>
import { PhX } from '@phosphor-icons/vue'

const { $global } = useNuxtApp()

const showAnn = ref(false)

const hideAnn = () => {
  localStorage.setItem("ann" + $global.meta?.time, "1")
  showAnn.value = false
}

onMounted(() => {
  if ($global.meta?.time && localStorage.getItem("ann" + $global.meta?.time) === null) {
    showAnn.value = true
  }
})
</script>

<template>
  <div class="relative w-full px-3 xs:px-4 py-4 border-b bdr bg-gradient-to-tl from-slate-200/60 to-transparent dark:from-slate-800/40 text-slate-800 dark:text-slate-200" v-if="$global.meta && !$global.meta?.hide && showAnn">
    <h1 class="text-sm xs:text-base font-semibold opacity-90 mb-2">General Announcement</h1>
    
    <p class="max-w-full text-bsm xs:text-sm whitespace-pre-line leading-none">
      {{ $global.meta?.announcement }}
    </p>
    
    <button @click="hideAnn" class="absolute top-3 right-3">
      <PhX :size="20" weight="bold" />
    </button>
  </div>
</template>