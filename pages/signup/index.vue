<script setup>
useHead({
  title: "SignUp - DreamsTorchlight Forums",
})

import * as yup from 'yup'
import { useToast } from '~/components/ui/toast/use-toast'
import { signupValidationSchema } from '~/lib/validationSchemas'
import Checkbox from '~/components/ui/checkbox/Checkbox.vue'
import Button from '~/components/ui/button/Button.vue'
import BigInput from '~/components/ui/BigInput.vue'
import GoogleAuthBtn from '~/components/GoogleAuthBtn.vue'
import { PhLock, PhEnvelopeSimple, PhEye, PhEyeSlash } from '@phosphor-icons/vue'

definePageMeta({
  layout: "auth-layout",
  middleware: "not-auth"
})

const { toast } = useToast()

const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
  terms: true,
  loading: false
})

const errorsObj = {
  email: '', password: '', confirmPassword: '', terms: ''
}
const errors = ref(errorsObj)

const passFields = ref({
  pass: false,
  confirm: false
})

// Function to validate form
const validateForm = async () => {
  try {
    await signupValidationSchema.validate(form.value, { abortEarly: false })
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
const submitSignup = async (googleData) => {
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
    const { data } = await useFetch('/api/auth/signup', {
      method: 'POST',
      body: formData,
    })
  
    if (data.value.success) {
      form.value.loading = false // Stop loading
      
      toast({ title: 'Signed Up Successfully!' })
      
      form.value = {email: '',password: '',confirmPassword: ''}
    
      // Navigate to homepage
      navigateTo('/set-profile')
    } else {
      form.value.loading = false
      toast({
        title: `Signup Failed! ${data.value.message || 'There was a problem'}`,
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

const showTerms = ref(false)

onMounted(() => {
  if (sessionStorage.getItem("signupTerms") === null) {
    showTerms.value = true
    sessionStorage.signupTerms = '1'
  }
})

onMounted(() => {
  // Define the global function for handling Google auth response
if (process.client) {
  window.signupHandler = (response) => {
    fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + response.credential)
    .then(response => response.json())
    .then(data => {
      submitSignup(data)
    })
    .catch(error => console.error("Verification failed"))
    }
}
})
</script>


<template>
  <form @submit.prevent="submitSignup(1)">

    <h1 class="text-lg xs:text-xl font-semibold text-sky-500">Hello, friend!</h1>
    <p class="text-bsm xs:text-sm text-slate-500 dark:text-slate-400 mb-5">Create an account to join our community.</p>

    <GoogleAuthBtn handler="signupHandler" class="mb-4" />
    
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
    
    <div class="mb-4">
      <div v-if="errors.terms" class="form-errs">{{ errors.terms }}</div>
      <div class="flex items-center">
        <Checkbox v-model:checked="form.terms" value="true" id="terms" class="mr-2 pointer-events-none" />
        <label
          for="terms"
          class="text-xs text-600"
        >
          Accept 
          <TermsOfUse :open="showTerms">
            <p class="text-sky-600 hover:underline">Terms of Use</p>
          </TermsOfUse>
        </label>
      </div>
    </div>
    
    <div class="flex justify-center mb-5">
      <Button type="submit" :loading="form.loading">Submit</Button>
    </div>
    
    <p class="text-bsm xs:text-sm text-600 text-center mb-4">Already have an account? <NuxtLink to="/login" class="text-sky-500">Login</NuxtLink></p>
  
  </form>
</template>