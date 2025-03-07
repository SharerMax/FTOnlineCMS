<template>
  <div>
    <ul class="list-none p-0">
      <li v-for="(task, index) in taskList" :key="index">
        <div>
          {{ task.provider.name }} {{ crawlerTaskStatusDict[task.status] }}
        </div>
        <div class="font-size-3.5 color-gray mt-2">
          {{ formatDateTime(task.startTime) }} - {{ formatDateTime(task.endTime) }}
        </div>
        <Divider class="my-4" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { CrawlerTaskRes } from '@/api/types/crawler-task'
import type { ConfigType } from 'dayjs'
import httpClient from '@/api/http-client'
import { crawlerTaskStatusDict } from '@/utils/dict'
import { Divider } from 'ant-design-vue'
import dayjs from 'dayjs'
import { ref } from 'vue'

const taskList = ref<CrawlerTaskRes[]>([])
function formatDateTime(dateTime: ConfigType) {
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss')
}
function queryTaskList() {
  httpClient.get<CrawlerTaskRes[]>('/crawlerTask/list').then((res) => {
    taskList.value = res.data
  })
}
queryTaskList()
</script>

<style scoped>

</style>
