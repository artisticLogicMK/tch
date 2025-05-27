<script setup>
import { PhNewspaper, PhNote, PhRssSimple, PhTrendUp } from '@phosphor-icons/vue'
</script>

<template>
  <div id="indexTab" class="flex border-b bdr px-3 xs:px-4">
    <NuxtLink to="/">
     <PhNote weight="duotone" /> Forums
    </NuxtLink>
    
    
    <NuxtLink v-if="false" to="/feeds">
      <PhNewspaper weight="duotone" />
      Feeds
    </NuxtLink>
        
    
    <NuxtLink to="/recent">
     <PhRssSimple weight="duotone" /> Recent
    </NuxtLink>
    
    <NuxtLink to="/trending">
     <PhTrendUp weight="duotone" /> Trending
    </NuxtLink>
    
  </div>
</template>

<style>
#indexTab {
  @apply w-full max-w-full overflow-x-auto overflow-y-hidden
}
#indexTab a {
  @apply flex items-center text-slate-500 dark:text-slate-300 text-[0.8125rem] xs:text-sm font-semibold px-2 xsm:px-3 py-2 border-b-2 -mb-px border-r border-r-slate-200/80 dark:border-r-slate-900 last:border-r-transparent border-b-transparent 
}
#indexTab a svg {
  @apply text-sm mr-1 hidden mic2:inline-block
}
#indexTab a.router-link-active {
  @apply text-sky-500 border-b-sky-500
}
</style>
