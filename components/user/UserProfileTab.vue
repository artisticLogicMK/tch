<script setup>
import { PhUser, PhUserList, PhBookmarks, PhChatsCircle } from '@phosphor-icons/vue'

const { user } = defineProps(['user'])

const { $auth } = useNuxtApp()
</script>

<template>
  <div v-if="user" class="shrink-0 w-fit md:h-full text-sm md:border-r bdr">
    
    <ul>
      <div class="head"><PhUser weight="bold" /> My Profile</div>
      <li>
        <NuxtLink :to="`/u/${user.username}`">Info</NuxtLink>
      </li>
      <li v-if="($auth.isAuthenticated && $auth.user.id === user.id) || user.preferences?.seeMyThreads">
        <NuxtLink  :to="`/u/${user.username}/threads`">Threads</NuxtLink>
      </li>
      <li v-if="($auth.isAuthenticated && $auth.user.id === user.id) || user.preferences?.seeMyThreads">
        <NuxtLink :to="`/u/${user.username}/posts`">Posts</NuxtLink>
      </li>
      <li v-if="false">
        <NuxtLink to="/u/username/followers">Followers</NuxtLink>
      </li>
    </ul>


    <ul v-if="$auth.isAuthenticated && $auth.user.id === user.id">
      <div class="head"><PhChatsCircle weight="bold" /> My Messages</div>
      <li>
        <NuxtLink :to="`/u/${$auth.user.username}/messages`">All</NuxtLink>
      </li>
    </ul>
      
    
    <ul v-if="false">
      <div class="head"><PhUserList weight="bold" /> My Followings</div>
      <li>
        <NuxtLink to="/u/username/followed-forums">Forums</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/u/username/followed-threads">Threads</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/u/username/followed-members">Members</NuxtLink>
      </li>
    </ul>
    
    <ul v-if="$auth.isAuthenticated && $auth.user.id === user.id">
      <div class="head"><PhBookmarks weight="bold" /> My Bookmarks</div>
      <li>
        <NuxtLink :to="`/u/${user.username}/bookmarked-threads`">Threads</NuxtLink>
      </li>
      <li>
        <NuxtLink :to="`/u/${user.username}/bookmarked-posts`">Posts</NuxtLink>
      </li>
    </ul>
    
  </div>
</template>

<style scoped>
ul {
  @apply text-slate-500 dark:text-slate-300 text-sm border-b border-slate-200/80 dark:border-slate-900 px-4 py-2 last:border-none
}
ul li {
  @apply mb-3
}
ul li a {
  @apply px-3 py-1.5 rounded-md
}
ul li a.router-link-active {
  @apply bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-500
}
.head {
  @apply flex items-center font-semibold mb-3
}
.head svg {
  @apply mr-1.5 text-base
}
</style>