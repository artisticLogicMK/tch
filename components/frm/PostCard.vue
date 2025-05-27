<script setup>
import ThreadPageUser from '@/components/frm/ThreadPageUser.vue'
import PostCardQuote from '@/components/frm/PostCardQuote.vue'
import PostCardActions from '@/components/frm/PostCardActions.vue'
import Button from '@/components/ui/button/Button.vue'
import Pinned from '@/components/ui/Pinned.vue'
import Content from '@/components/Content.vue'

const props = defineProps(['post', 'showSmallTime', 'showLocation', 'showPin'])

const { $formatTime, $global } = useNuxtApp()

const links = {
  category: { url: `/forum/${props.post.thread.forum.category.slug}`, name: props.post.thread.forum.category.name },
  forum: { url: `/forum/${props.post.thread.forum.category.slug}/${props.post.thread.forum.slug}`, name: props.post.thread.forum.name },
  thread: { url: `/forum/${props.post.thread.forum.category.slug}/${props.post.thread.forum.slug}/${props.post.thread.slug}`, title: props.post.thread.title }
}

provide('links', links)
</script>

<template>
  <div class="post-thread-card border-b">

    <p v-if="props.showLocation" class="cards-location pb-2">/ <NuxtLink :to="links.category.url">{{ links.category.name }}</NuxtLink> / <NuxtLink :to="links.forum.url">{{ links.forum.name }}</NuxtLink> / <NuxtLink :to="links.thread.url">{{ links.thread.title }}</NuxtLink></p>
  
    <Pinned v-if="props.post.pinned && props.showPin" class="mb-3" />
    
    <ThreadPageUser :data="props.post" />
    
    <PostCardQuote v-if="props.post.quote" :quote="props.post.quote" />

    <Content :contents="{ html:post.content_html, imgs:post.images, docs:post.docs, title:post.content_text.slice(0,30) }" />
    
    <PostCardActions :post="post" />
    
    <!--<PostCardComments v-if="showComments" />-->
    
  </div>
</template>

<style>
</style>