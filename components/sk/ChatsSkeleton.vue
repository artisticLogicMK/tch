<script setup>
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
</script>

<template>
  <div v-for="n in 5" class="flex items-center border-b bdr py-2.5 px-4">
    <Skeleton class="h-10 w-10 rounded-full mr-3" />
    <div class="grow">
      <Skeleton class="h-5 w-16 mb-2" />
      <Skeleton class="h-5 w-full" />
    </div>
  </div>
</template>