<script setup>
import { useAuthStore } from '~/store/auth'
import { useToast } from '@/components/ui/toast/use-toast'
import Button from '@/components/ui/button/Button.vue'
import Checkbox from '@/components/ui/checkbox/Checkbox.vue'
import { PhXCircle, PhCircleNotch } from '@phosphor-icons/vue'

const props = defineProps(['forumId'])

const auth = useAuthStore()
const { toast } = useToast()

const username = ref('')
const loading = ref(false)
const delLoading = ref(false)

const moderators = useState(`moderators${props.forumId}`, () => null)

const addMod = async () => {
  if (loading.value || username.value == '') return
  
  loading.value = true

  const { data } = await useFetch('/api/mod/add-moderator', {
    method: 'POST',
    body: {
      username: username.value,
      forumId: props.forumId
    },
    headers: {
      Authorization: `Bearer ${auth.token}`
    },
    server: false
  })

  if (data.value.success) {
    loading.value = false // Stop loading
    username.value = null
    
    moderators.value.push(data.value.mod)
    
    toast({ title: 'Moderator Added' })
  } else {
    loading.value = false
    toast({
      title: `${data.value.message}`,
      variant: 'destructive'
    })
  }
}


const delMod = async (modId) => {
  if (delLoading.value) return
  
  if (!confirm("Sure to remove moderator?")) return
  
  delLoading.value = modId

  const { data } = await useFetch('/api/mod/delete-moderator', {
    method: 'POST',
    body: {
      id: modId
    },
    headers: {
      Authorization: `Bearer ${auth.token}`
    },
    server: false
  })

  if (data.value.success) {
    delLoading.value = false // Stop loading
    
    moderators.value = moderators.value.filter(mod => mod.id !== modId)
    
    toast({ title: 'Moderator Removed!' })
  } else {
    delLoading.value = false
    toast({
      title: `${data.value.message}`,
      variant: 'destructive'
    })
  }
}


onMounted(async () => {
  if (process.client) {
    await nextTick()
    
    const { data, error } = await useFetch('/api/mod/moderators', {
      method: 'POST',
      body: {
        forumId: props.forumId
      },
      headers: {
        Authorization: `Bearer ${auth.token}`
      },
      server: false
    })
  
    if (data.value.success) {
      moderators.value = data.value.mods
    } else {
      toast({
        title: `Failed to fetch moderators. ${data.value.message}`,
        variant: 'destructive'
      })
    }
  }
})
</script>

<template>
  <form @submit.prevent="addMod" class="border bdr rounded-lg p-3 mb-5">
    <h1 class="text-600 font-semibold mb-2">Add Moderators</h1>
    <div class="flex items-center">
      <input type="text" v-model="username" class="input grow mr-3" placeholder="Username..." />
      <Button :loading="loading">Add</Button>
    </div>
  </form>
    
    
  <div class="border bdr rounded-lg mb-5">
    
    <div class="border-b bdr px-3 py-2">
      <h1 class="text-600 font-semibold">Moderators</h1>
    </div>
    
    <div v-if="moderators" class="flex flex-wrap p-3">
      <div v-for="mod in moderators" class="inline-flex items-center bg-black/5 dark:bg-white/10 text-600 text-xs border bdr px-2 py-1 rounded-full mr-3 mb-2">
        <img :src="mod.user.picture" class="w-5 h-5 object-center object-cover rounded-full border bdr mr-2" />
        <span>{{ mod.user.username }}</span>
        
        <button @click.prevent="delMod(mod.id)" class="text-lg ml-2" :disabled="delLoading">
          <PhCircleNotch v-if="delLoading === mod.id" class="animate-spin" />
          <PhXCircle v-else />
        </button>
      </div>
    </div>
    
    <div v-else class="text-bsm xs:text-sm text-sky-500 p-3 font-semibold">Fetching Moderators...</div>
    
  </div>
</template>