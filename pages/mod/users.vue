<script setup>
definePageMeta({
  layout: "mod-layout",
  middleware: ["auth", "is-valid-user", "is-admin"]
})

useHead({
  title: "Users - Dashboard",
})

useSeoMeta({
  robots: 'noindex, nofollow'
})

import { usePagesStore } from '@/store/pages'

const route = useRoute()
const router = useRouter()

const { $auth } = useNuxtApp()

const pagesStore = usePagesStore()

const users = ref(null)

const pageLoader = ref(false)
const currentPage = ref(route.query.page ? parseInt(route.query.page) : 1)
const totalPages = ref(0)

const pageKey = `${currentPage.value}`

const filters = ref(pagesStore.usersPagesData[pageKey] ? pagesStore.usersPagesData[pageKey].filters : {
  search: '',
  orderBy: 'joined',
  sort: 'desc',
  startsWith: '',
  showOnly: '',
  country: ''
})
const filterLoading = ref(false)
const filtered = ref(pagesStore.usersPagesData[pageKey] ? pagesStore.usersPagesData[pageKey].filtered : false)


const fetchUsers = async (page = 1, filts) => {
  const cacheKey = `${page || 1}`

  // Use cached forum page if exists
  if (pagesStore.usersPagesData[cacheKey] && !filterLoading.value) {
    users.value = pagesStore.usersPagesData[cacheKey].users
    totalPages.value = pagesStore.usersPagesData[cacheKey].totalPages
    currentPage.value = pagesStore.usersPagesData[cacheKey].currentPage
    filters.value = pagesStore.usersPagesData[cacheKey].filters
    filtered.value = pagesStore.usersPagesData[cacheKey].filtered
    return
  }
  
  try {
    const { data, error } = await useAsyncData('users', () =>
      $fetch(`/api/mod/users?page=${page}`, {
        method: "POST",
        body: { filters: filts },
        headers: {
          Authorization: `Bearer ${$auth.token}`
        },
      }))

    if (!data.value.users) {
      throw createError({ statusCode: 500, statusMessage: 'Server Error!' })
    }

    users.value = data.value.users
    totalPages.value = data.value.totalPages
    currentPage.value = data.value.currentPage
    
    pagesStore.setUsersPage(cacheKey, { ...data.value, filters: filts, filtered: filtered.value })
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: 'Server Error!' })
  }
}

await fetchUsers(currentPage.value, filters.value)

watch(() => route.query.page, async (newVal) => {
  if (filterLoading.value) return
  document.getElementById("pageLoader").scrollIntoView()
  pageLoader.value = true

  await fetchUsers(parseInt(newVal), filters.value)
  pageLoader.value = false
})


const submitFilter = async () => {
  if (filterLoading.value) return
  
  filterLoading.value = true
  
  router.push({ query: {} })
  filtered.value = true
  
  await fetchUsers(1, filters.value)

  filterLoading.value = false
}

const clearFilter = async () => {
  if (filterLoading.value) return
  filterLoading.value = true
  
  filters.value = {
    search: '',
    orderBy: 'joined',
    sort: 'desc',
    startsWith: '',
    showOnly: '',
    country: ''
  }
  router.push({ query: {} })
  filtered.value = false
  
  await fetchUsers(1, filters.value)
  
  filterLoading.value = false
}

import ModUsersTable from '~/components/mod/ModUsersTable.vue'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import Button from '~/components/ui/button/Button.vue'
import Paginator from '@/components/Paginator.vue'
import PageLoader from '@/components/PageLoader.vue'
import countries from '@/lib/countries'

const alpbabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'X']
</script>

<template>

    <div class="flex items-center justify-between border-b bdr px-5 py-2">
      <h1 class="modheads">All Users</h1>
      
      <div>
        <Button v-if="filtered" @click="clearFilter" class="rounded-full mr-3" variant="outline" :loading="filterLoading">&times; Clear</Button>
        
        <Popover>
          <PopoverTrigger>
            <Button class="rounded-full">Filter</Button>
          </PopoverTrigger>
    
          <PopoverContent class="max-w-[90%]">
            <form @submit.prevent="submitFilter">
              <p class="label">Username</p>
              <input type="search" v-model="filters.search" class="input mb-4" placeholder="Username..." />
              
              <p class="label">Order By</p>
              <select v-model="filters.orderBy" class="input mb-4">
                <option value="">Order by</option>
                <option value="joined">Joined</option>
                <option value="lastVisit">Last Visit</option>
                <option value="threads">Threads</option>
                <option value="posts">Posts</option>
                <option value="views">Views</option>
                <option value="reports">Reports</option>
                <option value="warnings">Warnings</option>
                <optgroup label="More">
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </optgroup>
              </select>
              
              <p class="label">Country</p>
              <select v-model="filters.country" class="input mb-4">
                <option value="">Select Country</option>
                <option v-for="(name, code) in countries" :key="code" :value="{name:name,code:code}">{{name}}</option>
              </select>
              
              <p class="label">Starts With</p>
              <select v-model="filters.startsWith" class="input mb-4">
                <option value="">By Alphabet</option>
                <option v-for="n in alpbabets" :key="n" :value="n">{{n}}</option>
              </select>
              
              <p class="label">Show Only</p>
              <select v-model="filters.showOnly" class="input mb-4">
                <option value="">Show Only</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>
              
              <p class="label">Order</p>
              <select v-model="filters.sort" class="input mb-4">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
              
              <Button class="w-full" :loading="filterLoading">Search</Button>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </div>
    
    <PageLoader :loading="pageLoader" />
    
    <div class="w-full max-w-full overflow-x-auto">
      
      <ModUsersTable :users="users" />
      
    </div>
    
    <div v-if="users && !users.length" class="no-item">
      <h1>No users here...</h1>
    </div>
    
    <Paginator v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages" />

</template>