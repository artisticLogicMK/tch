<script setup>
import { PhClock } from '@phosphor-icons/vue'
import Userpic from '@/components/usi/Userpic.vue'
import Username from '@/components/usi/Username.vue'
import Userlevel from '@/components/usi/Userlevel.vue'

const props = defineProps(['data'])

const { $formatTime } = useNuxtApp()

const moderators = props.data?.forum ? props.data?.forum.moderators : props.data?.thread.forum.moderators
const isModerator = moderators.some(th => th.userId === props.data.user.id) || props.data.user.admin
</script>

<template>
    
  <NuxtLink :to="`/u/${data.user.username}`" class="flex items-center mb-2.5 w-fit">
    <Userpic :user="data.user" :isModerator class="mr-3" />
    
    <div>
      <Username :username="data.user.username" :country="data.user.country" :isModerator class="mb-1.5" />
      <div class="flex items-center">
        <Userlevel :userCount="data.user._count" />
      </div>
    </div>
  </NuxtLink>
  
  <div class="post-time flex items-center">
    <span>
      {{ $formatTime(data.createdAt) }}
    </span>
    <template v-if="data.createdAt !== data.updatedAt">
      <span class="mx-2">•</span>
      <span>Edited</span>
    </template>
  </div>

</template>