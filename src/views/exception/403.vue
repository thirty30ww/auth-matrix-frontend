<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-number error-number--danger">403</div>
      <div class="error-message">访问受限</div>
      <div class="error-description">抱歉，您没有权限访问此页面</div>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">
          <el-icon class="el-icon--left"><HomeFilled /></el-icon>
          返回首页
        </el-button>
        <el-button @click="goBack">
          <el-icon class="el-icon--left"><ArrowLeft /></el-icon>
          返回上一页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTabsStore } from '@/stores/tabs'
import { HomeFilled, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const tabsStore = useTabsStore()

const goHome = () => {
  // 关闭当前403页面的标签
  tabsStore.removeTab('/403')
  router.push('/home')
}

const goBack = () => {
  // 关闭当前403页面的标签
  tabsStore.removeTab('/403')
  router.go(-1)
}
</script>

<style scoped>
/* 403页面特有样式（如果有的话可以在这里添加） */
</style>