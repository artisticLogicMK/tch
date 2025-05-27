<template>
  <div class="fixed w-full h-full bg-white flex flex-col justify-center items-center text-slate-500 dark:text-slate-300 p-5">
    <img src="/assets/error.webp" class="w-52 xs:w-64 sm:w-72 mb-10" />
    <h1 class="text-6xl sm:text-7xl font-round font-bold mb-2">{{ error.statusCode }}</h1>
    <p class="text-lg sm:text-xl font-round mb-10">{{ error.message }}</p>
    <NuxtLink to="/" class="border bdr text-sm px-3 py-2 rounded-md">Go back home</NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  error: Object
})
</script>