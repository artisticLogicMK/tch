<script setup>
definePageMeta({
  middleware: "is-valid-user"
})

import { usePagesStore } from '@/store/pages'

const route = useRoute()
const router = useRouter()

const threadSlug = route.params.thread
const { $auth } = useNuxtApp()

const pageLoader = ref(false)
const currentPage = ref(route.query.page ? parseInt(route.query.page) : 1)
const totalPages = ref(0)

const pagesStore = usePagesStore()

const thread = ref(null)

const pageKey = `${threadSlug}-${currentPage.value}`

const filters = ref(pagesStore.threadPagesData[pageKey] ? pagesStore.threadPagesData[pageKey].filters : {
  search: '',
  orderBy: 'created',
  sort: 'asc',
  timeRange: '',
  showOnly: '',
})
const filterLoading = ref(false)
const filtered = ref(pagesStore.threadPagesData[pageKey] ? pagesStore.threadPagesData[pageKey].filtered : false)


const fetchThread = async (page = 1, filts) => {
  const cacheKey = `${threadSlug}-${page || 1}`

  // Use cached thread page if exists
  if (pagesStore.threadPagesData[cacheKey] && !filterLoading.value && !route.query.post) {
    thread.value = pagesStore.threadPagesData[cacheKey].thread
    totalPages.value = pagesStore.threadPagesData[cacheKey].totalPages
    currentPage.value = pagesStore.threadPagesData[cacheKey].currentPage
    filters.value = pagesStore.threadPagesData[cacheKey].filters
    filtered.value = pagesStore.threadPagesData[cacheKey].filtered
    return
  }

  try {
    const { data, error } = await useAsyncData(cacheKey, () =>
      $fetch(`/api/forum/thread-page?slug=${threadSlug}&page=${page}`, {
        method: "POST",
        body: { userId: $auth.isAuthenticated ? $auth.user.id : null, filters: filts, post: route.query.post || null },
      }),
      { defaultCache: 7200 }
    )

    if (!data.value?.thread) throw createError({ statusCode: 500 })

    thread.value = data.value.thread
    totalPages.value = data.value.totalPages
    currentPage.value = data.value.currentPage

    pagesStore.setThreadPage(cacheKey, { ...data.value, filters: filts, filtered: filtered.value })
  } catch (err) {
    throw createError({ statusCode: 500 })
  }
}

await fetchThread(currentPage.value, filters.value)

watch(() => route.query.page, async (newVal) => {
  document.getElementById("newpage").scrollIntoView()
  pageLoader.value = true

  await fetchThread(parseInt(newVal), filters.value)
  pageLoader.value = false
})

