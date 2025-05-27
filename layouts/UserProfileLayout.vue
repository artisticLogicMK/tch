<script setup>
const user = ref(null)

provide("user", user)

import ForumLayout from '@/layouts/ForumLayout.vue'
import UserProfileTab from '@/components/user/UserProfileTab.vue'
import UserProfileMenu from '@/components/user/UserProfileMenu.vue'

const isMd = useMediaQuery('(min-width: 768px)')
const responsive = ref(false)

if (process.client) responsive.value = true
</script>

<template>
  <ForumLayout>
    
    <div id="topper"></div>
    
    <div class="md:flex w-full h-full">
    
      <UserProfileTab :user="user" class="hidden md:block" />
      
      <div class="grow">
        <div v-if="responsive && !isMd" class="p-3 pb-0 mb-1">
          <UserProfileMenu>
            <UserProfileTab :user="user" />
          </UserProfileMenu>
        </div>
        
        <slot />
      </div>
    
    </div>
    
    <div id="bottomer"></div>

  </ForumLayout>
</template>