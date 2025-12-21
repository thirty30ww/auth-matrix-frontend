<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Logo区域 - 当设置为显示在侧边栏时 -->
    <div v-if="themeStore.logoPosition === LOGO_POSITIONS.SIDEBAR" class="logo">
      <LogoIcon size="30px" />
      <span v-if="!isCollapsed">{{ systemStore.projectTitle }}</span>
    </div>
    
    <el-menu
      :collapse="isCollapsed"
      :default-active="activePath"
      class="el-menu-vertical"
      :class="{ 'menu-without-logo': themeStore.logoPosition === LOGO_POSITIONS.HEADER }"
      @select="handleSelect"
      router
      :unique-opened="true"
      :collapse-transition="false"
    >
      <!-- 动态渲染菜单 - 使用递归组件处理多级菜单 -->
      <template v-if="Array.isArray(menuTree) && menuTree.length > 0">
        <MenuTreeItem :menu-data="menuTree" />
      </template>
    </el-menu>
    
    <!-- 用户信息区域 -->
    <div class="user-profile" v-if="authStore.userLoggedIn">
      <!-- 折叠状态下：头像可点击显示下拉菜单 -->
      <template v-if="isCollapsed">
        <el-dropdown trigger="click" @command="handleCommand" placement="top" popper-class="sidebar-collapsed-dropdown">
          <el-avatar class="clickable-avatar">
            <UserAvatar :imageUrl="userInfo?.avatarUrl || undefined" />
          </el-avatar>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><UserFilled /></el-icon>
                个人中心
              </el-dropdown-item>
              <el-dropdown-item command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      
      <!-- 未折叠状态：原有的布局 -->
      <template v-else>
        <el-avatar>
          <UserAvatar :imageUrl="userInfo?.avatarUrl || undefined" />
        </el-avatar>
        <div class="user-info">
          <div class="user-name">{{ userInfo?.name || '未知用户' }}</div>
          <div class="user-username">{{ userInfo?.username }}</div>
        </div>
        <!-- 用户操作下拉菜单 -->
        <div class="user-actions">
          <el-dropdown trigger="click" @command="handleCommand">
            <IconButton>
              <el-icon class="user-menu-icon"><More /></el-icon>
            </IconButton>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><UserFilled /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {useAuthStore, useUserStore, usePermissionStore, useSystemStore, useThemeStore} from '@/stores'
import { LOGO_POSITIONS } from '@/stores/theme'
import {computed, onMounted} from 'vue'
import IconButton from '@/components/basic/IconButton.vue'
import UserAvatar from '@/components/basic/UserAvatar.vue'
import LogoIcon from '@/components/business/LogoIcon.vue'
import MenuTreeItem from '@/components/basic/MenuTreeItem.vue'

defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  }
});
const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const permissionStore = usePermissionStore()
const systemStore = useSystemStore()
const themeStore = useThemeStore()
const userInfo = computed(() => userStore.userInfo)

// 组件挂载时检查菜单数据，如果没有则加载（兜底逻辑）
onMounted(async () => {
  if (authStore.userLoggedIn && !permissionStore.hasMenuTree) {
    await permissionStore.getMenuTree()
  }
})

const activePath = computed(() => router.currentRoute.value.path)
// 菜单树数据 - 从store中获取专门的菜单树
const menuTree = computed(() => permissionStore.menuTree)

const handleCommand = (command: string) => {
  if (command === 'logout') {
    authStore.logout(true)
  } else if (command === 'profile') {
    router.push('/profile')
  }
}

const handleSelect = (key: string) => {
  router.push(key)
}
</script>

<style scoped>
.sidebar {
  height: 100%;
  background-color: var(--el-menu-bg-color);
  position: relative;
  transition: width 0.3s;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  height: var(--height-size-header);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: var(--el-menu-text-color);
  border-bottom: 1px solid var(--el-border-color-light);
  white-space: nowrap;
  overflow: hidden;
  gap: 8px;
  box-sizing: border-box; /* 确保边框包含在高度内 */
}



.el-menu-vertical {
  border-right: none;
  flex: 1;
}

.menu-without-logo {
  height: 100%;
}

/* 用户信息样式 */
.user-profile {
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar.collapsed .user-profile {
  justify-content: center;
}

.user-info {
  overflow: hidden;
  flex: 1;
}

.user-name {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--el-text-color-primary);
  font-size: var(--font-size-xs);
}

.user-username {
  font-size: var(--font-size-xs);
  color: var(--el-text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-actions {
  display: flex;
  align-items: center;
}

.user-menu-icon {
  width: var(--icon-size-xs);
  height: var(--icon-size-xs);
  transition: color 0.3s;
}

.icon-button:hover .user-menu-icon {
  color: var(--el-text-color-primary);
}

/* 可点击头像样式 */
.clickable-avatar {
  cursor: pointer;
  transition: all 0.3s ease;
}

.clickable-avatar:hover {
  transform: scale(1.05);
}
</style>

<!-- 全局样式，用于控制下拉菜单位置 -->
<style>
.sidebar-collapsed-dropdown {
  margin-left: var(--margin-size-spacing-2);
}
</style> 