<template>
  <div class="header">
    <div class="header-left">
      <IconButton @click="toggleSidebar">
        <el-icon>
          <component :is="sidebarIcon" />
        </el-icon>
      </IconButton>
      <div class="breadcrumb-container">
        <Breadcrumb />
      </div>
    </div>
    
    <div class="header-actions">
      <SearchBox />
      
      <IconButton @click="toggleFullscreen">
        <el-icon>
          <component :is="fullscreenIcon" />
        </el-icon>
      </IconButton>
      
      <IconButton @click="toggleDarkMode">
        <el-icon>
          <component :is="themeIcon" />
        </el-icon>
      </IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores'
import { 
  FullScreen, 
  Aim, 
  Moon, 
  Sunny, 
  Fold, 
  Expand
} from '@element-plus/icons-vue'
import IconButton from '@/components/basic/IconButton.vue'
import Breadcrumb from '@/components/business/Breadcrumb.vue'
import SearchBox from '@/components/basic/SearchBox.vue'

const props = defineProps({
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-sidebar'])

const themeStore = useThemeStore()
const isFullscreen = ref(false)

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }
}

// 切换侧边栏
const toggleSidebar = () => {
  emit('toggle-sidebar')
}

// 切换暗黑模式
const toggleDarkMode = () => {
  themeStore.toggleDarkMode()
}

// 计算图标
const fullscreenIcon = computed(() => {
  return isFullscreen.value ? Aim : FullScreen
})

const themeIcon = computed(() => {
  return themeStore.isDarkMode ? Sunny : Moon
})

const sidebarIcon = computed(() => {
  return props.isSidebarCollapsed ? Expand : Fold
})
</script>

<style scoped>
.header {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}

.header-left {
  display: flex;
  align-items: center;
}

.breadcrumb-container {
  margin-left: 15px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style> 