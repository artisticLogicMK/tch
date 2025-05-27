<script setup>
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PhList } from '@phosphor-icons/vue'

const isPopoverOpen = ref(false)

const closePopover = () => {
  isPopoverOpen.value = false
}
</script>

<template>
  <Popover :open="isPopoverOpen" @update:open="isPopoverOpen = $event">
    
    <PopoverTrigger @click="isPopoverOpen = !isPopoverOpen">
       <PhList class="text-slate-600 dark:text-slate-200 text-3xl" />
    </PopoverTrigger>


    <PopoverContent class="p-3">
      <slot />
    </PopoverContent>
    
  </Popover>
</template>

<style>

</style>