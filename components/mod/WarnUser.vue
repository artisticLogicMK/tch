<script setup>
const { userId } = defineProps(['userId'])
const user = useState(`userState-${userId}`)

import Button from '@/components/ui/button/Button.vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast/use-toast'

const { $auth } = useNuxtApp()
const { toast } = useToast()

const warning = ref(null)
const loading = ref(false)

const warnUser = async () => {
  if (loading.value) return
  
  if (!warning.value || warning.value.length > 300) {
    toast({ title: 'Warning cant be empty, and accepts max of 300 characters.', variant: 'destructive' })
    return
  }
  
  loading.value = true
  
  const { data } = await useFetch('/api/mod/mod-actions', {
    method: 'POST',
    body: {
      id: user.value.id,
      warn_text: warning.value,
      warnings: user.value.warnings + 1
    },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
  })
  
  if (data.value.success) {
    loading.value = false
    toast({ title: `User Warned!` })
    warning.value = null
    
    user.value.warnings = user.value.warnings + 1
    document.querySelector("#xDialg").click()
  } else {
    loading.value = false
    toast({
      title: `Failed! ${data.value.message || 'There was a problem'}`,
      variant: 'destructive'
    })
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
          Warn User
        </DialogTitle>
      </DialogHeader>
      

      <form @submit.prevent="warnUser" class="text-sm">
  
        <div class="mb-6">
          <textarea v-model="warning" class="input" placeholder="Warning..." rows="5" maxlength="300" required></textarea>
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