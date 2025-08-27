<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { RoleVO, ViewVO } from '@/types'
import api from '@/services'
import RoleTableSection from './RoleTable.vue'
import MenuPermissionSection from './MenuTable.vue'

// 响应式数据
const roleTableData = ref<RoleVO[]>([])
const menuTableData = ref<ViewVO[]>([])
const selectedRole = ref<RoleVO | null>(null)
const roleTableRef = ref()
const menuPermissionRef = ref()

// 获取角色列表数据
const getRoleTree = async () => {
  roleTableData.value = await api.role.getRoleTree()
}

// 获取菜单列表数据
const getMenuTree = async (roleId?: number) => {
  menuTableData.value = await api.view.getMenuTree(roleId)
}

// 角色表格行点击事件
const handleRoleRowClick = async (row: RoleVO) => {
  selectedRole.value = row
  await getMenuTree(row.node.id)
}

// 添加角色按钮点击事件
const handleAddRole = () => {
  // TODO: 实现添加角色功能
  console.log('添加角色功能待实现')
}

// 角色行操作方法
const handleAddChildRole = (row: RoleVO) => {
  // TODO: 实现添加子角色功能
  console.log('添加子角色', row)
}

const handleEditRole = (row: RoleVO) => {
  // TODO: 实现编辑角色功能
  console.log('编辑角色', row)
}

const handleDeleteRole = (row: RoleVO) => {
  // TODO: 实现删除角色功能
  console.log('删除角色', row)
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
const handleConfirm = () => {
  // TODO: 实现确认功能
  console.log('确认权限设置')
}

const handleReset = () => {
  // TODO: 实现重置功能
  console.log('重置权限设置')
}

// 初始化
onMounted(async () => {
  await getRoleTree()
  // 初始化时不加载菜单，等待用户选择角色
})
</script>

<template>
  <el-card>
    <div class="role-content">
      <!-- 左侧角色表格 -->
      <RoleTableSection
        ref="roleTableRef"
        :role-table-data="roleTableData"
        :selected-role="selectedRole"
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
        @confirm="handleConfirm"
        @reset="handleReset"
      />
    </div>
  </el-card>
</template>

<style scoped>
.role-content {
  display: flex;
  height: calc(100vh - var(--height-size-tab-bar) - var(--height-size-header) - var(--padding-size-main-bottom) - var(--padding-size-main-top) - 2 * var(--padding-size-card));
  gap: 12px;
}
</style>