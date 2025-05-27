<script setup>
useHead({
  title: "Jacob Followed Forums - DreamsTorchlight Forum",
})

import ForumComponent from '@/components/frm/ForumComponent.vue'
import Button from '@/components/ui/button/Button.vue'

definePageMeta({
  layout: "user-profile-layout",
  middleware: ["is-valid-user"]
})
</script>

<template>

    <div class="border-b bdr px-4 py-2">
      <h1 class="userheads">Followed Forums</h1>
    </div>

    <ForumComponent v-for="n in 10" :showLocation="true" />

</template>

<style>
.info-itm {
  @apply text-slate-500
}
.info-itm span {
  @apply font-semibold mr-2
}
</style>