<script setup>
const model = defineModel()
defineProps(['placeholder', 'type', 'required'])
</script>

<template>
  <div class="biginput flex items-center justify-start border dark:border-slate-800 rounded-md focus-within:border-sky-400 dark:focus-within:border-sky-400/50 space-x-2 px-2.5 py-2">
    <slot name="icon1" />

    <div class="grow">
      <input v-model="model" :type="type" class="w-full border-none text-sm bg-transparent text-slate-600 dark:text-slate-300 py-0 " :placeholder="placeholder" :required="required" />
    </div>

    <slot name="icon2" />
  </div>
</template>

<style>
.biginput svg {
  @apply text-lg text-slate-500/70 dark:text-slate-300
}
</style>