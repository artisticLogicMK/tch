<script setup>
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <ol
    :class="
      cn(
        'flex flex-wrapk items-center gap-1.5 break-words text-xs text-slate-500 sm:gap-1.5 dark:text-slate-400 whitespace-nowrap',
        props.class,
      )
    "
  >
    <slot />
  </ol>
</template>
