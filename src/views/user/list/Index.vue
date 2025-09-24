<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import api from '@/services'
import {type PageQueryDTO, type PageResponse, type SortDTO, type UserVO, type GetUserListDTO, UserSex} from '@/types'
import { SortDirection } from '@/types'
import { useListPageCache } from '@/composables/usePageCache'
import UserDialog from '@/views/user/list/UserDialog.vue'
import UserListFilterHeader from './FilterHeader.vue'
import UserListActionBar from './ActionBar.vue'
import UserListTable from './Table.vue'

// 初始化页面缓存
const { 
  restoreFromCache, 
  updateCache
} = useListPageCache()

// 响应式数据
const userList = ref<UserVO[]>([])
const pageInfo = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  pages: 0
})

// 加载状态
const isLoading = ref(false)

// 表格选择相关
const selectedUsers = ref<UserVO[]>([])

// 用户对话框相关
const userDialogVisible = ref(false)
const currentEditUser = ref<UserVO | null>(null)

// 查询条件
const searchForm = ref({
  keyword: '', // 合并用户名和姓名为一个关键词
  sex: '',
  isValid: '', // 用户状态筛选
  roleId: null as number | null, // 单选角色ID
  createTimeStart: '', // 创建时间开始
  createTimeEnd: '', // 创建时间结束
  sort: {
    field: '',
    direction: SortDirection.NONE
  }
})

// 从缓存恢复数据
const restoreDataFromCache = () => {
  const cached = restoreFromCache()
  if (cached) {
    // 恢复搜索条件
    if (cached.searchForm) {
      searchForm.value = { ...searchForm.value, ...cached.searchForm }
    }
    // 恢复分页信息
    if (cached.pageInfo) {
      pageInfo.value = { ...pageInfo.value, ...cached.pageInfo }
    }
  }
}

// 监听搜索条件变化，自动保存到缓存
watch(searchForm, () => {
  updateCache({ searchForm: searchForm.value })
}, { deep: true })

// 监听分页信息变化，自动保存到缓存
watch(pageInfo, () => {
  updateCache({ pageInfo: pageInfo.value })
}, { deep: true })

// 处理用户对话框成功事件
const handleUserDialogSuccess = () => {
  getUserList() // 刷新用户列表
}

// 打开添加用户对话框
const handleAddUser = () => {
  currentEditUser.value = null // 清空编辑用户
  userDialogVisible.value = true
}

// 获取用户列表（带加载动画）
const getUserList = async () => {
  isLoading.value = true
  
  try {
    // 将单选的角色ID转换为数组格式
    const roleIds = searchForm.value.roleId ? [searchForm.value.roleId] : []

    // 构建 PageQuery 对象
    const request: PageQueryDTO<GetUserListDTO> = {
      pageNum: pageInfo.value.pageNum,
      pageSize: pageInfo.value.pageSize,
      params: {
        username: searchForm.value.keyword, // 同时作为用户名搜索
        name: searchForm.value.keyword,     // 同时作为姓名搜索
        sex: searchForm.value.sex as UserSex | undefined,
        isValid: searchForm.value.isValid ? searchForm.value.isValid === 'true' : undefined,
        roleIds: roleIds,
        sort: {
          field: searchForm.value.sort.field,
          direction: searchForm.value.sort.direction
        },
        filterTime: {
          field: 'createTime',
          startTime: searchForm.value.createTimeStart,
          endTime: searchForm.value.createTimeEnd
        }
      }
    }

    const response: PageResponse<UserVO> = await api.user.getUserList(request)

    // 更新数据
    userList.value = response.records
    pageInfo.value = {
      pageNum: response.current,
      pageSize: response.size,
      total: response.total,
      pages: response.pages
    }
    
    // 清空选择状态
    selectedUsers.value = []
  } finally {
    isLoading.value = false
  }
}

// 筛选头部事件处理
const handleFilterSearch = () => {
  pageInfo.value.pageNum = 1 // 重置到第一页
  getUserList()
}

const handleFilterReset = () => {
  searchForm.value = {
    keyword: '',
    sex: '',
    isValid: '',
    roleId: null,
    createTimeStart: '',
    createTimeEnd: '',
    sort: {
      field: '',
      direction: SortDirection.NONE
    }
  }
  pageInfo.value.pageNum = 1
  getUserList()
}

const handleFilterRoleChange = () => {
  pageInfo.value.pageNum = 1 // 重置到第一页
  getUserList()
}

// 表格相关事件处理
const handlePageChange = (page: number) => {
  pageInfo.value.pageNum = page
  getUserList()
}

const handleSizeChange = (size: number) => {
  pageInfo.value.pageSize = size
  pageInfo.value.pageNum = 1 // 重置到第一页
  getUserList()
}

const handleSortChange = (sortInfo: SortDTO) => {
  searchForm.value.sort.field = sortInfo.field
  searchForm.value.sort.direction = sortInfo.direction
  pageInfo.value.pageNum = 1 // 重置到第一页
  getUserList()
}

const handleFilter = (field: string, value: string) => {
  if (field === 'sex') {
    searchForm.value.sex = value
  } else if (field === 'isValid') {
    searchForm.value.isValid = value
  }
  pageInfo.value.pageNum = 1 // 重置到第一页
  getUserList()
}

const handleSelectionChange = (selection: UserVO[]) => {
  selectedUsers.value = selection
}

// 处理修改用户
const handleEdit = (user: UserVO) => {
  currentEditUser.value = user
  userDialogVisible.value = true
}

// 处理封禁/解封用户
const handleBanToggle = async (user: UserVO) => {
  const isBanned = !user.isValid
  const action = isBanned ? '解封' : '封禁'
  const apiMethod = isBanned ? 'unbanUser' : 'banUser'
  
  await ElMessageBox.confirm(
    `确定要${action}用户 "${user.name}" 吗？`,
    `${action}确认`,
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  
  await api.user[apiMethod]([user.id])
  // 刷新用户列表
  await getUserList()
}

// 批量操作成功后的回调
const handleBatchSuccess = () => {
  getUserList() // 刷新用户列表
}

// 初始化
onMounted(() => {
  // 先尝试从缓存恢复数据
  restoreDataFromCache()
  
  // 如果有缓存数据，直接加载数据；否则使用默认参数加载
  getUserList()
})
</script>

<template>
  <div>
    <!-- 筛选头部组件 -->
    <UserListFilterHeader
      v-model:search-form="searchForm"
      @search="handleFilterSearch"
      @reset="handleFilterReset"
      @role-change="handleFilterRoleChange"
    />

    <!-- 表格区域 -->
    <el-card>
      <!-- 操作栏组件 -->
      <UserListActionBar
          :selected-users="selectedUsers"
          @add-user="handleAddUser"
          @batch-success="handleBatchSuccess"
      />

      <!-- 表格组件 -->
      <UserListTable
          :user-list="userList"
          :selected-users="selectedUsers"
          :page-info="pageInfo"
          :search-form="searchForm"
          :loading="isLoading"
          @selection-change="handleSelectionChange"
          @edit="handleEdit"
          @ban-toggle="handleBanToggle"
          @sort-change="handleSortChange"
          @filter="handleFilter"
          @page-change="handlePageChange"
          @size-change="handleSizeChange"
      />
    </el-card>

    <!-- 用户对话框 -->
    <UserDialog
        v-model:visible="userDialogVisible"
        :user-data="currentEditUser"
        @success="handleUserDialogSuccess"
    />
  </div>
</template>

<style scoped>
</style>