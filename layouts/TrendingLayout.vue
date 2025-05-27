<script setup>
definePageMeta({
  middleware: "is-valid-user"
})

import { usePagesStore } from '@/store/pages'

const { view } = defineProps(['view'])
const route = useRoute()
const { $auth } = useNuxtApp()

const threads = useState('trends', () => null)

const pageLoader = ref(false)
const currentPage = ref(route.query.page ? parseInt(route.query.page) : 1)
const totalPages = ref(0)

const pagesStore = usePagesStore()

const fetchThreads = async (page = 1) => {
  const cacheKey = `${view}_${page || 1}`

  // Check cache first
  if (pagesStore.trendPagesData[cacheKey]) {
    threads.value = pagesStore.trendPagesData[cacheKey].threads
    totalPages.value = pagesStore.trendPagesData[cacheKey].totalPages
    currentPage.value = pagesStore.trendPagesData[cacheKey].currentPage
    return
  }

  try {
    const { data } = await useAsyncData(cacheKey, () =>
      $fetch(`/api/trends?view=${view}&page=${page}`, {
        method: "POST",
        body: { userId: $auth.isAuthenticated ? $auth.user.id : null },
      }),
      { defaultCache: 7200 }
    )

    if (!data.value.threads) {
      throw createError({ statusCode: 500, statusMessage: 'Server Error!' })
    }

    threads.value = data.value.threads
    totalPages.value = data.value.totalPages
    currentPage.value = data.value.currentPage

    // Cache the result
    pagesStore.setTrendPage(cacheKey, data.value)
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: 'Server Error!' })
  }
}

await fetchThreads(currentPage.value)

watch(() => route.query.page, async (newVal) => {
  document.getElementById("newpage").scrollIntoView({ block: "start" })
  pageLoader.value = true

  await fetchThreads(parseInt(newVal))
  pageLoader.value = false
})


useHead(() => ({
  title: `${view === 'trend' ? 'Trending' : 'Recent'} - DreamsTorchlight Forum`
}))

import ForumLayout from '@/layouts/ForumLayout.vue'
import GeneralAnnounce from '~/components/GeneralAnnounce.vue'
import IndexTab from '~/components/frm/IndexTab.vue'
import ThreadCard from '@/components/frm/ThreadCard.vue'
import Paginator from '@/components/Paginator.vue'
import PageLoader from '@/components/PageLoader.vue'
</script>


<template>
  <ForumLayout>
    
    <GeneralAnnounce />

    <IndexTab />
    
    <div id="newpage"></div>
    
    <div>
      <Paginator v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages" />
      
      <PageLoader :loading="pageLoader" />
      
      <ThreadCard v-for="thread in threads" :key="thread.id" :thread="thread" :showSmallTime="true" :showLocation="true" class="border-b bdr" />
    </div>

    <div v-if="threads && !threads.length" class="h-64 flex items-center justify-center p-4 text-slate-300 dark:text-slate-600 text-2xl font-semibold">
      <h1>No threads here...</h1>
    </div>
    
    <Paginator v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages" />
    
  </ForumLayout>
</template>