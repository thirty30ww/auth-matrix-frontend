<template>
  <div class="layout-preview" :class="{ 'header-layout': isHeaderLayout, 'active': isActive }">
    <!-- 顶栏模式：Logo在header中 -->
    <div v-if="isHeaderLayout" class="preview-header">
      <div class="preview-logo"></div>
    </div>
    
    <!-- 主体区域 -->
    <div class="preview-body">
      <!-- 侧边栏 -->
      <div class="preview-sidebar">
        <!-- 侧边栏模式：Logo在sidebar中 -->
        <div v-if="!isHeaderLayout" class="preview-logo"></div>
      </div>
      
      <!-- 主内容区 -->
      <div class="preview-main">
        <!-- 侧边栏模式时的header -->
        <div v-if="!isHeaderLayout" class="preview-header"></div>
        
        <!-- 内容区 -->
        <div class="preview-content"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isHeaderLayout: boolean
  isActive?: boolean
}

defineProps<Props>()
</script>

<style scoped>
.layout-preview {
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: all 0.2s ease;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.layout-preview:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}


/* 顶栏模式 */
.header-layout .preview-header {
  height: 12px;
  background-color: var(--el-color-info-light-7);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

.header-layout.active .preview-header {
  background-color: var(--el-color-primary);
}

.header-layout .preview-body {
  flex: 1;
  display: flex;
  gap: 2px;
}

.header-layout .preview-sidebar {
  width: 30px;
  background-color: var(--el-color-info-light-8);
  border-radius: 0 0 0 var(--radius-md);
}

.header-layout.active .preview-sidebar {
  background-color: var(--el-color-primary-light-3);
}

.header-layout .preview-main {
  flex: 1;
  background-color: var(--el-color-info-light-9);
  border-radius: 0 0 var(--radius-md) 0;
}

.header-layout.active .preview-main {
  background-color: var(--el-color-primary-light-5);
}

/* 侧边栏模式 */
.preview-body {
  flex: 1;
  display: flex;
  gap: 2px;
}

.preview-sidebar {
  width: 30px;
  background-color: var(--el-color-info-light-8);
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}

.layout-preview.active .preview-sidebar {
  background-color: var(--el-color-primary-light-3);
}

.preview-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.preview-header {
  height: 12px;
  background-color: var(--el-color-info-light-7);
  border-radius: 0 var(--radius-md) 0 0;
}

.layout-preview.active .preview-header {
  background-color: var(--el-color-primary);
}

.preview-content {
  flex: 1;
  background-color: var(--el-color-info-light-9);
  border-radius: 0 0 var(--radius-md) 0;
}

.layout-preview.active .preview-content {
  background-color: var(--el-color-primary-light-5);
}

/* Logo 小色块 */
.preview-logo {
  width: 12px;
  height: 8px;
  background-color: var(--el-color-info-light-6);
  margin: 3px;
  border-radius: var(--radius-sm);
}

.layout-preview.active .preview-logo {
  background-color: var(--el-color-warning);
}

</style>