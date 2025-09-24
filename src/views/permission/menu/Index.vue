<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { usePermissionStore } from '@/stores'
import { VIEW_TYPE_TAG_MAP } from '@/constant'
import { getValue } from '@/utils'
import { Plus, Expand, Fold } from '@element-plus/icons-vue'
import ActionLinks from '@/components/basic/ActionLinks.vue'
import MenuDialog from '@/views/permission/menu/MenuDialog.vue'
import type { PermissionVO } from '@/types'
import { PermissionType } from '@/types'
import api from '@/services'
import { reloadRoutes } from '@/router/dynamicRoutes'
import { useTreeTableExpandState } from '@/utils/treeTable'

const router = useRouter()
const permissionStore = usePermissionStore()
const menuTableRef = ref()
const isLoading = ref(false)
const menuAndButtonTreeData = ref<PermissionVO[]>([])

// MenuDialog 相关状态
const menuDialogVisible = ref(false)
const currentMenuData = ref<PermissionVO | null>(null)

// 树型表格展开状态管理
const {
  handleExpandChange,
  restoreExpandedState,
  expandAll,
  collapseAll
} = useTreeTableExpandState('menuTable')

// 权限检查计算属性
const canAddMenu = computed(() => permissionStore.hasPermission('permission:menu:add'))
const canModifyMenu = computed(() => permissionStore.hasPermission('permission:menu:modify'))
const canDeleteMenu = computed(() => permissionStore.hasPermission('permission:menu:delete'))
const canMoveMenu = computed(() => permissionStore.hasPermission('permission:menu:move'))

// 检查是否有任何菜单操作权限
const hasAnyMenuOperationPermission = computed(() => {
  return permissionStore.hasAnyPermission([
    'permission:menu:add',
    'permission:menu:modify',
    'permission:menu:delete',
    'permission:menu:move'
  ])
})

// 展开全部
const handleExpandAll = () => expandAll(menuTableRef, menuAndButtonTreeData)

// 折叠全部
const handleCollapseAll = () => collapseAll(menuTableRef, menuAndButtonTreeData)

// 加载菜单数据
const loadMenuData = async () => {
  isLoading.value = true
  try {
    const data = await api.permission.getMenuAndButtonTree()
    if (data) {
      menuAndButtonTreeData.value = data
    }
  } finally {
    isLoading.value = false
  }
}

// 监听数据变化，恢复展开状态
watch(() => menuAndButtonTreeData.value, () => {
  if (menuAndButtonTreeData.value.length > 0) {
    restoreExpandedState(menuTableRef, menuAndButtonTreeData, handleExpandAll)
  }
}, { immediate: true })

onMounted(async () => {
  await loadMenuData()
  // 数据加载完成后恢复展开状态
  if (menuAndButtonTreeData.value.length > 0) {
    restoreExpandedState(menuTableRef, menuAndButtonTreeData, handleExpandAll)
  }
})

// 添加菜单
const handleAddMenu = () => {
  currentMenuData.value = null
  menuDialogVisible.value = true
}

// 菜单行操作方法
const handleAddChildMenu = (row: PermissionVO) => {
  // 根据父节点类型设置默认的子节点类型
  let defaultType = PermissionType.DIRECTORY
  if (row.node.type === PermissionType.MENU) {
    // 如果父节点是菜单，默认添加按钮
    defaultType = PermissionType.BUTTON
  } else if (row.node.type === PermissionType.DIRECTORY) {
    // 如果父节点是目录，默认添加目录
    defaultType = PermissionType.DIRECTORY
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

const handleEditMenu = (row: PermissionVO) => {
  currentMenuData.value = row
  menuDialogVisible.value = true
}

const handleDeleteMenu = async (row: PermissionVO) => {
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
  
  await permissionStore.deleteView(row.node.id)
  await loadMenuData()
  // 同步更新侧边栏菜单数据
  await permissionStore.getMenuTree()
  // 重新加载动态路由以移除已删除的页面路由
  await reloadRoutes(router)
}

// 上移菜单
const handleMoveUp = async (row: PermissionVO) => {
  await api.permission.movePermission(row.node.id, true)
  await loadMenuData()
  // 同步更新侧边栏菜单数据
  await permissionStore.getMenuTree()
}

// 下移菜单
const handleMoveDown = async (row: PermissionVO) => {
  await api.permission.movePermission(row.node.id, false)
  await loadMenuData()
  // 同步更新侧边栏菜单数据
  await permissionStore.getMenuTree()
}


// 处理MenuDialog成功事件
const handleMenuDialogSuccess = async () => {
  await loadMenuData()
  // 同步更新侧边栏菜单数据
  await permissionStore.getMenuTree()
  // 重新加载动态路由以包含新的页面路由
  await reloadRoutes(router)
}

// 获取菜单行操作配置
const getMenuActions = (row: PermissionVO) => {
  // 检查当前行是否不允许修改（hasChange为false）
  const isNotChangeable = row.hasChange === false
  
  // 检查当前行是否为按钮类型
  const isButton = row.node.type === PermissionType.BUTTON
  
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
      @expand-change="handleExpandChange"
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