<script setup>
import PermissionActions from '@/components/frm/PermissionActions.vue'
import { PhChatsCircle, PhEye, PhDotsNine, PhBookmarkSimple } from '@phosphor-icons/vue'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Reaction from '@/components/frm/Reaction.vue'

const props = defineProps(['thread'])
const { $auth, $formatNumber } = useNuxtApp()

const bookmarked = ref(props.thread.bookmarked)
const bookmarkCount = ref(props.thread._count.bookmarks)

const setBookmark = async () => {
  bookmarked.value = !bookmarked.value
  
  if (bookmarked.value) {
      bookmarkCount.value += 1
    } else {
      bookmarkCount.value -= 1
    }
  
  const { data } = await useFetch('/api/forum/set-bookmarks', {
    method: 'POST',
    body: {
      data: bookmarked.value,
      userId: $auth.user.id || null,
      threadId: props.thread.id || null,
      postId: null
    },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
  })

  if (data.value.success) {
    bookmarked.value = data.value.bookmark
  }
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="thread-acts">
      <span>
        <PhChatsCircle weight="fill" /> {{ $formatNumber(props.thread._count.posts) }}
      </span>
      <span>
        <PhEye weight="fill" /> {{ $formatNumber(props.thread._count.views) }}
      </span>

      <Reaction :reaction="{
        userReaction: props.thread.currentUserReaction ? props.thread.currentUserReaction.emoji : null,
        count: props.thread._count.reactions,
        firstTwoOther: props.thread.reactions,
        threadId: props.thread.id
      }" />
      
      <span v-if="$auth.isAuthenticated" @click="setBookmark" class="cp" :class="{'sel': bookmarked}">
        <PhBookmarkSimple weight="fill" /> {{ $formatNumber(bookmarkCount) }}
      </span>
    </div>

    <PermissionActions
      v-if="$auth.isAuthenticated"
      type="thread"
      :threadId="props.thread.id"
      :isUser="props.thread.user.id === $auth.user.id"
      :isModerator="props.thread.forum.moderators.some(th => th.userId === $auth.user.id) || $auth.user.admin"
      :mod="{ locked: thread.locked, pinned: thread.pinned, hidden: thread.hidden }"
    />
    
  </div>
</template>