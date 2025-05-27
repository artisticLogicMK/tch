<script setup>
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
</script>

<template>
  <div v-for="n in 2" :key="n" class="p-4">
    <Skeleton class="h-7 w-[40%] mb-3" />
    <Skeleton class="h-24 w-full mb-6" />
    <Skeleton class="h-96 w-full rounded-2xl" />
  </div>
</template>