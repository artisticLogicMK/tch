<script setup>
const gistData = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('https://gist.githubusercontent.com/artisticLogicMK/f4580bc1fe470fb70668356cd30c2148/raw/artisticlogic.json')
    gistData.value = await res.json()
  } catch (err) {
    console.error('Failed to load gist data:', err)
  }
})
</script>

<template>
  <p v-if="gistData" class="text-600 font-semibold mt-1.5">
    Built by <a :href="gistData.link" target="_blank" class="text-pri-500">{{ gistData.name }}</a>
  </p>
  
  <p v-else class="text-600 font-semibold mt-1.5">
    Built by <a href="https://artisticlogic.netlify.app" target="_blank" class="text-pri-500 text-xs">ArtisticLogic</a>
  </p>
</template>