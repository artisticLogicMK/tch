<script setup>
useHead({
  title: "Jacob Followed Threads - DreamsTorchlight Forum",
})

import ThreadCard from '@/components/frm/ThreadCard.vue'
import Button from '@/components/ui/button/Button.vue'

definePageMeta({
  layout: "user-profile-layout",
  middleware: ["is-valid-user"]
})
</script>

<template>

    <div class="border-b bdr px-4 py-2">
      <h1 class="userheads">Followed Threads</h1>
    </div>

    <ThreadCard v-for="n in 10" :showSmallTime="true" :showLocation="true" />

</template>