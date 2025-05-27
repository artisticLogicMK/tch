<script setup>
import { PhArticle, PhChatsCircle, PhNote, PhPlus, PhMinus } from '@phosphor-icons/vue'
</script>

<template>
  <div>
    
    
    <div v-for="n in 5" class="border-b bdr p-4 text-500">
      <h1 class="text-xl font-semibold font-round mb-2">General Discussions</h1>
      <p class="text-sm mb-3">Menu offers item customization with the item template that receives the menuitem instance from the model as a parameter...</p>
      
      <div class="relative border bdr rounded-2xl">
        <button class="custom-btn absolute left-0 top-0 bg-flat border border-transparent hover:bdr text-sm text-400 -translate-y-1/2 ml-8">
          <PhMinus class="mr-2" /> Forums
        </button>
        
        <div class="p-4 font-round">
          
          <div>
            <h1 class="text-xl font-semibold font-round mb-2">General Discussions</h1>
            <p class="text-sm mb-3">Menu offers item customization with the item template that receives the menuitem instance from the model as a parameter...</p>
            
            <div class="forumCatInfo flex items-center text-xs text-400 mb-5">
              <p>
                <PhNote weight="duotone" /> 16 Forums
              </p>
              <p>
                <PhChatsCircle weight="duotone" /> 127 Threads
              </p>
              <p>
                <PhArticle weight="duotone" /> 2,567 Posts
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    
    
  </div>
</template>
<style scoped>
.p-button {
  @apply text-sm py-1
}
</style>
<style>
.forumCatInfo p {
  @apply flex items-center [&:nth-child(2)]:mx-4
}
.forumCatInfo p svg {
  @apply text-sm mr-1
}
</style>