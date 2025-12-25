<template>
  <div class="header">
    <div class="header-left">
      <!-- Logo区域 - 当设置为显示在顶栏时，放在最左边 -->
      <div v-if="themeStore.logoPosition === LOGO_POSITIONS.HEADER" class="header-logo">
        <LogoIcon size="30px" />
        <span class="logo-text">{{ systemStore.projectTitle }}</span>
      </div>
      
      <IconButton @click="toggleSidebar">
        <el-icon>
          <component :is="sidebarIcon" />
        </el-icon>
      </IconButton>
      
      <IconButton @click="refreshPage" title="刷新页面">
        <el-icon>
          <Refresh />
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
      
      <IconButton @click="openSettings">
        <el-icon>
          <Setting />
        </el-icon>
      </IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore, useSystemStore } from '@/stores'
import { usePageCacheStore } from '@/stores/pageCache'
import { LOGO_POSITIONS } from '@/stores/theme'
import { 
  FullScreen, 
  Aim, 
  Moon, 
  Sunny, 
  Fold, 
  Expand,
  Setting,
  Refresh
} from '@element-plus/icons-vue'
import IconButton from '@/components/basic/IconButton.vue'
import Breadcrumb from '@/components/business/Breadcrumb.vue'
import SearchBox from '@/components/business/SearchBox.vue'
import LogoIcon from '@/components/business/LogoIcon.vue'

const props = defineProps({
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-sidebar', 'open-settings', 'refresh-main'])

const route = useRoute()
const themeStore = useThemeStore()
const systemStore = useSystemStore()
const pageCacheStore = usePageCacheStore()
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

// 切换暗黑模式（带动画）
const toggleDarkMode = (event: MouseEvent) => {
  themeStore.toggleDarkMode(event)
}

// 打开设置面板
const openSettings = () => {
  emit('open-settings')
}

// 刷新主内容区域
const refreshPage = () => {
  // 清除当前页面的缓存
  const currentPath = route.path
  pageCacheStore.clearPageCache(currentPath)
  
  // 触发主内容区域刷新
  emit('refresh-main')
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
  background-color: var(--am-bg-color-overlay);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--gap-size-none) var(--gap-size-xl);
  box-sizing: border-box; /* 确保盒模型一致 */
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-logo {
  /* 完全模拟侧边栏logo的样式和尺寸 */
  width: var(--width-size-sidebar);
  height: var(--height-size-header);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
  flex-shrink: 0; /* 防止被压缩 */
  /* 抵消header的左内边距，让logo位置与侧边栏完全一致 */
  margin-left: calc(-1 * var(--gap-size-xl));
}

.logo-text {
  white-space: nowrap;
}

.breadcrumb-container {
  margin-left: var(--gap-size-md);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style> 