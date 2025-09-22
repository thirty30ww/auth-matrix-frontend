<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Header from './Header.vue'
import Sidebar from './SideBar.vue'
import Main from './Main.vue'
import TabBar from '@/layouts/TabBar.vue'
import SettingsDrawer from '@/components/business/SettingsDrawer.vue'
import { useThemeStore } from '@/stores'
import { LOGO_POSITIONS } from '@/stores/theme'

const isCollapse = ref(false)
const layoutContainer = ref()
const themeStore = useThemeStore()
const settingsDrawerVisible = ref(false)
const refreshTrigger = ref(0)

// 判断是否是顶栏布局模式
const isHeaderLayout = computed(() => themeStore.logoPosition === LOGO_POSITIONS.HEADER)

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const openSettingsDrawer = () => {
  settingsDrawerVisible.value = true
}

const handleRefreshMain = () => {
  refreshTrigger.value++
}

onMounted(() => {
  // 组件挂载完成
})
</script>

<template>
  <div ref="layoutContainer" class="layout-container" :class="{ 'header-layout': isHeaderLayout }">
    <el-container :direction="isHeaderLayout ? 'vertical' : 'horizontal'">
      <!-- 顶栏 - 在header布局模式时显示在最上方 -->
      <el-header 
        v-show="isHeaderLayout" 
        class="header-container header-full-width"
      >
        <Header :isSidebarCollapsed="isCollapse" @toggle-sidebar="toggleSidebar" @open-settings="openSettingsDrawer" @refresh-main="handleRefreshMain" />
      </el-header>

      <!-- 主体容器 -->
      <el-container class="body-container">
        <!-- 侧边栏 -->
        <el-aside 
          :width="isCollapse ? 'var(--width-size-sidebar-fold)' : 'var(--width-size-sidebar)'" 
          class="aside-container"
          :class="{ 'aside-below-header': isHeaderLayout }"
        >
          <Sidebar :isCollapsed="isCollapse" />
        </el-aside>
        
        <!-- 右侧主内容区 -->
        <el-container class="main-container">
          <!-- 顶栏 - 在sidebar布局模式时显示在这里 -->
          <el-header 
            v-show="!isHeaderLayout"
            class="header-container"
          >
            <Header :isSidebarCollapsed="isCollapse" @toggle-sidebar="toggleSidebar" @open-settings="openSettingsDrawer" @refresh-main="handleRefreshMain" />
          </el-header>

          <div class="tab-bar-container">
            <TabBar />
          </div>
          
          <el-main class="content-container">
            <Main :refreshTrigger="refreshTrigger" />
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>

  <!-- 设置抽屉 -->
  <SettingsDrawer v-model="settingsDrawerVisible" />
</template>

<style scoped>

.layout-container {
  height: 100vh;
  width: 100%;
}

.header-container {
  height: var(--height-size-header);
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 0;
  box-sizing: border-box; /* 确保边框包含在高度内 */
}

.header-full-width {
  width: 100%;
}

.aside-container {
  height: 100%;
  transition: width 0.3s;
  overflow: hidden;
  border-radius: var(--radius-none) var(--radius-sidebar) var(--radius-sidebar) var(--radius-none);
  box-shadow: 2px 0 8px var(--pp-shadow-medium); /* 统一的阴影分隔 */
  position: relative;
  z-index: 1;
}

.aside-below-header {
  height: calc(100vh - var(--height-size-header));
  border-radius: var(--radius-none) var(--radius-sidebar) var(--radius-none) var(--radius-none);
}

.body-container {
  flex: 1;
}

/* 顶栏布局模式下的body容器高度调整 */
.header-layout .body-container {
  height: calc(100vh - var(--height-size-header));
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-container {
  margin: 0 var(--margin-size-spacing-1) var(--margin-size-spacing-1) var(--margin-size-spacing-1);
  background-color: var(--pp-bg-color);
  border-radius: var(--radius-card);
  padding: 0;
  overflow: hidden;
  position: relative;
}

.tab-bar-container {
  height: var(--height-size-tab-bar);
  min-height: var(--height-size-tab-bar);
  max-height: var(--height-size-tab-bar);
  width: 100%;
  flex-shrink: 0;
  position: relative;
}
</style>