<script setup>
useHead({
  title: "Login - DreamsTorchlight Forum",
})

import { useAuthStore } from '~/store/auth'

import * as yup from 'yup'
import { useToast } from '~/components/ui/toast/use-toast'
import { loginValidationSchema } from '~/lib/validationSchemas'
import BigInput from '~/components/ui/BigInput.vue'
import Checkbox from '~/components/ui/checkbox/Checkbox.vue'
import Button from '~/components/ui/button/Button.vue'
import GoogleAuthBtn from '~/components/GoogleAuthBtn.vue'
import { PhLock, PhEnvelopeSimple, PhEye, PhEyeSlash } from '@phosphor-icons/vue'

definePageMeta({
  layout: "auth-layout",
  middleware: "not-auth"
})

const auth = useAuthStore()

const { toast } = useToast()

const form = ref({
  email: '',
  password: '',
  remember: true,
  loading: false
})

const errorsObj = {
  email: '', password: ''
}
const errors = ref(errorsObj)

const passField = ref(false)

// Function to validate form
const validateForm = async () => {
  try {
    await loginValidationSchema.validate(form.value, { abortEarly: false })
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

// Submit thread handler
const submitLogin = async (googleData) => {
  if (form.value.loading) return
  errors.value = errorsObj

  let formData
  if (googleData !== 1) {
    formData = { ...form.value, email: googleData.email, picture: googleData.picture, googleAuth: true }
  } else {
    formData = form.value
  }
  
  form.value.loading = true
  const isValid = googleData !== 1 ? true : await validateForm()
  
  if (isValid) {
    const { data } = await useFetch('/api/auth/login', {
      method: 'POST',
      body: formData,
    })
  
    if (data.value.success) {
      if (data.value.suspended) {
        toast({ title: `You have been suspended till ${data.value.suspended.split('T')[0]}!`, variant: 'destructive' })
        form.value.loading = false
        return
      }
      
      if (data.value.banned) {
        toast({ title: 'You have been banned!', variant: 'destructive' })
        form.value.loading = false
        return
      }
      
      auth.setToken(data.value.token) // Store in Pinia
      auth.setUserState(data.value.user)
      
      form.value.loading = false // Stop loading
      form.value = {email: '',password: ''}
      
      toast({ title: 'Login Successful!' })
      
      // Navigate to homepage
      navigateTo('/')
    } else {
      form.value.loading = false
      toast({
        title: `Login Failed! ${data.value.message || 'There was a problem'}`,
        variant: 'destructive'
      })
    }
  } else {
    toast({
      title: 'You have errors in your form!',
      variant: 'destructive'
    })
  }
}

const goRecover = () => {
  if (form.value.email) {
    navigateTo(`/forgot-password?email=${form.value.email}`)
  } else {
    alert("Fill in your email!")
  }
}



  // Define the global function for handling Google auth response
if (process.client) {
  window.loginHandler = (response) => {
    fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + response.credential)
    .then(response => response.json())
    .then(data => {
      submitLogin(data)
    })
    .catch(error => console.error("Verification failed"))
    }
}
</script>

<template>
  
    <form @submit.prevent="submitLogin(1)">

      <h1 class="text-lg xs:text-xl font-semibold text-sky-500">Welcome Back!</h1>
      <p class="text-bsm xs:text-sm text-slate-500 dark:text-slate-400 mb-5">To stay connected with us please login to your account.</p>
      
      <GoogleAuthBtn handler="loginHandler" class="mb-4" />
      
      <div class="flex items-center mb-3 px-8">
        <div class="authsep"></div><span class="mx-4 text-xs font-semibold text-slate-500">OR</span><div class="authsep"></div>
      </div>
    
      <div class="mb-4">
        <div v-if="errors.email" class="form-errs">{{ errors.email }}</div>
        <BigInput v-model="form.email" placeholder="Email" required>
          <template #icon1>
            <PhEnvelopeSimple />
          </template>
        </BigInput>
      </div>
      
      <div class="mb-4">
        <div v-if="errors.password" class="form-errs">{{ errors.password }}</div>
        <BigInput v-model="form.password" placeholder="Password" :type="passField ? 'text' : 'password'" required>
          <template #icon1>
            <PhLock />
          </template>
          
          <template #icon2>
            <button @click.prevent="passField = !passField">
              <PhEye :class="{'hidden': passField}" />
              <PhEyeSlash :class="{'hidden': !passField}" />
            </button>
          </template>
        </BigInput>
      </div>
      
      <div class="flex items justify-between mb-4">
        <div class="flex items-center">
          <Checkbox v-model:checked="form.remember" value="true" id="rem" class="mr-2" />
          <label
            for="rem"
            class="text-xs text-slate-500 dark:text-slate-300"
          >
            Remember me
          </label>
        </div>
        
        <button @click.prevent="goRecover" class="text-sky-500 text-bsm">Forgot Password?</button>
      </div>
      
      <div class="flex justify-center mb-5">
        <Button type="submit" :loading="form.loading">Login</Button>
      </div>
      
      <p class="text-bsm xs:text-sm text-600 text-center mb-4">Don't have an account? <NuxtLink to="/signup" class="text-sky-500">Signup</NuxtLink></p>
    
    </form>

</template>