<template>
  <template v-for="item in menuData" :key="item.node.id">
    <!-- 有子菜单且是目录类型：渲染为子菜单 -->
    <el-sub-menu
      v-if="item.children && item.children.length > 0 && item.node.type === PermissionType.DIRECTORY"
      :index="String(item.node.id)"
    >
      <template #title>
        <el-icon v-if="item.node.icon">
          <component :is="item.node.icon" />
        </el-icon>
        <span>{{ item.node.name }}</span>
      </template>
      
      <!-- 递归调用组件本身 -->
      <MenuTreeItem :menu-data="item.children" />
    </el-sub-menu>
    
    <!-- 没有子菜单或是菜单类型：渲染为菜单项 -->
    <el-menu-item 
      v-else
      :index="item.node.path"
    >
      <el-icon v-if="item.node.icon">
        <component :is="item.node.icon" />
      </el-icon>
      <template #title>{{ item.node.name }}</template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { PermissionBkVO } from '@/services'
import { PermissionType } from '@/services'

defineProps<{
  menuData: PermissionBkVO[]
}>()
</script>