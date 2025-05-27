<script setup>
import { useToast } from '@/components/ui/toast/use-toast'
import Button from '@/components/ui/button/Button.vue'
import ForumModerators from '@/components/mod/ForumModerators.vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import urlSlug from '@/lib/urlSlug'

const props = defineProps(['edit','id'])

const { $auth } = useNuxtApp()
const { toast } = useToast()

const form = ref({ name: '', description: '', category: { connect: { id: null } } })
const loading = ref(false)

const { updateForum, addForum } = inject('forumActions')
const nextPosition = inject('nextPosition')
const categories = inject('categories')

const setForum = async () => {
  if (loading.value && !form.categoryId) return
  
  loading.value = true

  const { data } = await useFetch('/api/mod/set-forums', {
    method: 'POST',
    body: {
      data: {
        ...form.value,
        position: props.edit ? props.edit.position : nextPosition,
        slug: urlSlug(form.value.name)
      },
      frmId: props.edit ? props.edit.id : 0,
      isEdit: props.edit ? true : false,
    },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
    server: false
  })

  if (data.value.success) {
    loading.value = false // Stop loading
    
    if (props.edit) {
      updateForum(data.value.forum)
    } else {
      addForum(data.value.forum)
      form.value = { name: '', description: '', category: { connect: { id: null } } }
    }
    
    toast({ title: `Forum ${props.edit ? 'Edited' : 'Added'}!` })
    if (process.client) document.querySelector("#xDialg").click()
    
  } else {
    loading.value = false
    toast({
      title: `Failed! ${data.value.message}`,
      variant: 'destructive'
    })
  }
}

onMounted(async () => {
  if (props.edit) {
    form.value.name = props.edit.name
    form.value.description = props.edit.description
    form.value.category.connect.id = props.edit.categoryId
  }
})
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    <DialogContent>

      <DialogHeader>
        <DialogTitle class="capitalize">
          {{ props.edit ? 'Edit' : 'Add' }} Forum
        </DialogTitle>
      </DialogHeader>

      <form @submit.prevent="setForum" class="text-sm">

        <div class="mb-4">
          <input v-model="form.name" type="text" class="input" placeholder="Forum name..." required />
        </div>
        
        <div class="mb-6">
          <textarea v-model="form.description" class="input" placeholder="Forum description..." rows="5" required></textarea>
        </div>

        <div class="mb-6">
          <select v-model="form.category.connect.id" class="input" required>
            <option value="">Select Category</option>
            <option
              v-for="cat in categories"
              :value="cat.id"
              :key="cat.id">
            {{ cat.name }}</option>
          </select>
        </div>
        
        <div v-if="props.edit" class="flex justify-center mb-5">
          <Button :loading="loading">Submit</Button>
        </div>
        
        
        <ForumModerators v-if="props.edit" :forumId="props.edit.id" />
        
        
        <DialogFooter>
          <Button v-if="!props.edit" :loading="loading">Submit</Button>
          <DialogClose>
            <Button id="xDialg" @click.prevent variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>

    </DialogContent>
  </Dialog>
</template>