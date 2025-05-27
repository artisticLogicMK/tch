<script setup>
import { useAuthStore } from '~/store/auth'
import * as yup from 'yup'
import { useToast } from '@/components/ui/toast/use-toast'
import { setProfileUpdValidationSchema } from '~/lib/validationSchemas'
import countries from '~/lib/countries'

import { Input } from '@/components/ui/input'
import Checkbox from '@/components/ui/checkbox/Checkbox.vue'
import Button from '@/components/ui/button/Button.vue'

const auth = useAuthStore()

const form = ref({
  username: '',
  country: null,
  dob: null,
  about: null,
  gender: null,
  whatsapp: null,
  preferences: {
    allowMessage: true,
    seeMyThreads: true,
    seeWhoFollowMe: true,
    seeWhoIfollow: true,
    allowFollow: true,
    hideMeFromFollowers: false,
    seeFollowedForums: true,
    seeDob: false,
    seeEmail: false,
    seeOnline: true,
    allowWhatsapp: false
  }
})
const emailVal = ref(null)

const { toast } = useToast()

const errorsObj = {
  username: '', country: '', gender: '', about: '',
}
const errors = ref(errorsObj)

const loading = ref(false)
const picLoading = ref(false)
const rmLoading = ref(false)
const picError = ref(null)

const { handleFileInput, files } = useFileStorage()

