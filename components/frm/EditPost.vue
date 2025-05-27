<script setup>
import * as yup from 'yup'
import { useToast } from '@/components/ui/toast/use-toast'
import { postValidationSchema } from '@/lib/validationSchemas'

import Button from '@/components/ui/button/Button.vue'
import { Input } from '@/components/ui/input'
import Editor from '@/components/ui/Editor.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import EditPostQuote from '@/components/frm/EditPostQuote.vue'
import EditsImages from '@/components/frm/EditsImages.vue'

const { $auth } = useNuxtApp()
const { toast } = useToast()
const router = useRouter()

const props = defineProps(['intent', 'edit'])

const storedData = ref({ html: '', text: '' })

const errors = ref({
  content: ''
})

const loading = ref(false)

const images = ref([])
const imagesel = ref(4)
const doc = ref(null)

if (props.intent === "edit") {
  storedData.value = props.edit.content
  images.value = props.edit.images
  imagesel.value -= props.edit.images.length
  doc.value = props.edit.doc
}

const route = useRoute()
const forumSlug = route.params.forum
const threadSlug = route.params.thread

const storedQuote = ref(null)

// Function to validate form
const validateForm = async () => {
  try {
    await postValidationSchema.validate({
      content: storedData.value.text
    }, { abortEarly: false })
    return true
  } catch (err) {
    // Capture all errors and map them to fields
    errors.value = {}
    err.inner.forEach((error) => {
      errors.value[error.path] = error.message
    })
    return false
  }
}

const { handleFileInput: handleImages, files: imagesUpl } = useFileStorage()
const { handleFileInput: handleDoc, files: docs } = useFileStorage()

// Allowed file types
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"]
const allowedDocTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]

const validateFiles = () => {
  return new Promise((resolve, reject) => {
    // Validate documents
    for (const doc of docs.value) {
      if (!allowedDocTypes.includes(doc.type) || doc.size > 300 * 1024) {
        toast({
          title: "Document Upload:",
          description: "Only PDF, DOC, and TXT files are allowed. Max file size of 300KB.",
          variant: "destructive",
        })
        loading.value = false
        return reject(false) // Reject the promise if validation fails
      }
    }

    // Validate images
    for (const image of imagesUpl.value) {
      if (!allowedImageTypes.includes(image.type) || image.size > 1 * 1024 * 1024) {
        toast({
          title: "Images Upload:",
          description: "Only JPG, PNG, and GIF images are allowed. Each image must be less than 1MB.",
          variant: "destructive",
        })
        loading.value = false
        return reject(false) // Reject the promise if validation fails
      }
    }

    resolve(true) // Resolve the promise if all files pass validation
  })
}


// Submit post handler
const submitPost = async () => {
  if (loading.value) return
  errors.value = {content:''}
  
  if (imagesUpl.value.length > imagesel.value) {
    toast({ title: `Only ${imagesel.value} images left to upload.`, variant: 'destructive' })
    return
  }
  
  loading.value = true
  const isValid = await validateForm()
  const isValidFiles = await validateFiles()
  
  if (isValid && isValidFiles) {
    const { data } = await useFetch('/api/forum/set-post', {
      method: 'POST',
      body: {
        forumSlug,
        threadSlug,
        html: storedData.value.html,
        text: storedData.value.text,
        images: imagesUpl.value,
        docs: docs.value,
        isEdit: props.intent === 'edit' ? props.edit.id : false,
        editUserId: props.intent === 'edit' ? props.edit.userId : null,
        ...(storedQuote.value ? {quote:  {
          username: storedQuote.value.username,
          html: storedQuote.value.html, images: storedQuote.value.images, docs: storedQuote.value.docs
        }} : {} )
      },
      headers: {
        Authorization: `Bearer ${$auth.token}`
      },
    })
  
    if (data.value.success) {
      loading.value = false
      toast({ title: `Post ${props.edit ? 'Updated!' : 'Created!'}` })
      
      if (props.intent === "edit") {
        router.back()
      }
      else {
        storedData.value = {text:'',html:''}
        
        if (route.query.quote) sessionStorage.removeItem('quoteData')
        
        // Navigate to thread
        navigateTo(`/forum/${route.params.category}/${forumSlug}/${threadSlug}`, { replace: true })
      }
    } else {
      loading.value = false
      toast({
        title: `Failed! ${data.value.message || 'There was a problem'}`,
        variant: 'destructive'
      })
    }
  } else {
    toast({
      title: 'You have errors in your form!',
      variant: 'destructive'
    })
  }
}


