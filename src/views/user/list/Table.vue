<script setup lang="ts">
import type { UserVO, SortDTO } from '@/types'
import { LevelTagType, UserStatus } from '@/constant'
import { UserSex } from '@/types'
import { getValue, getValues } from '@/utils'
import UserAvatar from '@/components/basic/UserAvatar.vue'
import StatusDot from '@/components/basic/StatusDot.vue'
import ActionLinks from '@/components/basic/ActionLinks.vue'
import SortableTableHeader from '@/components/business/SortableTableHeader.vue'
import FilterableTableHeader from '@/components/business/FilterableTableHeader.vue'
import { computed } from 'vue'
import { usePermissionStore } from '@/stores/permission.ts'

// 定义 props
interface Props {
  userList: UserVO[]
  selectedUsers: UserVO[]
  loading?: boolean
  pageInfo: {
    pageNum: number
    pageSize: number
    total: number
    pages: number
  }
  searchForm: {
    sex: string
    isValid: string
    sort: SortDTO
  }
}

// 定义 emits
interface Emits {
  (e: 'selection-change', selection: UserVO[]): void
  (e: 'edit', user: UserVO): void
  (e: 'ban-toggle', user: UserVO): void
  (e: 'sort-change', sortInfo: SortDTO): void
  (e: 'filter', field: string, value: string): void
  (e: 'page-change', page: number): void
  (e: 'size-change', size: number): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const permissionStore = usePermissionStore()

// 检查是否有任何用户操作权限
const hasAnyUserOperationPermission = computed(() => {
  return permissionStore.hasAnyPermission(['user:modify', 'user:ban', 'user:unban'])
})

// 检查是否有批量操作权限（用于控制选择列显示）
const hasAnyBatchOperationPermission = computed(() => {
  return permissionStore.hasAnyPermission(['user:ban', 'user:unban'])
})

// 性别筛选选项 - 使用工具函数动态生成
const sexFilterOptions = getValues(UserSex).map(value => ({
  label: value,  // 显示的文本，如 '男', '女', '未知'
  value: value   // 实际的值，如 '男', '女', '未知'
}))

// 用户状态筛选选项
const userStatusFilterOptions = [
  { label: UserStatus.VALID, value: 'true' },   // 正常
  { label: UserStatus.INVALID, value: 'false' } // 封禁
]

// 表格选择处理函数
const isUserSelectable = (row: UserVO) => {
  return row.hasPermission
}

const handleSelectChange = (selection: UserVO[]) => {
  emit('selection-change', selection)
}

// 处理修改用户
const handleEdit = (user: UserVO) => {
  emit('edit', user)
}

// 处理封禁/解封用户
const handleBanToggle = (user: UserVO) => {
  emit('ban-toggle', user)
}

// 处理排序变化
const handleSortChange = (sortInfo: SortDTO) => {
  emit('sort-change', sortInfo)
}

// 处理筛选点击
const handleFilter = (field: string, value: string) => {
  emit('filter', field, value)
}

// 分页改变
const handlePageChange = (page: number) => {
  emit('page-change', page)
}

// 每页大小改变
const handleSizeChange = (size: number) => {
  emit('size-change', size)
}

// 获取操作按钮配置
const getActionLinks = (user: UserVO) => {
  const isBanned = !user.isValid
  const actions = []
  
  // 修改按钮 - 需要 user:modify 权限
  if (permissionStore.hasPermission('user:modify')) {
    actions.push({
      label: '修改',
      onClick: () => handleEdit(user),
      disabled: !user.hasPermission,
      type: 'default' as const
    })
  }
  
  // 封禁/解封按钮 - 需要对应的权限
  const banPermission = isBanned ? 'user:unban' : 'user:ban'
  if (permissionStore.hasPermission(banPermission)) {
    actions.push({
      label: isBanned ? '解封' : '封禁',
      onClick: () => handleBanToggle(user),
      disabled: !user.hasPermission,
      type: isBanned ? 'success' as const : 'danger' as const
    })
  }
  
  return actions
}
</script>

<template>
  <div 
    class="table-container"
  >
    <el-table
      :data="userList"
      style="width: 100%"
      @selection-change="handleSelectChange"
      v-table-loading="{ loading: $props.loading || false, text: '加载用户数据中...'}"
    >
      <!-- 选择列 -->
      <el-table-column 
        v-if="hasAnyBatchOperationPermission"
        type="selection" 
        width="55" 
        align="center" 
        :selectable="isUserSelectable"
      />
      <el-table-column prop="id" label="ID" min-width="40px" />
      <el-table-column label="头像" min-width="80px" align="center">
        <template #default="{ row }">
          <div class="avatar-container">
            <UserAvatar :image-url="row.avatarUrl" :alt="row.name" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" min-width="100px"/>
      <el-table-column prop="name" label="姓名" min-width="100px"/>
      <el-table-column prop="sex" label="性别" min-width="80px">
        <template #header="{ column }">
          <FilterableTableHeader 
            :label="column.label"
            field="sex"
            :options="sexFilterOptions"
            :current-filter-value="searchForm.sex"
            @filter="handleFilter"
          />
        </template>
      </el-table-column>
      <el-table-column label="角色" min-width="280px">
        <template #default="{ row }">
          <el-tag
             v-for="role in row.roles"
             :key="role.id"
             :type="getValue(LevelTagType, role.level, 'primary')"
             style="margin-right: var(--margin-size-spacing-1);"
           >
            {{ role.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="180px">
        <template #header="{ column }">
          <SortableTableHeader 
            :label="column.label"
            field="createTime"
            :current-sort="searchForm.sort"
            @sort-change="handleSortChange"
          />
        </template>
      </el-table-column>
      <el-table-column prop="isValid" label="状态" min-width="80px">
        <template #header="{ column }">
          <FilterableTableHeader 
            :label="column.label"
            field="isValid"
            :options="userStatusFilterOptions"
            :current-filter-value="searchForm.isValid"
            @filter="handleFilter"
          />
        </template>
        <template #default="{ row }">
          <StatusDot 
            :status="row.isValid" 
            :valid-text="UserStatus.VALID"
            :invalid-text="UserStatus.INVALID"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="hasAnyUserOperationPermission" label="操作" min-width="120px" align="center">
        <template #default="{ row }">
          <ActionLinks :actions="getActionLinks(row)" />
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页组件 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="pageInfo.pageNum"
        v-model:page-size="pageInfo.pageSize"
        :page-sizes="[10, 20, 50]"
        :total="pageInfo.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.avatar-container {
  width: 40px;
  height: 40px;
  margin: 0 auto;
}
</style>