watch(() => route.query.post, async (newVal) => {
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

const clearFilter = async () => {
  if (filterLoading.value) return
  filterLoading.value = true
  
  filters.value = {
    search: '',
    orderBy: 'created',
    sort: 'asc',
    timeRange: '',
    showOnly: '',
  }
  router.push({ query: {} })
  
  filtered.value = false
  await fetchThread(1, filters.value)
  
  filterLoading.value = false
}

const cleanThread = { ...thread.value, posts: null, pinnedPost: null, forumAnnouncement: null }

useHead(() => ({
  title: `${thread.value.title} - DreamsTorchlight Forum`,
  meta: [
    {
      name: 'description',
      content: `${thread.value.content_text.slice(0, 200)}`
    },
  ],
}))

import ForumPageLayout from '@/layouts/ForumPageLayout.vue'
import ForumAnnouncement from '@/components/frm/ForumAnnouncement.vue'
import ThreadCard from '@/components/frm/ThreadCard.vue'
import PostCard from '@/components/frm/PostCard.vue'
import ThreadPageUser from '@/components/frm/ThreadPageUser.vue'
import Breadcumb from '@/components/ui/Breadcumb.vue'
import Paginator from '@/components/Paginator.vue'
import Content from '@/components/Content.vue'
import PageLoader from '@/components/PageLoader.vue'
import ThreadPageSearch from '@/components/frm/ThreadPageSearch.vue'
import { PhMagnifyingGlass, PhPlus, PhLock, PhX } from '@phosphor-icons/vue'
import Button from '@/components/ui/button/Button.vue'

const items = [
  { name: 'Home', url: "/" },
  { name: thread.value.forum.category.name, url: `/forum/${thread.value.forum.category.slug}` },
  { name: thread.value.forum.name, url: `/forum/${thread.value.forum.category.slug}/${thread.value.forum.slug}/` },
  { name: thread.value.title, url: `/forum/${thread.value.forum.category.slug}/${thread.value.forum.slug}/${thread.value.slug}` }
]

const create = () => {
  if ($auth.isAuthenticated) {
    const key = `${threadSlug}-${currentPage.value}`
    pagesStore.removeThreadPage(key)
    
    navigateTo(`${items[3].url}/create-post`)
  } else {
    navigateTo('/login')
  }
}

const date = new Date().toISOString()

const [TopBottomTemplate, TopBottom] = createReusableTemplate()
</script>


<template>
  <ForumPageLayout>
    <template #breadcumb>
      <Breadcumb :items="items" />
    </template>

    <template #announcement>
      <ForumAnnouncement v-if="thread.forum.forumAnnouncement.length && !thread.forum.forumAnnouncement[0].hide  && (thread.forum.forumAnnouncement[0].expire && thread.forum.forumAnnouncement[0].expire > date)" :data="thread.forum.forumAnnouncement[0]" />
    </template>
    
    <div class="p-4 pb-0 -mb-1">
      <ThreadPageUser :data="cleanThread" />
    </div>
    
    <ThreadCard :thread="cleanThread" :showSmallTime="false" :showNewLink="`${items[3].url}/?page=${totalPages}`" />
    
    <div class="border-b bdr px-3 xs:px-4 -mt-3">
      <Content :contents="{ html:thread.content_html, imgs:thread.images, docs:thread.docs, title:thread.title.slice(0,30) }" />
    </div>
    
    <div id="newpage"></div>
  
    <TopBottomTemplate>
    <div class="flex items-center justify-between border-b bdr px-3 xs:px-4 py-2">
      <Button v-if="(thread.locked || thread.forum.locked) && ($auth.isAuthenticated && !$auth.user.admin)" class="rounded-full"><PhLock class="text-lg" /> Locked</Button>
      
      <Button v-else @click="create" class="rounded-full">
        <PhPlus weight="bold" /> POST
      </Button>
  
      <div class="flex items-center">
        <Button v-if="filtered || route.query.post" @click="clearFilter" class="rounded-full px-2" variant="outline"><PhX weight="bold" /></Button>
        
        <ThreadPageSearch
          v-model="filters"
          @search="submitFilter"
          :isModerator="$auth.isAuthenticated && (thread.forum.moderators.some(th => th.userId === $auth.user.id) || $auth.user.admin)"
        >
          <Button class="ml-2 rounded-full" :loading="filterLoading">
            <PhMagnifyingGlass weight="bold" /> Filter
          </Button>
        </ThreadPageSearch>
      </div>
    </div>
    </TopBottomTemplate>
    <TopBottom />


    <Paginator v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages" />
    {{thread.ps}}

    <div>
      <PostCard v-if="thread.pinnedPost" :post="thread.pinnedPost" :showPin="true" />
      
      <PageLoader :loading="pageLoader" />
      
      <PostCard v-for="post in thread.posts" :key="post.id" :post="post" />
    </div>

    <div v-if="thread.posts && !thread.posts.length && !thread.pinnedPost" class="h-64 flex items-center justify-center p-4 text-slate-300 dark:text-slate-600 text-2xl font-semibold">
      <h1>No posts here...</h1>
    </div>
    
    <TopBottom v-if="thread.posts.length > 3" />
    
    <Paginator v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages" />

  </ForumPageLayout>
</template>