<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="logo">
      <LogoIcon size="30px" />
      <span v-if="!isCollapsed">Prose Pulse</span>
    </div>
    
    <el-menu
      :collapse="isCollapsed"
      :default-active="activePath"
      class="el-menu-vertical"
      @select="handleSelect"
      router
      :unique-opened="true"
    >
      <!-- 动态渲染菜单 - 处理数组类型的菜单数据 -->
      <template v-if="Array.isArray(menuTree) && menuTree.length > 0">
        <template v-for="menu in menuTree" :key="menu.node.id">
          <!-- 一级菜单项 -->
          <el-menu-item 
            v-if="(!menu.children || menu.children.length === 0)"
            :index="menu.node.path"
          >
            <el-icon><component :is="menu.node.icon" /></el-icon>
            <template #title>{{ menu.node.name }}</template>
          </el-menu-item>
          
          <!-- 二级菜单 -->
          <el-sub-menu
            v-else
            :index="String(menu.node.id)"
          >
            <template #title>
              <el-icon><component :is="menu.node.icon" /></el-icon>
              <span>{{ menu.node.name }}</span>
            </template>
            
            <!-- 子菜单项 -->
            <template v-for="subMenu in menu.children" :key="subMenu.node.id">
              <el-menu-item 
                :index="subMenu.node.path"
              >
                <el-icon><component :is="subMenu.node.icon" /></el-icon>
                <span>{{ subMenu.node.name }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
      </template>
    </el-menu>
    
    <!-- 用户信息区域 -->
    <div class="user-profile" v-if="authStore.userLoggedIn">
      <el-avatar>
        <UserAvatar :imageUrl="userInfo?.avatarUrl || undefined" />
      </el-avatar>
      <div class="user-info" v-if="!isCollapsed">
        <div class="user-name">{{ userInfo?.name || '未知用户' }}</div>
        <div class="user-username">{{ userInfo?.username }}</div>
      </div>
      <!-- 用户操作下拉菜单 -->
      <div class="user-actions" v-if="!isCollapsed">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {useAuthStore, useUserStore, useViewStore} from '@/stores'
import {computed, onMounted} from 'vue'
import IconButton from '@/components/basic/IconButton.vue'
import UserAvatar from '@/components/basic/UserAvatar.vue'
import LogoIcon from '@/components/business/LogoIcon.vue'

defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  }
});
const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const viewStore = useViewStore()
const userInfo = computed(() => userStore.userInfo)

// 组件挂载时加载菜单数据
onMounted(async () => {
  if (authStore.userLoggedIn) {
    await viewStore.getMenuTree()
  }
})

const activePath = computed(() => router.currentRoute.value.path)
// 菜单树数据 - 从store中获取专门的菜单树
const menuTree = computed(() => viewStore.menuTree)

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
  width: 200px;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  height: 50px;
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
}



.el-menu-vertical {
  border-right: none;
  flex: 1;
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
</style> 