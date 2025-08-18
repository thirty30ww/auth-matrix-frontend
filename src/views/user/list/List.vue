<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import api from '@/services'
import type { PageQueryDTO, PageResponse, SortDTO, UserVO, GetUserListDTO } from '@/types'
import { SortDirection } from '@/constant'
import UserDialog from '@/components/business/UserDialog.vue'
import UserListFilterHeader from './UserListFilterHeader.vue'
import UserListActionBar from './UserListActionBar.vue'
import UserListTable from './UserListTable.vue'

// 响应式数据
const userList = ref<UserVO[]>([])
const pageInfo = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  pages: 0
})

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
  sort: {
    field: '',
    direction: SortDirection.NONE
  }
})

// 处理用户对话框成功事件
const handleUserDialogSuccess = () => {
  getUserList() // 刷新用户列表
}

// 打开添加用户对话框
const handleAddUser = () => {
  currentEditUser.value = null // 清空编辑用户
  userDialogVisible.value = true
}

// 获取用户列表
const getUserList = async () => {
  // 将单选的角色ID转换为数组格式
  const roleIds = searchForm.value.roleId ? [searchForm.value.roleId] : []

  // 构建 PageQuery 对象
  const request: PageQueryDTO<GetUserListDTO> = {
    pageNum: pageInfo.value.pageNum,
    pageSize: pageInfo.value.pageSize,
    params: {
      username: searchForm.value.keyword, // 同时作为用户名搜索
      name: searchForm.value.keyword,     // 同时作为姓名搜索
      sex: searchForm.value.sex,
      isValid: searchForm.value.isValid ? searchForm.value.isValid === 'true' : undefined,
      roleIds: roleIds,
      sort: {
        field: searchForm.value.sort.field,
        direction: searchForm.value.sort.direction
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
  getUserList()
})
</script>

<template>
  <div class="user-list">
    <!-- 筛选头部组件 -->
    <UserListFilterHeader
      v-model:search-form="searchForm"
      @search="handleFilterSearch"
      @reset="handleFilterReset"
      @role-change="handleFilterRoleChange"
    />

    <!-- 表格区域 -->
    <el-card shadow="never">
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