// Function to validate form
const validateForm = async () => {
  try {
    await setProfileUpdValidationSchema.validate(form.value, { abortEarly: false })
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

// Submit handler
const submitProfile = async () => {
  if (loading.value) return
  errors.value = errorsObj
  
  loading.value = true
  const isValid = await validateForm()
  
  if (isValid) {
    const { data } = await useFetch('/api/user/update-profile', {
      method: 'POST',
      body: {
        data: { ...form.value, dob: new Date(form.value.dob) }
      },
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
  
    if (data.value.success) {
      loading.value = false // Stop loading
      
      const username = auth.user.username
      
      // Update user in state
      auth.setUserState(data.value.user)
      
      toast({ title: 'Profile Updated!' })
      
      // Redirect route to reflect change of username
      if (username !== data.value.user.username) {
        navigateTo(`/u/${data.value.user.username}/preferences`, { replace: true })
      }
    } else {
      loading.value = false
      toast({
        title: `Update Failed! ${data.value.message}`,
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


const uploadImage = async (event) => {
  if (picLoading.value) return
  
  picError.value = false
  picLoading.value = true
  
  const file = event.target.files[0]
  if (!file) {
    picLoading.value = false
    return
  }

  // Check file type (PNG, JPG, or WEBP)
  const allowedTypes = ["image/png", "image/jpeg", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    picError.value = "Only PNG, JPG, and WEBP images are allowed."
    picLoading.value = false
    return
  }

  // Check file size (should not exceed 1MB)
  const maxSize = 1 * 1024 * 1024 // 1MB in bytes
  if (file.size > maxSize) {
    picError.value = "File size must be less than 1MB."
    picLoading.value = false
    return
  }

  const { data } = await useFetch('/api/user/update-picture', {
    method: 'POST',
    body: {
      files: files.value,
      previous: auth.user.picture.split('/').pop()
    },
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })

  if (data.value.success) {
    
    picLoading.value = false
    
    // Update user in state
    auth.setUserState(data.value.user)
    
    toast({ title: 'Picture Updated!' })
    
  } else {
    picLoading.value = false
    toast({
      title: `Failed! ${data.value.message}`,
      variant: 'destructive'
    })
  }
}


const removePic = async () => {
  if (rmLoading.value) return
  
  picError.value = false
  rmLoading.value = true

  const { data } = await useFetch('/api/user/remove-picture', {
    method: 'POST',
    body: {
      previous: auth.user.picture.split('/').pop()
    },
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })

  if (data.value.success) {
    rmLoading.value = false
    // Update user in state
    auth.setUserState(data.value.user)
    toast({ title: 'Picture Removed!' })
  } else {
    rmLoading.value = false
    toast({
      title: `Failed! ${data.value.message}`,
      variant: 'destructive'
    })
  }
}


const openImageSelect = () => {
  if (process.client) {
    document.getElementById('user-picture').click()
  }
}


onMounted(() => {
  form.value = {
    username: auth.user.username,
    country: auth.user.country,
    dob: auth.user.dob ? auth.user.dob.split('T')[0] : null,
    about: auth.user.about,
    gender: auth.user.gender,
    whatsapp: auth.user.whatsapp,
    preferences: { ...form.value.preferences, ...auth.user.preferences }
  }
  
  emailVal.value = auth.user.email
})
</script>

<template>
  <form v-if="auth.user" id="pinfo" class="p-4 sm:p-6" @submit.prevent="submitProfile">

    <h1 class="font-round text-base xs:text-xl font-bold text-sky-500 mb-4">Update Profile Information</h1>

    <div class="xs:flex items-center xs:space-x-4 mb-5">
      <img
        :src="auth.user?.picture.startsWith('http') || auth.user?.picture.startsWith('/assets') ? auth.user.picture : `/api${auth.user.picture}`"
        format="webp" fit="cover"
        quality="70" placeholder="/assets/pic_placeholder.jpg"
        class="w-24 h-24 object-cover object-center border bdr rounded-full mb-3 xs:mb-0"
        :alt="auth.user.username" />
      <!--<div :class="bg-[url(auth.user.picture)]" class="w-24 h-24 bg-cover bg-center border bdr rounded-full mb-3 xs:mb-0"></div>-->
      
      <div class="flex xs:space-x-4">
        <input
          id="user-picture" type="file"
          accept="image/jpeg, image/png, image/webp"
          @input="handleFileInput"
          @change="uploadImage" class="hidden" />
        <Button @click.prevent="openImageSelect" :loading="picLoading" class="mr-3 xs:m-0">Change</Button>
        <Button
          v-if="auth.user.picture && !auth.user.picture.includes('pic_placeholder')"
          @click.prevent="removePic"
          variant="outline" :loading="rmLoading"
        >Remove</Button>
      </div>
      
      <div v-if="picError" class="form-errs mt-2">{{picError}}</div>
    </div>
    
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
      <div class="prfdiv">
        <p class="label">
          Username <span class="text-red-500">*</span>
        </p>
        <div v-if="errors.username" class="form-errs">{{ errors.username }}</div>
        <Input
          v-model="form.username"
          type="text" placeholder="..." />
      </div>
  
      
      <div class="prfdiv">
        <p class="label">
          Country <span class="text-red-500">*</span>
          <img v-if="form.country"
  :src="'https://flagcdn.com/32x24/'+form.country?.code+'.png'" class="flag">
        </p>
        <div v-if="errors.country" class="form-errs">{{ errors.country }}</div>
        
        <select v-model="form.country" class="input">
          <option :value="null">Select Country</option>
          <option v-for="(name, code) in countries" :key="code" :value="{name:name,code:code}">{{name}}</option>
        </select>
      </div>
      
      
      <div class="prfdiv">
        <p class="label">Email</p>
        <Input
          type="text" v-model="emailVal" placeholder="..." disabled />
        <div class="checkdivs mt-2">
          <Checkbox v-model:checked="form.preferences.seeEmail" :value="false" id="em" class="mr-2" />
          <label for="em">
            Allow others to see your email?
          </label>
        </div>
      </div>
      
      <div class="prfdiv">
        <p class="label">Date of Birth</p>
        <input type="date" v-model="form.dob" class="input mb-2" />
        <div class="checkdivs">
          <Checkbox v-model:checked="form.preferences.seeDob" :value="false" id="dobv" class="mr-2" />
          <label for="dobv">
            Allow others to see your date of birth?
          </label>
        </div>
      </div>
      
      
      <div class="prfdiv">
        <p class="label">
          Gender <span class="text-red-500">*</span>
        </p>
        <div v-if="errors.gender" class="form-errs">{{ errors.gender }}</div>
        
        <select v-model="form.gender" class="input">
          <option :value="null">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      

      <div class="prfdiv">
        <p class="label">WhatsApp Number</p>
        <Input
          v-model="form.whatsapp" :disabled="!form.preferences.allowWhatsapp"
          type="text" placeholder="No spaces e.g +538474837" />
        <div class="checkdivs mt-2">
          <Checkbox v-model:checked="form.preferences.allowWhatsapp" :value="false" id="wh" class="mr-2" />
          <label for="wh">
            Allow others to contact you through WhatsApp?
          </label>
        </div>
      </div>
      
      
      <div class="prfdiv sm:col-span-2">
        <p class="label">About</p>
        <div v-if="errors.about" class="form-errs">{{ errors.about }}</div>
        <textarea v-model="form.about" class="input h-auto" rows="4" placeholder="Tell people about yourself..."></textarea>
      </div>
      
      
      <div class="checkdivs mb-4">
        <Checkbox v-model:checked="form.preferences.allowMessage" id="alm" class="mr-2" />
        <label for="alm">
          Allow others to message you?
        </label>
      </div>
      
    
      <div class="checkdivs mb-4">
        <Checkbox v-model:checked="form.preferences.seeMyThreads" id="tp" class="mr-2" />
        <label for="tp">
          Allow others to see the threads & posts on my profile?
        </label>
      </div>
      
      <div v-if="false" class="checkdivs mb-4">
        <Checkbox v-model:checked="form.preferences.allowFollow" id="alf" class="mr-2" />
        <label for="alf">
          Allow others to follow you?
        </label>
      </div>
      
      <div v-if="false" class="checkdivs mb-4">
        <Checkbox v-model:checked="form.preferences.seeWhoFollowMe" id="smf" class="mr-2" />
        <label for="smf">
          Allow others to see who follow you?
        </label>
      </div>
      
      <div v-if="false" class="checkdivs mb-4">
        <Checkbox v-model:checked="form.preferences.hideMeFromFollowers" id="hmf" class="mr-2" />
        <label for="hmf">
          Hide yourself from the followers list of others?
        </label>
      </div>
      
      <div v-if="false" class="checkdivs mb-4">
        <Checkbox v-model:checked="form.preferences.seeWhoIfollow" id="fl" class="mr-2" />
        <label for="fl">
          Allow others to see who you follow?
        </label>
      </div>
      
      <div v-if="false" class="checkdivs items-start mb-4">
        <Checkbox v-model:checked="form.preferences.seeFollowedForums" id="th" class="mr-2" />
        <label for="th">
          Allow others to see the forums and threads you follow?
        </label>
      </div>
      
      <div class="checkdivs">
        <Checkbox v-model:checked="form.preferences.seeOnline" id="ao" class="mr-2" />
        <label for="ao">
          Allow others to see my online status?
        </label>
      </div>
      
    </div>

    
    <div class="flex justify-center mt-5 pb-3">
      <Button type="submit" :loading="loading">Update Profile</Button>
    </div>
  
  
  </form>
</template>

<style>
.prfdiv {
  @apply mb-3
}
.checkdivs {
  @apply flex items-center
}
.checkdivs label{
  @apply text-[0.8125rem] xs:text-sm text-slate-600 dark:text-slate-300
}
</style>