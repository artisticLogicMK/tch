<script setup>
const route = useRoute()
const catId = route.params.category

const category = useState(`categoryPage-${catId}`, () => null)

if (!category.value) {
  const { data: cat } = await useAsyncData(`cat-${catId}`, () =>
    $fetch(`/api/forum/category?catId=${catId}`),
    { defaultCache: 7200 }
  )
  
  category.value = cat.value.category
}

useHead(() => ({
  title: `${category.value.name} - DreamsTorchlight Forum`,
  meta: [
    {
      name: 'description',
      content: `${category.value.description}`
    },
  ],
}))

import CategoryComponent from '@/components/frm/CategoryComponent.vue'
import Breadcumb from '@/components/ui/Breadcumb.vue'

const items = [
  { name: 'Home', url: "/" },
  { name: category.value.name, url: `/forum/${category.value.slug}` }
]

definePageMeta({
  layout: "forum-layout",
  middleware: "is-valid-user"
})
</script>


<template>

    <Breadcumb :items="items" />

    <CategoryComponent :category="category" />
    
</template>