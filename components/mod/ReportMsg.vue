<script setup>
defineProps(['msg'])

import Button from '~/components/ui/button/Button.vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    <DialogContent>

      <DialogHeader>
        <DialogTitle class="capitalize">
          Report Message
        </DialogTitle>
      </DialogHeader>
      
      <p class="text-bsm xs:text-sm text-600 whitespace-pre">{{ msg }}</p>
      
      <DialogFooter>
        <DialogClose>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
      </DialogFooter>

    </DialogContent>
  </Dialog>
</template>