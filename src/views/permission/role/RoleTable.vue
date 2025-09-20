<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import type { RoleVO } from '@/types'
import StatusDot from '@/components/basic/StatusDot.vue'
import ActionLinks from '@/components/basic/ActionLinks.vue'
import { Plus, Expand, Fold } from '@element-plus/icons-vue'
import {PermissionStatus} from "../../../constant"
import { useUserStore } from '@/stores'
import { usePermissionStore } from '@/stores/permission.ts'

// Props
interface Props {
  roleTableData: RoleVO[]
  selectedRole: RoleVO | null
  loading?: boolean
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'roleRowClick', row: RoleVO): void
  (e: 'addRole'): void
  (e: 'editRole', row: RoleVO): void
  (e: 'deleteRole', row: RoleVO): void
  (e: 'addChildRole', row: RoleVO): void
  (e: 'expandAll'): void
  (e: 'collapseAll'): void
}

const emit = defineEmits<Emits>()

// Stores
const userStore = useUserStore()
const viewStore = usePermissionStore()

// Refs
const roleTableRef = ref()

// Computed
const currentUserRoleIds = computed(() => {
  return userStore.userInfo?.roles?.map(role => role.id) || []
})

// 检查是否有任何角色操作权限
const hasAnyRoleOperationPermission = computed(() => {
  return viewStore.hasAnyPermission([
    'permission:role:add',
    'permission:role:modify', 
    'permission:role:delete'
  ])
})

// 角色表格行点击事件
const handleRoleRowClick = (row: RoleVO) => {
  emit('roleRowClick', row)
}

// 添加角色按钮点击事件
const handleAddRole = () => {
  emit('addRole')
}

// 展开全部
const handleExpandAll = () => {
  emit('expandAll')
}

// 折叠全部
const handleCollapseAll = () => {
  emit('collapseAll')
}

// 内部展开方法（供父组件调用）
const expandAll = async () => {
  await nextTick()
  
  // 递归展开所有行
  const expandAllRows = (data: any[], tableRef: any) => {
    data.forEach(item => {
      if (item.children && item.children.length > 0) {
        tableRef.toggleRowExpansion(item, true)
        expandAllRows(item.children, tableRef)
      }
    })
  }
  
  if (roleTableRef.value && props.roleTableData.length > 0) {
    expandAllRows(props.roleTableData, roleTableRef.value)
  }
}

// 内部折叠方法（供父组件调用）
const collapseAll = async () => {
  await nextTick()
  
  // 递归折叠所有行
  const collapseAllRows = (data: any[], tableRef: any) => {
    data.forEach(item => {
      if (item.children && item.children.length > 0) {
        tableRef.toggleRowExpansion(item, false)
        collapseAllRows(item.children, tableRef)
      }
    })
  }
  
  if (roleTableRef.value && props.roleTableData.length > 0) {
    collapseAllRows(props.roleTableData, roleTableRef.value)
  }
}

// 角色行操作方法
const handleAddChildRole = (row: RoleVO) => {
  emit('addChildRole', row)
}

const handleEditRole = (row: RoleVO) => {
  emit('editRole', row)
}

const handleDeleteRole = (row: RoleVO) => {
  emit('deleteRole', row)
}

// 获取角色行操作配置
const getRoleActions = (row: RoleVO) => {
  // 添加按钮disabled条件：不仅要hasPermission为false，还要该角色不在当前用户的角色列表中
  const isAddDisabled = !row.hasPermission && !currentUserRoleIds.value.includes(row.node.id)
  
  // 检查相关权限
  const canAdd = viewStore.hasPermission('permission:role:add')
  const canModify = viewStore.hasPermission('permission:role:modify')
  const canDelete = viewStore.hasPermission('permission:role:delete')
  
  const allActions = [
    {
      label: '添加',
      onClick: () => handleAddChildRole(row),
      disabled: isAddDisabled,
      type: 'default' as const,
      permission: canAdd
    },
    {
      label: '修改',
      onClick: () => handleEditRole(row),
      disabled: !row.hasPermission,
      type: 'default' as const,
      permission: canModify
    },
    {
      label: '删除',
      onClick: () => handleDeleteRole(row),
      disabled: !row.hasPermission,
      type: 'danger' as const,
      permission: canDelete
    }
  ]
  
  // 只返回有权限的操作
  return allActions.filter(action => action.permission).map(action => ({
    label: action.label,
    onClick: action.onClick,
    disabled: action.disabled,
    type: action.type
  }))
}

// 暴露方法给父组件
defineExpose({
  expandAll,
  collapseAll
})
</script>

<template>
  <div class="role-table-section">
    <!-- 角色操作按钮 -->
    <div class="role-action-bar">
      <div class="left-actions">
        <el-button v-permission="'permission:role:add'" type="primary" @click="handleAddRole">
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
      ref="roleTableRef"
      :data="roleTableData"
      row-key="node.id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      highlight-current-row
      @row-click="handleRoleRowClick"
      default-expand-all
      v-table-loading="{ loading: $props.loading || false, text: '加载角色数据中...' }"
    >
      <el-table-column prop="node.name" label="角色名称" min-width="120px"/>
      <el-table-column prop="node.description" label="描述" min-width="300px"/>
      <el-table-column label="权限状态" min-width="100px">
        <template #default="{ row }">
          <StatusDot 
            :status="row.hasPermission" 
            :valid-text="PermissionStatus.YES"
            :invalid-text="PermissionStatus.NO"
            size="small"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="hasAnyRoleOperationPermission" label="操作" width="180" align="center">
        <template #default="{ row }">
          <ActionLinks :actions="getRoleActions(row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.role-table-section {
  width: calc(70% - 6px); /* 减去gap的一半 */
  border-right: 1px solid var(--el-border-color-light);
  padding-right: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.role-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--margin-size-lg);
}

.left-actions {
  display: flex;
  align-items: center;
}

/* 表格容器样式 */
.role-table-section .el-table {
  flex: 1;
  overflow: auto;
}

/* 操作栏固定在顶部 */
.role-action-bar {
  flex-shrink: 0;
}
</style>