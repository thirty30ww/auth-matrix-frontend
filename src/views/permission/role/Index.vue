<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import {ElMessageBox} from 'element-plus'
import type {Role, RoleVO, PermissionBkVO} from '@/services'
import api from '@/services'
import RoleTableSection from './RoleTable.vue'
import MenuPermissionSection from './MenuTable.vue'
import RoleDialog from '@/views/permission/role/RoleDialog.vue'
import AmCard from '@/components/basic/AmCard.vue'
import { useRolePageCache } from '@/composables/usePageCache'
import { usePermissionStore } from '@/stores/permission'
import { isGlobalRole, getRoleTypeLabel } from '@/constant'

// 响应式数据
const roleTableData = ref<RoleVO[]>([])
const menuTableData = ref<PermissionBkVO[]>([])
const selectedRole = ref<RoleVO | null>(null)
const roleTableRef = ref()
const menuPermissionRef = ref()

// 加载状态
const isLoadingRoles = ref(false)
const isLoadingMenus = ref(false)

// 角色对话框相关状态
const roleDialogVisible = ref(false)
const currentRoleData = ref<Role | null>(null)
const currentParentNodeId = ref<number | undefined>(undefined)
const showParentSelect = ref(true)
const showRoleTypeSelect = ref(false)

// 页面缓存
const rolePageCache = useRolePageCache()

// 权限 store
const permissionStore = usePermissionStore()

// 处理全局角色权限的递归函数
const processRolePermissions = (roles: RoleVO[]): RoleVO[] => {
  const hasGlobalRolePermission = permissionStore.hasPermission('permission:role:global')
  
  return roles.map(role => {
    const processedRole = { ...role }
    
    // 如果是全局角色但用户没有全局角色权限，设置 hasPermission 为 false
    if (isGlobalRole(processedRole.node.level) && !hasGlobalRolePermission) {
      processedRole.hasPermission = false
    }
    
    // 递归处理子角色
    if (processedRole.children && processedRole.children.length > 0) {
      processedRole.children = processRolePermissions(processedRole.children)
    }
    
    return processedRole
  })
}

// 获取角色列表数据（带加载动画）
const getRoleTree = async () => {
  isLoadingRoles.value = true
  try {
    const rawData = await api.role.getRoleTree()
    // 处理全局角色权限
    roleTableData.value = processRolePermissions(rawData)
  } finally {
    isLoadingRoles.value = false
  }
}

// 获取菜单列表数据
const getMenuTree = async (roleId?: number) => {
  isLoadingMenus.value = true
  try {
    const data = await api.permission_bk.getMenuAndButtonTree(roleId)
    if (data) {
      menuTableData.value = data
    }
  } finally {
    isLoadingMenus.value = false
  }
}

// 角色表格行点击事件
const handleRoleRowClick = async (row: RoleVO) => {
  selectedRole.value = row
  await getMenuTree(row.node.id)
  
  // 缓存选中的角色
  rolePageCache.updateCache({
    selectedRole: {
      id: row.node.id,
      name: row.node.name,
      description: row.node.description
    }
  })
}

// 添加角色按钮点击事件（顶部添加）
const handleAddRole = () => {
  currentRoleData.value = null
  currentParentNodeId.value = undefined
  showParentSelect.value = true
  showRoleTypeSelect.value = true // 顶部添加时显示角色类型选择器
  roleDialogVisible.value = true
}

// 角色行操作方法
const handleAddChildRole = (row: RoleVO) => {
  // 行内添加子角色，ParentNodeId默认为当前点击行的角色ID，但允许用户修改
  currentRoleData.value = null
  currentParentNodeId.value = row.node.id
  showParentSelect.value = true // 显示父角色选择器
  showRoleTypeSelect.value = false // 行内添加时不显示角色类型选择器
  roleDialogVisible.value = true
}

const handleEditRole = (row: RoleVO) => {
  // 编辑角色
  currentRoleData.value = row.node
  currentParentNodeId.value = undefined
  showParentSelect.value = true
  showRoleTypeSelect.value = false // 编辑时不显示角色类型选择器
  roleDialogVisible.value = true
}

