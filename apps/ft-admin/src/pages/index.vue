<template>
  <div class="w-160 mx-auto  pt-4">
    <Space>
      <RouterLink to="/">
        <Button :type="getButtonTypeFromPath('/') ">
          采集站点
        </Button>
      </RouterLink>
      <RouterLink to="/task">
        <Button :type="getButtonTypeFromPath('/task')">
          任务管理
        </Button>
      </RouterLink>
    </Space>
    <Divider />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { Button, Divider, Space } from 'ant-design-vue'
import { useRoute } from 'vue-router'

const route = useRoute()
function getButtonTypeFromPath(path: string) {
  if (path === route.path) {
    return 'primary'
  }
  return 'default'
}
</script>

<style scoped>

</style>
