<script setup>
useHead({
  title: "Messages - DreamsTorchlight Forum.",
})

useSeoMeta({
  robots: 'noindex, nofollow'
})

definePageMeta({
  layout: "user-profile-layout",
  middleware: ["auth", "is-valid-user", "is-user"]
})

const { $auth } = useNuxtApp()

import MessagesCard from '@/components/user/MessagesCard.vue'
import ChatsSkeleton from '@/components/sk/ChatsSkeleton.vue'
import Button from '@/components/ui/button/Button.vue'
import { PhMagnifyingGlass, PhMagnifyingGlassMinus, PhX } from '@phosphor-icons/vue'

const userProfile = inject('user')
const chats = useState('chatsData', () => null)

const chatsFetch = async (search = null) => {
  try {
    const { data } = await useFetch(`/api/chat/chats?search=${search}`, {
      method: 'POST',
      body: { userId: $auth.user.id },
      headers: {
        Authorization: `Bearer ${$auth.token}`
      }
    })
  
    if (data.value.success) {
      chats.value = data.value.chats
      userProfile.value = data.value.user
      
      msgAlert.value = null
      notifyAlert.value = null
      
      const now = new Date().toISOString()
      localStorage.lastMessageSeen = String(now)
    } else {
      toast({
        title: `Failed to fetch chats. ${data.value.message}`,
        variant: 'destructive'
      })
    }
  } catch (error) {
    console.log(error)
  }
}

const filter = ref('all')
const searchOpen = ref(false)
const search = ref(null)
const searchLoad = ref(false)

const compChats = computed(() => {
  if (filter.value === 'all') {
    return chats.value
  }
  
  if (filter.value === 'unread') {
    return chats.value.filter(chat => chat._count.messages > 0)
  }

  if (filter.value === 'fav') {
    return chats.value.filter(chat => {
      return localStorage.getItem(`${chat.slug}`) !== null
    })
  }
})

const searchChats = async () => {
  if (searchLoad.value && !search.value) return
  searchLoad.value = true
  
  await chatsFetch(search.value)
  
  searchLoad.value = false
}

const closeSearch = async () => {
  if (!search.value) {
    searchOpen.value = false
    return
  }
  
  if (searchLoad.value) return
  searchLoad.value = true
  
  search.value = null
  
  await chatsFetch(search.value)
  
  searchLoad.value = false
  searchOpen.value = false
}

const msgAlert = useState('msgAlert')
const notifyAlert = useState('notifyAlert')

let chatInterval

onMounted(async () => {
  await nextTick()
  await chatsFetch()
  
  chatInterval = setInterval(async () => {
    await chatsFetch(search.value)
  }, 30 * 1000)
})

onUnmounted(() => {
  clearInterval(chatInterval)
})
</script>

<template>
    <div class="flex items-center justify-between border-b bdr text-slate-700 dark:text-slate-200 px-3 xs:px-4 py-2">
      <div class="topbtns flex flex-wrap space-x-2">
        <button @click="filter = 'all'" :class="{'active': filter === 'all'}">All</button>
        <button @click="filter = 'unread'" :class="{'active': filter === 'unread'}">Unread</button>
        <button @click="filter = 'fav'" :class="{'active': filter === 'fav'}">Favourites</button>
      </div>
      
      <button @click="searchOpen = true" class="text-xl">
        <PhMagnifyingGlass />
      </button>
    </div>
    
    <form v-if="searchOpen" @submit.prevent="searchChats" class="flex items-center px-3 xs:px-4 py-2 border-b bdr">
      <input type="search" v-model="search" class="grow w-14 bg-transparent botder-none text-sm text-slate-700 dark:text-slate-200 mr-3" placeholder="Search username or message..." required />
      <Button class="h-7" :loading="searchLoad">Search</Button>
      <button @click.prevent="closeSearch" class="text-xl text-sm text-slate-700 dark:text-slate-200 ml-2"><PhX /></button>
    </form>

    <div v-if="chats && chats.length">
      <MessagesCard v-for="chat in compChats" :key="chat.id" :chat="chat" />
    </div>
    
    <div v-if="chats && !chats.length" class="no-item text-center">Message a member to start a chat.</div>
    
    <ChatsSkeleton v-if="!chats" />
    
</template>

<style>
.topbtns button {
  @apply bg-slate-200/60 dark:bg-slate-900 text-xs font-semibold rounded-full px-3 py-1.5
}
.topbtns button.active {
  @apply bg-slate-300 dark:bg-slate-700/80
}
</style>