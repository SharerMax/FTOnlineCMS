<template>
  <ContextHolder />
  <div class="flex gap-col-2">
    <Input class="flex-0" />
    <Button class="flex-none" @click="openProviderModal = true">
      添加
    </Button>
  </div>
  <List
    :data-source="providers"
    bordered
    class="mt-4"
    size="small"
  >
    <template #renderItem="{ item }">
      <ListItem>
        <template #actions>
          <Button size="small" danger @click="handleRemoveProviderClick(item)">
            <div class="flex items-center">
              <div class="i-hugeicons-delete-04" />
              <span class="ml-1">删除</span>
            </div>
          </Button>
          <Switch class="self-center" :checked="item.enable" @change="handleProviderStateChange(item, $event)" />
        </template>
        <ListItemMeta :title="item.name" :description="item.apiUrl" />
      </ListItem>
    </template>
  </List>
  <Modal
    v-model:open="openProviderModal"
    title="添加采集站点"
    :confirm-loading="addOrUpdateProviderConfirmLoading"
    destroy-on-close
    @ok="handleAddOrUpdateProviderOk"
  >
    <Form
      ref="addOrUpdateProviderForm"
      :model="providerFormModel"
      :rules="providerFormRules"
      :label-col="{ span: 4 }"
    >
      <FormItem label="站点名称" name="name">
        <Input v-model:value="providerFormModel.name" />
      </FormItem>
      <FormItem label="接口地址" name="apiUrl">
        <Input v-model:value="providerFormModel.apiUrl" placeholder="http(s)://api.example.com" />
      </FormItem>
      <FormItem label="接口key" name="apiKey">
        <Input v-model:value="providerFormModel.apiKey" />
      </FormItem>
      <FormItem label="优先级" name="proiority">
        <InputNumber v-model:value="providerFormModel.proiority" :precision="0" :min="0" />
      </FormItem>
      <FormItem label="启用" name="enable">
        <Switch v-model:checked="providerFormModel.enable" />
      </FormItem>
    </Form>
  </Modal>
</template>

<script setup lang="ts">
import type { ProviderRes } from '@/api/types/provider'
import type { FormInstance, RuleObject } from 'ant-design-vue/es/form'
import type { AxiosResponse } from 'axios'
import httpClient from '@/api/http-client'
import { Button, Form, FormItem, Input, InputNumber, List, ListItem, ListItemMeta, message, Modal, Switch } from 'ant-design-vue'
import { reactive, ref, useTemplateRef } from 'vue'

const [messageApi, ContextHolder] = message.useMessage()
const providers = ref<ProviderRes[]>([])

function queryProviderList() {
  httpClient.get('/provider/list').then((res: AxiosResponse<ProviderRes[]>) => {
    providers.value = res.data
  }).catch((error) => {
    messageApi.error(error.message)
  })
}
queryProviderList()
function handleRemoveProviderClick(provider: ProviderRes) {
  httpClient.delete(`provider/${provider.id}`).then(() => {
    providers.value = providers.value.filter(item => item.id !== provider.id)
  }).catch((error) => {
    messageApi.error(error.message)
  })
}
const openProviderModal = ref(false)
const providerFormModel = reactive({
  name: '',
  apiUrl: '',
  apiKey: '',
  proiority: 0,
  enable: true,
})
const providerFormRules: { [k in keyof typeof providerFormModel]: RuleObject | RuleObject[] } = {
  apiKey: { required: false, message: '请输入接口key' },
  apiUrl: [{ required: true, message: '请输入接口地址' }, { type: 'url', message: '请输入正确的apiUrl' }],
  name: { required: true, message: '请输入站点名称' },
  proiority: { required: true, message: '请输入优先级' },
  enable: { required: true, message: '请输入是否启用' },
}
const addOrUpdateProviderForm = useTemplateRef<FormInstance>('addOrUpdateProviderForm')
const addOrUpdateProviderConfirmLoading = ref(false)
function handleAddOrUpdateProviderOk() {
  addOrUpdateProviderConfirmLoading.value = true
  addOrUpdateProviderForm.value?.validate().then(() => {
    httpClient.post('/provider/item', providerFormModel).then(() => {
      openProviderModal.value = false
      addOrUpdateProviderConfirmLoading.value = false
      queryProviderList()
    }).catch((error) => {
      messageApi.error(error.message)
      addOrUpdateProviderConfirmLoading.value = false
    })
  }).catch(() => {
    addOrUpdateProviderConfirmLoading.value = false
  })
}

function handleProviderStateChange(provider: ProviderRes, checked: unknown) {
  if (typeof checked === 'boolean') {
    provider.enable = checked
    httpClient.put(`/provider/${provider.id}`, provider).then(() => {
      // queryProviderList()
    }).catch((error) => {
      messageApi.error(error.message)
    })
  }
}
</script>

<style scoped>
:deep(.ant-list-item-action ){
  display: flex;
  align-items: center;
}
</style>
