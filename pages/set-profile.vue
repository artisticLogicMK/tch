<script setup>
definePageMeta({
  layout: "auth-layout",
  middleware: ["auth", "set-profile"]
})

useHead({
  title: "Set Profile",
})

useSeoMeta({
  robots: 'noindex, nofollow'
})

import { useAuthStore } from '~/store/auth'
import * as yup from 'yup'
import { useToast } from '@/components/ui/toast/use-toast'
import { setProfileValidationSchema } from '@/lib/validationSchemas'
import countries from '@/lib/countries'

import { Input } from '@/components/ui/input'
import Checkbox from '@/components/ui/checkbox/Checkbox.vue'
import Button from '@/components/ui/button/Button.vue'

const token = import.meta.env.VITE_IPINFO_TOKEN || "0efcfe40be5649"

// Fetch user country for a great user experience
const { data } = await useAsyncData('fetch-country', () => $fetch(`https://ipinfo.io?token=${token}`))
const code = data.value.country.toLowerCase()

const auth = useAuthStore()

const { toast } = useToast()

const form = ref({
  username: auth.user.username || '',
  country: auth.user.country || null,
  dob: auth.user.dob ? auth.user.dob.split('T')[0] : null,
  preferences: {
    ...auth.user?.preferences, seeDob: auth.user?.preferences.seeDob || false
  },
  gender: auth.user.gender || null,
  secret: auth.user.secret || {}
})

form.value.country = countries[code] ? { name: countries[code], code } : null

const loading = ref(false)

const errorsObj = {
  username: '', country: '', gender: '', secret: '', answer: ''
}
const errors = ref(errorsObj)

// Function to validate form
const validateForm = async () => {
  try {
    await setProfileValidationSchema.validate({ ...form.value, secret: form.value.secret.question, answer: form.value.secret.answer }, { abortEarly: false })
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
const submitProfile = async () => {
  if (loading.value) return
  errors.value = errorsObj
  
  loading.value = true
  const isValid = await validateForm()
  
  if (isValid) {
    const { data } = await useFetch('/api/auth/set-profile', {
      method: 'POST',
      body: {
        data: {
          ...form.value,
          dob: new Date(form.value.dob),
          editing: auth.user.username ? true : false
        }
      },
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
  
    if (data.value.success) {
      loading.value = false // Stop loading
      
      // Update user in state
      auth.setUserState(data.value.user)
      
      toast({ title: 'Info Set Successfully!' })
    
      // Navigate to homepage
      navigateTo('/')
    } else {
      loading.value = false
      toast({
        title: `Info Setup Failed! ${data.value.message}`,
        variant: 'destructive'
      })
    }
  } else {
    loading.value = false
    toast({
      title: 'You have errors in your form!',
      variant: 'destructive'
    })
  }
}
</script>

<template>

    <form @submit.prevent="submitProfile">

      <h1 class="text-lg xs:text-xl font-semibold text-sky-500">Set Basic Info!</h1>
      <p class="text-bsm xs:text-sm text-slate-500 dark:text-slate-400 mb-5">The fields marked with (<span class="text-red-500">*</span>) are required.</p>
      
      
      <div v-if="auth.user.oldUser || !auth.user.username" class="mb-5">
        <p class="label">
          Username <span class="text-red-500">*</span>
        </p>
        <div v-if="errors.username" class="form-errs">{{ errors?.username }}</div>
        <Input
          v-model="form.username"
          type="text" placeholder="..." required />
      </div>

      
      <div v-if="!auth.user.country" class="mb-5">
        <p class="label">
          Country <span class="text-red-500">*</span>
          <img v-if="form.country"
  :src="'https://flagcdn.com/32x24/'+form.country?.code+'.png'" class="ml-1 w-[1.2em] -mt-[2px] inline-block">
        </p>
        <div v-if="errors.country" class="form-errs">{{ errors?.country }}</div>
        
        <select v-model="form.country" class="input" required>
          <option :value="null">Select Country</option>
          <option v-for="(name, code) in countries" :key="code" :value="{name:name,code:code}">{{name}}</option>
        </select>
      </div>
      
      
      <div v-if="!auth.user.gender" class="mb-5">
        <p class="label">
          Gender <span class="text-red-500">*</span>
        </p>
        <div v-if="errors.gender" class="form-errs">{{ errors?.gender }}</div>
        
        <select v-model="form.gender" class="input" required>
          <option :value="null">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div v-if="!auth.user.dob" class="mb-5">
        <p class="label">Date of Birth</p>
        <input type="date" v-model="form.dob" class="input mb-2" />
        <div class="checkdivs">
          <Checkbox v-model:checked="form.preferences.seeDob" :value="false" id="dob" class="mr-2" />
          <label for="dob" class="text-bsm xs:text-sm text-slate-500 dark:text-slate-300">
            Allow others to see your date of birth?
          </label>
        </div>
      </div>
      
      
      <div v-if="!auth.user.secret" class="mb-5">
        <p class="label">
          Security Question <span class="text-red-500">*</span>
        </p>
        <p class="text-slate-500 text-bsm xs:text-sm mb-2">"Choose a security question and set an answer. This will help you recover your password if you ever forget it.</p>
        <div v-if="errors.secret" class="form-errs">{{ errors?.secret }}</div>
        
        <select v-model="form.secret.question" class="input" required>
          <option value="">-- select a question --</option>
          <option value="first_pet">What was the name of your first pet?</option>
          <option value="birth_city">In what city were you born?</option>
          <option value="elementary_school">What was the name of your elementary school?</option>
          <option value="mother_maiden">What is your mother’s maiden name?</option>
          <option value="childhood_nickname">What was your childhood nickname?</option>
          <option value="first_car">What was the make of your first car?</option>
          <option value="favorite_teacher">Who was your favorite teacher in school?</option>
          <option value="first_friend">What was the first name of your first best friend?</option>
          <option value="street_grew_up">What street did you grow up on?</option>
          <option value="parents_meet_town">What is the name of the town where your parents met?</option>
        </select>
      </div>
      
      
      <div v-if="!auth.user.secret" class="mb-5">
        <p class="label">
          Answer to Question<span class="text-red-500">*</span>
        </p>
        <div v-if="errors.answer" class="form-errs">{{ errors?.answer }}</div>
        <Input
          v-model="form.secret.answer"
          type="text" placeholder="..." required />
      </div>

      
      <div class="flex justify-center pb-3">
        <Button type="submit" :loading="loading">Continue</Button>
      </div>
    
    </form>

</template>