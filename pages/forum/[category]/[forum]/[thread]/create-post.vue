<script setup>
useHead({
  title: "Create Post",
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

const postData = ref(null)

if (route.query.post) {
  const { data } = await useAsyncData('editpost', () =>
    $fetch('/api/forum/post', {
      method: "POST",
      body: {
        userId: $auth.user.id,
        postId: Number(route.query.post)
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
    
    const post = data.value.post
    if (!postData.value) postData.value = {}
    
    postData.value.edit = {
      id: post.id,
      userId: post.userId,
      content: {
        html: post.content_html,
        text: post.content_text
      },
      quoteData: post.quote || null,
      images: post.images,
      doc: post.docs[0]
    }
  } else {
    throw createError({ statusCode: 400, statusMessage: 'There was a problem. Try refreshing page.' })
  }
}
else {
  postData.value = true
}

import ForumPageLayout from '@/layouts/ForumPageLayout.vue'
import EditPost from '@/components/frm/EditPost.vue'
import EditContentsSkeleton from '@/components/sk/EditContentsSkeleton.vue'
</script>


<template>
  <ForumPageLayout :hideAnnounce="true">
    
    <EditPost
      v-if="postData"
      :intent="postData.edit ? 'edit' : 'create'"
      :edit="postData.edit"
      :quote="postData.quote"
    />
    
    <template v-else >
      <EditContentsSkeleton />
    </template>
    
  </ForumPageLayout>
</template>