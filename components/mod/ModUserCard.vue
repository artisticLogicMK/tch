<script setup>
const props = defineProps(['user'])

const user = useState(`userState-${props.user.id}`, () => props.user)

import ModUserActions from '@/components/mod/ModUserActions.vue'
import { TableCell, TableRow } from '@/components/ui/table'
import Button from '@/components/ui/button/Button.vue'
import Userlevel from '@/components/usi/Userlevel.vue'

const { $formatNumber, $formatTimeNoTZ } = useNuxtApp()

const today = new Date().toISOString()
</script>

<template>
  <TableRow v-if="!user?.hide">
    <TableCell>
      <NuxtLink :to="`/u/${user.username}`" class="text-sky-500">{{ user.username }}</NuxtLink>
    </TableCell>
    
    <TableCell>
      {{ user.email }}
    </TableCell>
    
    <TableCell v-if="user.country" class="whitespace-nowrap">{{ user.country?.name }} <img v-if="user.country" :src="`https://flagcdn.com/32x24/${user.country?.code}.png`" class="flag"></TableCell>
    <TableCell v-else>-</TableCell>
    
    <TableCell>
      <Userlevel :userCount="user._count" />
    </TableCell>
    
    <TableCell class="whitespace-nowrap">{{ $formatTimeNoTZ(user.createdAt) }}</TableCell>
    
    <TableCell class="whitespace-nowrap">{{ $formatTimeNoTZ(user.lastLoggedIn * 1000) }}</TableCell>
    
    <TableCell>{{ $formatNumber(user._count.threads) }}</TableCell>
    
    <TableCell>{{ $formatNumber(user._count.posts) }}</TableCell>
    
    <TableCell>{{ $formatNumber(user._count.views) }}</TableCell>
    
    <TableCell>{{ user.moderating.length ? 'Yes' : 'No' }}</TableCell>
    
    <TableCell>{{ $formatNumber(user._count.reports) }}</TableCell>
    
    <TableCell>{{ $formatNumber(Number(user.warnings)) }}</TableCell>
    
    <TableCell>{{ user.suspended > today ? 'Yes' : 'No' }}</TableCell>
    
    <TableCell>{{ user.banned ? 'Yes' : 'No' }}</TableCell>
    
    <TableCell>
      <ModUserActions :userId="user.id">
        <Button>Actions</Button>
      </ModUserActions>
    </TableCell>
  </TableRow>
</template>