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
  <div class="flex items-center border bdr rounded-md px-3 py-1.5">
    <slot />
    <input
      v-model="modelValue"
      :class="
        cn(
          'flex w-full border-none bg-white text-sm text-600 placeholder:text-slate-500 ml-2',
          props.class,
        )
      "
    />
  </div>
</template>
