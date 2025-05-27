<script setup>
import { cn } from '@/lib/utils';
import { Primitive } from 'radix-vue';
import { buttonVariants } from '.';
import { PhSpinnerGap } from '@phosphor-icons/vue'

const props = defineProps({
  variant: { type: null, required: false },
  size: { type: null, required: false },
  class: { type: null, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false, default: 'button' },
  loading: { type: Boolean, required: false },
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    :disabled="props.loading"
  >
    <slot />
    <PhSpinnerGap v-if="props.loading" :size="32" weight="bold" class="animate-spin" />
  </Primitive>
</template>
