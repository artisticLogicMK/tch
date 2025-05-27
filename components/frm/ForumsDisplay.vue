<script setup>
import CategoryComponent from '~/components/frm/CategoryComponent.vue'
import CategorySkeleton from '~/components/sk/CategorySkeleton.vue'

const { $global } = useNuxtApp()
</script>

<template>
  <template v-if="$global.categories && $global.categories.length" :key="'cat-comps'">
    <CategoryComponent v-for="cat in $global.categories" :key="cat.id" :category="cat" />
  </template>
  
  <CategorySkeleton v-else />
</template>