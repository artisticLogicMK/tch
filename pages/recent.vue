<script setup>
definePageMeta({
  middleware: ["is-valid-user"]
})

import TrendingLayout from '@/layouts/TrendingLayout.vue'
</script>

<template>
  <TrendingLayout view="recent" />
</template>