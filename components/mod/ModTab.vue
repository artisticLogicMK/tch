<script setup>
import { PhChatsCircle, PhListBullets, PhChatCenteredDots, PhNote, PhMegaphone, PhFlag, PhUsers } from '@phosphor-icons/vue'
</script>

<template>
  
  <div class="modtab bg-flat shrink-0 border bdr rounded-3xl p-3">
    <NuxtLink to="/mod/forums">
      <PhChatsCircle /> Forums
    </NuxtLink>
    
    <NuxtLink to="/mod/forum-categories">
      <PhListBullets /> Categories
    </NuxtLink>
    
    <NuxtLink to="/mod/users">
      <PhUsers /> Users
    </NuxtLink>
    
    <NuxtLink v-if="false" to="/">
      <PhChatCenteredDots /> Threads
    </NuxtLink>
    
    <NuxtLink v-if="false" to="/">
      <PhNote /> Posts
    </NuxtLink>
    
    <NuxtLink to="/mod/reports">
      <PhFlag /> Reports
    </NuxtLink>
    
    <NuxtLink to="/mod/alerts">
      <PhMegaphone /> Forum Alerts
    </NuxtLink>
  </div>
  
</template>

<style>
.modtab a {
  @apply flex items-center w-full text-sm text-slate-600 dark:text-slate-300 block px-3 py-2.5 rounded-xl
}
.modtab a svg {
  @apply mr-2 text-lg
}
.modtab a.router-link-active {
 @apply bg-slate-200/80 dark:bg-slate-800/90
}
</style>
