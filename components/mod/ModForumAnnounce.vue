<script setup>
import { useAuthStore } from '~/store/auth'
import { useToast } from '@/components/ui/toast/use-toast'
import Button from '@/components/ui/button/Button.vue'
import Checkbox from '@/components/ui/checkbox/Checkbox.vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { dateUtc } from '@/lib/dateOperation'

const props = defineProps(['forumId', 'forum'])

const auth = useAuthStore()
const { toast } = useToast()

const form = ref({ content: '', expire: '', hide: false, hideAudio: false })
const loading = ref(false)
const audioAvail = ref(null)

const { handleFileInput, files } = useFileStorage()

const { updateForum } = inject('forumActions')

const setAnnounce = async () => {
  if (loading.value) return
  
  loading.value = true
  
  const expire = form.value.expire ? { expire: new Date(form.value.expire).toISOString() } : { expire: new Date('4000-01-01').toISOString() }
  
  delete form.value.expire

  const { data, error } = await useFetch('/api/mod/set-forumAnnounce', {
    method: 'POST',
    body: {
      data: { ...form.value, ...expire },
      files: files.value,
      forumId: props.forumId
    },
    headers: {
      Authorization: `Bearer ${auth.token}`
    },
    server: false
  })

  if (data.value.success) {
    loading.value = false // Stop loading
    
    const forumData = props.forum
    forumData.forumAnnouncement[0] = data.value.announce
    
    if (data.value.announce.audio) audioAvail.value = true
    
    updateForum(forumData)
    
    if (process.client) document.querySelector("#xDialg").click()
    
    toast({ title: 'Announcement Updated!' })
  } else {
    loading.value = false
    toast({
      title: `${data.value.message}`,
      variant: 'destructive'
    })
  }
}

onMounted(async () => {
  await nextTick()
  
  const ann = props.forum.forumAnnouncement[0]
  form.value = {
    content: ann.content || '',
    expire: ann.expire ? ann.expire.split('T')[0] : '',
    hide: ann.hide || false,
    hideAudio: ann.hideAudio || false
  }
  
  audioAvail.value = ann.audio ? true : false
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
          Set Forum Announcement
        </DialogTitle>
      </DialogHeader>


      <form @submit.prevent="setAnnounce" class="text-sm">
        
        <div class="mb-6">
          <textarea v-model="form.content" class="input" placeholder="Content..." rows="5" required></textarea>
        </div>
        
        <div class="mb-4">
          <p class="label">Audio</p>
          <div v-if="audioAvail" class="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-bsm xs:text-sm inline-block font-semibold px-3 py-1 mb-2 rounded-md" @click="removeAudio">
            Audio Available
          </div>
          <input
            type="file" @input="handleFileInput"
            class="input appearance-none file:hidden file:text-end"
            accept="audio/*"
          />
        </div>
        
        <div class="mb-4">
          <p class="label">Expiration Date</p>
          <input type="date" v-model="form.expire" class="input" />
        </div>
        
        <div class="flex items-center text-sm mb-4">
          <Checkbox id="hra" v-model:checked="form.hideAudio" />
          <label for="hra" class="text-600 ml-2">Hide Audio</label>
        </div>
        
        <div class="flex items-center text-sm mb-4">
          <Checkbox id="hfa" v-model:checked="form.hide" />
          <label for="hfa" class="text-600 ml-2">Hide Announcement</label>
        </div>
        
        
        <DialogFooter>
          <Button :loading="loading">Update</Button>
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