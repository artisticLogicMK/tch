<script setup>
useHead({
  title: "Recover Password - DreamsTorchlight Forum",
})

definePageMeta({
  layout: "auth-layout",
  middleware: "not-auth"
})

const route = useRoute()
const email = route.query.email

const notfound = ref(false)
const newpass = ref(null)

const { data } = await useAsyncData('recover-pass', () => $fetch(`/api/auth/recover-pass?email=${email}`))
const secret = data.value.secret ? data.value.secret : null

if (!data.value.success) {
  notfound.value = data.value.message
}

import Button from '~/components/ui/button/Button.vue'
import { decrypt } from '~/utils/crypto'

const answer = ref(null)
const loading = ref(false)

const recover = async () => {
  loading.value = true
  
  if (answer.value.toLowerCase() === decrypt(secret.answer).toLowerCase()) {
    const { data } = await useFetch('/api/auth/get-password', {
      method: 'POST',
      body: { email },
    })
    newpass.value = data.value.password
  }
  
  else {
    alert("Wrong answer!")
  }
  
  loading.value = false
}

const questions = {
  first_pet: "What was the name of your first pet?",
  birth_city: "In what city were you born?",
  elementary_school: "What was the name of your elementary school?",
  mother_maiden: "What is your mother’s maiden name?",
  childhood_nickname: "What was your childhood nickname?",
  first_car: "What was the make of your first car?",
  favorite_teacher: "Who was your favorite teacher in school?",
  first_friend: "What was the first name of your first best friend?",
  street_grew_up: "What street did you grow up on?",
  parents_meet_town: "What is the name of the town where your parents met?"
};
</script>

<template>
  
    <form v-if="secret" @submit.prevent="recover">

      <h1 class="text-lg xs:text-xl font-semibold text-sky-500">Rocover your Password.</h1>
      <p class="text-bsm xs:text-sm text-slate-500 dark:text-slate-400 mb-5">Answer your security question to recover your password.</p>
      
      <p class="text-sm font-semibold text-slate-600 dark:text-slate-200 mb-5">{{ questions[secret.question] }}</p>
      
      <div class="mb-5">
        <p class="label">
          Answer <span class="text-red-500">*</span>
        </p>
        <input
          v-model="answer" class="input"
          type="text" placeholder="..." required />
      </div>


      <div class="flex justify-center mb-5">
        <Button type="submit" :loading="loading">Recover</Button>
      </div>
      
      <div v-if="newpass" class="mb-5">
        <p class="label">
          <span class="text-red-500">Your new password</span>
        </p>
        <input
          class="input" :value="newpass"
          type="text" placeholder="..." />
      </div>
      
      <p class="text-bsm xs:text-sm text-600 text-center mb-4"><NuxtLink to="/login" class="text-sky-500">Back to login</NuxtLink></p>
      
    </form>


    <div v-if="notfound" class="no-item text-center">
      {{ notfound }}
    </div>

</template>