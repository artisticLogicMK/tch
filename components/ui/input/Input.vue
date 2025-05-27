<script setup>
import { cn } from '@/lib/utils';
import { useVModel } from '@vueuse/core';

const props = defineProps({
  defaultValue: { type: [String, Number], required: false },
  modelValue: { type: [String, Number], required: false },
  class: { type: null, required: false },
});

const emits = defineEmits(['update:modelValue']);

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <input
    v-model="modelValue"
    :class="
      cn(
        'flex h-9 w-full rounded-md border bdr bg-transparent px-3 py-2 text-xs xs:text-sm text-600 file:border-0 file:bg-transparent file:text-600 file:text-bsm xs:file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 dark:focus-visible:ring-sky-400/50 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400/70',
        props.class,
      )
    "
  />
</template>
