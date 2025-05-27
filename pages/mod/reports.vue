<script setup>
definePageMeta({
  layout: "mod-layout",
  middleware: ["auth", "is-valid-user", "is-admin"]
})

useHead({
  title: "Reports - Dashboard",
})

useSeoMeta({
  robots: 'noindex, nofollow'
})

import { usePagesStore } from '@/store/pages'

const route = useRoute()

const { $auth, $formatTime } = useNuxtApp()

const reports = ref(null)

const pageLoader = ref(false)
const currentPage = ref(route.query.page ? parseInt(route.query.page) : 1)
const totalPages = ref(0)

const pagesStore = usePagesStore()

const fetchReports = async (page = 1) => {
  const cacheKey = `${page || 1}`

  // Use cached forum page if exists
  if (pagesStore.reportPagesData[cacheKey]) {
    reports.value = pagesStore.reportPagesData[cacheKey].reports
    totalPages.value = pagesStore.reportPagesData[cacheKey].totalPages
    currentPage.value = pagesStore.reportPagesData[cacheKey].currentPage
    return
  }
  
  try {
    const { data } = await useAsyncData('userReports', () =>
      $fetch(`/api/mod/reports?page=${page}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${$auth.token}`
        },
      }))

    if (!data.value.reports) {
      throw createError({ statusCode: 500, statusMessage: 'Server Error!' })
    }

    reports.value = data.value.reports
    totalPages.value = data.value.totalPages
    currentPage.value = data.value.currentPage
    
    pagesStore.setReportPage(cacheKey, data.value)
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: 'Server Error!' })
  }
}

await fetchReports(currentPage.value)

watch(() => route.query.page, async (newVal) => {
  document.getElementById("pageLoader").scrollIntoView()
  pageLoader.value = true

  await fetchReports(parseInt(newVal))
  pageLoader.value = false
})

import ReportMsg from '~/components/mod/ReportMsg.vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import Paginator from '@/components/Paginator.vue'
import PageLoader from '@/components/PageLoader.vue'
</script>

<template>

    <div class="w-full">
      <div class="border-b bdr px-5 py-2">
          <h1 class="modheads">Reports</h1>
      </div>
      
      <PageLoader :loading="pageLoader" />
      
      <div class="w-full max-w-full overflow-x-auto">
        <Table class="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Reporter</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            <TableRow v-for="report in reports" :key="report.id">
              
              <TableCell>
                <NuxtLink :to="`/u/${report.reporter}`" class="text-sky-500">{{ report.reporter }}</NuxtLink>
              </TableCell>
              
              <TableCell>
                <NuxtLink :to="report.link" class="text-sky-500 capitalize">{{ report.type }}</NuxtLink>
              </TableCell>
              
              <TableCell>
                <ReportMsg :msg="report.message">
                  <span class="text-sky-500 underline underline-offset-4">See</span>
                </ReportMsg>
              </TableCell>
              
              <TableCell class="whitespace-nowrap">
                {{ $formatTime(report.createdAt) }}
              </TableCell>
              
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div v-if="reports && !reports.length" class="no-item">
        <h1>No reports here...</h1>
      </div>
      
      <Paginator v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages" />

    </div>

</template>