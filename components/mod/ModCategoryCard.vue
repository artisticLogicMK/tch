<script setup>
import { useAuthStore } from '~/store/auth'
import { useToast } from '@/components/ui/toast/use-toast'
import Button from '@/components/ui/button/Button.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import ModCategoryEdit from '@/components/mod/ModCategoryEdit.vue'
import { PhNotePencil, PhTrash, PhArrowUp, PhArrowDown, PhCircleNotch } from '@phosphor-icons/vue'

const props = defineProps(['category', 'moving'])

const auth = useAuthStore()
const { toast } = useToast()
const delLoading = ref(false)

const { removeCategory } = inject('categoryActions')

const deleteCategory = async () => {
  if (delLoading.value) return

  delLoading.value = true

  const { data } = await useFetch('/api/mod/delete-category', {
    method: 'POST',
    body: {
      catId: props.category.id
    },
    headers: {
      Authorization: `Bearer ${auth.token}`
    },
    server: false
  })

  if (data.value.success) {
    delLoading.value = false // Stop loading
    
    removeCategory(data.value.category.id)
    
    toast({ title: 'Category Deleted' })
  } else {
    delLoading.value = false
    toast({
      title: `Failed! ${data.value.message}`,
      variant: 'destructive'
    })
  }
}
</script>

<template>
  <div class="px-4 py-3 border-b bdr">
    <div class="modthread xsm:flex items-end justify-between mb-2.5">

      <p class="text-sm text-600 font-semibold mb-2.5 xsm:mb-0">{{ props.category.name }}</p>

      
      <div class="flex items-center justify-end xsm:justify-items-start text-600 space-x-3">
        <ModCategoryEdit :edit="props.category">
          <button class="btn">
            <PhNotePencil />
          </button>
        </ModCategoryEdit>
        
        <ConfirmDialog
          title="Are you sure to delete?"
          description="This will permanently delete this category. All of its forums will be uncategorised."
          @accept="deleteCategory">
          <button class="btn" :disabled="delLoading">
            <PhCircleNotch v-if="delLoading" class="animate-spin" />
            <PhTrash v-else />
          </button>
        </ConfirmDialog>
        

        <button
          @click="!props.moving && $emit('moveCategory', {id: props.category.id, direction: 'up'})"
        >
          <PhCircleNotch v-if="props.moving === props.category.id" class="animate-spin" />
          <PhArrowUp v-else />
        </button>
        
        <button
          @click="!props.moving && $emit('moveCategory', {id: props.category.id, direction: 'down'})"
        >
          <PhCircleNotch v-if="props.moving === props.category.id" class="animate-spin" />
          <PhArrowDown v-else />
        </button>

      </div>
    </div>
    
    <p class="text-500 text-bsm xs:text-sm">
      {{ props.category.description.slice(0,150) }}
    </p>
    
  </div>
</template>