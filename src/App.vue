<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore, useUserStore } from '@/stores'

const authStore = useAuthStore()
const userStore = useUserStore()

onMounted(async () => {
  // 如果已登录则获取用户信息（认证状态已通过持久化插件自动恢复）
  if (authStore.userLoggedIn) {
    await userStore.getUserInfo()
  }
})
</script>

<template>
  <router-view />
</template>

<style>
</style>
