<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import BatchOperations, { type BatchOperation } from '@/components/basic/BatchOperations.vue'
import type { UserVO } from '@/types'
import api from '@/services'

// 定义 props
interface Props {
  selectedUsers: UserVO[]
}

// 定义 emits
interface Emits {
  (e: 'add-user'): void
  (e: 'batch-success'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

// 打开添加用户对话框
const openAddUserDialog = () => {
  emit('add-user')
}

// 批量操作配置
const userBatchOperations: Record<string, BatchOperation<UserVO>> = {
  ban: {
    action: 'ban',
    actionText: '批量封禁',
    confirmTitle: '批量封禁确认',
    warningMessage: '请选择有权限的用户进行封禁',
    filterCondition: (user: UserVO) => user.hasPermission,
    apiMethod: (userIds: number[]) => api.user.banUser(userIds)
  },
  unban: {
    action: 'unban',
    actionText: '批量解封',
    confirmTitle: '批量解封确认',
    warningMessage: '请选择有权限的用户进行解封',
    filterCondition: (user: UserVO) => user.hasPermission,
    apiMethod: (userIds: number[]) => api.user.unbanUser(userIds)
  }
}

// 批量操作成功后的回调
const handleBatchSuccess = () => {
  emit('batch-success')
}
</script>

<template>
  <div class="table-actions">
    <div class="left-actions">
      <el-button type="primary" @click="openAddUserDialog">
        <el-icon class="el-icon--left"><Plus /></el-icon>
        添加用户
      </el-button>
      
      <!-- 批量操作组件 -->
      <BatchOperations 
        :selected-items="selectedUsers"
        :operations="userBatchOperations"
        item-name="用户"
        @success="handleBatchSuccess"
      />
    </div>
  </div>
</template>

<style scoped>
.table-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--margin-size-lg);
}

.left-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>