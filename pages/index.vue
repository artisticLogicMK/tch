<script setup>
definePageMeta({
  layout: "forum-layout",
  middleware: "is-valid-user"
})

useHead({
  title: "Home - DreamsTorchlight Forum",
})

import ForumsDisplay from '~/components/frm/ForumsDisplay.vue'
import FeedsDisplay from '~/components/frm/FeedsDisplay.vue'
import GeneralAnnounce from '~/components/GeneralAnnounce.vue'
import IndexTab from '~/components/frm/IndexTab.vue'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'

const { $global } = useNuxtApp()
</script>


<template>
  
  <GeneralAnnounce />
  
  <IndexTab />

  <ForumsDisplay v-if="$global.categories && $global.categories.length" />
  
</template>