<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {ElMessageBox} from 'element-plus'
import type {Role, RoleVO, PermissionVO} from '@/types'
import api from '@/services'
import RoleTableSection from './RoleTable.vue'
import MenuPermissionSection from './MenuTable.vue'
import RoleDialog from '@/components/business/RoleDialog.vue'

// 响应式数据
const roleTableData = ref<RoleVO[]>([])
const menuTableData = ref<PermissionVO[]>([])
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

// 获取角色列表数据（带加载动画）
const getRoleTree = async () => {
  isLoadingRoles.value = true
  try {
    roleTableData.value = await api.role.getRoleTree()
  } finally {
    isLoadingRoles.value = false
  }
}

// 获取菜单列表数据
const getMenuTree = async (roleId?: number) => {
  isLoadingMenus.value = true
  try {
    const data = await api.permission.getMenuAndButtonTree(roleId)
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
}

// 添加角色按钮点击事件（顶部添加）
const handleAddRole = () => {
  currentRoleData.value = null
  currentParentNodeId.value = undefined
  showParentSelect.value = true
  roleDialogVisible.value = true
}

// 角色行操作方法
const handleAddChildRole = (row: RoleVO) => {
  // 行内添加子角色，ParentNodeId默认为当前点击行的角色ID，但允许用户修改
  currentRoleData.value = null
  currentParentNodeId.value = row.node.id
  showParentSelect.value = true // 显示父角色选择器
  roleDialogVisible.value = true
}

const handleEditRole = (row: RoleVO) => {
  // 编辑角色
  currentRoleData.value = row.node
  currentParentNodeId.value = undefined
  showParentSelect.value = true
  roleDialogVisible.value = true
}

const handleDeleteRole = async (row: RoleVO) => {
  await ElMessageBox.confirm(
    `确定要删除角色 "${row.node.name}" 吗？此操作不可撤销。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )

  await api.role.deleteRole(row.node.id)
  await getRoleTree() // 重新加载角色树

  // 如果删除的是当前选中的角色，清空选中状态
  if (selectedRole.value?.node.id === row.node.id) {
    selectedRole.value = null
    menuTableData.value = []
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
    await api.role.assignView(selectedRole.value.node.id, viewIds)
    // 重新加载菜单数据以反映最新的权限状态
    await getMenuTree(selectedRole.value.node.id)
  } finally {
    isLoadingMenus.value = false
  }
}

// 初始化
onMounted(async () => {
  await getRoleTree()
  // 初始化时不加载菜单，等待用户选择角色
})
</script>

<template>
  <el-card class="role-content">
    <!-- 左侧角色表格 -->
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

    <!-- 右侧菜单权限表格 -->
    <MenuPermissionSection
      ref="menuPermissionRef"
      :menu-table-data="menuTableData"
      :selected-role="selectedRole"
      :loading="isLoadingMenus"
      @confirm="handleConfirm"
    />

    <!-- 角色对话框 -->
    <RoleDialog
      v-model:visible="roleDialogVisible"
      :role-data="currentRoleData"
      :parent-node-id="currentParentNodeId"
      :show-parent-select="showParentSelect"
      @success="handleRoleDialogSuccess"
    />
  </el-card>
</template>

<style scoped>
.role-content {
  height: var(--height-size-page);
}

.role-content :deep(.el-card__body) {
  display: flex;
  height: calc(100% - 2 * var(--padding-size-card));
  gap: 12px;
}
</style>
