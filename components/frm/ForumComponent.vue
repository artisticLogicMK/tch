<script setup>
import { PhArticle, PhChatsCircle, PhShieldStar, PhUser } from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu'

const props = defineProps(['showLocation', 'forum'])
const { $auth, $formatNumber, $getRelative } = useNuxtApp()

const forum = `/forum/${props.forum.category.slug}/${props.forum.slug}`
</script>

<template>
  <div class="border-b bdr last:border-none p-3 xs:p-4">

    <p v-if="props.showLocation" class="cards-location">/ <NuxtLink :to="`/forum/${props.forum.category.slug}`">{{ props.forum.category.name }}</NuxtLink></p>

    <div class="flex items-baseline sm:items-end justify-between mb-2">
      <NuxtLink :to="forum" class="forums-list-head text-pri-500 text-base xsm:text-lg">
        {{ props.forum.name }}
      </NuxtLink>
      <button v-if="false && $auth.isAuthenticated" class="text-pri-500 border border-sky-500 text-bsm xsm:text-sm hover:opacity-70 px-2 py-0.5 rounded-md cp ml-2">Follow</button>
    </div>
    
    <p class="text-bsm xsm:text-sm text-600 mb-2">{{ props.forum.description }}</p>
    
    <div class="forumCatInfo flex items-center text-bsm text-500">
      <DropdownMenu v-if="props.forum.moderators.length">
        <DropdownMenuTrigger class="p-[0!important]">
          <p class="mds text-pri-500 border border-sky-500 px-1.5 py-1 rounded-md cp">
            <PhShieldStar weight="fill" class="xsm:-mt-[2px]" /> <span class="hidden xs:block">Moderators</span>
          </p>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent>
          <DropdownMenuLabel>Moderators</DropdownMenuLabel>
          <DropdownMenuItem v-for="mod in props.forum.moderators" :key="mod.id">
            <NuxtLink :to="`/u/${mod.user.username}`" class="flex items-center">
              <PhUser class="mr-1" /> {{ mod.user.username }}
            </NuxtLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div class="infs">
        <p>
          <PhChatsCircle weight="duotone" /> {{ $formatNumber(props.forum._count.threads) }} Threads
        </p>
        <NuxtLink v-if="props.forum.threads[0]?.createdAt" :to="`${forum}/${props.forum.threads[0]?.slug}`" class="text-xs">Last: {{ $getRelative(props.forum.threads[0]?.createdAt) }}</NuxtLink>
      </div>
      
      <div class="infs">
        <p>
          <PhArticle weight="duotone" /> {{ $formatNumber(props.forum._count.posts) }} Posts
        </p>
        <NuxtLink v-if="props.forum.threads[0]?.createdAt && props.forum.posts[0]?.createdAt" :to="`${forum}/${props.forum.posts[0]?.thread.slug}`" class="text-xs">Last: {{ $getRelative(props.forum.posts[0]?.createdAt) }}</NuxtLink>
        <span v-if="props.forum.threads[0]?.createdAt && !props.forum.posts[0]?.createdAt">Last: None yet</span>
      </div>
    </div>
    
    
  </div>
</template>

<style>
.forumCatInfo .infs {
  @apply [&:nth-child(2)]:mx-4
}
.forumCatInfo .infs p {
  @apply flex items-center
}
.forumCatInfo .infs a {
  @apply hover:underline underline-offset-4 text-slate-600 dark:text-slate-300
}
.forumCatInfo .infs p svg {
  @apply text-sm mr-1 -mt-[2px]
}
.forumCatInfo p.mds svg {
  @apply text-sm xsm:mr-1
}
</style>