const removeContent = async (content) => {
  const { data } = await useFetch('/api/forum/remove-contents', {
    method: 'POST',
    body: {
      threadId: props.edit.id,
      userId: props.edit.userId,
      ...content
    },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
  })

  if (data.value.success) {
    if (content.type === 'img') {
      images.value = images.value.filter((img) => img !== content.data)
      imagesel.value += 1
    }
    if (content.type === 'doc') {
      doc.value = null
    }
  } else {
    toast({ title: 'There was a problem removing item.', variant: 'destructive' })
  }
}


const deletePost = async () => {
  const { data } = await useFetch('/api/forum/delete-post', {
    method: 'POST',
    body: {
      postId: props.edit.id,
      userId: props.edit.userId,
    },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
  })

  if (data.value.success) {
    toast({ title: 'Post Deleted!' })
    navigateTo(`/forum/${route.params.category}/${forumSlug}/${threadSlug}`, { replace: true })
  } else {
    toast({ title: 'There was a problem deleting post.', variant: 'destructive' })
  }
}

onMounted(() => {
  if (route.query.quote && !sessionStorage.quoteData) {
   throw createError({ statusCode: 400, statusMessage: 'Invalid Action.' })
  }
  
 if (route.query.quote && sessionStorage.quoteData !== null) {
   storedQuote.value = sessionStorage.quoteData ? JSON.parse(sessionStorage.quoteData) : null
 }
})

onUnmounted(() => {
  sessionStorage.removeItem('quoteData')
})
</script>


<template>
  <div class="w-full h-full bg-flat overflow-y-auto">

    <div class="flex items-center justify-between border-b bdr px-3 xs:px-4 py-2">
        <h1 class="text-sm xs:text-base font-semibold font-round text-600">{{ props.intent === 'edit' ? 'Edit' : 'Create' }} Post</h1>
        
        <ConfirmDialog v-if="intent === 'edit'" title="Are you sure to delete?" description="This action will permanently delete this post from the forum." @accept="deletePost">
          <Button @click.prevent class="hover:bg-red-100 hover:text-red-500" variant="outline">Delete</Button>
        </ConfirmDialog>
    </div>
    
    
    <form class="p-3 xs:p-4" @submit.prevent="submitPost">
      
      <EditPostQuote v-if="route.query.post && props.edit.quoteData" :quote="props.edit.quoteData" />

      <EditPostQuote v-if="storedQuote" :quote="storedQuote" />
      
      <div class="mb-5">
        <p class="label">Content</p>
        <div v-if="errors.content" class="form-errs">{{ errors.content }}</div>
        <Editor
          v-model="storedData"
          :content="storedData.html"
        />
      </div>
      
      <EditsImages
        v-if="props.intent === 'edit' && images.length"
        :images="images"
        @removeImage="removeContent"
      />

      <div class="mb-5">
        <p class="label">Upload Images</p>
        <p class="text-bsm text-500 mb-2">Maximum of 4 images. {{images.length ? `${imagesel} left.` : '' }}</p>
        <Input type="file" @input="handleImages" accept="image/jpeg, image/png, image/webp" class="fis h-9 mb-2 last:mb-0 appearance-none file:hidden" multiple />
      </div>
      
      <div class="mb-5">
        <p class="label">Upload Document</p>
        <Button v-if="doc" @click.prevent="removeContent({data:doc, type: 'doc'})" variant="outline">
          &times; Remove Document
        </Button>
        <input v-else type="file" @input="handleDoc" accept=".pdf,.doc,.docx,.txt" class="fis input h-9 mb-2 last:mb-0 appearance-none file:hidden" />
      </div>
      
      <div class="flex items-center justify-end sm:justify-center mb-5">
        <Button class="w-fit sm:w-32" :loading="loading">
          {{ props.intent === 'edit' ? 'Update' : 'Submit' }}
        </Button>
      </div>
      
    </form>
    
  </div>
</template>
