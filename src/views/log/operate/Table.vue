<script setup lang="ts">
import type { LogOperationVO, SortDTO } from '@/services'
import { OperationType, MethodType } from '@/services'
import { getValues } from '@/utils'
import { getStatusCodeType, getOperationTypeColor, getMethodTypeColor } from '@/constant'
import AmActionLinks from '@/components/basic/AmActionLinks.vue'
import AmSortHeader from '@/components/basic/AmSortHeader.vue'
import AmFilterHeader from '@/components/basic/AmFilterHeader.vue'
import { computed } from 'vue'
import { usePermissionStore } from '@/stores/permission'

// 定义 props
interface Props {
  logList: LogOperationVO[]
  loading?: boolean
  pageInfo: {
    pageNum: number
    pageSize: number
    total: number
    pages: number
  }
  searchForm: {
    keyword?: string
    module?: string
    code?: number | null
    type?: string
    method?: string
    createTimeStart?: string
    createTimeEnd?: string
    sort: SortDTO
  }
}

// 定义 emits
interface Emits {
  (e: 'sort-change', sortInfo: SortDTO): void
  (e: 'filter', field: string, value: string): void
  (e: 'page-change', page: number): void
  (e: 'size-change', size: number): void
  (e: 'view-detail', log: LogOperationVO): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const permissionStore = usePermissionStore()

// 检查是否有日志详情查看权限
const hasLogDetailPermission = computed(() => {
  return permissionStore.hasPermission('log:operation:detail')
})

// 操作类型筛选选项
const operationTypeFilterOptions = getValues(OperationType).map(value => ({
  label: value,
  value: value
}))

// 请求方法筛选选项
const methodTypeFilterOptions = getValues(MethodType).map(value => ({
  label: value,
  value: value
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

// 查看详情
const handleViewDetail = (log: LogOperationVO) => {
  emit('view-detail', log)
}

// 获取操作按钮配置
const getActionLinks = (log: LogOperationVO) => {
  const actions = []
  
  // 详情按钮 - 需要 log:detail 权限
  if (permissionStore.hasPermission('log:operation:detail')) {
    actions.push({
      label: '详情',
      onClick: () => handleViewDetail(log),
      type: 'default' as const
    })
  }
  
  return actions
}


</script>

<template>
  <div class="table-container">
    <el-table
      :data="logList"
      style="width: 100%"
      v-am-loading="{ loading: $props.loading || false, text: '加载操作日志中...'}"
    >
      <el-table-column prop="id" label="ID" min-width="80px" />
      <el-table-column prop="name" label="操作人" min-width="100px" />
      <el-table-column prop="module" label="模块" min-width="120px" />
      <el-table-column prop="description" label="操作描述" min-width="200px" />
      <el-table-column prop="type" label="操作类型" min-width="100px">
        <template #header="{ column }">
          <AmFilterHeader 
            :label="column.label"
            :options="operationTypeFilterOptions"
            v-model="searchForm.type"
            @change="(value) => handleFilter('type', value as string)"
          />
        </template>
        <template #default="{ row }">
          <el-tag :type="getOperationTypeColor(row.type)">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="method" label="请求方法" min-width="100px">
        <template #header="{ column }">
          <AmFilterHeader 
            :label="column.label"
            :options="methodTypeFilterOptions"
            v-model="searchForm.method"
            @change="(value) => handleFilter('method', value as string)"
          />
        </template>
        <template #default="{ row }">
          <el-tag :type="getMethodTypeColor(row.method)">
            {{ row.method }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="状态码" min-width="80px">
        <template #default="{ row }">
          <el-tag :type="getStatusCodeType(row.code)">
            {{ row.code }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="请求路径" min-width="150px" show-overflow-tooltip />
      <el-table-column prop="ip" label="IP地址" min-width="120px" />
      <el-table-column prop="operateTime" label="操作时间" min-width="100px">
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
      <el-table-column 
        v-if="hasLogDetailPermission" 
        label="操作" 
        min-width="80px" 
        align="center" 
        fixed="right"
      >
        <template #default="{ row }">
          <AmActionLinks :actions="getActionLinks(row)" />
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