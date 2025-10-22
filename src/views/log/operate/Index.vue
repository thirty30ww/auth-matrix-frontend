<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import api from '@/services'
import { type PageQueryDTO, type PageResponse, type SortDTO, type LogOperationVO, type LogOperationDTO } from '@/services'
import { SortDirection } from '@/services'
import { useListPageCache } from '@/composables/usePageCache'
import LogOperateTable from './Table.vue'
import LogOperateDetailDrawer from './DetailDrawer.vue'
import FilterHeader from './FilterHeader.vue'

// 初始化页面缓存
const { 
  restoreFromCache, 
  updateCache
} = useListPageCache()

// 响应式数据
const logList = ref<LogOperationVO[]>([])
const pageInfo = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  pages: 0
})

// 加载状态
const isLoading = ref(false)

// 组件是否已初始化
const isInitialized = ref(false)

// 详情侧边栏相关
const detailDrawerVisible = ref(false)
const currentLogId = ref<number | null>(null)

// 查询条件
const searchForm = ref({
  keyword: '',
  module: '',
  code: null as number | null,
  type: '',
  method: '',
  createTimeStart: '',
  createTimeEnd: '',
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

// 获取操作日志列表（带加载动画）
const getLogList = async () => {
  isLoading.value = true
  
  // 构建 PageQuery 对象
  const request: PageQueryDTO<LogOperationDTO> = {
    pageNum: pageInfo.value.pageNum,
    pageSize: pageInfo.value.pageSize,
    params: {
      name: searchForm.value.keyword || undefined,
      description: searchForm.value.keyword || undefined,
      module: searchForm.value.module || undefined,
      code: searchForm.value.code || undefined,
      type: searchForm.value.type as any || undefined,
      method: searchForm.value.method as any || undefined,
      filterTime: (searchForm.value.createTimeStart || searchForm.value.createTimeEnd) ? {
        field: 'createTime',
        startTime: searchForm.value.createTimeStart || undefined,
        endTime: searchForm.value.createTimeEnd || undefined
      } : undefined,
      sort: searchForm.value.sort ? {
        field: searchForm.value.sort.field,
        direction: searchForm.value.sort.direction
      } : {
        field: '',
        direction: SortDirection.NONE
      }
    }
  }

  const response: PageResponse<LogOperationVO> = await api.log.getLogOperationList(request)

  // API现在返回分页对象
  logList.value = response.records
  pageInfo.value = {
    pageNum: response.current,
    pageSize: response.size,
    total: response.total,
    pages: response.pages
  }
  
  isLoading.value = false
}

// 表格相关事件处理
const handlePageChange = (page: number) => {
  pageInfo.value.pageNum = page
  getLogList()
}

const handleSizeChange = (size: number) => {
  pageInfo.value.pageSize = size
  pageInfo.value.pageNum = 1 // 重置到第一页
  getLogList()
}

const handleSortChange = (sortInfo: SortDTO) => {
  searchForm.value.sort.field = sortInfo.field
  searchForm.value.sort.direction = sortInfo.direction
  pageInfo.value.pageNum = 1 // 重置到第一页
  getLogList()
}

const handleFilter = (field: string, value: string) => {
  if (field === 'type') {
    searchForm.value.type = value
  } else if (field === 'method') {
    searchForm.value.method = value
  }
  pageInfo.value.pageNum = 1 // 重置到第一页
  getLogList()
}

// 筛选相关事件处理
const handleSearch = () => {
  pageInfo.value.pageNum = 1 // 重置到第一页
  getLogList()
}

const handleReset = () => {
  pageInfo.value.pageNum = 1 // 重置到第一页
  getLogList()
}

// 查看详情
const handleViewDetail = (log: LogOperationVO) => {
  currentLogId.value = log.id
  detailDrawerVisible.value = true
}

// 初始化
onMounted(() => {
  // 先尝试从缓存恢复数据
  restoreDataFromCache()
  
  // 标记为已初始化
  isInitialized.value = true
  
  // 如果有缓存数据，直接加载数据；否则使用默认参数加载
  getLogList()
})
</script>

<template>
  <div>
    <!-- 筛选区域 -->
    <FilterHeader
      v-model:search-form="searchForm"
      @search="handleSearch"
      @reset="handleReset"
    />
    
    <!-- 表格区域 -->
    <el-card>
      <!-- 表格组件 -->
      <LogOperateTable
        :log-list="logList"
        :page-info="pageInfo"
        :search-form="searchForm"
        :loading="isLoading"
        @sort-change="handleSortChange"
        @filter="handleFilter"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
        @view-detail="handleViewDetail"
      />
    </el-card>

    <!-- 详情侧边栏 -->
    <LogOperateDetailDrawer
      v-model:visible="detailDrawerVisible"
      :log-id="currentLogId"
    />
  </div>
</template>

<style scoped>
</style>