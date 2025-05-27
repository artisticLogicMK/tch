<script setup>
import ModTab from '~/components/mod/ModTab.vue'
import ModMenu from '~/components/mod/ModMenu.vue'
import ThemeModeBtn from '~/components/frm/ThemeModeBtn.vue'
import Button from '~/components/ui/button/Button.vue'
import Scroller from '~/components/Scroller.vue'

const isMd = useMediaQuery('(min-width: 768px)')
const responsive = ref(false)

if (process.client) responsive.value = true
</script>

<template>
    <div class="flex flex-col w-full h-screen">
      
      <div class="shrink-0 bg-flat flex items-center justify-between border-b bdr text-center px-4 py-2">
        <ModMenu v-if="responsive && !isMd">
          <ModTab />
        </ModMenu>
        <img v-else alt="DreamsTorchlight logo" class="h-4" src="/assets/logo.png" />
        
        <div class="flex items-center space-x-3">
          <ThemeModeBtn />
          <NuxtLink to="/">
            <Button class="rounded-full">< Forum</Button>
          </NuxtLink>
        </div>
      </div>
      

     <div class="grow h-full bg-transparent flex w-full max-w-7xl mx-auto overflow-y-auto space-x-5 p-3 xs:p-4">
        <ModTab v-if="isMd" class="hidden md:block" />
        
        <div class="grow w-[60%] h-full min-h-fit bg-flat border bdr rounded-2xl xsm:rounded-3xl">
          <div id="topper"></div>
          
          <slot />
          
          <div id="bottomer"></div>
        </div>
        
     </div>
    
      <Scroller />
    </div>

</template>

<style>
.modheads {
  @apply text-sm xs:text-base font-semibold text-slate-500 dark:text-slate-400
}
.modthread .btn {
  @apply flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-xl p-1.5 rounded-full active:scale-125 duration-200 border dark:border-slate-800/80
}

.modthread .btn.sel {
  @apply bg-slate-500 dark:bg-slate-600 text-white
}
</style>