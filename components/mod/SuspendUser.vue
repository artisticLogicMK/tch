<script setup>
const { userId } = defineProps(['userId'])
const user = useState(`userState-${userId}`)

import Button from '@/components/ui/button/Button.vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast/use-toast'

const { $auth } = useNuxtApp()
const { toast } = useToast()

const suspendDate = user.value.suspended ? user.value.suspended.split('T')[0] : null

const timeRange = ref(suspendDate)
const loading = ref(false)

const suspendUser = async () => {
  if (loading.value) return
  
  const date = new Date(timeRange.value).toISOString()

  loading.value = true
  
  const { data } = await useFetch('/api/mod/mod-actions', {
    method: 'POST',
    body: {
      id: user.value.id,
      suspended: date
    },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
  })
  
  if (data.value.success) {
    loading.value = false
    toast({ title: `User Suspended till ${timeRange.value}!` })
    timeRange.value = null
    
    user.value.suspended = date
    document.querySelector("#xDialg").click()
  } else {
    loading.value = false
    toast({ title: 'There was a problem', variant: 'destructive' })
  }
}
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Suspend User
        </DialogTitle>
      </DialogHeader>
      

      <form @submit.prevent="suspendUser" class="text-sm">
  
        <div class="mb-6">
          <p class="label">Suspend Till</p>
          <input type="date" v-model="timeRange" class="input" required />
        </div>
        
        <DialogFooter>
          <Button :loading="loading">Submit</Button>
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