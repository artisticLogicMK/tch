<script setup>
import isOnline from '@/lib/isUserOnline'
import { PhGenderFemale, PhGenderMale } from '@phosphor-icons/vue'

const props = defineProps(['user', 'isModerator'])

const userImg = props.user?.picture.startsWith('http') || props.user?.picture.startsWith('/assets') ? props.user.picture : `/api${props.user.picture}`
</script>

<template>

  <div class="userpic relative shrink-0 w-fit rounded-full overflow-visible border bdr" :class="{'moderator': isModerator}">
    <img :src="userImg" class="w-10 h-10 object-center object-cover rounded-full" />
    <div v-if="user.gender" class="gender">{{ user.gender === 'male' ? 'M' : 'F' }}</div>
    <span class="status absolute top-0 left-0 w-[5px] h-[5px] bg-slate-300 dark:bg-slate-200 rounded-full -ml-1" :class="{'online': isOnline(user.lastActivity) && user.preferences?.seeOnline}"></span>
  </div>
    
</template>

<style>
.userpic .status.online {
  @apply bg-green-500
}

.userpic.moderator {
  @apply border-2 border-sky-500
}

.userpic .gender {
  @apply text-blue-500 dark:text-blue-400 text-[10px] absolute bottom-0 right-0 flex items-center justify-center bg-white dark:bg-slate-950 rounded-full w-3.5 h-3.5
}
.userpic .gender.female {
  @apply text-pink-500 dark:text-pink-400
}
</style>