<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import type { RoleVO } from '@/services'
import StatusDot from '@/components/basic/StatusDot.vue'
import AmActionLinks from '@/components/basic/AmActionLinks.vue'
import { Plus, Expand, Fold } from '@element-plus/icons-vue'
import {PermissionStatus} from "@/constant"
import { useUserStore } from '@/stores'
import { usePermissionStore } from '@/stores/permission'
import { useTreeTableExpandState } from '@/utils/treeTable'

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
const permissionStore = usePermissionStore()

// Refs
const roleTableRef = ref()

// 树型表格展开状态管理
const {
  handleExpandChange,
  restoreExpandedState,
  expandAll,
  collapseAll
} = useTreeTableExpandState('roleTable')

// Computed
const currentUserRoleIds = computed(() => {
  return userStore.userInfo?.roles?.map(role => role.id) || []
})

// 检查是否有任何角色操作权限
const hasAnyRoleOperationPermission = computed(() => {
  return permissionStore.hasAnyPermission([
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
const internalExpandAll = () => expandAll(roleTableRef, props.roleTableData)

// 内部折叠方法（供父组件调用）
const internalCollapseAll = () => collapseAll(roleTableRef, props.roleTableData)

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
  // 检查是否为全局角色
  const isGlobalRole = row.node.level === -1
  
  // 添加按钮disabled条件：全局角色不能添加子角色，或者没有权限的情况
  const isAddDisabled = isGlobalRole || (!row.hasPermission && !currentUserRoleIds.value.includes(row.node.id))
  
  // 检查基础权限（用于显示按钮）
  const hasAddPermission = permissionStore.hasPermission('permission:role:add')
  const hasModifyPermission = permissionStore.hasPermission('permission:role:modify')
  const hasDeletePermission = permissionStore.hasPermission('permission:role:delete')
  
  const allActions = [
    {
      label: '添加',
      onClick: () => handleAddChildRole(row),
      disabled: isAddDisabled,
      type: 'default' as const,
      permission: hasAddPermission
    },
    {
      label: '修改',
      onClick: () => handleEditRole(row),
      disabled: !row.hasPermission,
      type: 'default' as const,
      permission: hasModifyPermission
    },
    {
      label: '删除',
      onClick: () => handleDeleteRole(row),
      disabled: !row.hasPermission,
      type: 'danger' as const,
      permission: hasDeletePermission
    }
  ]
  
  // 只返回有基础权限的操作（显示按钮，但可能被禁用）
  return allActions.filter(action => action.permission).map(action => ({
    label: action.label,
    onClick: action.onClick,
    disabled: action.disabled,
    type: action.type
  }))
}

// 监听数据变化，恢复展开状态
watch(() => props.roleTableData, () => {
  if (props.roleTableData.length > 0) {
    restoreExpandedState(roleTableRef, props.roleTableData, internalExpandAll)
  }
}, { immediate: true })

// 组件挂载后恢复展开状态
onMounted(() => {
  if (props.roleTableData.length > 0) {
    restoreExpandedState(roleTableRef, props.roleTableData, internalExpandAll)
  }
})

// 设置当前选中行的方法
const setCurrentRow = (row: RoleVO | null) => {
  if (roleTableRef.value && row) {
    nextTick(() => {
      roleTableRef.value.setCurrentRow(row)
    })
  } else if (roleTableRef.value && !row) {
    roleTableRef.value.setCurrentRow()
  }
}

// 监听选中角色变化，设置表格高亮
watch(() => props.selectedRole, (newRole) => {
  setCurrentRow(newRole)
}, { immediate: true })

// 暴露方法给父组件
defineExpose({
  expandAll: internalExpandAll,
  collapseAll: internalCollapseAll,
  setCurrentRow
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
      @expand-change="handleExpandChange"
      v-table-loading="{ loading: $props.loading || false, text: '加载角色数据中...' }"
    >
      <el-table-column prop="node.name" label="角色名称" min-width="120px"/>
      <el-table-column label="类型" min-width="80px">
        <template #default="{ row }">
          <el-tag :type="row.node.level === -1 ? 'warning' : 'success'" size="small">
            {{ row.node.level === -1 ? '全局角色' : '普通角色' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="node.description" label="描述" min-width="280px"/>
      <el-table-column label="权限状态" min-width="80px">
        <template #default="{ row }">
          <StatusDot 
            :status="row.hasPermission" 
            :valid-text="PermissionStatus.YES"
            :invalid-text="PermissionStatus.NO"
            size="small"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="hasAnyRoleOperationPermission" label="操作" width="160" align="center" fixed="right">
        <template #default="{ row }">
          <AmActionLinks :actions="getRoleActions(row)" />
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
  margin-bottom: var(--gap-size-lg);
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