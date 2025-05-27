<script setup>
definePageMeta({
  layout: "user-profile-layout",
  middleware: ["is-valid-user"]
})

import { usePagesStore } from '@/store/pages'

const route = useRoute()
const username = route.params.username

const { $auth } = useNuxtApp()

const threads = ref(null)
const user = ref(null)

const pageLoader = ref(false)
const currentPage = ref(route.query.page ? parseInt(route.query.page) : 1)
const totalPages = ref(0)

const pagesStore = usePagesStore()

const fetchThreads = async (page = 1) => {
  const cacheKey = `${username}-${page || 1}`

  // Use cached forum page if exists
  if (pagesStore.userthreadPagesData[cacheKey]) {
    threads.value = pagesStore.userthreadPagesData[cacheKey].threads
    user.value = pagesStore.userthreadPagesData[cacheKey].user
    totalPages.value = pagesStore.userthreadPagesData[cacheKey].totalPages
    currentPage.value = pagesStore.userthreadPagesData[cacheKey].currentPage
    return
  }
  
  try {
    const { data } = await useAsyncData('userThreads', () =>
      $fetch(`/api/profile/user-threads?user=${username}&page=${page}`, {
        method: "POST",
        body: { userId: $auth.isAuthenticated ? $auth.user.id : null },
      }),
      { defaultCache: 7200 }
    )

    if (data.value.notFound) {
      throw createError({ statusCode: 404, statusMessage: 'Page not found!' })
    }

    threads.value = data.value.threads
    user.value = data.value.user
    totalPages.value = data.value.totalPages
    currentPage.value = data.value.currentPage
    
    pagesStore.setUserthreadPage(cacheKey, data.value)
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: 'Server Error!' })
  }
}

await fetchThreads(currentPage.value)

const userProfile = inject('user')
userProfile.value = user.value

watch(() => route.query.page, async (newVal) => {
  document.getElementById("newpage").scrollIntoView()
  pageLoader.value = true

  await fetchThreads(parseInt(newVal))
  pageLoader.value = false
})


useHead(() => ({
  title: `${username} Threads - DreamsTorchlight Forum`
}))

import ThreadCard from '@/components/frm/ThreadCard.vue'
import Button from '@/components/ui/button/Button.vue'
import Paginator from '@/components/Paginator.vue'
import PageLoader from '@/components/PageLoader.vue'
</script>

<template>
    
    <div id="newpage"></div>

    <div class="border-b bdr px-4 py-2">
      <h1 class="userheads">My Threads</h1>
    </div>
    
    <Paginator v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages" />
    
    <PageLoader :loading="pageLoader" />

    <ThreadCard v-for="thread in threads" :key="thread.id" :thread="thread" :showSmallTime="true" :showLocation="true" />
    
    <div v-if="threads && !threads.length" class="no-item">
      <h1>No threads here...</h1>
    </div>
    
    <Paginator v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages" />

</template>