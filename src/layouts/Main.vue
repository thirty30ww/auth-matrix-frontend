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
  padding: var(--padding-size-main-top) var(--padding-size-main-right) var(--padding-size-main-bottom) var(--padding-size-main-left);
  height: calc(100% - var(--padding-size-main-top) - var(--padding-size-main-bottom));
  overflow-y: auto;
  scrollbar-gutter: stable; /* 为滚动条预留稳定空间 */
}
</style>