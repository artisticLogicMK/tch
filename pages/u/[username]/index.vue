<script setup>
const route = useRoute()
const username = route.params.username
const { $pages } = useNuxtApp()

const user = ref(null)

if (!$pages.profilePages.includes(username)) {
  const { data } = await useAsyncData('profilePage', () =>
    $fetch(`/api/profile/view?user=${username}`),
    { defaultCache: 7200 }
  )
  
  if (data.value.notFound) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found!' })
  }
  
  $pages.setProfilePage(username, data.value.user)
  user.value = $pages.profilePagesData[username]
  useState(`userState-${data.value.user.id}`, () => data.value.user)
} else {
  user.value = $pages.profilePagesData[username]
  useState(`userState-${$pages.profilePagesData[username].id}`, () => $pages.profilePagesData[username])
}

const userProfile = inject('user')
userProfile.value = user.value

useHead(() => ({
  title: `${user.value.username} - DreamsTorchlight Forum`,
  meta: [
    {
      name: 'description',
      content: `See ${user.value.username} profile on DreamsTorchlight Forum. ${user.value?.about ? user.value?.about.slice(0,120) : ''}`
    },
  ],
}))

import ModUserActions from '@/components/mod/ModUserActions.vue'
import Userlevel from '@/components/usi/Userlevel.vue'
import Button from '@/components/ui/button/Button.vue'
import ReportUser from '@/components/user/ReportUser.vue'
import SendMsg from '@/components/user/SendMsg.vue'
import isOnline from '@/lib/isUserOnline'
import { PhShieldCheck, PhDotsNine, PhStar, PhNotePencil, PhChat } from '@phosphor-icons/vue'

definePageMeta({
  layout: "user-profile-layout",
  middleware: ["is-valid-user"]
})

const { $auth, $formatTime, $formatNumber, $formatTimeNoTZ, $formatTimeSimpleNoTZ, $convertTime } = useNuxtApp()

const date = new Date().toISOString()
</script>

