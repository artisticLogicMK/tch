<script setup>
import TermsOfUse from '@/components/TermsOfUse.vue'
import Al from '@/components/frm/Al.vue'
import { PhUsersThree, PhChartBar, PhNote, PhDot } from '@phosphor-icons/vue'
import CurrentDate from '~/components/CurrentDate.vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const { $global, $getRelative } = useNuxtApp()

const currentYear = new Date().getFullYear()
</script>

<template>
  <div v-if="$global.loaded" class="shrink-0 flex-col md3:w-[25%] h-fit md3:h-full text-600 p-3 mt-1 md3:mt-0">
    
    <div class="column-boxes md3:overflow-y-auto bg-flat bdr p-3 xs:p-4">
      
      <p class="hidden md3:block"><CurrentDate /></p>
      
      <div class="hidden md3:block border-b bdr w-11/12 my-3 mx-auto"></div>
      
      <h1 class="font-round text-500">
        <PhUsersThree weight="duotone" />
        Who's Online
      </h1>
      <p><span class="statBl">{{ $global.statistics.activeUsersCount }}</span> users active in the past 15 minutes, and <span class="statBl">{{ $global.statistics.visitorsCount }}</span> guests.</p>
      
      <div v-if="$global.statistics.onlineUsers && $global.statistics.onlineUsers.length" class="mt-1.5">
        <p v-for="user in $global.statistics.onlineUsers" :key="user.username" class="ou inline-block">
        <NuxtLink :to="`/u/${user.username}`" class="text-sky-500">{{user.username}}<img v-if="user?.country" :src="`https://flagcdn.com/32x24/${user?.country?.code}.png`" class="flag sm" /></NuxtLink>
          <PhDot weight="bold" class="text-base inline-block scale-150" />
        </p>
      </div>
      
      <div class="border-b bdr w-11/12 my-3 mx-auto"></div>
      
      <h1 class="font-round text-500">
        <PhChartBar weight="duotone" />
        Forum Statistics
      </h1>
      <p class="mb-2">Our members have made a total of <span class="statBl">{{ $global.statistics.postsCount.toLocaleString() }}</span> posts in <span class="statBl">{{ $global.statistics.threadsCount.toLocaleString() }}</span> threads.</p>
      <p class="mb-2">We currently have <span class="statBl">{{ $global.statistics.usersCount.toLocaleString() }}</span> members registered.</p>
      <p class="mb-2">Please welcome our newest member:</p>
      <NuxtLink v-if="$global.statistics.newestUser" :to="`/u/${$global.statistics.newestUser?.username}`" class="flex items-center">
        <img :src="$global.statistics.newestUser?.picture.startsWith('http') || $global.statistics.newestUser?.picture.startsWith('/assets') ? $global.statistics.newestUser?.picture : `/api${$global.statistics.newestUser?.picture}`" class="w-7 h-7 object-center object-cover rounded-full mr-3 border bdr" />
        <div>
          <p class="text-600 font-semibold">
            {{ $global.statistics.newestUser?.username }}
            <img v-if="$global.statistics.newestUser?.country" :src="`https://flagcdn.com/32x24/${$global.statistics.newestUser?.country?.code}.png`" class="flag" />
          </p>
          <p class="text-slate-500 font-round">{{ $getRelative($global.statistics.newestUser?.createdAt) }}</p>
        </div>
      </NuxtLink>
    </div>
    
    
    <div class="column-boxes bg-flat bdr px-3 xs:px-4 py-2 mt-3">
      <Popover>
        <PopoverTrigger as-child>
          <h1 class="fr font-round text-500 cursor-pointer">
            <PhNote weight="duotone" />
            See Top Forums
          </h1>
        </PopoverTrigger>
      
        <PopoverContent>
          <NuxtLink v-for="tp in $global.statistics.topForums" :key="tp.name" :to="`/forum/${tp.category.slug}/${tp.slug}`" class="flex items-center w-fit text-sm font-semibold mt-2 block hover:text-pri-500">
            <PhDot weight="bold" class="text-lg" />
            {{ tp.name }}
          </NuxtLink>
        </PopoverContent>
      
      </Popover>
    </div>
    
    
    <div class="shrink-0 column-boxes bg-flat bdr p-3 xs:p-4 mt-3">
      <p class="text-600 mb-1.5">&copy; {{currentYear}} DreamsTorchlight Forum.</p>
      
      <TermsOfUse>
        <p class="text-500 text-xs hover:underline mb-2">Terms & Agreement</p>        
      </TermsOfUse>
      
      <p class="mb-2">
        <a class="text-bsm xs:text-sm text-sky-500 font-semibold underline underline-offset-4" href="https://old.dreamstorchlight.org" target="_blank">Visit old forum here</a>
      </p>
      
      <Al />
    </div>
        
  </div>
</template>

<style>
.column-boxes h1 {
  @apply flex items-center text-sm font-semibold
}
.column-boxes h1:not(.fr) {
  @apply mb-1
}
.column-boxes h1 svg {
  @apply text-base mr-1.5
}
.column-boxes p {
  @apply text-[0.8125rem] xs:text-sm
}

.ou:last-child svg { @apply hidden }

.statBl { @apply font-semibold }
</style>