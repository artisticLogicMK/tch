<script setup>
import Button from '@/components/ui/button/Button.vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast/use-toast'

const { user } = defineProps(['user'])

const { $auth } = useNuxtApp()
const { toast } = useToast()

const reason = ref(null)
const loading = ref(false)

const reportUser = async () => {
  if (loading.value) return
  
  if (!reason.value || reason.value.length > 300) {
    toast({ title: 'Reason cant be empty, and accepts max of 300 characters.', variant: 'destructive' })
    return
  }
  
  loading.value = true
  
  
  const { data } = await useFetch('/api/forum/report', {
    method: 'POST',
    body: {
      userId: user.id || null,
      reporter: $auth.user.username,
      type: "user",
      link: `/u/${user.username}`,
      message: reason.value
    },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
  })
  
  if (data.value.success) {
    loading.value = false
    toast({ title: `User Reported!` })
    reason.value = null
    if (process.client) document.querySelector("#xDialg").click()
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
          Report User
        </DialogTitle>
      </DialogHeader>
      

      <form @submit.prevent="reportUser" class="text-sm">
  
        <div class="mb-6">
          <textarea v-model="reason" class="input" placeholder="Reason..." rows="5" maxlength="300" required></textarea>
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

<style>

</style>