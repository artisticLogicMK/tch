<script setup>
import ForumLayout from '@/layouts/ForumLayout.vue'
import GeneralAnnounce from '~/components/GeneralAnnounce.vue'

defineProps(['hideAnnounce'])
</script>


<template>
  <ForumLayout>
    <GeneralAnnounce v-if="!hideAnnounce" />
    
    <slot name="breadcumb"></slot>
    
    <slot name="announcement"></slot>
    
    <slot />
   </ForumLayout> 
</template>