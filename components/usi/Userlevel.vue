<script setup>
import { PhStar } from '@phosphor-icons/vue'

const props = defineProps(['userCount'])

function getUserLevel() {
    if (props.userCount.threads >= 251 || props.userCount.posts >= 801 || props.userCount.views >= 15001) {
        return 5
    } else if (props.userCount.threads >= 101 || props.userCount.posts >= 301 || props.userCount.views >= 5001) {
        return 4
    } else if (props.userCount.threads >= 41 || props.userCount.posts >= 101 || props.userCount.views >= 2001) {
        return 3
    } else if (props.userCount.threads >= 11 || props.userCount.posts >= 31 || props.userCount.views >= 501) {
        return 2
    } else {
        return 1
    }
}

const level = getUserLevel()
</script>

<template>
  <p class="flex">
    <PhStar v-for="n in level" :key="n" class="stars" weight="fill" />
    <PhStar v-for="n in (5 - level)" :key="n" class="stars null" weight="fill" />
  </p>
</template>

<style>
.stars { @apply text-sm text-yellow-500 dark:text-yellow-400 mr-0.5 }
.stars.null { @apply text-slate-300 dark:text-slate-700 }
</style>