<script setup>
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
</script>

<template>
  <div id="search">
    <PhMagnifyingGlass size="20" class="icons text-slate-400 dark:text-slate-500" />
    <div id="input"><input type="text" placeholder="Search forum..." class="text-500 pointer-events-none" /></div>
  </div>
</template>

<style scoped>
#search {
  @apply grow flex items-center h-full max-w-[130px] sm:max-w-[200px] md:max-w-xs md2:max-w-sm bg-slate-100/90 dark:bg-slate-900 rounded-full mx-4 px-1 cursor-pointer
}
#search #input{
  @apply grow overflow-hidden mr-3
}
#search input{
  @apply h-full w-full text-sm bg-transparent mx-3
}
#search .icons {
  @apply shrink-0 m-1.5
}
</style>