<script setup>
const props = defineProps(['handler'])
const googleButton = ref(null)
const { $initGoogleSignIn } = useNuxtApp()

onMounted(() => {
  $initGoogleSignIn(googleButton.value, props.handler)
})
</script>

<template>
  <div class="flex justify-center">
    <div ref="googleButton"></div>
  </div>
</template>