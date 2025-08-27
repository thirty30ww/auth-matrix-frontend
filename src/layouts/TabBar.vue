<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Close, Delete } from '@element-plus/icons-vue'
import { useTabsStore } from '@/stores/tabs'
import IconButton from '@/components/basic/IconButton.vue'

const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()

// 使用 computed 获取响应式数据
const tabs = computed(() => tabsStore.tabs)
const activeTab = computed(() => tabsStore.activeTab)

// 跟踪悬浮状态
const hoveredTab = ref('')

// 添加标签页
const addTab = () => {
  const { path, meta } = route
  const title = meta.title as string
  const icon = meta.icon as string
  
  if (title) {
    tabsStore.addTab({
      path,
      title,
      icon: icon
    })
  }
}

// 关闭标签页
const closeTab = (targetPath: string) => {
  const nextActivePath = tabsStore.removeTab(targetPath)
  
  // 如果需要跳转到其他标签
  if (nextActivePath) {
    router.push(nextActivePath)
  }
}

// 处理鼠标按键事件（用于中键关闭标签）
const handleMouseDown = (event: MouseEvent, tab: any) => {
  // 鼠标中键（滚轮按钮）
  if (event.button === 1 && tab.path !== '/home') {
    event.preventDefault()
    closeTab(tab.path)
  }
}

// 点击标签切换路由
const switchTab = (path: string) => {
  tabsStore.setActiveTab(path)
  router.push(path)
}

// 清除所有标签（保留首页）
const clearAllTabs = () => {
  tabsStore.clearTabs()
  router.push('/home')
}

// 判断是否显示右边框
const shouldShowRightBorder = (tab: any, index: number) => {
  const nextTab = tabs.value[index + 1]
  
  return index < tabs.value.length - 1 && 
         activeTab.value !== tab.path && 
         (nextTab && activeTab.value !== nextTab.path) &&
         hoveredTab.value !== tab.path &&
         (nextTab && hoveredTab.value !== nextTab.path)
}

// 监听路由变化
watch(() => route.path, () => {
  if (route.meta.title) {
    addTab()
  } else if (route.path === '/home') {
    // 如果是首页，确保设置为激活状态
    tabsStore.setActiveTab('/home')
  }
}, { immediate: true })
</script>

<template>
  <div class="tab-bar">
    <div class="tabs-container">
      <div
        v-for="(tab, index) in tabs"
        :key="tab.path"
        :class="[
          'tab-item', 
          { active: activeTab === tab.path },
          { 'home-tab': tab.path === '/home' },
          { 'show-right-border': shouldShowRightBorder(tab, index) }
        ]"
        @click="switchTab(tab.path)"
        @mousedown="handleMouseDown($event, tab)"
        @mouseenter="hoveredTab = tab.path"
        @mouseleave="hoveredTab = ''"
      >
        <el-icon class="tab-icon">
          <component :is="tab.icon" />
        </el-icon>
        <span v-if="tab.path !== '/home'" class="tab-title">{{ tab.title }}</span>
        <el-icon 
          v-if="tab.path !== '/home'" 
          class="tab-close"
          @click.stop="closeTab(tab.path)"
        >
          <Close />
        </el-icon>
      </div>
    </div>
    
    <!-- 右侧操作区域 -->
    <div class="tab-actions">
      <IconButton 
        @click="clearAllTabs"
        class="clear-tabs-btn"
        title="清除所有标签"
      >
        <el-icon>
          <Delete />
        </el-icon>
      </IconButton>
    </div>
  </div>
</template>

<style scoped>
.tab-bar {
  height: 100%;
  background-color: var(--pp-bg-color-overlay);
  padding: var(--padding-size-none) var(--padding-size-tab-bar);
  display: flex;
  align-items: flex-end; /* 恢复底部对齐，保持 tab 外圆角效果 */
  justify-content: space-between; /* 两端对齐 */
  overflow: hidden;
  position: relative;
}

.tabs-container {
  display: flex;
  flex: 1; /* 占用剩余空间 */
  height: 100%;
  position: relative;
  overflow: visible; /* 允许外圆角伪元素显示 */
}

.tab-item {
  padding: 0 15px;
  height: 100%;
  line-height: 100%;
  background-color: var(--pp-bg-color-overlay);
  border-radius: var(--radius-item) var(--radius-item) 0 0; /* 只在上方圆角 */
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  min-width: 100px;
  max-width: 200px;
  color: var(--el-text-color-secondary);
  z-index: 1;
}

.tab-item:hover {
  background-color: var(--pp-bg-color-medium);
  z-index: 2;
}

.tab-item.active {
  background-color: var(--pp-bg-color);
  color: var(--el-color-primary);
  margin-bottom: calc(-1 * var(--margin-size-spacing-1));
  border-bottom: none;
  z-index: 3;
  border-top: 2px solid var(--el-color-primary);
}

/* Edge风格外圆角效果 */
.tab-item.active::before,
.tab-item.active::after,
.tab-item:hover::before,
.tab-item:hover::after {
  content: '';
  position: absolute;
  bottom: 0;
  width: var(--radius-item);
  height: var(--radius-item);
  z-index: -1;
}

.tab-item.active::before,
.tab-item:hover::before {
  left: calc(-1 * var(--radius-item));
  background: radial-gradient(circle at 0 0, transparent var(--radius-item), var(--pp-bg-color) var(--radius-item));
}

.tab-item.active::after,
.tab-item:hover::after {
  right: calc(-1 * var(--radius-item));
  background: radial-gradient(circle at var(--radius-item) 0, transparent var(--radius-item), var(--pp-bg-color) var(--radius-item));
}

/* 悬浮时的外圆角使用悬浮背景色 */
.tab-item:hover:not(.active)::before {
  background: radial-gradient(circle at 0 0, transparent var(--radius-item), var(--pp-bg-color-medium) var(--radius-item));
}

.tab-item:hover:not(.active)::after {
  background: radial-gradient(circle at var(--radius-item) 0, transparent var(--radius-item), var(--pp-bg-color-medium) var(--radius-item));
}


.tab-item.home-tab {
  min-width: 36px;
  max-width: 36px;
  justify-content: center;
  padding: var(--padding-size-none);
}

.tab-item.home-tab .tab-icon {
  margin-right: var(--margin-size-none);
}

.tab-item.show-right-border::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 20px;
  background-color: var(--pp-border-color-light);
}

.tab-icon {
  margin-right: var(--margin-size-spacing-1);
}

.tab-title {
  font-size: var(--font-size-tab-bar);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: var(--margin-size-spacing-1);
  flex: 1;
}

.tab-item.active .tab-title {
  font-weight: bold;
}

.tab-item.active .tab-icon {
  color: var(--el-color-primary);
}

.tab-close {
  font-size: 12px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  margin-left: var(--margin-size-spacing-1);
}

.tab-close:hover {
  background-color: rgba(var(--el-color-danger-rgb), 0.1);
  color: var(--el-color-danger);
  opacity: 1;
}

/* 右侧操作区域 */
.tab-actions {
  display: flex;
  align-items: flex-end; /* 与 tab 对齐到底部 */
  gap: 8px;
  flex-shrink: 0; /* 防止被压缩 */
  height: 100%; /* 确保高度一致 */
}

</style>