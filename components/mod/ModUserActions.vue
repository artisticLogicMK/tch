<script setup>
const { userId } = defineProps(['userId'])
const user = useState(`userState-${userId}`)

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import SuspendUser from '@/components/mod/SuspendUser.vue'
import WarnUser from '@/components/mod/WarnUser.vue'
import Button from '@/components/ui/button/Button.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useToast } from '@/components/ui/toast/use-toast'

const { $auth } = useNuxtApp()
const { toast } = useToast()

const banLoading = ref(false)
const delLoading = ref(false)

const banUser = async () => {
  if (banLoading.value) return
  
  banLoading.value = true
  
  const { data } = await useFetch('/api/mod/mod-actions', {
    method: 'POST',
    body: {
      id: user.value.id,
      banned: !user.value.banned
    },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
  })
  
  if (data.value.success) {
    banLoading.value = false
    toast({ title: `User ${user.value.banned ? 'Unbanned' : 'Banned'}!` })
    
    user.value.banned = !user.value.banned
    //document.querySelector("#xDialg").click()
  } else {
    banLoading.value = false
    toast({ title: 'There was a problem', variant: 'destructive' })
  }
}


const delUser = async () => {
  if (delLoading.value) return
  
  delLoading.value = true
  
  const { data } = await useFetch('/api/mod/delete-user', {
    method: 'POST',
    body: {
      id: user.value.id,
    },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
  })
  
  if (data.value.success) {
    delLoading.value = false
    toast({ title: `User Deleted from Forum!` })
    
    user.value.hide = true
  } else {
    delLoading.value = false
    toast({ title: 'There was a problem', variant: 'destructive' })
  }
}

const date = new Date().toISOString()
</script>

<template>
  <Popover>
    
    <PopoverTrigger>
      <slot />
    </PopoverTrigger>

    <PopoverContent class="flex flex-col space-y-2 p-2">
      <WarnUser :userId="user.id">
        <Button class="bg-yellow-500 hover:bg-yellow-600">Warn</Button>
      </WarnUser>
      
      <SuspendUser :userId="user.id">
        <Button variant="outline">{{ user.suspended > date ? 'Unsuspended' : 'Suspend' }}</Button>
      </SuspendUser>
      
      <ConfirmDialog title="Are you sure?" :description="`${!user.banned ? 'This will prevent the user from accessing this forum.' : 'This will give the user access to this forum.'}`" @accept="banUser">
        <Button variant="outline" :loading="banLoading">{{ user.banned ? 'Unban' : 'Ban' }}</Button>
      </ConfirmDialog>
      
      <ConfirmDialog title="Are you sure to delete?" description="This will permanently delete this user and all of their threads and posts." @accept="delUser">
        <Button variant="destructive" :loading="delLoading">Delete</Button>
      </ConfirmDialog>
    </PopoverContent>
    
  </Popover>
</template>

<style>
.ua buttons {
  @apply block w-full
}
</style>