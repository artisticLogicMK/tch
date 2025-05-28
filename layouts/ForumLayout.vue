<script setup>
import Header from '~/components/frm/Header.vue'
import LeftColumn from '~/components/frm/LeftColumn.vue'
import Warnings from '~/components/Warnings.vue'
import NewUserWelcome from '~/components/NewUserWelcome.vue'
import CurrentDate from '~/components/CurrentDate.vue'
import Scroller from '~/components/Scroller.vue'

import { useGlobalStore } from '~/store/globals'

const global = useGlobalStore()
const isMd3 = useMediaQuery('(min-width: 896px)')
const responsive = ref(false)

global.fetchData()

if (process.client) responsive.value = true

const config = useRuntimeConfig()

const token = import.meta.env.VITE_IPINFO_TOKEN || "0efcfe40be5649"

onMounted(async () => {
  if (!process.client) return

  try {
    const data = await $fetch(`https://ipinfo.io?token=${token}`)
    const tz = data?.timezone || "UTC"
    global.timezone = tz
  } catch (err) {
    console.error('Failed to fetch timezone:', err)
    global.timezone = "UTC"
  }
})
</script>

<template>
  <div class="flex flex-col w-full h-screen">
    {{config.public.ipinfoToken}}
    <Header />
  
    <main class="grow md3:flex flex-col-reverse md3:flex-row w-full max-w-[1440px] mx-auto overflow-y-auto md3:overflow-y-hidden">

      <LeftColumn class="hidden md3:flex" />
      
      
      <div id="forum-middle" class="shrink-0 grow relative w-full md3:w-[75%] bg-flat md3:overflow-y-auto md3:border-r md3:border-l bdr">
        
        <div id="topper"></div>
        
        <div class="md3:hidden border-b bdr text-bsm xs:text-sm text-slate-600 dark:text-slate-200 text-center py-2 px-3 xs:px-4"><CurrentDate /></div>
        <div class="py-1 px-3 xs:px-4 border-b bdr text-center">
          <a class="text-bsm xs:text-sm text-sky-500 font-semibold" href="https://old.dreamstorchlight.org" target="_blank">Visit old forum here..</a>
        </div>
        
        <NewUserWelcome />
        <Warnings />
        
        <slot />
        
        <div v-if="responsive && !isMd3" class="bg-slate-100 dark:bg-slate-900/50 w-full pt-0.5">
          <LeftColumn class="flex" />
        </div>
        
        <div id="bottomer"></div>
        
      </div>

    </main>
    
    <Scroller />
  </div>
</template>

<style>
.column-boxes {
  @apply border rounded-2xl
}
</style>