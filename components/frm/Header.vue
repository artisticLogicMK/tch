<script setup>
import { useAuthStore } from '~/store/auth'
import { PhMagnifyingGlass, PhBell, PhList, PhChatsCircle } from '@phosphor-icons/vue'
import Button from '@/components/ui/button/Button.vue'
import UserAuth from '@/components/frm/UserAuth.vue'
import Menu from '@/components/frm/Menu.vue'
import ThemeModeBtn from '@/components/frm/ThemeModeBtn.vue'

const auth = useAuthStore()

const [ThemeTemplate, ThemeBtn] = createReusableTemplate()
const [SearchTemplate, SearchBtn] = createReusableTemplate()
const [LoginTemplate, Login] = createReusableTemplate()
const isXsm = useMediaQuery('(min-width: 540px)')

const notifyAlert = useState('notifyAlert')
</script>

<template>
  <ThemeTemplate>
    <ThemeModeBtn />
  </ThemeTemplate>
  
  <SearchTemplate>
    <button @click="navigateTo('/search')" class="head-btn">
      <PhMagnifyingGlass :size="22" />
    </button>
  </SearchTemplate>
  
  <LoginTemplate>
    <NuxtLink to="/login">
      <Button class="shrink-0 rounded-full">
        Login
      </Button>
    </NuxtLink>
  </LoginTemplate>

  
  <header class="border-b bdr bg-flat">

    <nav class="flex w-full max-w-7xl mx-auto items-center justify-between px-3 xs:px-4 sm:px-5 py-2">
      <NuxtLink to="/">
        <img alt="DreamsTorchlight logo" class="h-3 mic2:h-4 xs:h-5 md2:h-6" src="/assets/logo.png" />
      </NuxtLink>
      
      
      <NuxtLink to="/search" v-if="isXsm" location="general">
        <div id="search">
          <PhMagnifyingGlass size="20" class="icons text-slate-400 dark:text-slate-500" />
          <div id="input"><input type="text" placeholder="Search forum..." class="text-500 pointer-events-none" /></div>
        </div>
      </NuxtLink>
      
      
      <div class="flex items-center">
        <div class="nav-btns flex items-center">
          <SearchBtn v-if="!isXsm" />
          <ThemeBtn v-if="isXsm" />
          
          <NuxtLink :to="`/u/${$auth.user.username}/messages`" v-if="auth.isAuthenticated" class="relative">
            <PhChatsCircle :size="22" />
            <span v-if="notifyAlert" class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full -mt-0.5 animate-ping"></span>
          </NuxtLink>
        </div>
        
        
        <UserAuth v-if="auth.isAuthenticated">
          <div class="flex justify-center items-center mb-1 py-2 block xsm:hidden">
            <SearchBtn v-if="false" />
            <ThemeBtn />
          </div>
        </UserAuth>

   
        <Menu v-if="!auth.isAuthenticated && !isXsm">
          <div class="flex justify-between">
            <Login class="mr-3" />
            <ThemeBtn />
          </div>
        </Menu>

 
        <Login v-if="!auth.isAuthenticated && isXsm" />
      </div>
      
    </nav>
  </header>
</template>

<style>
#search {
  @apply grow flex items-center h-full max-w-[130px] sm:max-w-[200px] md:max-w-xs md2:max-w-sm bg-slate-100/90 dark:bg-slate-900 rounded-full mx-4 px-1 cursor-pointer
}
#search #input{
  @apply grow overflow-hidden mr-3
}
#search input{
  @apply h-full w-full text-sm bg-transparent mx-3
}
#search .icons {
  @apply shrink-0 m-1.5
}

header .nav-btns button, header .nav-btns a, .head-btn {
  @apply flex items-center justify-center bg-slate-100/90 dark:bg-slate-900 text-slate-600 dark:text-slate-300 p-1.5 rounded-full mr-2 xs:mr-4
}
</style>
