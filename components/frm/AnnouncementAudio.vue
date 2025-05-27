<script setup>
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { PhSpeakerHigh } from '@phosphor-icons/vue'

defineProps(['audio'])
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <button class="bg-white/10 rounded-full p-2 mr-2 xs:mr-4">
        <PhSpeakerHigh weight="fill" class="text-lg" />
      </button>
    </DialogTrigger>
    <DialogContent class="max-w-sm">
      <DialogHeader>
        <DialogDescription>
          Listen to announcement audio.
        </DialogDescription>
      </DialogHeader>

      <div class="flex justify-center">
       <audio controls>
          <source :src="`/api${audio}`">
          Your browser does not support the audio element.
        </audio>
      </div>
      
    </DialogContent>
  </Dialog>
</template>