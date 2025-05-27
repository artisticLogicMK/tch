<script setup>
useHead({
  title: "Jacob Followed Members - DreamsTorchlight Forum",
})

import UserCard from '@/components/usi/UserCard.vue'
import Button from '@/components/ui/button/Button.vue'

definePageMeta({
  layout: "user-profile-layout",
  middleware: ["is-valid-user"]
})
</script>

<template>
  
    <div class="p-3 xsm:p-4">
      
      <h1 class="userheads mb-4">Followed Members</h1>
      
      <div class="grid grid-cols-1 xsm2:grid-cols-2 gap-4">
   
         <div v-for="n in 15" :key="n" class="border bdr p-3 rounded-lg">
           <UserCard :moderator="false" />
           <Button class="h-6 mt-2">Follow</Button>
         </div>
        
      </div>
      
      
    </div>

</template>