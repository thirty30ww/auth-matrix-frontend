<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useThemeStore } from '@/stores'
import FloatingLabelInput from '@/components/basic/FloatingLabelInput.vue'
import { HOME } from '@/constant'

const username = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const loginCardWrapper = ref()

const login = async () => {
  if (!username.value || !password.value) {
    return
  }

  // 使用Pinia store进行登录
  const success = await authStore.login(username.value, password.value)
  
  if (success) {
    // 添加退出动画到卡片包装器
    if (loginCardWrapper.value) {
      loginCardWrapper.value.classList.add('login-success-transition')
    }
    
    // 同时进行主题加载和动画
    const themePromise = themeStore.initializeFromBackend()
    const animationPromise = new Promise(resolve => setTimeout(resolve, 300))
    
    // 等待动画和主题加载都完成
    Promise.all([themePromise, animationPromise]).then(async () => {
      // 恢复滚动
      document.body.style.overflow = ''
      await router.push(HOME.PATH)
    })
  }
}

onMounted(() => {
  // 页面进入时给卡片包装器添加动画并禁用全局滚动
  document.body.style.overflow = 'hidden'
  if (loginCardWrapper.value) {
    loginCardWrapper.value.classList.add('login-page-enter')
  }
})

// 组件卸载时恢复滚动
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
<div class="login-page">
  <div ref="loginCardWrapper" class="login-card-wrapper">
    <el-card class="login-container" shadow="hover">
      <div class="login-from">
        <h2>Login</h2>
        <FloatingLabelInput v-model="username" label="username" />
        <FloatingLabelInput v-model="password" label="password" type="password" />
        <el-button type="primary" @click="login" class="login-button">登录</el-button>
      </div>
    </el-card>
  </div>
</div>
</template>

<style>
@import '@/assets/style/animations/login.css';
</style>

<style scoped>

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--am-bg-color);
  overflow: hidden; /* 防止动画过程中出现滚动条 */
}

.login-card-wrapper {
  max-width: 300px;
  width: 100%;
}

.login-container {
  width: 100%;
  box-shadow: 2px 0 8px var(--am-shadow-medium); /* 统一的阴影分隔 */
}

.login-from {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

h2 {
  text-align: center;
  margin-bottom: var(--margin-size-xl);
}

.login-button {
  margin-top: var(--margin-size-lg);
}
</style>