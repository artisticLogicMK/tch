<script setup>
definePageMeta({
  layout: "mod-layout",
  middleware: ["auth", "is-valid-user", "is-admin"]
})

useHead({
  title: "Forums - Dashboard",
})

useSeoMeta({
  robots: 'noindex, nofollow'
})

import { useToast } from '@/components/ui/toast/use-toast'
import ModForumCard from '~/components/mod/ModForumCard.vue'
import ModForumEdit from '~/components/mod/ModForumEdit.vue'
import Button from '~/components/ui/button/Button.vue'
import ListSkeleton from '~/components/sk/ListSkeleton.vue'
import swapPositions from '~/lib/swapPositions'

// ✅ Use useState() to persist data across navigations
const forums = useState('forumsData', () => null)
const categories = useState('categoriesData', () => null)

const categorySel = useState('categorySel', () => '')
const searchforum = useState('searchforum', () => '')

const { $auth } = useNuxtApp()
const { toast } = useToast()

const moving = ref(false)

const forumsComp = computed(() => {
  if (!forums.value) return []

  let filteredForums = forums.value

  // Apply category filter if set
  if (categorySel.value) {
    filteredForums = filteredForums.filter(fr => fr.categoryId === categorySel.value)
  }

  // Apply search filter if set
  if (searchforum.value) {
    const searchTerm = searchforum.value.toLowerCase()
    filteredForums = filteredForums.filter(fr => fr.name.toLowerCase().includes(searchTerm))
  }

  return sortForum(filteredForums)
})


const moveForum = async (forum) => {
  moving.value = forum.id
  // This block gets the ID of the forum to replace
  const forumIndex = forumsComp.value.findIndex(f => f.id === forum.id) 
          
   // Determine the index of the forum to replace
  const forumToSwap = forum.direction === 'up' ? forumIndex - 1 : forumIndex + 1
 
  // Check if there is no forum next
  if (forumsComp.value[forumToSwap] === undefined) {
    moving.value = false
    return 
  }
 
  // the id
  const forumToSwapId = forumsComp.value[forumToSwap].id
  
  // Then swap position and return changed data
  const { list, positions } = swapPositions(forums.value, forum.id, forumToSwapId)
  
  const { data } = await useFetch('/api/mod/move-forum', {
    method: 'POST',
    body: { positions },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
    server: false
  })

  if (data.value.success) {
     forums.value = list
     moving.value = false
  } else {
    moving.value = false
    toast({ title: 'Faild to move category.', variant: "destructive" })
  }
}


const sortForum = (forums) => {
  return forums.sort((a,b) => a.position - b.position)
}


const updateForum = (frmData) => {
  const index = forums.value.findIndex(frm => frm.id === frmData.id)

  forums.value[index] = frmData
}

const addForum = (frmData) => {
  forums.value.push(frmData)
}

const removeForum = (frmId) => {
  const index = forums.value.findIndex(frm => frm.id === frmId)
  forums.value.splice(index, 1)
}

provide('forumActions', {
  updateForum, addForum, removeForum
})

// Generate next position of new added forums
const nextForumPos = computed(() => {
  if (forums.value) {
    return forums.value.length ? forums.value[forums.value.length - 1].position + 1 : 1
  } else {
    return 1
  }
})

provide('nextPosition', nextForumPos)
provide('categories', categories)

const frmFetch = async () => {
  const { data } = await useFetch('/api/mod/forums', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
    server: false
  })

  if (data.value.success) {
    forums.value = data.value.forums
  } else {
    toast({
      title: `Failed to fetch forums. ${data.value.message}`,
      variant: 'destructive'
    })
  }
}

const catsFetch = async () => {
  const { data } = await useFetch('/api/mod/categories', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
    default: () => ({ success: false }),
    server: false
  })
  
  if (data.value.success) {
    categories.value = data.value.categories
  } else {
    toast({
      title: `Failed to fetch categories.`,
      variant: 'destructive'
    })
  }
}

onMounted(async () => {
  if (process.client) {
    await nextTick()
    frmFetch()
    catsFetch()
  }
})
</script>


<template>
  <template v-if="forums && categories">
    <div class="xsm:flex items-center justify-between border-b bdr px-4 xsm:px-5 py-2">
      <h1 class="modheads mb-1 xsm:mb-0">Forums</h1>
      <div class="flex items-center w-full xsm:max-w-xs space-x-3">
        <input type="search" v-model="searchforum" gjinput="search($event.target.value)" id="sch" class="input" placeholder="Name..." />
        <select v-model="categorySel" hdhchange="filterCat($event.target.value)" id="cat" class="input">
          <option value="">Categories (All)</option>
          <option
            v-for="cat in categories"
            :value="cat.id"
            :key="cat.id">
          {{ cat.name }}</option>
        </select>
        
        <ModForumEdit>
          <Button class="rounded-full">Add</Button>
        </ModForumEdit>
      </div>
    </div>
    
    <div>
    
      <ModForumCard v-for="frm in forumsComp" :key="frm.id" :forum="frm" :isSelCategory="categorySel" :moving="moving" @moveForum="moveForum" />
      
    </div>
  </template>
  
  <ListSkeleton v-else />
  
</template>