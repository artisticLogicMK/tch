<script setup>
import Content from '@/components/Content.vue'

const quoteCollapse = ref(false)

defineProps(['quote'])
</script>

<template>
  <div class="bg-slate-100 dark:bg-slate-900 border-l-4 border-sky-500 text-sm p-3 rounded-md my-3 mb-2">
    
    <div class_="overflow-y-hidden" class__="{'max-h-52': !quoteCollapse}">
      <h1 class="text-slate-600 dark:text-slate-300 font-semibold mb-2">
        Quoting post by
        <NuxtLink :to="`/u/${quote.username}`" class="text-sky-600 dark:text-sky-500">@{{quote.username}}</NuxtLink>
      </h1>
      
      <Content :contents="{ html: quote.html, imgs: quote.images, docs: quote.docs }" />
    </div>

    <!--<button v-if="!quoteCollapse" @click="quoteCollapse = true" class="mt-2 text-sm text-sky-500 dark:text-sky-400 underline underline-offset-2">See more</button>-->
    
  </div>
</template>