<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { RoleVO } from '@/types'
import StatusDot from '@/components/basic/StatusDot.vue'
import ActionLinks from '@/components/basic/ActionLinks.vue'
import { Plus, Expand, Fold } from '@element-plus/icons-vue'
import {PermissionStatus} from "../../../constant";

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

// Refs
const roleTableRef = ref()

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
  return [
    {
      label: '添加',
      onClick: () => handleAddChildRole(row),
      disabled: !row.hasPermission,
      type: 'default' as const
    },
    {
      label: '修改',
      onClick: () => handleEditRole(row),
      disabled: !row.hasPermission,
      type: 'default' as const
    },
    {
      label: '删除',
      onClick: () => handleDeleteRole(row),
      disabled: !row.hasPermission,
      type: 'danger' as const
    }
  ]
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
        <el-button type="primary" @click="handleAddRole">
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
      <el-table-column label="操作" width="180" align="center">
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