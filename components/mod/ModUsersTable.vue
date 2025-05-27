<script setup>
const { users } = defineProps(['users'])

import ModUserCard from '@/components/mod/ModUserCard.vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
</script>

<template>
  <Table class="w-full">
    <TableHeader>
      <TableRow>
        <TableHead>Username</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Country</TableHead>
        <TableHead>Membership</TableHead>
        <TableHead>Joined</TableHead>
        <TableHead>Last&nbsp;Visit</TableHead>
        <TableHead>Threads</TableHead>
        <TableHead>Posts</TableHead>
        <TableHead>Views</TableHead>
        <TableHead>Moderator</TableHead>
        <TableHead>Reports</TableHead>
        <TableHead>Warnings</TableHead>
        <TableHead>Suspended</TableHead>
        <TableHead>Banned</TableHead>
        <TableHead>#</TableHead>
      </TableRow>
    </TableHeader>
    
    <TableBody>
      <ModUserCard v-for="user in users" :key="user.id" :user="user" />
    </TableBody>
  </Table>
</template>