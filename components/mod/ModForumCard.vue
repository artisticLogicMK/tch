<script setup>
import { useAuthStore } from '~/store/auth'
import { useToast } from '@/components/ui/toast/use-toast'
import Button from '@/components/ui/button/Button.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import ModForumEdit from '@/components/mod/ModForumEdit.vue'
import ModForumAnnounce from '@/components/mod/ModForumAnnounce.vue'
import { PhNotePencil, PhLock, PhTrash, PhMegaphone, PhArrowUp, PhArrowDown, PhCircleNotch } from '@phosphor-icons/vue'

const props = defineProps(['forum', 'isSelCategory', 'moving'])

const auth = useAuthStore()
const { toast } = useToast()
const delLoading = ref(false)
const lockLoading = ref(false)

const { removeForum, updateForum } = inject('forumActions')

const deleteForum = async () => {
  if (delLoading.value) return

  delLoading.value = true

  const { data } = await useFetch('/api/mod/delete-forum', {
    method: 'POST',
    body: {
      frmId: props.forum.id
    },
    headers: {
      Authorization: `Bearer ${auth.token}`
    },
    server: false
  })

  if (data.value.success) {
    delLoading.value = false // Stop loading
    
    removeForum(data.value.forum.id)
    
    toast({ title: 'Forum Deleted' })
  } else {
    delLoading.value = false
    toast({
      title: `Failed! ${data.value.message}`,
      variant: 'destructive'
    })
  }
}

const lockForum = async () => {
  if (lockLoading.value) return

  lockLoading.value = true

  const { data } = await useFetch('/api/mod/lock-forum', {
    method: 'POST',
    body: {
      forumId: props.forum.id,
      locked: props.forum.locked
    },
    headers: {
      Authorization: `Bearer ${auth.token}`
    },
    server: false
  })

  if (data.value.success) {
    lockLoading.value = false // Stop loading
    
    updateForum(data.value.forum)

    toast({ title: `Forum ${data.value.forum.locked ? 'Locked' : 'Unlocked'}` })
  } else {
    lockLoading.value = false
    toast({
      title: `Failed! ${data.value.message}`,
      variant: 'destructive'
    })
  }
}
</script>

<template>
  <div class="flist px-3 xs:px-4 py-3 border-b bdr even:bg-slate-100 dark:even:bg-slate-900/90">
    <div class="modthread xsm:flex items-center justify-between mb-2.5">
      <div class="mb-2.5 xsm:mb-0">
        <p class="text-sm text-600 font-semibold">{{ props.forum.name }}</p>
        <p class="text-bsm xs:text-sm text-slate-500/90 dark:text-slate-400">Category: {{ props.forum.category.name }}</p>
      </div>

      <div class="flex items-center justify-end xsm:justify-items-start text-600 space-x-3">
        <ModForumEdit :edit="forum">
          <button class="btn">
            <PhNotePencil />
          </button>
        </ModForumEdit>
        
        <ModForumAnnounce :forumId="props.forum.id" :forum="props.forum">
          <button class="btn">
            <PhMegaphone />
          </button>
        </ModForumAnnounce>
        
        
        <ConfirmDialog :title="`Are you sure to ${props.forum.locked ? 'unlock' : 'lock'} forum?`" description="This will stop the creation of threads and posts on this forum." @accept="lockForum">
          <button class="btn" :class="{'sel': props.forum.locked}" :disabled="lockLoading">
            <PhCircleNotch v-if="lockLoading" class="animate-spin" />
            <PhLock v-else />
          </button>
        </ConfirmDialog>
         
        <ConfirmDialog title="Are you sure to delete?" description="This will permanently delete this forum and all of its threads and posts." @accept="deleteForum">
          <button class="btn" :disabled="delLoading">
            <PhCircleNotch v-if="delLoading" class="animate-spin" />
            <PhTrash v-else />
          </button>
        </ConfirmDialog>
        
        <template v-if="props.isSelCategory">
          <button
            @click="!props.moving && $emit('moveForum', {id: props.forum.id, direction: 'up'})"
          > 
            <PhCircleNotch v-if="props.moving === props.forum.id" class="animate-spin" />
            <PhArrowUp v-else />
          </button>
          
          <button
            @click="!props.moving && $emit('moveForum', {id: props.forum.id, direction: 'down'})"
          >
            <PhCircleNotch v-if="props.moving === props.forum.id" class="animate-spin" />
            <PhArrowDown v-else />
          </button>
        </template>
      </div>
    </div>
    
    <p class="text-600 text-bsm xs:text-sm">
      {{ props.forum.description.slice(0,150) }}
    </p>
    
  </div>
</template>