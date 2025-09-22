<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import type { PermissionVO } from '@/types'
import { Check, Refresh } from '@element-plus/icons-vue'
import { PermissionStatus } from "@/constant"
import ClickableTag from '@/components/basic/ClickableTag.vue'
import { usePermissionStore } from '@/stores/permission.ts'
import { useTreeTableExpandState } from '@/utils/treeTable'

// Props
interface Props {
  menuTableData: PermissionVO[]
  selectedRole: any
  loading?: boolean
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'confirm', viewIds: number[]): void
}

const emit = defineEmits<Emits>()

// Stores
const permissionStore = usePermissionStore()

// Refs
const menuTableRef = ref()

// 树型表格展开状态管理
const {
  handleExpandChange,
  restoreExpandedState,
  expandAll,
  collapseAll
} = useTreeTableExpandState('roleMenuTable')

// 本地菜单数据副本，用于权限修改
const localMenuData = ref<PermissionVO[]>([])

// 初始菜单数据，用于重置
const originalMenuData = ref<PermissionVO[]>([])

// 监听菜单数据变化，更新本地副本
watch(() => props.menuTableData, (newData) => {
  // 深拷贝菜单数据
  localMenuData.value = JSON.parse(JSON.stringify(newData))
  originalMenuData.value = JSON.parse(JSON.stringify(newData))
  
  // 数据更新后恢复展开状态
  if (newData.length > 0) {
    restoreExpandedState(menuTableRef, localMenuData, internalExpandAllMenus)
  }
}, { immediate: true, deep: true })

// 检查数据是否有变化
const hasDataChanged = computed(() => {
  return JSON.stringify(localMenuData.value) !== JSON.stringify(originalMenuData.value)
})

// 检查是否有权限分配权限
const hasAssignPermission = computed(() => {
  return permissionStore.hasPermission('permission:role:assign')
})

// 检查当前角色是否有修改权限
const canModifyRole = computed(() => {
  return props.selectedRole?.hasPermission ?? false
})

// 检查特定菜单项是否可以修改
const canModifyMenuItem = (row: PermissionVO) => {
  // 首先检查是否有权限分配权限
  if (!hasAssignPermission.value) {
    return false
  }
  
  // 然后检查角色是否有修改权限
  if (!canModifyRole.value) {
    return false
  }
  
  // 最后检查菜单项的hasChange字段
  if (row.hasChange === false) {
    return false
  }
  
  return true
}

// 切换菜单权限
const togglePermission = (row: PermissionVO) => {
  // 检查是否可以修改该菜单项
  if (!canModifyMenuItem(row)) {
    return
  }
  
  // 切换权限状态
  row.hasPermission = !row.hasPermission
  
  if (row.hasPermission) {
    // 如果打开子页面权限，打开所有父级和祖先页面权限
    enableParentPermissions(row)
  } else {
    // 如果取消父页面权限，则取消所有子页面权限
    if (row.children && row.children.length > 0) {
      setChildrenPermission(row.children, false)
    }
  }
}

// 递归设置子菜单权限
const setChildrenPermission = (children: PermissionVO[], hasPermission: boolean) => {
  children.forEach(child => {
    child.hasPermission = hasPermission
    if (child.children && child.children.length > 0) {
      setChildrenPermission(child.children, hasPermission)
    }
  })
}

// 启用所有父级和祖先页面权限
const enableParentPermissions = (currentRow: PermissionVO) => {
  const findAndEnableParent = (data: PermissionVO[], targetRow: PermissionVO): boolean => {
    for (const item of data) {
      if (item.children && item.children.includes(targetRow)) {
        // 启用父页面权限
        item.hasPermission = true
        // 继续向上查找祖先页面
        enableParentPermissions(item)
        return true
      }
      
      if (item.children && item.children.length > 0) {
        if (findAndEnableParent(item.children, targetRow)) {
          return true
        }
      }
    }
    return false
  }
  
  findAndEnableParent(localMenuData.value, currentRow)
}

// 收集有权限的菜单ID
const getPermissionViewIds = (data: PermissionVO[]): number[] => {
  const viewIds: number[] = []
  
  const collectIds = (items: PermissionVO[]) => {
    items.forEach(item => {
      if (item.hasPermission === true) {
        viewIds.push(item.node.id)
      }
      if (item.children && item.children.length > 0) {
        collectIds(item.children)
      }
    })
  }
  
  collectIds(data)
  return viewIds
}

// 确认按钮
const handleConfirm = () => {
  const viewIds = getPermissionViewIds(localMenuData.value)
  emit('confirm', viewIds)
}

// 重置按钮
const handleReset = () => {
  // 恢复到原始状态
  localMenuData.value = JSON.parse(JSON.stringify(originalMenuData.value))
}

// 内部展开方法（供父组件调用）
const internalExpandAllMenus = () => expandAll(menuTableRef, localMenuData)

// 内部折叠方法（供父组件调用）
const internalCollapseAllMenus = () => collapseAll(menuTableRef, localMenuData)

// 组件挂载后恢复展开状态
onMounted(() => {
  if (localMenuData.value.length > 0) {
    restoreExpandedState(menuTableRef, localMenuData, internalExpandAllMenus)
  }
})

// 暴露方法给父组件
defineExpose({
  expandAllMenus: internalExpandAllMenus,
  collapseAllMenus: internalCollapseAllMenus
})
</script>

<template>
  <div class="menu-table-section">
    <!-- 菜单操作按钮 -->
    <div class="menu-action-bar">
      <div class="right-actions">
        <el-button 
          v-if="hasAssignPermission"
          type="primary" 
          :disabled="!hasDataChanged || !canModifyRole"
          @click="handleConfirm"
        >
          <el-icon class="el-icon--left"><Check /></el-icon>
          确认
        </el-button>
        <el-button 
          v-if="hasAssignPermission"
          :disabled="!canModifyRole"
          @click="handleReset"
        >
          <el-icon class="el-icon--left"><Refresh/></el-icon>
          重置
        </el-button>
      </div>
    </div>
    
    <el-table
      ref="menuTableRef"
      :data="localMenuData"
      row-key="node.id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @expand-change="handleExpandChange"
      v-table-loading="{ loading: $props.loading || false, text: '加载菜单权限中...' }"
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
          <ClickableTag 
            v-if="row.hasPermission === true" 
            type="success" 
            :disabled="!canModifyMenuItem(row)"
            :text="PermissionStatus.YES"
            @click="() => togglePermission(row)"
          />
          <ClickableTag 
            v-else-if="row.hasPermission === false" 
            type="danger" 
            :disabled="!canModifyMenuItem(row)"
            :text="PermissionStatus.NO"
            @click="() => togglePermission(row)"
          />
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