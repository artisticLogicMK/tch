<script setup>
import { PhCaretDown, PhCaretUp } from '@phosphor-icons/vue'

const scrollTop = () => {
  const el = document.getElementById("topper")
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollDown = () => {
  const el = document.getElementById("bottomer")
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div id="scroller">
    <button @click="scrollTop">
      <PhCaretUp />
    </button>
    <button @click="scrollDown">
      <PhCaretDown />
    </button>
  </div>
</template>

<style>
#scroller {
  @apply fixed right-7 bottom-[15%] z-20 shadow-sm rounded-full
}
#scroller button {
  @apply block bg-sky-500 text-lg text-white dark:text-slate-950 first:rounded-t-full last:rounded-b-full first:border-b first:border-sky-600 last:border-t last:border-sky-400 active:bg-sky-600 py-1 px-2
}
</style>