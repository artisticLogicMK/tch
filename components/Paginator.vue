<script setup>
import Button from '@/components/ui/button/Button.vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

defineProps(['currentPage', 'totalPages'])

const pageval = ref(null)
const popoverOpen = ref(false)

const target = useTemplateRef('target')
onClickOutside(target, event => popoverOpen.value = false)

const goToPage = (page) => {
  navigateTo(`?page=${page}`)
}

const goToPageVal = (tp) => {
  if ((typeof pageval.value === 'number' && !isNaN(pageval.value)) && Number.isInteger(pageval.value) && pageval.value >= 1 && pageval.value <= tp ) {
    popoverOpen.value = false
    navigateTo(`?page=${pageval.value}`)
  }
}
</script>

<template>
  <div class="flex items-center justify-between px-3 xs:px-4 py-2 border-b bdr">
    
    <div class="text-bsm xs:text-xs text-slate-500 mr-1">Page {{currentPage}} of {{totalPages}}</div>
    
    <div class="flex space-x-1.5 xs:space-x-2">
      <Button variant="outline" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">Prev</Button>
      
      <Button variant="outline" :disabled="currentPage <= 2" @click="goToPage(currentPage - 2)" class="hidden xs:block"><<</Button>
      
      <Button variant="outline" :disabled="currentPage >= totalPages - 2" @click="goToPage(currentPage + 2)" class="hidden xs:block">>></Button>
      
      <Button variant="outline" :disabled="currentPage >= totalPages" @click="goToPage(currentPage + 1)">Next</Button>
      
      <Popover :open="popoverOpen">
        <PopoverTrigger @click="popoverOpen = totalPages < 2 ? false : !popoverOpen">
          <Button variant="outline" :disabled="totalPages < 2">Go to</Button>
        </PopoverTrigger>
      
        <PopoverContent ref="target" class="flex space-x-3">
          <input type="number" v-model="pageval" class="input" style="width:60px;padding:0 5px;height:30px" placeholder="page" />
          <Button variant="outline" @click="goToPageVal(totalPages)">Go</Button>
        </PopoverContent>
      </Popover>
      
    </div>
    
  </div>
</template>