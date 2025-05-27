<script setup>
useHead({
  title: "Create Thread",
})

useSeoMeta({
  robots: 'noindex, nofollow'
})

definePageMeta({
  middleware: ["auth", "is-valid-user"]
})

const { $auth } = useNuxtApp()
import { useRoute } from 'vue-router'
const route = useRoute()

const threadData = ref(null)

if (route.query.thread) {
  const { data } = await useAsyncData('editthread', () =>
    $fetch('/api/forum/thread', {
      method: "POST",
      body: {
        userId: $auth.user.id,
        threadId: Number(route.query.thread)
      },
      headers: {
          Authorization: `Bearer ${$auth.token}`
        },
    })
  )
  
  if (data.value.success) {
    if (data.value.unAuthorized) {
      throw createError({ statusCode: 403, statusMessage: 'Unauthorized!' })
    }
    
    const thread = data.value.thread
    if (!threadData.value) threadData.value = {}
    
    threadData.value.edit = {
      id: thread.id,
      userId: thread.userId,
      title: thread.title,
      content: {
        html: thread.content_html,
        text: thread.content_text
      },
      images: thread.images,
      doc: thread.docs[0]
    }
  } else {
    throw createError({ statusCode: 400, statusMessage: 'There was a problem. Try refreshing page.' })
  }
}
else {
  threadData.value = true
}

import ForumPageLayout from '@/layouts/ForumPageLayout.vue'
import EditThread from '@/components/frm/EditThread.vue'
import EditContentsSkeleton from '@/components/sk/EditContentsSkeleton.vue'

// Check if user is editing and get thread if
const edit = route.query.thread || null
</script>

<template>
  <ForumPageLayout :hideAnnounce="true">
    <EditThread
      v-if="threadData"
      :intent="edit !== null ? 'edit' : 'create'"
      :edit="threadData.edit"
    />
    
    <template v-else >
      <EditContentsSkeleton />
    </template>
 </ForumPageLayout>   
</template>