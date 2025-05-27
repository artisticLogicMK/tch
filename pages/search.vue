<script setup>
definePageMeta({
  middleware: "is-valid-user"
})

useHead(() => ({
  title: 'Search - DreamsTorchlight Forum'
}))

useSeoMeta({
  robots: 'noindex, nofollow'
})

import { usePagesStore } from '@/store/pages'

const route = useRoute()
const router = useRouter()

const { $auth } = useNuxtApp()

const pageLoader = ref(false)
const currentPage = ref(route.query.page ? parseInt(route.query.page) : 1)
const totalPages = ref(0)

const pagesStore = usePagesStore()

const threads = ref(null)
const posts = ref(null)

const pageKey = `${currentPage.value}`

const filters = ref(pagesStore.searchPagesData[pageKey] ? pagesStore.searchPagesData[pageKey].filters : {
  search: '',
  orderBy: 'trending',
  sort: 'desc',
  timeRange: '',
  showOnly: '',
  returnType: 'thread'
})
const filterLoading = ref(false)
const filtered = ref(pagesStore.searchPagesData[pageKey] ? pagesStore.searchPagesData[pageKey].filtered : false)


const fetchThread = async (page = 1, filts) => {
  const cacheKey = `${page || 1}`

  // Use cached thread page if exists
  if (pagesStore.searchPagesData[cacheKey] && !filterLoading.value) {
    threads.value = filts.returnType === 'thread' ? pagesStore.searchPagesData[cacheKey].threads : null
    posts.value = filts.returnType === 'post' ?  pagesStore.searchPagesData[cacheKey].posts : null
    totalPages.value = pagesStore.searchPagesData[cacheKey].totalPages
    currentPage.value = pagesStore.searchPagesData[cacheKey].currentPage
    filters.value = pagesStore.searchPagesData[cacheKey].filters
    filtered.value = pagesStore.searchPagesData[cacheKey].filtered
    return
  }
  
  const api = filters.value.returnType === 'thread' ? 'threads-search' : 'posts-search'

  try {
    const { data } = await useAsyncData(cacheKey, () =>
      $fetch(`/api/${api}?page=${page}`, {
        method: "POST",
        body: { userId: $auth.isAuthenticated ? $auth.user.id : null, filters: filts },
      }),
      { defaultCache: 7200 }
    )

    if (!data.value.threads && !data.value.posts) throw createError({ statusCode: 500 })

    threads.value = filts.returnType === 'thread' ? data.value.threads : null
    posts.value = filts.returnType === 'post' ? data.value.posts : null
    totalPages.value = data.value.totalPages
    currentPage.value = data.value.currentPage

    pagesStore.setSearchPage(cacheKey, { ...data.value, filters: filts, filtered: filtered.value })
  } catch (err) {
    throw createError({ statusCode: 500 })
  }
}

//await fetchThread(currentPage.value, filters.value)

watch(() => route.query.page, async (newVal) => {
  document.getElementById("newpage").scrollIntoView({ block: "start" })
  pageLoader.value = true

  await fetchThread(parseInt(newVal), filters.value)
  pageLoader.value = false
})


const submitFilter = async () => {
  if (filterLoading.value) return
  
  filterLoading.value = true
  
  router.push({ query: {} })
  filtered.value = true
  
  await fetchThread(1, filters.value)

  filterLoading.value = false
}

import ForumLayout from '@/layouts/ForumLayout.vue'
import ThreadCard from '@/components/frm/ThreadCard.vue'
import PostCard from '@/components/frm/PostCard.vue'
import Paginator from '@/components/Paginator.vue'
import PageLoader from '@/components/PageLoader.vue'
import ForumSearch from '@/components/frm/ForumSearch.vue'
import SearchInput from '@/components/SearchInput.vue'
import Button from '@/components/ui/button/Button.vue'
import { PhMagnifyingGlass, PhSpinnerGap } from '@phosphor-icons/vue'

onMounted(() => {
  document.querySelector("#xSearch").click()
})
</script>


<template>
  <ForumLayout>

    <div class="flex justify-center px-3 xs:px-4 py-2 border-b bdr">
   
      <div class="flex items-center justify-between w-full max-w-lg">
        <h1 class="font-round text-500 text-sm xs:text-base font-semibold">Search DreamsTorchlight</h1>
        
        <ForumSearch v-model="filters" @search="submitFilter" :isAdmin="$auth.isAuthenticated && $auth.user.admin">
          <Button id="xSearch" class="rounded-full" :loading="filterLoading">
            <PhMagnifyingGlass weight="bold" /> Search
          </Button>
        </ForumSearch>
      </div>
      
    </div>
    
    <div id="newpage"></div>

    <div>
      <Paginator v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages" />
      
      <PageLoader :loading="pageLoader" />
      
      <template v-if="threads && threads.length">
        <ThreadCard v-for="thread in threads" :key="thread.id" :thread="thread" :showSmallTime="true" :showLocation="true" class="border-b bdr" />
      </template>
      
      <template v-if="posts && posts.length">
        <PostCard v-for="post in posts" :key="post.id" :post="post" :showLocation="true" class="border-b bdr" />
      </template>
    </div>

    <div v-if="(threads && !threads.length) || (posts && !posts.length) || (!threads && !posts)" class="h-64 flex items-center justify-center p-4 text-slate-300 dark:text-slate-600 text-2xl font-semibold">
      <h1>Nothing found...</h1>
    </div>
    
    <Paginator v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages" />
    
  </ForumLayout>
</template>