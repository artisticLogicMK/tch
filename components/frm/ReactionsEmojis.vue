<script setup>
defineProps(['emoji'])
</script>

<template>
  <button>
    <img v-if="emoji === 'thumbsup'" src="/assets/emojis/thumbsup.png" width="18px" />
    <img v-if="emoji === 'heart'" src="/assets/emojis/heart.png" width="18px" />
    <img v-if="emoji === 'laugh'" src="/assets/emojis/laugh.png" width="18px" />
    <img v-if="emoji === 'awe'" src="/assets/emojis/awe.png" width="18px" />
    <img v-if="emoji === 'sad'" src="/assets/emojis/sad.png" width="18px" />
    <img v-if="emoji === 'angry'" src="/assets/emojis/angry.png" width="18px" />
  </button>
</template>

<style scoped>
img {@apply -mt-0.5 }
</style>