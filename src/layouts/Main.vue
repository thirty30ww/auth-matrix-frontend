<template>
  <div class="main-container">
    <router-view v-slot="{ Component, route }">
      <!-- 页面切换动画 -->
      <transition name="page" mode="out-in">
        <div class="page-wrapper" :key="route.path">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.main-container {
  padding: 20px 25px 50px 25px;
  height: calc(100% - 50px - 20px); /* 减去header高度 */
  overflow-y: auto;
  scrollbar-gutter: stable; /* 为滚动条预留稳定空间 */
}
</style> 