<script setup>
import PermissionActions from '@/components/frm/PermissionActions.vue'
import { PhChatCircle, PhEye, PhHeart, PhDotsNine, PhBookmarkSimple } from '@phosphor-icons/vue'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Reaction from '@/components/frm/Reaction.vue'

const props = defineProps(['post'])
const { $auth, $formatNumber } = useNuxtApp()

const bookmarked = ref(props.post.bookmarked)
const bookmarkCount = ref(props.post._count.bookmarks)

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
      postId: props.post.id || null,
      threadId: null
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
        <PhEye weight="fill" /> {{ $formatNumber(props.post._count.views) }}
      </span>
      
      <Reaction :reaction="{
        userReaction: props.post.currentUserReaction ? props.post.currentUserReaction.emoji : null,
        count: props.post._count.reactions,
        firstTwoOther: props.post.reactions,
        postId: props.post.id
      }" />
      
      <span v-if="$auth.isAuthenticated" @click="setBookmark" class="cp" :class="{'sel': bookmarked}">
        <PhBookmarkSimple weight="fill" />{{ $formatNumber(bookmarkCount) }}
      </span>
    </div>

    <PermissionActions
      v-if="$auth.isAuthenticated"
      type="post"
      :postId="props.post.id"
      :isUser="props.post.user.id === $auth.user.id"
      :isModerator="props.post.thread.forum.moderators.some(th => th.userId === $auth.user.id) || $auth.user.admin"
      :mod="{ locked: post.locked, pinned: post.pinned, hidden: post.hidden }"
      :threadLocked="post.thread.locked"
      :quoteData="{username: post.user.username, html: post.content_html, text: post.content_text.slice(0,120), images: post.images, docs: post.docs}"
    />

  </div>
</template>