<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore, useUserStore, useTabsStore, useViewStore, useSystemStore } from '@/stores'

const authStore = useAuthStore()
const userStore = useUserStore()
const tabsStore = useTabsStore()
const viewStore = useViewStore()
const systemStore = useSystemStore()

onMounted(async () => {
  // 先获取项目名称（公共接口，无需登录）
  await systemStore.fetchProjectTitle()
  
  // 如果已登录则获取用户信息（认证状态已通过持久化插件自动恢复）
  if (authStore.userLoggedIn) {
    await userStore.getUserInfo()
    // 获取权限码
    await viewStore.getPermissionCodes()
    await tabsStore.initializeTabs()
  }
})
</script>

<template>
  <router-view />
</template>

<style>
</style>
