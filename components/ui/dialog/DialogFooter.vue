<script setup>
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col-reverseh sm:flex-rowh justify-end gap-x-2 text-slate-700 dark:text-slate-300',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
