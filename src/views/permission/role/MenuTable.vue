<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { ViewVO } from '@/types'
import { Check, Refresh } from '@element-plus/icons-vue'

// Props
interface Props {
  menuTableData: ViewVO[]
  selectedRole: any
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'confirm'): void
  (e: 'reset'): void
}

const emit = defineEmits<Emits>()

// Refs
const menuTableRef = ref()

// 确认按钮
const handleConfirm = () => {
  emit('confirm')
}

// 重置按钮
const handleReset = () => {
  emit('reset')
}

// 展开全部菜单
const expandAllMenus = async () => {
  await nextTick()
  
  const expandAllRows = (data: any[], tableRef: any) => {
    data.forEach(item => {
      if (item.children && item.children.length > 0) {
        tableRef.toggleRowExpansion(item, true)
        expandAllRows(item.children, tableRef)
      }
    })
  }
  
  if (menuTableRef.value && props.menuTableData.length > 0) {
    expandAllRows(props.menuTableData, menuTableRef.value)
  }
}

// 折叠全部菜单
const collapseAllMenus = async () => {
  await nextTick()
  
  const collapseAllRows = (data: any[], tableRef: any) => {
    data.forEach(item => {
      if (item.children && item.children.length > 0) {
        tableRef.toggleRowExpansion(item, false)
        collapseAllRows(item.children, tableRef)
      }
    })
  }
  
  if (menuTableRef.value && props.menuTableData.length > 0) {
    collapseAllRows(props.menuTableData, menuTableRef.value)
  }
}

// 暴露方法给父组件
defineExpose({
  expandAllMenus,
  collapseAllMenus
})
</script>

<template>
  <div class="menu-table-section">
    <!-- 菜单操作按钮 -->
    <div class="menu-action-bar">
      <div class="right-actions">
        <el-button type="primary" @click="handleConfirm">
          <el-icon class="el-icon--left"><Check /></el-icon>
          确认
        </el-button>
        <el-button @click="handleReset">
          <el-icon class="el-icon--left"><Refresh/></el-icon>
          重置
        </el-button>
      </div>
    </div>
    
    <el-table
      ref="menuTableRef"
      :data="menuTableData"
      row-key="node.id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      default-expand-all
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
      <el-table-column label="访问权限" min-width="100">
        <template #default="{ row }">
          <el-tag v-if="row.hasPermission === true" type="success">有权限</el-tag>
          <el-tag v-else-if="row.hasPermission === false" type="danger">无权限</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="selectedRole ? '您没有权限查看该角色菜单权限' : '请选择角色查看菜单权限'" />
      </template>
    </el-table>
  </div>
</template>

<style scoped>
.menu-table-section {
  width: calc(30% - 6px); /* 减去gap的一半 */
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.menu-name-cell {
  display: flex;
  align-items: center;
}

.menu-icon {
  margin-right: var(--margin-size-spacing-2);
}

.menu-action-bar {
  display: flex;
  align-items: center;
  margin-bottom: var(--margin-size-lg);
}

.right-actions {
  display: flex;
  align-items: center;
  margin-left: auto;
}

/* 表格容器样式 */
.menu-table-section .el-table {
  flex: 1;
  overflow: auto;
}

/* 操作栏固定在顶部 */
.menu-action-bar {
  flex-shrink: 0;
}
</style>