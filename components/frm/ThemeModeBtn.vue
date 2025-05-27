<script setup>
import { PhMoon, PhSun } from '@phosphor-icons/vue'

const changeTheme = () => {
  const currentTheme = document.documentElement.classList[0]
  if (currentTheme == 'light') {
    document.documentElement.classList.remove('light')
    document.documentElement.classList.add('dark')
    document.querySelector('meta[name=theme-color]').setAttribute("content", "#020617")
    
    // set theme in localStorage 
    localStorage.theme = "dark"
  } else {
    document.documentElement.classList.remove('dark') 
    document.documentElement.classList.add('light')
    document.querySelector('meta[name=theme-color]').setAttribute("content", "#ffffff")
    
    // set theme in localStorage 
    localStorage.theme = "light"
  }
}
</script>

<template>
  <button @click="changeTheme" class="head-btn text-600">
    <PhMoon :size="22" class="dark:hidden" />
    <PhSun :size="22" class="hidden dark:block" />
  </button>
</template>