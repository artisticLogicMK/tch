<script setup>
import { PhChatsCircle, PhUser } from '@phosphor-icons/vue'
</script>

<template>
  <div class="side-columns">
    
    <div v-for="(n,i) in 2" class="flex-1 column-boxes bg-flat bdr p-4 mb-3">
      
      <h1 class="font-round text-500 mb-1">
        <PhChatsCircle weight="duotone" />
        {{i == 1 ? 'New' : 'Trending'}} Threads
      </h1>
      
      <div v-for="n in 3" class="mt-1.5 font-round">
        <a class="flex items-center text-sm font-bold mb-0.5k block hover:text-pri-500">
          I ate a whole three of mango in my dream
        </a>
        <p class="flex items-center text-500">
          <PhUser weight="duotone" />
          &nbsp;ebankole
        </p>
      </div>
      
    </div>
        
  </div>
</template>

<style>

</style>