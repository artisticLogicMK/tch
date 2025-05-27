<script setup>
import { usePagesStore } from '@/store/pages'
import { PhDotsNine, PhSpinnerGap } from '@phosphor-icons/vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useToast } from '@/components/ui/toast/use-toast'

const props = defineProps(['type', 'threadId', 'postId', 'isUser', 'isModerator', 'mod', 'threadLocked', 'quoteData'])

const { $auth } = useNuxtApp()
const { toast } = useToast()

const route = useRoute()
const params = route.params

const modActs = ref({
  locked: props.mod.locked,
  pinned: props.mod.pinned,
  hidden: props.mod.hidden
})
const act = ref('')

const loading = ref(false)

const links = inject('links')

watch(modActs.value, async (newVal, oldVal) => {
  if (loading.value) return
  loading.value = true
  
  const { data } = await useFetch('/api/forum/mod-set', {
    method: 'POST',
    body: {
      threadId: props.threadId || null,
      postId: props.postId || null,
      data: newVal
    },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
  })
  
  if (data.value.success) {
    if (data.value.result[act.value]) {
      toast({ title: `${props.type} ${act.value}!` })
    } else {
      toast({ title: `${props.type} un${act.value}!` })
    }
  }

  if (!data.value.success) {
    modActs.value = oldVal
  }
  
  loading.value = false
})

const report = async () => {
  const { data } = await useFetch('/api/forum/report', {
    method: 'POST',
    body: {
      threadId: props.threadId || null,
      postId: props.postId || null,
      reporter: $auth.user.username,
      type: props.type,
      link: props.type === "thread" ? links.thread.url : `${links.thread.url}?post=${props.postId}`,
      message: "Bad or inapproprite content."
    },
    headers: {
      Authorization: `Bearer ${$auth.token}`
    },
  })
  
  if (data.value.success) {
    toast({ title: `${props.type} reported!` })
  }
}


const pagesStore = usePagesStore()

const clearCache = () => {
  let slug
  if (props.type === 'thread') slug = params.forum
  if (props.type === 'thread' && params.thread) slug = params.thread
  if (props.type === 'post') slug = params.thread
  
  const key = `${slug}-${route.query.page || 1}`
  props.type === 'thread' && !params.thread ? pagesStore.removeForumPage(key) : pagesStore.removeThreadPage(key)
}

const setQuote = () => {
  sessionStorage.quoteData = JSON.stringify(props.quoteData)
  clearCache()
  navigateTo(`${links.thread.url}/create-post?quote=${props.postId}`)
}
</script>

<template>
  
    <Popover>
      <PopoverTrigger>
        <button class="hover:bg-surface text-600 text-xl border border-transparent rounded-md hover:bdr">
          <PhDotsNine weight="bold" />
        </button>
      </PopoverTrigger>
      
      <PopoverContent class="p-2">
        <div class="usetab perms">
        <template v-if="((props.isUser && !props.mod.locked) || props.isModerator) && props.type === 'thread'">
          <NuxtLink @click="clearCache" :to="`${links.forum.url}/create-thread/?thread=${props.threadId}`">Edit</NuxtLink>
        </template>
        
        <button v-if="false && props.type === 'thread'">Follow</button>
        
        <NuxtLink @click="clearCache" v-if="((props.isUser && !props.mod.locked && !threadLocked) || props.isModerator) && props.type === 'post'" :to="`${links.thread.url}/create-post/?post=${props.postId}`">Edit</NuxtLink>
        
        <button v-if="((!threadLocked && !props.mod.locked) || props.isModerator) && props.type === 'post'" @click="setQuote">Quote</button>
        
        <button v-if="!isUser" @click="report">This is bad</button>
  
        
        <template v-if="props.isModerator">
          <div class="border-b bdr"></div>
          
          <div class="flex items-center text-sm font-semibold text-slate-500 mt-2 mb-1">
            <PhSpinnerGap v-if="loading" weight="bold" class="text-base animate-spin mr-1" /> Moderator
          </div>
          
          <button @click="modActs.pinned = !modActs.pinned; act = 'pinned'">
            {{ modActs.pinned ? 'Unpin' : 'Pin' }}
          </button>
          
          <button @click="modActs.locked = !modActs.locked; act = 'locked'">
            {{ modActs.locked ? 'Unlock' : 'Lock' }}
          </button>
          
          <button @click="modActs.hidden = !modActs.hidden; act = 'hidden'">
            {{ modActs.hidden ? 'Unhide' : 'Hide' }}
          </button>
        </template>
        
        </div>
      </PopoverContent>
      
    </Popover>

</template>