<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores'
import UserAvatar from '@/components/basic/UserAvatar.vue'

const userStore = useUserStore()

// 计算属性，获取用户名称，如果没有则显示"用户"
const userName = computed(() => {
  return userStore.userInfo?.name || '用户'
})

// 计算属性，获取用户头像URL
const userAvatar = computed(() => {
  return userStore.userInfo?.avatarUrl || ''
})
</script>

<template>
  <div class="home-container">
    <el-card class="welcome-card" shadow="never">
      <div class="welcome-content">
        <div class="user-avatar">
          <el-avatar :size="80">
            <UserAvatar :imageUrl="userAvatar" />
          </el-avatar>
        </div>
        <div class="welcome-text">
          <p class="welcome-title">欢迎回来，{{ userName }}！</p>
          <p class="welcome-description">欢迎使用 Auth Matrix 企业级权限管理系统</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>

.welcome-card {
  width: 100%;
}

.welcome-content {
  display: flex;
  align-items: center;
}

.user-avatar {
  margin-right: 20px;
}

.welcome-text {
  flex: 1;
}

.welcome-title {
  font-size: var(--font-size-title);
  margin: 0 0 8px 0;
  color: var(--el-text-color-primary);
}

.welcome-description {
  color: var(--el-text-color-regular);
  margin: 0;
}
</style>