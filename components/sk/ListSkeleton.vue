<script setup>
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
</script>

<template>
  <div class="flex justify-between border-b bdr py-2 px-4">
    <Skeleton class="h-7 w-20" />
    <Skeleton class="h-7 w-16" />
  </div>
  
  <div v-for="n in 4" :key="n">
    <Skeleton class="h-20 w-full" />
    <div class="h-20 w-full"></div>
  </div>
</template>