<script setup>
import { ref, onMounted } from 'vue'

// Reactive variable to track dark mode state
const isDark = ref(false)

// Ensure emoji-picker-element is loaded only in the browser
onMounted(async () => {
  if (process.client) {
    await import('emoji-picker-element') // Dynamically import

    // Attach an event listener to the emoji picker
    document.querySelector('emoji-picker')?.addEventListener('emoji-click', event => {
      emit('emojiSelected', event.detail.unicode)
    })
    
    // Check if the 'dark' class is applied to the <html> element
    if (document.documentElement.classList.contains('dark')) {
      isDark.value = true
    }
  }
})

// Define an event emitter for when an emoji is selected
const emit = defineEmits(['emojiSelected'])
</script>

<template>
  <!-- Use client-only to prevent SSR errors -->
  <client-only>
    <emoji-picker class="w-full" :class="{ 'dark': isDark }"></emoji-picker>
  </client-only>
</template>

<style>
emoji-picker {
  --border-radius: 8px;
  --box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  --background: white;
  --emoji-size: 19px;
  --font-size: 14px;
  --border-color: #ebeff4;
  
  --search-background: transparent; /* Changes search bar background */
  --input-font-color: #666; /* Changes search text color */
  --input-border-color: #ebeff4;
  --outline-color: #0ea5e9;
  --outline-size: 1px;
  --button-hover-background: #ebeff4;
  --indicator-color: #0ea5e9;
  --input-font-size: 14px;
  --button-active-background: transparent;
}

.dark emoji-picker {
  --background: #020617;
  --font-color: white;
  --input-border-color: #0f172a;
  --border-color: #0f172a;
  --button-hover-background: #0f172a;
}
</style>