<script setup>
definePageMeta({
  layout: "user-profile-layout",
  middleware: ["auth", "is-valid-user", "is-user"]
})

useSeoMeta({
  robots: 'noindex, nofollow'
})

import { usePagesStore } from '@/store/pages'

const route = useRoute()
const username = route.params.username

const { $auth } = useNuxtApp()
const pagesStore = usePagesStore()

const posts = ref(null)
const user = ref(null)

const pageLoader = ref(false)
const currentPage = ref(route.query.page ? parseInt(route.query.page) : 1)
const totalPages = ref(0)

const fetchPosts = async (page = 1) => {
  if (pagesStore.bkPostPagesData[page]) {
    posts.value = pagesStore.bkPostPagesData[page].posts
    user.value = pagesStore.bkPostPagesData[page].user
    totalPages.value = pagesStore.bkPostPagesData[page].totalPages
    currentPage.value = pagesStore.bkPostPagesData[page].currentPage
    return
  }

  try {
    const { data } = await useAsyncData(`userBksPosts_${page}`, () =>
      $fetch(`/api/profile/bk-posts?user=${username}&page=${page}`, {
        method: "POST",
        body: { userId: $auth.isAuthenticated ? $auth.user.id : null },
      }),
      { defaultCache: 7200 }
    )

    if (data.value.notFound) {
      throw createError({ statusCode: 404, statusMessage: 'Page not found!' })
    }

    posts.value = data.value.posts
    user.value = data.value.user
    totalPages.value = data.value.totalPages
    currentPage.value = data.value.currentPage

    pagesStore.setBkPostPage(page, data.value)
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: 'Server Error!' })
  }
}

await fetchPosts(currentPage.value)

const userProfile = inject('user')
userProfile.value = user.value

watch(() => route.query.page, async (newVal) => {
  document.getElementById("newpage").scrollIntoView()
  pageLoader.value = true

  await fetchPosts(parseInt(newVal))
  pageLoader.value = false
})


useHead(() => ({
  title: `${username} Bookmarks:Posts - DreamsTorchlight Forum`
}))

import PostCard from '@/components/frm/PostCard.vue'
import Button from '@/components/ui/button/Button.vue'
import Paginator from '@/components/Paginator.vue'
import PageLoader from '@/components/PageLoader.vue'
</script>

<template>
  
    <div id="newpage"></div>

    <div class="border-b bdr px-4 py-2">
      <h1 class="userheads">Bookmarks > Posts</h1>
    </div>
    
    <Paginator v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages" />
    
    <PageLoader :loading="pageLoader" />

    <PostCard v-for="post in posts" :key="post.id" :post="post" :showLocation="true" />
    
    <div v-if="posts && !posts.length" class="h-64 flex items-center justify-center p-4 text-slate-300 dark:text-slate-600 text-2xl font-semibold">
      <h1>No posts here...</h1>
    </div>
    
    <Paginator v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages" />

</template>

<style>
.info-itm {
  @apply text-slate-500
}
.info-itm span {
  @apply font-semibold mr-2
}
</style>