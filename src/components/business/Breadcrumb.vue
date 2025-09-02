<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item 
      v-for="(item, index) in breadcrumbItems" 
      :key="index" 
      :to="index === 0 ? item.path : ''"
    >
      <div class="breadcrumb-item-content">
        <el-icon v-if="item.icon" class="breadcrumb-icon">
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.title }}</span>
      </div>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useViewStore } from '@/stores'
import type {TabItem, ViewVO} from "@/types";
import { HOME } from '@/constant';

const route = useRoute()
const viewStore = useViewStore()

// 面包屑数据
const breadcrumbItems = computed(() => {
  const result: TabItem[] = []
  // 添加首页
  result.push({
    path: HOME.PATH,
    title: HOME.TITLE,
    icon: HOME.ICON
  })

  // 获取当前路由路径
  const currentPath = route.path
  
  // 如果是首页，则直接返回
  if (currentPath === '/home') {
    return result
  }

  // 递归查找当前路径的所有父级路径
  const findPathInViewTree = (nodes: ViewVO[], path: string, parents: TabItem[] = []): TabItem[] | null => {
    for (const item of nodes) {
      // 当前路径匹配
      if (item.node.path === path) {
        return [...parents, {
          path: item.node.path,
          title: item.node.name,
          icon: item.node.icon || ''
        }]
      }
      
      // 检查子节点
      if (item.children && item.children.length > 0) {
        const found: TabItem[] | null = findPathInViewTree(item.children, path, [...parents, {
          path: item.node.path,
          title: item.node.name,
          icon: item.node.icon || ''
        }])
        if (found) return found
      }
    }
    return null
  }

  // 在页面树中查找当前路径
  const pathItems = findPathInViewTree(viewStore.viewTree, currentPath)
  if (pathItems) {
    result.push(...pathItems)
  }

  return result
})
</script>

<style scoped>

.breadcrumb-item-content {
  display: flex;
  align-items: center;
  font-size: var(--font-size-breadcrumb);
}

.breadcrumb-icon {
  margin-right: 4px;
}
</style>