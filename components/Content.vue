<script setup>
import replaceEmojisWithImages from '@/lib/replaceEmojis'
import { PhFile } from '@phosphor-icons/vue'
import Button from '@/components/ui/button/Button.vue'

const props = defineProps(['contents'])

const html = ref(props.contents.html)

onMounted(async () => {
  const emojiTest = "😀"
  const supportsEmoji = emojiTest.length === 2
  
  // If device does not support emoji, replace emojis with images in its display
  if (!supportsEmoji) {
    html.value = await replaceEmojisWithImages(props.contents.html)
  }
})
</script>

<template>
  <div v-if="html || contents.imgs.length || contents.docs.length" class="py-3 pb-4">
    
    <div class="torch-doc ql-editor p-0 whitespace-pre-line" v-html="html">
    </div>

    <div v-if="contents.imgs && contents.imgs.length" class="mt-4">
      <img v-for="img in contents.imgs" :key="img.id" :src="`/api/uploads/contents_imgs/${img.url}`" class="block w-full max-w-sm mb-3 last:mb-0" />
    </div>
    
    <template v-if="contents.docs && contents.docs.length">
      <div class="mt-5"></div>
      <a :href="`/api/uploads/contents_docs/${contents.docs[0].url}`" :download="contents.title">
        <Button variant="outline"><PhFile /> Download Document</Button>
      </a>
    </template>
    
  </div>
</template>