<script setup>
import { PhSpinnerGap } from '@phosphor-icons/vue'

defineProps(['loading'])
</script>

<template>
  <div id="pageLoader">
    <div v-if="loading" class="flex justify-center py-2 border-b bdr">
      <PhSpinnerGap weight="bold" class="text-3xl text-slate-500 animate-spin" />
    </div>
  </div>
</template>