const handleDeleteRole = async (row: RoleVO) => {
  const isGlobalRoleToDelete = isGlobalRole(row.node.level)
  const roleTypeText = getRoleTypeLabel(row.node.level)
  
  await ElMessageBox.confirm(
    `确定要删除${roleTypeText} "${row.node.name}" 吗？此操作不可撤销。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )

  // 根据角色类型调用不同的删除API
  if (isGlobalRoleToDelete) {
    await api.role.deleteGlobalRole(row.node.id)
  } else {
    await api.role.deleteRole(row.node.id)
  }
  
  await getRoleTree() // 重新加载角色树

  // 如果删除的是当前选中的角色，清空选中状态
  if (selectedRole.value?.node.id === row.node.id) {
    selectedRole.value = null
    menuTableData.value = []
    // 清除缓存中的选中角色
    rolePageCache.updateCache({ selectedRole: undefined })
  }
}

// 角色对话框成功回调
const handleRoleDialogSuccess = async () => {
  await getRoleTree() // 重新加载角色树
}

// 展开折叠控制方法
const handleExpandAll = () => {
  // 同时展开左右两边的表格
  if (roleTableRef.value) {
    roleTableRef.value.expandAll()
  }
  if (menuPermissionRef.value) {
    menuPermissionRef.value.expandAllMenus()
  }
}

const handleCollapseAll = () => {
  // 同时折叠左右两边的表格
  if (roleTableRef.value) {
    roleTableRef.value.collapseAll()
  }
  if (menuPermissionRef.value) {
    menuPermissionRef.value.collapseAllMenus()
  }
}

// 菜单权限操作方法
const handleConfirm = async (viewIds: number[]) => {
  if (!selectedRole.value) {
    return
  }
  
  isLoadingMenus.value = true
  try {
    const isGlobalRoleSelected = isGlobalRole(selectedRole.value.node.level)
    
    // 根据角色类型调用不同的权限分配API
    if (isGlobalRoleSelected) {
      await api.role.assignGlobalPermission(selectedRole.value.node.id, viewIds)
    } else {
      await api.role.assignPermission(selectedRole.value.node.id, viewIds)
    }
    
    // 重新加载菜单数据以反映最新的权限状态
    await getMenuTree(selectedRole.value.node.id)
  } finally {
    isLoadingMenus.value = false
  }
}

// 递归查找角色
const findRoleById = (roles: RoleVO[], id: number): RoleVO | null => {
  for (const role of roles) {
    if (role.node.id === id) {
      return role
    }
    if (role.children && role.children.length > 0) {
      const found = findRoleById(role.children, id)
      if (found) return found
    }
  }
  return null
}

// 从缓存恢复选中的角色
const restoreSelectedRole = () => {
  const cached = rolePageCache.restoreFromCache()
  if (cached?.selectedRole && roleTableData.value.length > 0) {
    const role = findRoleById(roleTableData.value, cached.selectedRole.id)
    if (role) {
      selectedRole.value = role
      // 加载该角色的菜单数据
      getMenuTree(role.node.id)
    }
  }
}

// 监听权限码变化，重新处理角色权限状态
watch(() => permissionStore.permissionCodes, () => {
  if (roleTableData.value.length > 0) {
    // 重新处理角色权限状态
    roleTableData.value = processRolePermissions(roleTableData.value)
  }
}, { deep: true })

// 监听角色数据变化，恢复选中状态
watch(() => roleTableData.value, () => {
  if (roleTableData.value.length > 0) {
    restoreSelectedRole()
  }
}, { immediate: true })

// 初始化
onMounted(async () => {
  // 确保权限码已加载完成再获取角色树
  if (!permissionStore.hasPermissionCodes) {
    await permissionStore.getPermissionCodes()
  }
  await getRoleTree()
  // 角色数据加载完成后，尝试恢复选中状态
  restoreSelectedRole()
})
</script>

<template>
  <div class="role-page-container">
    <!-- 左侧角色表格卡片 -->
    <AmCard class="role-card" :padding="20">
      <RoleTableSection
        ref="roleTableRef"
        :role-table-data="roleTableData"
        :selected-role="selectedRole"
        :loading="isLoadingRoles"
        @role-row-click="handleRoleRowClick"
        @add-role="handleAddRole"
        @edit-role="handleEditRole"
        @delete-role="handleDeleteRole"
        @add-child-role="handleAddChildRole"
        @expand-all="handleExpandAll"
        @collapse-all="handleCollapseAll"
      />
    </AmCard>

    <!-- 右侧菜单权限表格卡片 -->
    <AmCard class="menu-card" :padding="20">
      <MenuPermissionSection
        ref="menuPermissionRef"
        :menu-table-data="menuTableData"
        :selected-role="selectedRole"
        :loading="isLoadingMenus"
        @confirm="handleConfirm"
      />
    </AmCard>

    <!-- 角色对话框 -->
    <RoleDialog
      v-model:visible="roleDialogVisible"
      :role-data="currentRoleData"
      :parent-id="currentParentNodeId"
      :show-parent-select="showParentSelect"
      :show-role-type-select="showRoleTypeSelect"
      @success="handleRoleDialogSuccess"
    />
  </div>
</template>

<style scoped>
.role-page-container {
  display: flex;
  height: var(--height-size-page);
  gap: var(--gap-size-xl);
}

.role-card {
  flex: 0 0 70%;
}

.menu-card {
  flex: 0 0 calc(30% - var(--gap-size-xl));
}

.role-card :deep(.el-card__body),
.menu-card :deep(.el-card__body) {
  display: flex;
  height: calc(100% - 2 * var(--gap-size-xl));
}

.role-card :deep(.role-table-section) {
  width: 100%;
  border-right: none;
  padding-right: 0;
}

.menu-card :deep(.menu-table-section) {
  width: 100%;
}
</style>
