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
        <Header :isSidebarCollapsed="isCollapse" @toggle-sidebar="toggleSidebar" />
        
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

.el-container {
  height: 100%;
}

.aside-container {
  height: 100%;
  transition: width 0.3s;
  overflow: hidden;
  border-radius: var(--radius-none) var(--radius-card) var(--radius-menu) var(--radius-none);
  box-shadow: var(--el-box-shadow-light);
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-container {
  padding: 0;
  overflow: hidden;
}
</style> 