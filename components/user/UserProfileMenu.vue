<script setup>
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger, SheetContent, SheetHeader } from '@/components/ui/sheet'
import { PhList } from '@phosphor-icons/vue'

const route = useRoute()
const isSheetOpen = ref(false)

// Watch for route changes and close the sheet
watch(route, () => {
  isSheetOpen.value = false
})
</script>

<template>
  <Sheet v-model:open="isSheetOpen">
    <SheetTrigger as-child>
      <Button variant="outline" @click="isSheetOpen = true">
        <PhList /> Profile Menu
      </Button>
    </SheetTrigger>
    <SheetContent side="left" class="w-fit p-5 px-10 bdr">
      <SheetHeader class="mb-2">
        <h1 class="text-slate-600 dark:text-slate-500 text-base font-semibold">Profile Menu</h1>
      </SheetHeader>

      <slot />
    </SheetContent>
  </Sheet>
</template>