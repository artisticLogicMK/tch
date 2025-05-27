<script setup>
import AnnouncementAudio from '@/components/frm/AnnouncementAudio.vue'
import { PhMegaphone, PhSpeakerHigh } from '@phosphor-icons/vue'

defineProps(['data'])
</script>


<template>
  <div class="flex items-center bg-gradient-to-br from-sky-600 to-sky-500 text-white dark:text-slate-950 text-bsm xs:text-sm px-3 xs:px-4 py-2.5">
    <PhMegaphone v-if="false" weight="fill" class="shrink-0 text-lg mr-2 xs:mr-4" />
    
    <AnnouncementAudio v-if="!data.hideAudio" :audio="data.audio" />
    
    <div>
      <p class="text-xs font-semibold mb-1">Forum Announcement</p>
      <p class="whitespace-pre-line">{{ data.content }}</p>
    </div>
  </div>
</template>