<template>

    <div class="p-3 xsm:p-4 border-b bdr md:border-none">
      
      <div class="flex items-center justify-between mb-4">
        <h1 class="font-round text-base xs:text-xl font-bold text-sky-500">Profile Information</h1>
        
        <div v-if="$auth.isAuthenticated" class="flex items-center space-x-2">
          <NuxtLink v-if="$auth.user.id === user.id" :to="`/u/${username}/preferences`" >
            <Button class="h-7 px-1.5 rounded-full"><PhNotePencil /></Button>
          </NuxtLink>
          <ModUserActions v-if="$auth.user.admin" :userId="user.id" >
            <Button class="h-7 px-1.5 rounded-full"><PhDotsNine /></Button>
          </ModUserActions>
        </div>
      </div>
    
      <div class="xsm:flex items-start xsm:space-x-4 mb-8">
        <img :src="user.picture.startsWith('http') || user.picture.startsWith('/assets') ? user.picture : `/api${user.picture}`" class="w-20 h-20 sm:w-24 sm:h-24 object-cover object-center border bdr rounded-full" :alt="username" />
        
        <div class="mt-2 xsm:mt-0">
          <div class="flex items-center mb-3">
            <h1 class="text-slate-500 dark:text-slate-300 text-base xs:text-lg font-semibold">{{ username }}</h1>
            <Button v-if="user.moderating.length || user.admin" variant="outline" class="text-sky-500 border-sky-500 dark:text-sky-500 dark:border-sky-500 text-xs p-0 px-2 h-7 rounded-full ml-3">
              <PhShieldCheck weight="fill" class="text-base -mt-0.5" /> Mod
            </Button>

            <SendMsg v-if="$auth.isAuthenticated && $auth.user.id !== user.id && user.preferences?.allowMessage" :user="{ id: user.id, username: user.username }" />
          </div>
          
          <div class="flex space-x-3">
            <Button v-if="false" class="h-7 rounded-full">Follow</Button>
            
            <NuxtLink v-if="user.preferences?.allowWhatsapp" :to="`https://wa.me/${user.whatsapp}?text=Hello%20there!%20Reaching%20you%20from%20DreamsTorchlight%20Forum.`">
              <Button class="bg-green-500 hover:bg-green-600 h-7 rounded-full">WhatsApp</Button>
            </NuxtLink>
            
            <ReportUser v-if="$auth.isAuthenticated && $auth.user.id !== user.id && user.preferences?.allowMessage" :user="{ id: user.id, username: user.username }" class="mb-3">
              <Button variant="outline" class="h-7 rounded-full">Report</Button>
            </ReportUser>
          </div>
          
          <p class="text-bsm xs:text-sm text-600 mt-3">
            {{ user.about }}
          </p>
        </div>
      </div>
      
      
      <div v-if="user.suspended > date || user.banned" class="mb-4">
        <Button v-if="user.suspended > date" class="bg-orange-500 hover:bg-orange-500 mr-3">User Suspended</Button>
        <Button v-if="user.banned" variant="destructive">User Banned</Button>
      </div>
   
      
      <div v-if="$auth.isAuthenticated && user.moderating.length" class="w-full text-bsm xs:text-sm mb-4">
        <div class="text-slate-600 dark:text-slate-200 mb-1">{{ user.username }} is moderating the forums:</div> 
        <NuxtLink v-for="mod in user.moderating" :key="mod.id" :to="`/forum/${mod.forum.category.slug}/${mod.forum.slug}`" class="text-sky-500 hover:text-sky-500/80 whitespace-pre-wrap">{{ mod.forum.name }}, </NuxtLink>
      </div>
      
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-bsm xs:text-sm">
        
        <div v-if="user.preferences?.seeOnline" class="info-itm">
          <span>Online Status</span> {{ isOnline(user.lastActivity) ? 'Online' : 'Offline' }}
        </div>
        
        <div v-if="user.preferences?.seeEmail" class="info-itm">
          <span>Email</span> {{ user.email }}
        </div>
        
        <div v-if="user.country" class="info-itm">
          <span>Country</span> 
          {{ user.country.name }} <img :src="`https://flagcdn.com/32x24/${user.country.code}.png`" class="flag">
        </div>
        <div v-else class="info-itm"><span>Country</span> Not Specified</div>
        
        <div class="info-itm capitalize">
          <span>Gender</span> {{ user.gender ? user.gender : 'Not Specified' }}
        </div>
        
        <div class="info-itm flex items-center">
          <span>Membership</span> 
          <Userlevel :userCount="user._count" />
        </div>
        
        <div v-if="user.preferences?.seeDob"  class="info-itm">
          <span>Date of Birth</span> {{ $formatTimeSimpleNoTZ(user.dob) }}
        </div>
        
        <div class="info-itm">
          <span>Joined Date</span> {{ $formatTimeNoTZ(user.createdAt) }}
        </div>
        
        <div v-if="false" class="info-itm">
          <span>Followers</span> 10
        </div>
        
        <div v-if="false" class="info-itm">
          <span>Followings</span> 23
        </div>
        
        <div class="info-itm">
          <span>Total No of Threads</span> {{ $formatNumber(user._count.threads) }}
        </div>
        
        <div class="info-itm">
          <span>Total No of Posts</span> {{ $formatNumber(user._count.posts) }}
        </div>
        
        <div class="info-itm">
          <span>Total No of Views</span> {{ $formatNumber(user._count.views) }}
        </div>
        
        <div class="info-itm">
          <span>Last Logged in</span> {{ $formatTimeNoTZ(user.lastLoggedIn * 1000) }}
        </div>
        
        <div class="info-itm">
          <span>Time Spent Online</span> {{ $convertTime(user.timeSpentOnline) }}
        </div>
        
      </div>
      
      
    </div>

</template>

<style>
.info-itm {
  @apply text-slate-600 dark:text-slate-300
}
.info-itm span {
  @apply font-semibold mr-2
}
</style>