<script setup>
import { PhMagnifyingGlass, PhPlus, PhLock } from '@phosphor-icons/vue'
import Button from '@/components/ui/button/Button.vue'
import ForumSearch from '@/components/frm/ForumSearch.vue'

const props = defineProps(['page', 'createLink', 'locked', 'loading'])

const { $auth } = useNuxtApp()
</script>


<template>
  <div class="flex items-center justify-between border-b bdr px-4 py-2">
    
    <NuxtLink v-if="!props.locked" :to="$auth.isAuthenticated ? props.createLink : '/login'">
      <Button class="rounded-full">
        <PhPlus class="text-lg" weight="bold" />
        {{ props.page === 'forum' ? 'Create' : 'Post' }}
      </Button>
    </NuxtLink>
    
    <Button v-else class="rounded-full"><PhLock class="text-lg" /> Locked</Button>
    

    <div class="flex items-center">
      <ForumSearch :location="props.page === 'forum' ? 'forum' : 'thread'" :id="3">
        <Button class="ml-2 rounded-full">
          <PhMagnifyingGlass class="text-lg" weight="bold" /> Search
        </Button>
      </ForumSearch>
    </div>
    
  </div>
</template>