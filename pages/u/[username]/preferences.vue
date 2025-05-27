<script setup>
useHead({
  title: "My Preferences",
})

useSeoMeta({
  robots: 'noindex, nofollow'
})

import Button from '@/components/ui/button/Button.vue'
import PrfInfo from '@/components/user/PrfInfo.vue'
import PrfPassword from '@/components/user/PrfPassword.vue'

definePageMeta({
  layout: "forum-layout",
  middleware: ["auth", "is-valid-user", "is-user"]
})
</script>


<template>

    <div class="prfTab">
      <button>
        <a href="#pinfo">Profile Info</a>
      </button>

      <button>
        <a href="#password">Change Password</a>
      </button>
    </div>
    
    <PrfInfo />
    
    <PrfPassword />

</template>

<style>
.prfTab {
  @apply flex space-x-2 xsm:space-x-4 px-3 xsm:px-4 py-2 border-b border-slate-200/80 dark:border-slate-900
}

.prfTab button {
  @apply text-slate-600 dark:text-slate-300 text-[0.8125rem] xs:text-sm border border-transparent rounded-full px-2 py-1
}
.prfTab button:hover {
  @apply border-sky-600 text-sky-600 dark:border-sky-500 dark:text-sky-500
}
</style>