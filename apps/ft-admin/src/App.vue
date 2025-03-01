<template>
  <ContextHolder />
  <div class="w-160 mx-auto min-h-screen">
    <div class="flex mt-16 gap-col-2">
      <Input class="flex-0" />
      <Button class="flex-none">
        添加
      </Button>
    </div>
    <List :data-source="providers" bordered class="mt-4" size="small">
      <template #renderItem="{ item }">
        <ListItem>
          <template #actions>
            <Button size="small" danger @click="handleRemoveProviderClick(item)">
              <div class="flex items-center">
                <div class="i-hugeicons-delete-04" />
                <span class="ml-1">删除</span>
              </div>
            </Button>
            <Switch class="self-center" />
          </template>
          <ListItemMeta :title="item.name" :description="item.apiUrl" />
        </ListItem>
      </template>
    </List>
  </div>
</template>

<script setup lang="ts">
import type { ProviderRes } from '@/api/types/provider'
import type { AxiosResponse } from 'axios'
import httpClient from '@/api/http-client'
import { Button, Input, List, ListItem, ListItemMeta, message, Switch } from 'ant-design-vue'
import { ref } from 'vue'

const [messageApi, ContextHolder] = message.useMessage()
const providers = ref<ProviderRes[]>([])
httpClient.get('provider/list').then((res: AxiosResponse<ProviderRes[]>) => {
  providers.value = res.data
}).catch((error) => {
  messageApi.error(error.message)
})

function handleRemoveProviderClick(provider: ProviderRes) {
  httpClient.delete(`provider/${provider.id}`).then(() => {
    providers.value = providers.value.filter(item => item.id !== provider.id)
  }).catch((error) => {
    messageApi.error(error.message)
  })
}
</script>

<style scoped>
:deep(.ant-list-item-action ){
  display: flex;
  align-items: center;
}
</style>
