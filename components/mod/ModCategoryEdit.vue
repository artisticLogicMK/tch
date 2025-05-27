<script setup>
import { useToast } from '@/components/ui/toast/use-toast'
import Button from '@/components/ui/button/Button.vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { PhXCircle } from '@phosphor-icons/vue'
import urlSlug from '@/lib/urlSlug'

const props = defineProps(['edit','id'])

const { $auth } = useNuxtApp()
const { toast } = useToast()

const form = ref({ name: '', description: '' })
const loading = ref(false)

const errorsObj = { name: '', description: '' }
const errors = ref(errorsObj)

const { updateCategory, addCategory } = inject('categoryActions')
const nextPosition = inject('nextPosition')

const setCategory = async () => {
  if (loading.value) return
  errors.value = errorsObj
  
  loading.value = true

  const { data } = await useFetch('/api/mod/set-category', {
    method: 'POST',
    body: {
      data: {
        ...form.value,
        position: props.edit ? props.edit.position : nextPosition,
        slug: urlSlug(form.value.name)
      },
      catId: props.edit ? props.edit.id : 0,
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
      updateCategory(data.value.category)
    } else {
      addCategory(data.value.category)
    }
    
    toast({ title: `Category ${props.edit ? 'Edited' : 'Added'}!` })
    form.value = { name: '', description: '' }
    if (process.client) document.querySelector("#xDialg").click()
  } else {
    loading.value = false
    toast({
      title: `Failed! ${data.value.message}`,
      variant: 'destructive'
    })
  }
}

onMounted(() => {
  if (props.edit) {
    form.value.name = props.edit.name
    form.value.description = props.edit.description
  }
})
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent>

      <DialogHeader>
        <DialogTitle class="capitalize">
          {{ props.edit ? 'Edit' : 'Add' }} Category
        </DialogTitle>
      </DialogHeader>


      <form @submit.prevent="setCategory" class="text-sm">
        
        <div class="mb-4">
          <input v-model="form.name" type="text" class="input" placeholder="Category name..." required />
        </div>
        
        <div class="mb-6">
          <textarea v-model="form.description" class="input" placeholder="Category description..." rows="6" required></textarea>
        </div>
        
        
        <DialogFooter>
          <Button type="submit" :loading="loading">Submit</Button>
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