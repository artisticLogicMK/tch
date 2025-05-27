<script setup>
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

defineProps(['items'])
</script>

<template>
<div class="overflow-x-auto px-3 py-2 border-b bdr">

  <Breadcrumb class="w-full overflow-hiddenk">
    <BreadcrumbList>
      <template v-for="(item, i) in items" :key="item.url">
        <BreadcrumbItem>
          <NuxtLink :to="item.url">
            {{ item.name }}
          </NuxtLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="last:hidden" />
      </template>
      <!--  -->
    </BreadcrumbList>
  </Breadcrumb>
  
</div>
</template>