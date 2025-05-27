<script setup>
import * as yup from 'yup'
import { useToast } from '@/components/ui/toast/use-toast'
import { threadValidationSchema } from '@/lib/validationSchemas'

import Button from '@/components/ui/button/Button.vue'
import { Input } from '@/components/ui/input'
import Editor from '@/components/ui/Editor.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import EditsImages from '@/components/frm/EditsImages.vue'

const { $auth } = useNuxtApp()
const { toast } = useToast()

const props = defineProps(['intent', 'edit'])

const storedData = ref({
  title: '',
  content: {},
})

const errorsObj = {
  title: '',
  content: ''
}
const errors = ref(errorsObj)
const loading = ref(false)

const images = ref([])
const imagesel = ref(4)
const doc = ref(null)

if (props.intent === "edit") {
  storedData.value.title = props.edit.title
  storedData.value.content = props.edit.content
  images.value = props.edit.images
  imagesel.value -= props.edit.images.length
  doc.value = props.edit.doc
}

const route = useRoute()
const forumSlug = route.params.forum

// Function to validate form
const validateForm = async () => {
  try {
    await threadValidationSchema.validate({
      title: storedData.value.title,
      content: storedData.value.content.text
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

// Submit thread handler
const submitThread = async () => {
  if (loading.value) return
  errors.value = errorsObj
  
  if (imagesUpl.value.length > imagesel.value) {
    toast({ title: `Only ${imagesel.value} images left to upload.`, variant: 'destructive' })
    return
  }
  
  loading.value = true
  const isValid = await validateForm()
  const isValidFiles = await validateFiles()
  
  if (isValid && isValidFiles) {
    const { data } = await useFetch('/api/forum/set-thread', {
      method: 'POST',
      body: {
        forumSlug,
        title: storedData.value.title,
        html: storedData.value.content.html,
        text: storedData.value.content.text,
        images: imagesUpl.value,
        docs: docs.value,
        isEdit: props.intent === 'edit' ? props.edit.id : false,
        editUserId: props.intent === 'edit' ? props.edit.userId : null
      },
      headers: {
        Authorization: `Bearer ${$auth.token}`
      },
    })
  
    if (data.value.success) {
      loading.value = false
      toast({ title: `Thread ${props.edit ? 'Updated!' : 'Created!'}` })
      
      storedData.value.title = ''
      storedData.value.content = {text:'',html:''}
      // Navigate to thread
      navigateTo(`/forum/${route.params.category}/${forumSlug}/${data.value.thread.slug}`, { replace: true })
    } else {
      loading.value = false
      toast({
        title: `Failed! ${data.value.message || 'There was a problem'}`,
        variant: 'destructive'
      })
    }
  } else {
    loading.value = false
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

const deleteThread = async () => {
  const { data } = await useFetch('/api/forum/delete-thread', {
    method: 'POST',
    body: {
      threadId: props.edit.id,
      userId: props.edit.userId,
    },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
  })

  if (data.value.success) {
    toast({ title: 'Thread Deleted!' })
    navigateTo(`/forum/${route.params.category}/${forumSlug}`, { replace: true })
  } else {
    toast({ title: 'There was a problem deleting thread.', variant: 'destructive' })
  }
}

/*onMounted(() => {
 if (props.intent === 'edit') {
    storedData.value.title = props.edit.title
    storedData.value.content = props.edit.content
    
    if (props.edit.images && props.edit.images.length) {
      images.value = props.edit.images
      imagesel.value -= props.edit.images.length
      doc.value = props.edit.doc
    }
  }
})*/
</script>

<template>
  <div class="w-full h-full bg-flat overflow-y-auto">

    <div class="flex items-center justify-between border-b bdr px-3 xs:px-4 py-2">
        <h1 class="text-sm xs:text-base font-semibold font-round text-600">{{ props.intent === 'edit' ? 'Edit' : 'Create' }} Thread</h1>
        
        <ConfirmDialog v-if="intent === 'edit'" title="Are you sure to delete?" description="This action will permanently delete this thread from the forum." @accept="deleteThread">
          <Button @click.prevent class="hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-700" variant="outline">Delete</Button>
        </ConfirmDialog>
    </div>
    
    
    <form class="p-3 xs:p-4" @submit.prevent="submitThread">
      <div class="mb-5">
        <p class="label">Title</p>
        <div v-if="errors.title" class="form-errs">{{ errors.title }}</div>
        <Input
          v-model="storedData.title"
          type="text" placeholder="Thread Title..." />
      </div>


      <div class="mb-5">
        <p class="label">Content</p>
        <div v-if="errors.content" class="form-errs">{{ errors.content }}</div>
        <Editor
          v-model="storedData.content"
          :content="storedData.content.html"
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
        <Input type="file" @input="handleImages" accept="image/jpeg, image/png, image/webp" class="h-9 mb-2 last:mb-0 appearance-none file:hidden" multiple />
      </div>
      
      <div class="mb-5">
        <p class="label">Upload Document</p>
        <Button v-if="doc" @click.prevent="removeContent({data:doc, type: 'doc'})" variant="outline">
          &times; Remove Document
        </Button>
        <input v-else type="file" @input="handleDoc" accept=".pdf,.doc,.docx,.txt" class="input h-9 mb-2 last:mb-0 appearance-none file:hidden" />
      </div>
      
      <div class="flex items-center justify-end sm:justify-center mb-5">
        <Button class="w-fit sm:w-32" :loading="loading">
          {{ props.intent === 'edit' ? 'Update' : 'Submit' }}
        </Button>
      </div>
    </form>
    
  </div>
</template>
