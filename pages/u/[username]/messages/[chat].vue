<script setup>
useSeoMeta({
  robots: 'noindex, nofollow'
})

definePageMeta({
  middleware: ["auth", "is-valid-user"]
})

import { usePagesStore } from '@/store/pages'

const route = useRoute()

const chatSlug = route.params.chat
const username = route.params.username

const { $auth, $formatTime, $global } = useNuxtApp()

$global.fetchData()

const pageLoader = ref(false)
const currentPage = ref(route.query.page ? parseInt(route.query.page) : 1)
const totalPages = ref(0)

const pagesStore = usePagesStore()

const chat = ref(null)

const fetchChat = async (page = 1) => {
  const cacheKey = `${chatSlug}-${page || 1}`

  // Use cached forum page if exists
  if (pagesStore.chatPagesData[cacheKey]) {
    chat.value = pagesStore.chatPagesData[cacheKey].chat
    totalPages.value = pagesStore.chatPagesData[cacheKey].totalPages
    currentPage.value = pagesStore.chatPagesData[cacheKey].currentPage
    return
  }

  try {
    const { data } = await useAsyncData(cacheKey, () =>
      $fetch(`/api/chat/messages?slug=${chatSlug}&page=${page}`, {
        method: "POST",
        body: { userId: $auth.isAuthenticated ? $auth.user.id : null },
      }),
      { defaultCache: 7200 }
    )

    if (!data.value?.chat) throw createError({ statusCode: 500 })

    chat.value = data.value.chat
    totalPages.value = data.value.totalPages
    currentPage.value = data.value.currentPage

    pagesStore.setChatPage(cacheKey, data.value)
  } catch (err) {
    //throw createError({ statusCode: 500 })
  }
}

await fetchChat(currentPage.value)

watch(() => route.query.page, async (newVal) => {
  document.getElementById("pageLoader").scrollIntoView()
  pageLoader.value = true

  await fetchChat(parseInt(newVal))
  pageLoader.value = false
})

import Button from '@/components/ui/button/Button.vue'
import { PhStar, PhArrowLeft, PhArrowDown, PhPaperPlaneTilt, PhTrash, PhSpinnerGap } from '@phosphor-icons/vue'
import { useToast } from '@/components/ui/toast/use-toast'
import MsgPaginator from '@/components/MsgPaginator.vue'
import PageLoader from '@/components/PageLoader.vue'

const { textarea, input: message } = useTextareaAutosize()

const { toast } = useToast()

const loading = ref(false)
const delLoading = ref(false)

const scrollDown = () => {
  const element = document.getElementById('chat-con')
  element.scrollTop = element.scrollHeight
}

const sendMsg = async () => {
  if (loading.value || message.value === '') return

  loading.value = true
  
  const { data } = await useFetch('/api/chat/send-msg', {
    method: 'POST',
    body: {
      chatId: chat.value.id,
      userId: $auth.user.id,
      message: message.value
    },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
  })
  
  if (data.value.success) {
    loading.value = false
    message.value = ''
    
    pagesStore.removeChatPage(`${chatSlug}-1`)
    
    if (currentPage.value !== 1) {
      navigateTo('?page=1')
    } else {
      chat.value.messages.push(data.value.newMsg)
      
      await nextTick()
      scrollDown()
    }
  } else {
    loading.value = false
    toast({ title: 'There was a problem sending message!', variant: 'destructive' })
  }
}

const delMsg = async (id) => {
  if (delLoading.value) return
  if (!confirm("Sure to delete message?")) return
  
  delLoading.value = id
  
  const { data } = await useFetch('/api/chat/del-msg', {
    method: 'POST',
    body: { id },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
  })
  
  if (data.value.success) {
    delLoading.value = false

    chat.value.messages = chat.value.messages.filter(msg => msg.id !== id)
  } else {
    delLoading.value = false
    toast({ title: 'There was a problem deleting message!', variant: 'destructive' })
  }
}

const starred = ref(false)

const star = async () => {
  if (localStorage.getItem(`${chatSlug}`) === null) {
    localStorage.setItem(`${chatSlug}`, '1')
    starred.value = true
  } else {
    localStorage.removeItem(`${chatSlug}`)
    starred.value = false
  }
}


let otherUser
if (chat.value.sender.id === $auth.user.id) otherUser = chat.value.receiver
if (chat.value.receiver.id === $auth.user.id) otherUser = chat.value.sender

useHead({
  title: otherUser.username,
})

let msgInterval

