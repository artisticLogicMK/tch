<script setup>
import Userpic from '@/components/usi/Userpic.vue'
import { PhShieldStar } from '@phosphor-icons/vue'

const { chat } = defineProps(['chat'])

const { $auth, $getRelativeShort } = useNuxtApp()

let otherUser
if (chat.sender.id === $auth.user.id) otherUser = chat.receiver
if (chat.receiver.id === $auth.user.id) otherUser = chat.sender

const lastUpdated = new Date(chat.lastUpdated)

const updated = `${lastUpdated.getMonth() + 1}/${lastUpdated.getDate()}/${String(lastUpdated.getFullYear()).slice(-2)}`

const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
</script>

<template>
  <NuxtLink :to="`/u/${otherUser.username}/messages/${chat.slug}`" class="relative flex items-center border-b bdr space-x-3 px-3 xs:px-4 py-3">
    <Userpic :user="otherUser" :isModerator="otherUser.moderating.length || otherUser.admin" :class="{'moderator': otherUser.moderating.length || otherUser.admin}" />
    
    <div class="grow w-1/2">
      <div class="flex items-center justify-between mb-1">
        <p class="usn text-600 dark:text-slate-200 font-semibold text-sm" :class="{'moderator': otherUser.moderating.length || otherUser.admin}">
          <PhShieldStar class="hidden text-sm xs:text-base" weight="fill" />
          {{ otherUser.username }}
        </p>

        <p class="text-slate-500 dark:text-slate-300 text-xs">{{ oneDayAgo > chat.lastUpdated ? updated : $getRelativeShort(lastUpdated) }}</p>
      </div>
      <p class="text-slate-500 dark:text-slate-300 text-bsm xs:text-sm truncate">{{ chat.messages[0].message }}</p>
    </div>
    
    <div v-if="chat._count.messages > 0" class="bg-red-500 text-white absolute right-0 top-0 text-xs w-5 flex justify-center rounded-bl-full">
      {{ chat._count.messages > 99 ? '99+' : chat._count.messages }}
    </div>
  </NuxtLink>
</template>

<style>
.usn.moderator {
  @apply text-sky-500
}
.usn.moderator svg {
  @apply inline-block -mt-[3px]
}
</style>