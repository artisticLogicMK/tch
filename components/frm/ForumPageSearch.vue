<script setup>
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from '@/components/ui/dialog'
import Button from '@/components/ui/button/Button.vue'
import { Input } from '@/components/ui/input'

const filters = defineModel()
defineProps(['isModerator'])
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    
    <DialogContent :trapFocus="false">

      <DialogHeader>
        <DialogTitle class="capitalize">
          Forum Filter
        </DialogTitle>
        <DialogDescription>
          Filter threads on this forum.
        </DialogDescription>
      </DialogHeader>
      

      <form @submit.prevent="$emit('search')" class="sch-form">
        <div class="mb-3">
          <input v-model="filters.search" type="text" class="input" placeholder="Type keywords..." />
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

          <div class="itm">
            <div class="label">Order By</div>
            <select v-model="filters.orderBy" class="input">
              <option value="recent">Time Updated</option>
              <option value="created">Time Created</option>
              <option value="trending">Popular</option>
              <option value="views">Views</option>
              <option value="posts">Posts</option>
              <option value="reactions">Reactions</option>
            </select>
          </div>


          <div class="itm">
            <div class="label">Time Range</div>
            <input type="date" v-model="filters.timeRange" class="input dateplace w-full" />
          </div>
          
          <div v-if="isModerator" class="itm">
            <div class="label">Moderator</div>
            <select v-model="filters.showOnly" class="input">
              <option value="">Show Only</option>
              <option value="hidden">Hidden Items</option>
              <option value="locked">Locked Items</option>
            </select>
          </div>
          
          <div class="itm">
            <div class="label">Order</div>
            <select v-model="filters.sort" class="input">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
          
        </div>
        
        
        <DialogFooter>
          <DialogClose>
            <Button class="mr-3">Search</Button>
          
            <Button @click.prevent variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>

    </DialogContent>
  </Dialog>
</template>

<style>
.sch-form .label {
  @apply text-[0.8125rem] xs:text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1
}
</style>