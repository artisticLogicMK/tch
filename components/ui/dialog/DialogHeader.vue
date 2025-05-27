<script setup>
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <div
    :class="cn('flex flex-col gap-y-1.5 text-slate-700 dark:text-slate-300 text-center sm:text-left', props.class)"
  >
    <slot />
  </div>
</template>
