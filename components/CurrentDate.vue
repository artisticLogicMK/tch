<script setup>
import moment from 'moment-timezone'

const currentTime = ref('')

let intervalId

const updateTime = () => {
  currentTime.value = moment().format('ddd MMM D, YYYY h:mm a');
}

onMounted(() => {
  updateTime()
  intervalId = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
 Its currently {{currentTime ? currentTime : '...'}}
</template>