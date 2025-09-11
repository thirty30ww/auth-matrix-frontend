<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useViewStore } from '@/stores'
import { VIEW_TYPE_TAG_MAP } from '@/constant'
import { getValue, useTableExpandCollapse } from '@/utils'
import { Plus, Expand, Fold } from '@element-plus/icons-vue'
import ActionLinks from '@/components/basic/ActionLinks.vue'
import MenuDialog from '@/components/business/MenuDialog.vue'
import type { ViewVO } from '@/types'
import { ViewType } from '@/types'
import api from '@/services'
import { reloadRoutes } from '@/router/dynamicRoutes'

const router = useRouter()
const viewStore = useViewStore()
const menuTableRef = ref()
const isLoading = ref(false)
const menuAndButtonTreeData = ref<ViewVO[]>([])

// MenuDialog 相关状态
const menuDialogVisible = ref(false)
const currentMenuData = ref<ViewVO | null>(null)

// 使用树形表格展开/折叠钩子
const { expandAll: handleExpandAll, collapseAll: handleCollapseAll } = useTableExpandCollapse(
  menuTableRef,
  () => menuAndButtonTreeData.value
)

// 权限检查计算属性
const canAddMenu = computed(() => viewStore.hasPermission('permission:menu:add'))
const canModifyMenu = computed(() => viewStore.hasPermission('permission:menu:modify'))
const canDeleteMenu = computed(() => viewStore.hasPermission('permission:menu:delete'))
const canMoveMenu = computed(() => viewStore.hasPermission('permission:menu:move'))

// 检查是否有任何菜单操作权限
const hasAnyMenuOperationPermission = computed(() => {
  return viewStore.hasAnyPermission([
    'permission:menu:add',
    'permission:menu:modify',
    'permission:menu:delete',
    'permission:menu:move'
  ])
})

onMounted(async () => {
  await loadMenuData()
})

// 加载菜单数据
const loadMenuData = async () => {
  isLoading.value = true
  try {
    const data = await api.view.getMenuAndButtonTree()
    if (data) {
      menuAndButtonTreeData.value = data
    }
  } finally {
    isLoading.value = false
  }
}

// 添加菜单
const handleAddMenu = () => {
  currentMenuData.value = null
  menuDialogVisible.value = true
}

// 菜单行操作方法
const handleAddChildMenu = (row: ViewVO) => {
  // 根据父节点类型设置默认的子节点类型
  let defaultType = ViewType.DIRECTORY
  if (row.node.type === ViewType.MENU) {
    // 如果父节点是菜单，默认添加按钮
    defaultType = ViewType.BUTTON
  } else if (row.node.type === ViewType.DIRECTORY) {
    // 如果父节点是目录，默认添加目录
    defaultType = ViewType.DIRECTORY
  }
  
  // 为添加子菜单，传递父节点信息以便在对话框中预选
  currentMenuData.value = {
    node: {
      id: 0,
      name: '',
      path: '',
      component: '',
      type: defaultType,
      parentNodeId: row.node.id, // 设置父节点ID为当前行的ID
      frontNodeId: 0,
      behindNodeId: 0,
      icon: '',
      permissionCode: '',
      isValid: true
    },
    children: []
  }
  menuDialogVisible.value = true
}

const handleEditMenu = (row: ViewVO) => {
  currentMenuData.value = row
  menuDialogVisible.value = true
}

const handleDeleteMenu = async (row: ViewVO) => {
  // 确认删除操作
  const confirmed = await ElMessageBox.confirm(
    '确定要删除该菜单吗？删除后不可恢复。',
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).catch(() => false)
  
  if (!confirmed) return
  
  await viewStore.deleteView(row.node.id)
  await loadMenuData()
  // 同步更新侧边栏菜单数据
  await viewStore.getMenuTree()
  // 重新加载动态路由以移除已删除的页面路由
  await reloadRoutes(router)
}

// 上移菜单
const handleMoveUp = async (row: ViewVO) => {
  await api.view.moveView(row.node.id, true)
  await loadMenuData()
  // 同步更新侧边栏菜单数据
  await viewStore.getMenuTree()
}

// 下移菜单
const handleMoveDown = async (row: ViewVO) => {
  await api.view.moveView(row.node.id, false)
  await loadMenuData()
  // 同步更新侧边栏菜单数据
  await viewStore.getMenuTree()
}


// 处理MenuDialog成功事件
const handleMenuDialogSuccess = async () => {
  await loadMenuData()
  // 同步更新侧边栏菜单数据
  await viewStore.getMenuTree()
  // 重新加载动态路由以包含新的页面路由
  await reloadRoutes(router)
}

// 获取菜单行操作配置
const getMenuActions = (row: ViewVO) => {
  // 检查当前行是否不允许修改（hasChange为false）
  const isNotChangeable = row.hasChange === false
  
  // 检查当前行是否为按钮类型
  const isButton = row.node.type === ViewType.BUTTON
  
  const allActions = []
  
  // 添加按钮
  allActions.push({
    label: '添加',
    onClick: () => handleAddChildMenu(row),
    // 如果是按钮类型或者hasChange为false，则禁用添加功能
    disabled: isNotChangeable || isButton,
    type: 'default' as const,
    permission: canAddMenu.value
  })
  
  // 上移按钮
  allActions.push({
    label: '上移',
    onClick: () => handleMoveUp(row),
    // frontNodeId === 0 表示是第一个时禁用
    disabled: row.node.frontNodeId === 0,
    type: 'default' as const,
    permission: canMoveMenu.value
  })
  
  // 下移按钮
  allActions.push({
    label: '下移',
    onClick: () => handleMoveDown(row),
    // behindNodeId === 0 表示是最后一个时禁用
    disabled: row.node.behindNodeId === 0,
    type: 'default' as const,
    permission: canMoveMenu.value
  })
  
  // 修改按钮
  allActions.push({
    label: '修改',
    onClick: () => handleEditMenu(row),
    // 如果hasChange为false，则禁用修改功能
    disabled: isNotChangeable,
    type: 'default' as const,
    permission: canModifyMenu.value
  })
  
  // 删除按钮
  allActions.push({
    label: '删除',
    onClick: () => handleDeleteMenu(row),
    // 如果hasChange为false，则禁用删除功能
    disabled: isNotChangeable,
    type: 'danger' as const,
    permission: canDeleteMenu.value
  })
  
  // 只返回有权限的操作
  return allActions.filter(action => action.permission).map(action => ({
    label: action.label,
    onClick: action.onClick,
    disabled: action.disabled,
    type: action.type
  }))
}
</script>

<template>
  <el-card>
    <!-- 菜单操作按钮 -->
    <div class="menu-action-bar">
      <div class="left-actions">
        <el-button v-permission="'permission:menu:add'" type="primary" @click="handleAddMenu">
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
      :data="menuAndButtonTreeData"
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
      <el-table-column label="可见" min-width="100">
        <template #default="{ row }">
          <span>{{ row.node.isValid ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="100">
        <template #default="{ row }">
          <el-tag :type="getValue(VIEW_TYPE_TAG_MAP, row.node.type, 'primary')">{{ row.node.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="hasAnyMenuOperationPermission" label="操作" width="280" align="center">
        <template #default="{ row }">
          <ActionLinks :actions="getMenuActions(row)" />
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无菜单数据" />
      </template>
    </el-table>
  </el-card>
  
  <!-- 菜单对话框 -->
  <MenuDialog 
    v-model:visible="menuDialogVisible"
    :menu-data="currentMenuData"
    @success="handleMenuDialogSuccess"
  />
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