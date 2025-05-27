<script setup>
definePageMeta({
  middleware: "is-valid-user",
})

import { usePagesStore } from '@/store/pages'

const route = useRoute()
const router = useRouter()

const forumSlug = route.params.forum
const { $auth, $global } = useNuxtApp()

const pageLoader = ref(false)
const currentPage = ref(route.query.page ? parseInt(route.query.page) : 1)
const totalPages = ref(0)

const pagesStore = usePagesStore()

const forum = ref(null)

const pageKey = `${forumSlug}-${currentPage.value}`

const filters = ref(pagesStore.forumPagesData[pageKey] ? pagesStore.forumPagesData[pageKey].filters : {
  search: '',
  orderBy: 'recent',
  sort: 'desc',
  timeRange: '',
  showOnly: '',
})
const filterLoading = ref(false)
const filtered = ref(pagesStore.forumPagesData[pageKey] ? pagesStore.forumPagesData[pageKey].filtered : false)


const fetchForum = async (page = 1, filts) => {
  const cacheKey = `${forumSlug}-${page || 1}`

  // Use cached forum page if exists
  if (pagesStore.forumPagesData[cacheKey] && !filterLoading.value) {
    forum.value = pagesStore.forumPagesData[cacheKey].forum
    totalPages.value = pagesStore.forumPagesData[cacheKey].totalPages
    currentPage.value = pagesStore.forumPagesData[cacheKey].currentPage
    filters.value = pagesStore.forumPagesData[cacheKey].filters
    filtered.value = pagesStore.forumPagesData[cacheKey].filtered
    return
  }

  try {
    const { data } = await useAsyncData(cacheKey, () =>
      $fetch(`/api/forum/forum?slug=${forumSlug}&page=${page}`, {
        method: "POST",
        body: { userId: $auth.isAuthenticated ? $auth.user.id : null, filters: filts },
      }),
      { defaultCache: 7200 }
    )

    if (!data.value?.forum) throw createError({ statusCode: 500 })

    forum.value = data.value.forum
    totalPages.value = data.value.totalPages
    currentPage.value = data.value.currentPage

    pagesStore.setForumPage(cacheKey, { ...data.value, filters: filts, filtered: filtered.value })
  } catch (err) {
    throw createError({ statusCode: 500 })
  }
}

await fetchForum(currentPage.value, filters.value)

watch(() => route.query.page, async (newVal) => {
  document.getElementById("newpage").scrollIntoView()
  pageLoader.value = true

  await fetchForum(parseInt(newVal), filters.value)
  pageLoader.value = false
})


const submitFilter = async () => {
  if (filterLoading.value) return
  
  filterLoading.value = true
  
  router.push({ query: {} })
  filtered.value = true
  
  await fetchForum(1, filters.value)

  filterLoading.value = false
}

const clearFilter = async () => {
  if (filterLoading.value) return
  filterLoading.value = true
  
  filters.value = {
    search: '',
    orderBy: 'recent',
    sort: 'desc',
    timeRange: '',
    showOnly: '',
  }
  router.push({ query: {} })
  
  filtered.value = false
  await fetchForum(1, filters.value)
  
  filterLoading.value = false
}


const cleanForum = { ...forum.value, threads: forum.value.lasts.threads, posts: forum.value.lasts.posts, forumAnnouncement: null, user: null, lasts: null }

useHead(() => ({
  title: `${forum.value.name} - DreamsTorchlight Forum`,
  meta: [
    {
      name: 'description',
      content: `${forum.value.description}`
    },
  ],
}))

import ForumPageLayout from '@/layouts/ForumPageLayout.vue'
import ForumAnnouncement from '@/components/frm/ForumAnnouncement.vue'
import ForumComponent from '@/components/frm/ForumComponent.vue'
import ThreadCard from '@/components/frm/ThreadCard.vue'
import Breadcumb from '@/components/ui/Breadcumb.vue'
import Paginator from '@/components/Paginator.vue'
import PageLoader from '@/components/PageLoader.vue'
import ForumPageSearch from '@/components/frm/ForumPageSearch.vue'
import { PhMagnifyingGlass, PhPlus, PhLock, PhX } from '@phosphor-icons/vue'
import Button from '@/components/ui/button/Button.vue'

const items = [
  { name: 'Home', url: "/" },
  { name: forum.value.category.name, url: `/forum/${forum.value.category.slug}` },
  { name: forum.value.name, url: `/forum/${forum.value.category.slug}/${forum.value.slug}` },
]

const create = () => {
  if ($auth.isAuthenticated) {
    const key = `${forumSlug}-${currentPage.value}`
    pagesStore.removeForumPage(key)
    
    navigateTo(`${items[2].url}/create-thread`)
  } else {
    navigateTo('/login')
  }
}

const date = new Date().toISOString()

const [TopBottomTemplate, TopBottom] = createReusableTemplate()
</script>


<template>
 <ForumPageLayout v-if="forum">

    <template #breadcumb>
      <Breadcumb :items="items" />
    </template>

    <template #announcement>
      <ForumAnnouncement v-if="(forum.forumAnnouncement.length && !forum.forumAnnouncement[0].hide) && (forum.forumAnnouncement[0].expire === null || forum.forumAnnouncement[0].expire > date)" :data="forum.forumAnnouncement[0]" />
    </template>
    
    <ForumComponent :forum="cleanForum" />
    
    <div id="newpage"></div>
    
    <TopBottomTemplate>
    <div class="flex items-center justify-between border-b bdr px-3 xs:px-4 py-2">
      <Button v-if="forum.locked && ($auth.isAuthenticated && !$auth.user.admin)" class="rounded-full"><PhLock class="text-lg" /> Locked</Button>
      
      <Button v-else @click="create" class="rounded-full">
        <PhPlus weight="bold" /> Create
      </Button>
  
      <div class="flex items-center">
        <Button v-if="filtered" @click="clearFilter" class="rounded-full px-2" variant="outline"><PhX weight="bold" /></Button>

        <ForumPageSearch
          v-model="filters"
          @search="submitFilter"
          :isModerator="$auth.isAuthenticated && (forum.moderators.some(th => th.userId === $auth.user.id) || $auth.user.admin)"
        >
          <Button class="ml-2 rounded-full" :loading="filterLoading">
            <PhMagnifyingGlass weight="bold" /> Filter
          </Button>
        </ForumPageSearch>
      </div>
    </div>
    </TopBottomTemplate>
    <TopBottom />
    
    <Paginator v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages" />


    <div>
      <ThreadCard v-if="forum.pinnedThread" :thread="forum.pinnedThread" :showSmallTime="true" :showPin="true" />
      
      <PageLoader :loading="pageLoader" />
      
      <ThreadCard v-for="thread in forum.threads" :key="thread.id" :thread="thread" :showSmallTime="true" />
    </div>
    
    <div v-if="forum.threads && !forum.threads.length && !forum.pinnedThread" class="h-64 flex items-center justify-center p-4 text-slate-300 dark:text-slate-600 text-2xl font-semibold">
      <h1>No threads here...</h1>
    </div>
    
    <TopBottom v-if="forum.threads.length > 9" />
    
    <Paginator v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages" />
    
</ForumPageLayout>
</template>