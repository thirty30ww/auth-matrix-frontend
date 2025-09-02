<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useViewStore } from '@/stores'
import { VIEW_TYPE_TAG_MAP } from '@/constant'
import { getValue, useTableExpandCollapse } from '@/utils'
import { Plus, Expand, Fold } from '@element-plus/icons-vue'
import ActionLinks from '@/components/basic/ActionLinks.vue'
import type { ViewVO } from '@/types'

const viewStore = useViewStore()
const menuTableRef = ref()
const isLoading = ref(false)

// 使用树形表格展开/折叠钩子
const { expandAll: handleExpandAll, collapseAll: handleCollapseAll } = useTableExpandCollapse(
  menuTableRef,
  () => viewStore.viewTree
)

onMounted(async () => {
  await loadMenuData()
})

// 加载菜单数据
const loadMenuData = async () => {
  isLoading.value = true
  try {
    await viewStore.getViewTree()
  } finally {
    isLoading.value = false
  }
}

// 添加菜单（暂未实现）
const handleAddMenu = () => {
  console.log('添加菜单功能暂未实现')
}

// 菜单行操作方法
const handleAddChildMenu = (row: ViewVO) => {
  console.log('添加子菜单功能暂未实现', row)
}

const handleEditMenu = (row: ViewVO) => {
  console.log('修改菜单功能暂未实现', row)
}

const handleDeleteMenu = (row: ViewVO) => {
  console.log('删除菜单功能暂未实现', row)
}

// 获取菜单行操作配置
const getMenuActions = (row: ViewVO) => {
  return [
    {
      label: '添加',
      onClick: () => handleAddChildMenu(row),
      disabled: false, // 暂时不禁用，等接口实现后可以根据权限控制
      type: 'default' as const
    },
    {
      label: '修改',
      onClick: () => handleEditMenu(row),
      disabled: false,
      type: 'default' as const
    },
    {
      label: '删除',
      onClick: () => handleDeleteMenu(row),
      disabled: false,
      type: 'danger' as const
    }
  ]
}
</script>

<template>
  <el-card>
    <!-- 菜单操作按钮 -->
    <div class="menu-action-bar">
      <div class="left-actions">
        <el-button type="primary" @click="handleAddMenu">
          <el-icon class="el-icon--left"><Plus /></el-icon>
          添加
        </el-button>
        <el-button @click="handleExpandAll">
          <el-icon class="el-icon--left"><Expand /></el-icon>
          展开全部
        </el-button>
        <el-button @click="handleCollapseAll">
          <el-icon class="el-icon--left"><Fold /></el-icon>
          折叠全部
        </el-button>
      </div>
    </div>
    
    <el-table
      ref="menuTableRef"
      :data="viewStore.menuTree"
      row-key="node.id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      default-expand-all
      v-table-loading="{ loading: isLoading, text: '加载菜单数据中...' }"
    >
      <el-table-column label="菜单名称" min-width="200">
        <template #default="{ row }">
          <div class="menu-name-cell">
            <el-icon v-if="row.node.icon" class="menu-icon">
              <component :is="row.node.icon" />
            </el-icon>
            <span>{{ row.node.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="路径" min-width="200">
        <template #default="{ row }">
          <span>{{ row.node.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="100">
        <template #default="{ row }">
          <el-tag :type="getValue(VIEW_TYPE_TAG_MAP, row.node.type, 'default')">{{ row.node.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="{ row }">
          <ActionLinks :actions="getMenuActions(row)" />
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无菜单数据" />
      </template>
    </el-table>
  </el-card>
</template>

<style scoped>
.menu-name-cell {
  display: flex;
  align-items: center;
}

.menu-icon {
  margin-right: var(--margin-size-spacing-2);
}

.menu-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--margin-size-lg);
}

.left-actions {
  display: flex;
  align-items: center;
}
</style>