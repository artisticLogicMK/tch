<script setup>
import { PhMinus, PhPlus, PhLink } from '@phosphor-icons/vue'
import ForumComponent from '~/components/frm/ForumComponent.vue'

const props = defineProps(['category'])
const show = ref(true)
</script>

<template>
  <div v-if="props.category.forums && props.category.forums.length">

    <div class="border-b bdr p-3 xsm:p-4">
      <NuxtLink :to="`/forum/${props.category.slug}`" class="forums-list-head w-fit text-500 dark:text-slate-300 text-lg xsm:text-xl mb-2">
        <PhLink weight="duotone" />
        {{ props.category.name }}
      </NuxtLink>
      <p v-if="props.category.description !== props.category.name" class="text-bsm xsm:text-sm text-600 mb-3">{{ props.category.description }}</p>
      
      <div class="relative border bdr rounded-2xl mt-7 mb-3">
        <button @click="show = !show" class="custom-btn absolute left-0 top-0 bg-flat border bdr hover:bg-surface text-bsm xsm:text-sm text-400 -translate-y-1/2 ml-8">
          <PhMinus v-if="show" class="mr-2" />
          <PhPlus v-else class="mr-2" />
          {{ show ? 'Hide' : 'Show' }} Forums
        </button>
        
        
        <div v-if="show" class="mt-2">
          
          <ForumComponent
            v-for="forum in props.category.forums"
            :key="forum.id"
            :forum="forum"
            :category="props.category"
          />
          
        </div>
      </div>
    </div>
    
    
  </div>
</template>