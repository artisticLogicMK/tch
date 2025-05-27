<script setup>
import { ref, onMounted, computed } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ReactionsEmojis from '@/components/frm/ReactionsEmojis.vue'
import { PhHeart } from '@phosphor-icons/vue'

const props = defineProps(['reaction'])

const reaction = ref({
  userReaction: props.reaction.userReaction,
  count: props.reaction.count
})

const { $auth } = useNuxtApp()

const emojis = ['thumbsup', 'heart', 'laugh', 'awe', 'sad', 'angry']

const otherReactions = computed(() => props.reaction.firstTwoOther.filter((rc) => rc.emoji !== reaction.value.userReaction))

const isPopoverOpen = ref(false)

const closePopover = () => {
  isPopoverOpen.value = false
}

const setEmoji = async (emoji) => {
  const beforeValue = reaction.value
  
  // Add new reaction
  if (reaction.value.userReaction === null) {
    reaction.value = {
      userReaction: emoji,
      count: reaction.value.count + 1
    }
  }
  
  // Change reaction
  else if (reaction.value.userReaction !== null && reaction.value.userReaction !== emoji) {
    reaction.value.userReaction = emoji
  }
  
  // Remove reaction
  else if (reaction.value.userReaction === emoji) {
    reaction.value = {
      userReaction: null,
      count: reaction.value.count - 1
    }
  }
  
  closePopover()
  
  // Then set in database here
  const { data } = await useFetch('/api/forum/set-reaction', {
    method: 'POST',
    body: {
      data: reaction.value,
      userId: $auth.user.id || null,
      threadId: props.reaction.threadId || null,
      postId: props.reaction.postId || null
    },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
  })

  if (!data.value.success) {
    // if fail for example set prev emoji & count back
    reaction.value = beforeValue
  }
}
</script>

<template>
  <Popover :open="isPopoverOpen" @update:open="isPopoverOpen = $event">
    
    <PopoverTrigger @click="isPopoverOpen = !isPopoverOpen" as-child>
      <span class="cp emoji-line">
        <PhHeart weight="fill" v-if="!(otherReactions.length && !$auth.isAuthenticated) && !reaction.userReaction" class="reac" />
        
        <!--User selected reaction -->
        <ReactionsEmojis v-if="$auth.isAuthenticated && reaction.userReaction" :emoji="reaction.userReaction" />
        
        <!--other reactions -->
        <ReactionsEmojis
          v-for="emoji in otherReactions.slice(0, $auth.isAuthenticated ? 2 : 3)"
          :key="emoji.id" :emoji="emoji.emoji"
        />
        
        {{ reaction.count }}
      </span>
    </PopoverTrigger>


    <PopoverContent v-if="$auth.isAuthenticated" side="top" class="rounded-full py-1 px-1">
      <div class="emoji-pop flex w-fit">
        <ReactionsEmojis
          v-for="emoji in emojis"
          :key="emoji"
          :emoji="emoji"
          class="p-2 rounded-full active:scale-75 duration-200"
          :class="{'sel': reaction.userReaction === emoji}"
          @click="setEmoji(emoji)" />
      </div>
    </PopoverContent>
    
  </Popover>
</template>

<style>
.emoji-line button {
  @apply mr-1
}
.emoji-line button img {
  @apply w-[18px]
}

.emoji-pop img {
  @apply w-6 cursor-pointer duration-200
}
.emoji-pop button.sel {
  @apply bg-slate-200 dark:bg-slate-800
}
</style>