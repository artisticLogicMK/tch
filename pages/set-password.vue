<script setup>
useHead({
  title: "Set Password",
})

useSeoMeta({
  robots: 'noindex, nofollow'
})

import { useAuthStore } from '~/store/auth'
import * as yup from 'yup'
import { useToast } from '@/components/ui/toast/use-toast'
import { setPassValidationSchema } from '@/lib/validationSchemas'

import BigInput from '@/components/ui/BigInput.vue'
import Button from '@/components/ui/button/Button.vue'
import { PhLock, PhEye, PhEyeSlash } from '@phosphor-icons/vue'

definePageMeta({
  layout: "auth-layout",
  middleware: ["auth", "set-password"]
})

const auth = useAuthStore()

const { toast } = useToast()

const form = ref({
  password: '',
  confirmPassword: '',
  loading: false
})

const errorsObj = {
  password: '', confirmPassword: ''
}
const errors = ref(errorsObj)

const passFields = ref({
  pass: false,
  confirm: false
})

// Function to validate form
const validateForm = async () => {
  try {
    await setPassValidationSchema.validate(form.value, { abortEarly: false })
    return true
  } catch (err) {
    // Capture all errors and map them to fields
    errors.value = {}
    err.inner.forEach((error) => {
      errors.value[error.path] = error.message
    })
    return false
  }
}

// Submit pass handler
const submitPass = async () => {
  if (form.value.loading) return
  errors.value = errorsObj
  
  form.value.loading = true
  const isValid = await validateForm()
  
  if (isValid) {
    const { data } = await useFetch('/api/auth/set-password', {
      method: 'POST',
      body: {
        password: form.value.password
      },
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
  
    if (data.value.success) {
      form.value.loading = false // Stop loading
      
      // Update user in state
      auth.setUserState(data.value.user)
    
      toast({ title: 'Set Successfully!!' })
    
      // Navigate to homepage
      navigateTo('/')
    } else {
      form.value.loading = false
      toast({
        title: `Password Setup Failed! ${data.value.message}`,
        variant: 'destructive'
      })
    }
  } else {
    form.value.loading = false
    toast({
      title: 'You have errors in your form!',
      variant: 'destructive'
    })
  }
}

const logout = () => {
  auth.logout()
  navigateTo('/')
}
</script>

<template>
    <form @submit.prevent="submitPass">

      <div class="flex items-center justify-between">
        <h1 class="text-lg xs:text-xl font-semibold text-sky-500">Set a Password!</h1>
        <button @click="logout" class="text-xs text-[#01153e] font-semibold">Log Out</button>
      </div>
      <p class="text-bsm xs:text-sm text-slate-500 dark:text-slate-400 mb-5">Setup a new password to continue on the forum.</p>
      
      <div class="mb-4">
        <div v-if="errors.password" class="form-errs">{{ errors.password }}</div>
        <BigInput v-model="form.password" placeholder="Password" :type="passFields.pass ? 'text' : 'password'" required>
          <template #icon1>
            <PhLock />
          </template>
          
          <template #icon2>
            <button @click.prevent="passFields.pass = !passFields.pass">
              <PhEye :class="{'hidden': passFields.pass}" />
              <PhEyeSlash :class="{'hidden': !passFields.pass}" />
            </button>
          </template>
        </BigInput>
      </div>
      
      <div class="mb-3">
        <div v-if="errors.confirmPassword" class="form-errs">{{ errors.confirmPassword }}</div>
        <BigInput v-model="form.confirmPassword" placeholder="Confirm Password" :type="passFields.confirm ? 'text' : 'password'" required>
          <template #icon1>
            <PhLock />
          </template>
          
          <template #icon2>
            <button @click.prevent="passFields.confirm = !passFields.confirm">
              <PhEye :class="{'hidden': passFields.confirm}" />
              <PhEyeSlash :class="{'hidden': !passFields.confirm}" />
            </button>
          </template>
        </BigInput>
      </div>


      <div class="flex justify-center pb-3">
        <Button type="submit" :loading="form.loading">Countinue</Button>
      </div>
    
    </form>
</template>