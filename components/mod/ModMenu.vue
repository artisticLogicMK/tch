<script setup>
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet'
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
      <Button variant="outline">
        <PhList /> Menu
      </Button>
    </SheetTrigger>
    <SheetContent side="left" class="w-fit p-8 px-6 bdr">

      <slot />

    </SheetContent>
  </Sheet>
</template>