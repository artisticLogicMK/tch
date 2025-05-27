<script setup>
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <tr
    :class="
      cn(
        'border-b bdr text-bsm xs:text-sm transition-colors even:bg-slate-100 dark:even:bg-slate-900/40 text-slate-700 dark:text-slate-200 data-[state=selected]:bg-slate-100 dark:data-[state=selected]:bg-slate-800',
        props.class,
      )
    "
  >
    <slot />
  </tr>
</template>
