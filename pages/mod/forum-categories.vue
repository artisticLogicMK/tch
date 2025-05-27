<script setup>
definePageMeta({
  layout: "mod-layout",
  middleware: ["auth", "is-valid-user", "is-admin"]
})

useHead({
  title: "Forum Categories - Dashboard",
})

useSeoMeta({
  robots: 'noindex, nofollow'
})

import { useToast } from '@/components/ui/toast/use-toast'
import ModCategoryCard from '~/components/mod/ModCategoryCard.vue'
import ModCategoryEdit from '~/components/mod/ModCategoryEdit.vue'
import Button from '~/components/ui/button/Button.vue'
import swapPositions from '~/lib/swapPositions'

const categories = useState('categoriesList', () => '')
const moving = ref(false)

const { $auth } = useNuxtApp()
const { toast } = useToast()

const categoriesComp = computed(() => {
  if (categories.value) {
    return sortCat(categories.value)
  }
})


const moveCategory = async (cat) => {
  moving.value = cat.id
  
  // This block gets the ID of the cat to replace
  const catIndex = categories.value.findIndex(c => c.id === cat.id) 
          
   // Determine the index of the cat to replace
  const catToSwap = cat.direction === 'up' ? catIndex - 1 : catIndex + 1
 
  // Check if there is no cat next
  if (categories.value[catToSwap] === undefined) {
    moving.value = false
    return 
  }
 
  // the id
  const catToSwapId = categories.value[catToSwap].id
  
  // Then swap position and return changed data
  const { list, positions } = swapPositions(categories.value, cat.id, catToSwapId)
  
  const { data } = await useFetch('/api/mod/move-category', {
    method: 'POST',
    body: { positions },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
    server: false
  })

  if (data.value.success) {
     categories.value = list
     moving.value = false
  } else {
    moving.value = false
    toast({ title: 'Faild to move category.', variant: "destructive" })
  }
}


const sortCat = (cats) => {
  return cats.sort((a,b) => a.position - b.position)
}


const updateCategory = (catData) => {
  const index = categories.value.findIndex(cat => cat.id === catData.id)

  categories.value[index] = catData
}

const addCategory = (catData) => {
  categories.value.push(catData)
}

const removeCategory = (catId) => {
  const index = categories.value.findIndex(cat => cat.id === catId)
  categories.value.splice(index, 1)
}

provide('categoryActions', {
  updateCategory, addCategory, removeCategory
})

// Generate next positionof new added categories
const nextCatPos = computed(() => {
  if (categories.value) {
    return categories.value.length ? categories.value[categories.value.length - 1].position + 1 : 1
  } else {
    return 1
  }
})
provide('nextPosition', nextCatPos)

const catFetch = async () => {
  const { data, error } = await useFetch('/api/mod/categories', {
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
      title: `Failed to fetch categories. ${data.value.message}`,
      variant: 'destructive'
    })
  }
}

onMounted(async () => {
  if (process.client) {
    await nextTick()
    catFetch()
  }
})
</script>


<template>
  <ModLayout>
    <template v-if="categories">
      <div class="flex items-center justify-between border-b bdr px-5 py-2">
        <h1 class="modheads">Categories</h1>
  
        <ModCategoryEdit>
          <Button class="rounded-full">Add</Button>
        </ModCategoryEdit>
      </div>
      
  
      <div>
        
        <ModCategoryCard v-for="category in categoriesComp" :key="category.id" :category="category" :moving="moving" @moveCategory="moveCategory" />
        
      </div>
    </template>
    
    <ListSkeleton v-else />
  </ModLayout>
</template>