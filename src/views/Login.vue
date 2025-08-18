<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import FloatingLabelInput from '@/components/basic/FloatingLabelInput.vue'

const username = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const login = async () => {
  if (!username.value || !password.value) {
    return
  }

  // 使用Pinia store进行登录
  const success = await authStore.login(username.value, password.value)
  
  if (success) {
    // 登录成功后跳转到首页
    await router.push('/home')
  }
}
</script>

<template>
<div class="login-page">
  <el-card class="login-container" shadow="hover">
    <div class="login-from">
      <h2>Login</h2>
      <FloatingLabelInput v-model="username" label="username" />
      <FloatingLabelInput v-model="password" label="password" type="password" />
      <el-button type="primary" @click="login" class="login-button">登录</el-button>
    </div>
  </el-card>
</div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-container {
  max-width: 300px;
  width: 100%;
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