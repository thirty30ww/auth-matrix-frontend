<template>
  <div class="batch-operations">
    <!-- 批量操作下拉按钮 -->
    <el-dropdown 
      @command="handleBatchAction"
      :disabled="selectedItems.length === 0"
    >
      <el-button :disabled="selectedItems.length === 0">
        批量操作
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            v-for="(operation, key) in operations"
            :key="key"
            :command="key"
            :disabled="!canExecuteOperation(key)"
          >
            {{ operation.actionText }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    
    <!-- 已选择信息 -->
    <span class="selected-info" v-if="selectedItems.length > 0">
      已选择 {{ selectedItems.length }} 项
    </span>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 批量操作配置接口
export interface BatchOperation<T = any> {
  action: string
  actionText: string
  confirmTitle: string
  warningMessage: string
  filterCondition: (item: T) => boolean
  apiMethod: (ids: number[]) => Promise<any>
}

// Props 定义
interface Props {
  selectedItems: any[]
  operations: Record<string, BatchOperation>
  itemName?: string // 项目类型名称，默认为"项目"
}

// Emits 定义
interface Emits {
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 通用批量操作处理函数
const executeBatchOperation = async (operation: BatchOperation) => {
  if (props.selectedItems.length === 0) return
  
  const targetItems = props.selectedItems.filter(operation.filterCondition)
  if (targetItems.length === 0) {
    ElMessage.warning(operation.warningMessage)
    return
  }
  
  await ElMessageBox.confirm(
    `确定要${operation.actionText}选中的 ${targetItems.length} 个${props.itemName || '项目'}吗？`,
    operation.confirmTitle,
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  
  const ids = targetItems.map(item => item.id)
  await operation.apiMethod(ids)
  
  // 触发成功事件
  emit('success')
}

// 批量操作入口函数
const handleBatchAction = async (command: string) => {
  const operation = props.operations[command]
  if (operation) {
    await executeBatchOperation(operation)
  }
}

// 检查是否有可执行的操作
const canExecuteOperation = (command: string): boolean => {
  const operation = props.operations[command]
  return operation ? props.selectedItems.some(operation.filterCondition) : false
}
</script>

<style scoped>
.batch-operations {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selected-info {
  font-size: 14px;
  color: var(--el-color-info);
}
</style>