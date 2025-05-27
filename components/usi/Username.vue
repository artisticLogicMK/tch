<script setup>
import { PhShieldStar } from '@phosphor-icons/vue'

defineProps(['username', 'country', 'isModerator'])
</script>

<template>
  <p class="username text-bsm xs:text-sm font-bold text-500 leading-none" :class="{'moderator': isModerator}">
    <PhShieldStar v-if="isModerator" class="icon hidden shrink-0" weight="fill" />
    {{ username }}
    <img v-if="country" :src="`https://flagcdn.com/32x24/${country.code}.png`" class="flag">
  </p>
</template>

<style>
.username {
  @apply flex items-center
}

.username.moderator {
  @apply text-sky-500
}
.username.moderator .icon {
  @apply inline-block mr-0.5 text-base -mt-[2px]
}
</style>