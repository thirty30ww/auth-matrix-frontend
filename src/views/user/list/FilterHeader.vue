<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import api from '@/services'
import {type Role, RoleListType} from '@/types'
import DateRangeFilter from '@/components/basic/DateRangeFilter.vue'

// 定义 props
interface Props {
  searchForm: {
    keyword: string
    roleId: number | null
    createTimeStart: string
    createTimeEnd: string
  }
}

// 定义 emits
interface Emits {
  (e: 'search'): void
  (e: 'reset'): void
  (e: 'role-change'): void
  (e: 'update:searchForm', value: Props['searchForm']): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式数据
const roleList = ref<Role[]>([])

// 计算属性，用于双向绑定
const localSearchForm = ref({ ...props.searchForm })

// 获取角色列表
const getRoleList = async () => {
  roleList.value = await api.role.getRoleList(RoleListType.ALL)
}

// 处理重置
const handleReset = () => {
  localSearchForm.value = {
    keyword: '',
    roleId: null,
    createTimeStart: '',
    createTimeEnd: ''
  }
  emit('update:searchForm', { ...localSearchForm.value })
  emit('reset')
}

// 处理角色变化
const handleRoleChange = () => {
  emit('update:searchForm', { ...localSearchForm.value })
  emit('role-change')
}

// 处理日期范围变化
const handleDateRangeChange = (startDate: string, endDate: string) => {
  localSearchForm.value.createTimeStart = startDate
  localSearchForm.value.createTimeEnd = endDate
  emit('update:searchForm', { ...localSearchForm.value })
  debouncedSearch()
}

// 防抖搜索
let searchTimeout: ReturnType<typeof setTimeout> | null = null
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    emit('update:searchForm', { ...localSearchForm.value })
    emit('search')
  }, 300) // 300ms 防抖
}

// 监听关键词变化，实现静默搜索
watch(() => localSearchForm.value.keyword, () => {
  debouncedSearch()
})

// 监听 props 变化，同步到本地状态
watch(() => props.searchForm, (newVal) => {
  localSearchForm.value = { ...newVal }
}, { deep: true })

// 初始化
onMounted(() => {
  getRoleList()
})
</script>

<template>
  <el-card class="search-card" shadow="never">
    <div class="search-form">
      <el-input
        v-model="localSearchForm.keyword"
        placeholder="请输入用户名或姓名"
        clearable
        style="width:200px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select
        v-model="localSearchForm.roleId"
        placeholder="请选择角色"
        clearable
        style="width: 200px"
        @change="handleRoleChange"
      >
        <el-option
          v-for="role in roleList"
          :key="role.id"
          :label="role.name"
          :value="role.id"
        />
      </el-select>

      <DateRangeFilter
        :start-date="localSearchForm.createTimeStart"
        :end-date="localSearchForm.createTimeEnd"
        @change="handleDateRangeChange"
      />

      <div class="search-buttons">
        <el-button @click="handleReset">
          <el-icon class="el-icon--left"><Refresh /></el-icon>
          重置
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.search-buttons {
  display: flex;
  gap: 8px;
}
</style>