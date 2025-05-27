<script setup>
import { useAuthStore } from '~/store/auth'
import * as yup from 'yup'
import { useToast } from '@/components/ui/toast/use-toast'
import { setPassValidationSchema } from '@/lib/validationSchemas'

import BigInput from '@/components/ui/BigInput.vue'
import Button from '@/components/ui/button/Button.vue'
import { PhLock, PhEye, PhEyeSlash } from '@phosphor-icons/vue'

const auth = useAuthStore()

const form = ref({
  password: '',
  confirmPassword: '',
  loading: false
})

const currentPassword = ref(null)

const errorsObj = { password: '', confirmPassword: '' }
const errors = ref(errorsObj)

const passFields = ref({
  pass: false,
  confirm: false,
  cpass: false
})

const { toast } = useToast()

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
    const { data } = await useFetch('/api/user/change-password', {
      method: 'POST',
      body: {
        password: currentPassword.value,
        newPassword: form.value.password,
      },
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
  
    if (data.value.success) {
      form.value = {password: '', confirmPassword: '', loading: false}
      currentPassword.value = null
      passFields.value = {pass: false,confirm: false,cpass: false}
      
      // Update user in cookie and state
      auth.setUserState(data.value.user)
      
      toast({ title: 'Password Changed!' })
    } else {
      form.value.loading = false
      toast({
        title: `Failed! ${data.value.message}`,
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
</script>

<template>
  <form id="password" @submit.prevent="submitPass" class="mt-10 p-4 xsm:p-6 w-full max-w-lg">

    <h1 class="font-round text-base xs:text-xl font-bold text-sky-500 mb-2">Change Password</h1>
    <p v-if="auth.user.googleAuth" class="text-bsm xs:text-sm text-slate-500 dark:text-slate-400 mb-5">
      <NuxtLink to="/set-password" class="text-pri-600">Set up a password here </NuxtLink>
      for Google authenticated members.
    </p>
    
    <div class="mb-4">
      <div v-if="passerror" class="form-errs">{{ passerror }}</div>
      <BigInput v-model="currentPassword" placeholder="Current Password" :type="passFields.cpass ? 'text' : 'password'">
        <template #icon1>
          <PhLock />
        </template>
        
        <template #icon2>
          <button @click.prevent="passFields.cpass = !passFields.cpass">
            <PhEye :class="{'hidden': passFields.cpass}" />
            <PhEyeSlash :class="{'hidden': !passFields.cpass}" />
          </button>
        </template>
      </BigInput>
    </div>
    
    <div class="mb-4">
      <div v-if="errors.password" class="form-errs">{{ errors.password }}</div>
      <BigInput v-model="form.password" placeholder="New Password" :type="passFields.pass ? 'text' : 'password'">
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
    
    <div class="mb-5">
      <div v-if="errors.confirmPassword" class="form-errs">{{ errors.confirmPassword }}</div>
      <BigInput v-model="form.confirmPassword" placeholder="Confirm Password" :type="passFields.confirm ? 'text' : 'password'">
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


    <div class="flex justify-start pb-3">
      <Button type="submit" :loading="form.loading">Change</Button>
    </div>
  
  </form>
</template>