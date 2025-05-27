<script setup>
import { ref, watchEffect } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'

const props = defineProps(['open'])

const isPopoverOpen = ref(false)

const iAgree = () => {
  isPopoverOpen.value = false
}

watchEffect(() => {
  if (props.open) isPopoverOpen.value = true
})
</script>

<template>
  <Dialog :open="isPopoverOpen" @update:open="isPopoverOpen = $event">
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    
    <DialogContent class="flex flex-col max-h-full p-0" :hideClose="true">

      <DialogHeader>
        <DialogTitle class="capitalize p-3 pb-0">
          Terms of Use
        </DialogTitle>
      </DialogHeader>
      
      <div class="terms text-slate-700 dark:text-slate-200 grow overflow-y-auto p-3 xs:p-4 pb-10 pt-0">
        <p>Welcome to our community! Before you participate, please take a moment to review our guidelines.</p>
  
        <h1>1. Respect and Responsibility</h1>
        <p>
          This is a space for open discussions, but we expect all members to be respectful. You agree not to post anything:
          <br><br>
          False, misleading, or inaccurate
          <br><br>
          Abusive, hateful, harassing, or threatening
          <br><br>
          Sexually explicit or inappropriate
          <br><br>
          Invasive of someone's privacy
          <br><br>
          Illegal or in violation of any laws
          <br><br>
          While we strive to maintain a positive environment, we cannot monitor every post. The opinions shared belong to the users and do not necessarily reflect our views.
        </p>


        <h1>2. Account and Content Management</h1>
        <p>
        Your account may be suspended or banned if you violate these terms.
        <br><br>
        We reserve the right to edit, remove, or lock any content as needed.
        <br><br>
        Your IP address is recorded for security purposes.
        </p>
        
        
        <h1>3. Privacy and Data</h1>
        <p>
        Any information you share is stored in our database.
        <br><br>
        We will not share your data with third parties without your consent.
        <br><br>
        While we take security seriously, we cannot guarantee protection from hacking attempts.
        <br><br>
        By using this forum, you agree to these terms. If you have any questions, feel free to reach out to the administrators. Enjoy your stay!
        </p>
        
        <div class="flex justify-center mt-4">
          <Button @click="iAgree" class="max-w-fit text-base">
            I agree to these terms!
          </Button>
        </div>

      </div>

    </DialogContent>
  </Dialog>
</template>

<style>
.terms h1 {
  @apply text-base xs:text-lg font-semibold mb-2 mt-5
}
.terms p {
  @apply text-sm leading-tight
}
</style>