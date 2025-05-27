<script setup>
import { initTheme } from "~/utils/theme"
import Toaster from '~/components/ui/toast/Toaster.vue'
import WelcomeScreen from '~/components/WelcomeScreen.vue'
import NewMessage from '~/components/NewMessage.vue'
import isMobile from '~/lib/isMobile'

useSeoMeta({
  ogImage: "https://dreamstorchlight.org/assets/social.jpg",
  twitterCard: "summary_large_image",
})

const { $auth } = useNuxtApp()

const showSplash = ref(false)

if (process.client) {
  initTheme()
  
  if (localStorage.getItem("splash") === null) {
    showSplash.value = true
    localStorage.splash = '1'
  }
  
 // So the scrollbar can be styled to be of less width in mobile devices 
  if (isMobile) document.body.classList.add('mobile')
}

const getFingerprint = async () => {
  try {
    if (localStorage.getItem('fingerprint')) {
      return localStorage.getItem('fingerprint')
    } else {
      const FingerprintJS = await import('@fingerprintjs/fingerprintjs')
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      const fingerprint = result.visitorId
      localStorage.setItem('fingerprint', fingerprint)
      
      return fingerprint
    }
  } catch (err) {
    console.log(err)
  }
}

const setVisit = async (fingerprint) => {
  if ($auth.isAuthenticated) return
  
  if (!sessionStorage.getItem('visitor')) {
    const { data } = await useFetch('/api/visitor', {
      method: 'POST',
      body: { fingerprint },
      once: true,
      async onResponse({ data }) {
        sessionStorage.setItem('visitor', fingerprint)
      }
    })
  }
}

const msgAlert = useState('msgAlert', () => null)
const notifyAlert = useState('notifyAlert', () => null)

onMounted(async () => {
  
  const fingerprint = await getFingerprint()
  
  setVisit(fingerprint)
  
  if ($auth.isAuthenticated) {
    setInterval(async () => {
      
      const { data } = await useFetch('/api/chat/checkChats', {
        method: 'POST',
        body: { lastSeen: localStorage.lastMessageSeen, userId: $auth.user.id },
        headers: { Authorization: `Bearer ${$auth.token}` }
      })
      
      if (data.value?.newMsg) {
        if (sessionStorage.getItem('popupNo') === null) msgAlert.value = data.value.newMsg
        notifyAlert.value = true
      }
    }, 30 * 1000)
  }
  
  if (!$auth.isAuthenticated) $auth.logout()
})

onMounted(() => {
  if (process.client) {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onLoad = function () {
      window.Tawk_API.hide(); // hides the default widget button
    };
  }
});
</script>

<template>
    <NuxtLoadingIndicator color="#0ea5e9" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <Toaster />
    <WelcomeScreen v-if="showSplash" @close="showSplash=false" />
    
    <NewMessage :count="msgAlert" />

</template>
