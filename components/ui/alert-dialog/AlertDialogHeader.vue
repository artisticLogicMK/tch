<script setup>
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <div
    :class="cn('flex flex-col gap-y-2 text-center sm:text-left text-slate-700 dark:text-slate-300', props.class)"
  >
    <slot />
  </div>
</template>
