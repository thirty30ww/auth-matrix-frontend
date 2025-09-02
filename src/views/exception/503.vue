<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-number error-number--warning">503</div>
      <div class="error-message">功能维护中</div>
      <div class="error-description">抱歉，该功能正在维护升级，请稍后再试</div>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">
          <el-icon class="el-icon--left"><HomeFilled /></el-icon>
          返回首页
        </el-button>
        <el-button @click="goBack">
          <el-icon class="el-icon--left"><ArrowLeft /></el-icon>
          返回上一页
        </el-button>
        <el-button @click="refresh">
          <el-icon class="el-icon--left"><Refresh /></el-icon>
          刷新页面
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTabsStore } from '@/stores/tabs'
import { HomeFilled, ArrowLeft, Refresh } from '@element-plus/icons-vue'
import { HOME } from '@/constant'

const router = useRouter()
const tabsStore = useTabsStore()

const goHome = () => {
  // 关闭当前503页面的标签
  tabsStore.removeTab('/503')
  router.push(HOME.PATH)
}

const goBack = () => {
  // 关闭当前503页面的标签
  tabsStore.removeTab('/503')
  router.go(-1)
}

const refresh = () => {
  // 刷新当前页面
  location.reload()
}
</script>

<style scoped>
</style>