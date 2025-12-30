<script setup lang="ts">
import type { LogLoginVO, SortDTO } from '@/services'
import { LoginType, Status } from '@/services'
import { getKeys, getValue, getMappings } from '@/utils'
import { LoginTypeColor, StatusColor, elType } from '@/constant'
import AmSortHeader from '@/components/basic/AmSortHeader.vue'
import AmFilterHeader from '@/components/basic/AmFilterHeader.vue'

// 定义 props
interface Props {
  logList: LogLoginVO[]
  loading?: boolean
  pageInfo: {
    pageNum: number
    pageSize: number
    total: number
    pages: number
  }
  searchForm: {
    keyword: string
    browser: string
    operatingSystem: string
    type: LoginType | null
    status: Status | null
    createTimeStart: string
    createTimeEnd: string
    sort: SortDTO
  }
}

// 定义 emits
interface Emits {
  (e: 'sort-change', sortInfo: SortDTO): void
  (e: 'filter', field: string, value: string): void
  (e: 'page-change', page: number): void
  (e: 'size-change', size: number): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

// 创建从枚举值到key的反向映射
const loginTypeValueToKey = Object.fromEntries(
  getMappings(LoginType).map(({key, value}) => [value, key])
)

const statusValueToKey = Object.fromEntries(
  getMappings(Status).map(({key, value}) => [value, key])
)

// 登录类型筛选选项  
const loginTypeFilterOptions = getKeys(LoginType).map(key => ({
  label: LoginType[key as keyof typeof LoginType],
  value: key
}))

// 状态筛选选项
const statusFilterOptions = getKeys(Status).map(key => ({
  label: Status[key as keyof typeof Status],
  value: key
}))

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

</script>

<template>
  <div class="table-container">
    <el-table
      :data="logList"
      style="width: 100%"
      v-table-loading="{ loading: $props.loading || false, text: '加载登录日志中...'}"
    >
      <el-table-column prop="id" label="ID" min-width="80px" />
      <el-table-column prop="name" label="用户名" min-width="120px" />
      <el-table-column prop="ip" label="IP地址" min-width="140px" />
      <el-table-column prop="browser" label="浏览器" min-width="120px" show-overflow-tooltip />
      <el-table-column prop="operatingSystem" label="操作系统" min-width="120px" show-overflow-tooltip />
      <el-table-column prop="deviceModel" label="设备" min-width="100px" show-overflow-tooltip />
      <el-table-column prop="type" label="登录类型" min-width="100px">
        <template #header="{ column }">
          <AmFilterHeader 
            :label="column.label"
            :options="loginTypeFilterOptions"
            :model-value="searchForm.type ? loginTypeValueToKey[searchForm.type] : ''"
            @change="(value) => handleFilter('type', value as string)"
          />
        </template>
        <template #default="{ row }">
          <el-tag :type="getValue(LoginTypeColor, loginTypeValueToKey[row.type], elType.INFO as any)">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="80px">
        <template #header="{ column }">
          <AmFilterHeader 
            :label="column.label"
            :options="statusFilterOptions"
            :model-value="searchForm.status ? statusValueToKey[searchForm.status] : ''"
            @change="(value) => handleFilter('status', value as string)"
          />
        </template>
        <template #default="{ row }">
          <el-tag :type="getValue(StatusColor, statusValueToKey[row.status], elType.INFO as any)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="errorMessage" label="错误信息" min-width="150px" show-overflow-tooltip>
        <template #default="{ row }">
          <span v-if="row.errorMessage" :title="row.errorMessage">
            {{ row.errorMessage }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="operateTime" label="操作耗时" min-width="100px">
        <template #header="{ column }">
          <AmSortHeader 
            :label="column.label"
            field="operateTime"
            :sort="searchForm.sort"
            @change="handleSortChange"
          />
        </template>
        <template #default="{ row }">
          {{ row.operateTime }}ms
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="180px">
        <template #header="{ column }">
          <AmSortHeader 
            :label="column.label"
            field="createTime"
            :sort="searchForm.sort"
            @change="handleSortChange"
          />
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
</style>