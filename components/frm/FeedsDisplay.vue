<script setup>
defineProps(['filter'])
</script>

<template>
  {{ filter === 'threads' ? `New ${filter} from the users and forums you follow` : `New ${filter} from the users and threads you follow` }}
</template>