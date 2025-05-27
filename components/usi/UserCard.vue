<script setup>
import Userpic from '@/components/usi/Userpic.vue'
import Username from '@/components/usi/Username.vue'
import Userlevel from '@/components/usi/Userlevel.vue'

defineProps(['moderator'])
</script>

<template>
  
  <div class="usercard flex items-center" :class="{'moderator':moderator}">
    <Userpic class="mr-3" />
    
    <div>
      <Username class="mb-2" />
      <Userlevel />
    </div>
  </div>
  
</template>