onMounted(async () => {
  if (localStorage.getItem(`${chatSlug}`) !== null) {
    starred.value = true
  }
  
  if (currentPage.value === 1) {
    await nextTick()
    scrollDown()
  }
  
  msgInterval = setInterval(async () => {
    if (currentPage.value !== 1) return

    const { data } = await useFetch('/api/chat/fetch-msg', {
      method: 'POST',
      body: { otherUserId: otherUser.id, chatId: chat.id, lastMsgTime: chat.value.messages[chat.value.messages.length - 1].createdAt },
      headers: { Authorization: `Bearer ${$auth.token}` },
    })
    
    if (data.value.msgs.length) {
      data.value.msgs.forEach(ch => {
       if (!chat.value.messages.includes(ch)) chat.value.messages.push(ch)
      })
      
      await nextTick()
      scrollDown()
    }
  }, 20 * 1000)
})

onUnmounted(() => {
  clearInterval(msgInterval)
})
</script>

<template>
  <div class="flex flex-col h-screen bg-slate-200/70 dark:bg-slate-900/70">

    <div class="shrink-0 flex items-center justify-between bg-flat border-b bdr text-slate-600 dark:text-slate-200 px-3 xs:px-4 py-2">
      
      <div class="flex items-center space-x-2">
        <NuxtLink :to="`/u/${$auth.user.username}/messages/`">
          <PhArrowLeft :size="27" />
        </NuxtLink>
        
        <img :src="otherUser?.picture.startsWith('http') || otherUser?.picture.startsWith('/assets') ? otherUser?.picture : `/api${otherUser?.picture}`" class="w-8 h-8 object-cover object-center rounded-full shrink-0 border bdr" />
      </div>
      
      <button @click="star">
        <PhStar v-if="starred" :size="27" class="text-yellow-500" weight="fill" />
        <PhStar v-else :size="27" class="opacity-70" />
      </button>
     
    </div>
    
    
    <div id="chat-con" class="grow justify-end overflow-y-auto chat-container p-3 xs:p-4 md:px-7">
      
      <template v-if="chat?.messages.length">
        <div v-for="msg in chat.messages" :key="msg.id" class="chatbox" :class="msg.userId === $auth.user.id ? 'usr' : 'msgr'">
          <button v-if="msg.userId === $auth.user.id" @click="delMsg(msg.id)">
            <PhSpinnerGap v-if="delLoading === msg.id" class="animate-spin" /> <PhTrash v-else />
          </button>

          <p>{{ msg.message }}
            <span class="w-full text-end text-[0.7rem] float-right opacity-60">
              {{ $formatTime(msg.createdAt) }}
            </span>
          </p>
        </div>
      </template>
      
      <div v-if="!chat?.messages.length" class="text-slate-400 dark:text-slate-600 text-2xl font-semibold text-center mt-36">
        Send a message to start conversation<br/>
        <PhArrowDown class="text-3xl inline-block mt-5" />
      </div>
      
    </div>
    
    
    
    <PageLoader :loading="pageLoader" />
    
    <form class="flex items-end space-x-2 md:space-x-4 px-3 xs:px-4 md:px-7 py-2 border-t bdr" @submit.prevent="sendMsg">
      <textarea v-model="message" ref="textarea" class="chat-text grow bg-flat rounded-3xl resize-none px-3 max-h-32 text-sm text-slate-800 dark:text-slate-100" rows="1" />
      <Button :loading="loading" class="shrink-0 py-5 rounded-full">
        <PhPaperPlaneTilt v-if="!loading" class="text-7xl" />
      </Button>
    </form>
    
    <MsgPaginator v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages" />
    
    
  </div>
</template>

<style>
.chat-container .chatbox {
  @apply flex justify-between items-end mb-1
}
.chat-container .chatbox p {
  @apply max-w-[80%] md:max-w-[70%] inline-block p-3 rounded-lg shadow-sm text-slate-800 dark:text-slate-100 text-[0.8125rem] xs:text-sm
}

.chat-container button {
  @apply text-slate-500 dark:text-slate-300
}

.chat-container .usr p {
  @apply bg-sky-200 dark:bg-sky-700
}

.chat-container .msgr p {
  @apply bg-white dark:bg-slate-950
}

.chatbox.usr + .chatbox.msgr {
  @apply mt-4
}
.chatbox.msgr + .chatbox.usr {
  @apply mt-4
}

.chat-text {
  -ms-overflow-style: none;
  scrollbar-width: none;
  line-height: 24px;
}

.chat-text::-webkit-scrollbar {
  display: none;
}
</style>