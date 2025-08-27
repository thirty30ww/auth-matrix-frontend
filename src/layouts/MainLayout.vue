<script setup lang="ts">
import { ref } from 'vue'
import Header from './Header.vue'
import Sidebar from './SideBar.vue'
import Main from './Main.vue'
import TabBar from '@/layouts/TabBar.vue'

const isCollapse = ref(false)

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<template>
  <div class="layout-container">
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'" class="aside-container">
        <Sidebar :isCollapsed="isCollapse" />
      </el-aside>
      
      <el-container class="main-container">
        <el-header class="header-container">
          <Header :isSidebarCollapsed="isCollapse" @toggle-sidebar="toggleSidebar" />
        </el-header>

        <div class="tab-bar-container">
          <TabBar />
        </div>
        
        <el-main class="content-container">
          <Main />
        </el-main>
      </el-container>
    </el-container>
  </div>
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

.el-container {
  height: 100%;
}

.aside-container {
  height: 100%;
  transition: width 0.3s;
  overflow: hidden;
  border-radius: var(--radius-none) var(--radius-sidebar) var(--radius-sidebar) var(--radius-none);
  box-shadow: 2px 0 8px var(--pp-shadow-medium); /* 统一的阴影分隔 */
  position: relative;
  z-index: 20;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-container {
  background-color: var(--pp-bg-color);
  border-radius: var(--radius-card);
  padding: 0;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.tab-bar-container {
  height: var(--height-size-tab-bar);
  min-height: var(--height-size-tab-bar);
  max-height: var(--height-size-tab-bar);
  width: 100%;
  flex-shrink: 0;
  position: relative;
  z-index: 5;
}
</style>