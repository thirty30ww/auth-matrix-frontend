<template>
  <div class="main-container">
    <router-view v-slot="{ Component, route }">
      <!-- 页面切换动画 -->
      <transition name="page" mode="out-in">
        <div class="page-wrapper" :key="`${route.path}-${routerViewKey}`">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义 props 来接收刷新信号
const props = defineProps<{
  refreshTrigger?: number
}>()

// 使用 props 的刷新触发器或默认值作为 key
const routerViewKey = ref(props.refreshTrigger || 0)

// 监听 props 变化来更新 key
import { watch } from 'vue'
watch(() => props.refreshTrigger, (newVal) => {
  if (newVal !== undefined) {
    routerViewKey.value = newVal
  }
})
</script>

<style scoped>
.main-container {
  padding: var(--gap-size-xl) var(--gap-size-2xl) var(--gap-size-3xl) var(--gap-size-2xl);
  height: calc(100% - var(--gap-size-xl) - var(--gap-size-3xl));
  overflow-y: auto;
  scrollbar-gutter: stable; /* 为滚动条预留稳定空间 */
}
</style>