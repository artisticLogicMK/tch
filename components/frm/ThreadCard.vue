<script setup>
import { PhUser } from '@phosphor-icons/vue'
import Pinned from '@/components/ui/Pinned.vue'
import ThreadActions from '@/components/frm/ThreadActions.vue'

const props = defineProps(['thread', 'showSmallTime', 'showLocation', 'showPin', 'showNewLink'])

const { $formatTime, $global } = useNuxtApp()

const links = {
  category: { url: `/forum/${props.thread.forum.category.slug}`, name: props.thread.forum.category.name },
  forum: { url: `/forum/${props.thread.forum.category.slug}/${props.thread.forum.slug}`, name: props.thread.forum.name },
  thread: { url: `/forum/${props.thread.forum.category.slug}/${props.thread.forum.slug}/${props.thread.slug}`, title: props.thread.title }
}

provide('links', links)
</script>

<template>
  <div class="post-thread-card" :class="{'border-b': props.showSmallTime}">

    <p v-if="props.showLocation" class="cards-location">/ <NuxtLink :to="links.category.url">{{ links.category.name }}</NuxtLink> / <NuxtLink :to="links.forum.url">{{ links.forum.name }}</NuxtLink></p>
    
    <Pinned v-if="props.thread.pinned && props.showPin" />

    <div class="mb-2 md3:mb-3">
      <NuxtLink :to="links.thread.url" class="text-base sm:text-xl text-600 font-bold font-round hover:underline underline-offset-4">
        {{ links.thread.title }}
      </NuxtLink>
    </div>

    <div v-if="props.showSmallTime === true" class="xs:flex items-center text-xs mb-3">
      <span class="flex items-center text-pri-500 font-semibold xs:mr-4 mb-2 xs:mb-0">
        <PhUser class="mr-1" weight="bold" /> 
        <NuxtLink :to="`/u/${props.thread.user.username}`">{{ props.thread.user.username }}</NuxtLink>
      </span>
      <span class="flex items-center text-slate-500/90 dark:text-slate-400 font-light">
        {{ $formatTime(props.thread.createdAt) }}
      </span>
    </div>
    
    <div v-if="props.showNewLink" class="mb-3">
      <NuxtLink :to="showNewLink" class="text-sky-500 text-bsm xs:text-sn">See latest replies</NuxtLink>
    </div>
    
    <ThreadActions :thread="props.thread" />

  </div>
</template>