<script setup>
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
</script>

<template>
  <div class="flex justify-between border-b bdr py-2 px-4">
    <Skeleton class="h-7 w-20" />
    <Skeleton class="h-7 w-16" />
  </div>
  
  <div class="p-4">
    <Skeleton class="h-6 w-16 mb-3" />
    <Skeleton class="h-6 w-full mb-8" />
    <Skeleton class="h-56 w-full mb-8" />
    <Skeleton v-for="n in 4" :key="n" class="h-6 w-64 mb-3" />
    <Skeleton class="h-6 w-32 mb-3 mt-8 mx-auto" />
  </div>
</template>