<script setup>
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-vue-next';
import { SelectIcon, SelectTrigger, useForwardProps } from 'radix-vue';
import { computed } from 'vue';

const props = defineProps({
  disabled: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
});

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'flex h-9 items-center justify-between rounded-md border bdr bg-transparent px-3 py-1 text-bsm xs:text-sm text-slate-600 dark:text-slate-200 ring-offset-white data-[placeholder]:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate text-start dark:ring-offset-slate-950 dark:data-[placeholder]:text-slate-300 dark:focus:ring-sky-400/50',
        props.class,
      )
    "
  >
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="w-4 h-4 opacity-50 shrink-0" />
    </SelectIcon>
  </SelectTrigger>
</template>
