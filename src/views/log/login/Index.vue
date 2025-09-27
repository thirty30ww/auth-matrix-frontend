<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import api from '@/services'
import { type PageQueryDTO, type PageResponse, type SortDTO, type LogLoginVO, type LogLoginDTO, LoginType, Status } from '@/types'
import { SortDirection } from '@/types'
import { useListPageCache } from '@/composables/usePageCache'
import LogLoginTable from './Table.vue'
import FilterHeader from './FilterHeader.vue'

// 初始化页面缓存
const { 
  restoreFromCache, 
  updateCache
} = useListPageCache()

// 响应式数据
const logList = ref<LogLoginVO[]>([])
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

// 查询条件
const searchForm = ref({
  keyword: '',
  browser: '',
  operatingSystem: '',
  type: null as LoginType | null,
  status: null as Status | null,
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

// 获取登录日志列表（带加载动画）
const getLogList = async () => {
  isLoading.value = true
  
  // 构建 PageQuery 对象
  const request: PageQueryDTO<LogLoginDTO> = {
    pageNum: pageInfo.value.pageNum,
    pageSize: pageInfo.value.pageSize,
    params: {
      name: searchForm.value.keyword,
      browser: searchForm.value.browser,
      operatingSystem: searchForm.value.operatingSystem,
      type: searchForm.value.type || undefined,
      status: searchForm.value.status || undefined,
      filterTime: (searchForm.value.createTimeStart || searchForm.value.createTimeEnd) ? {
        field: 'createTime',
        startTime: searchForm.value.createTimeStart,
        endTime: searchForm.value.createTimeEnd
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

  const response: PageResponse<LogLoginVO> = await api.log.getLogLoginList(request)

  // API返回分页对象
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
  console.log('表头筛选:', field, value)
  if (field === 'type') {
    // 直接使用筛选器传来的key转换为对应的value
    searchForm.value.type = value ? LoginType[value as keyof typeof LoginType] : null
  } else if (field === 'status') {
    // 直接使用筛选器传来的key转换为对应的value
    searchForm.value.status = value ? Status[value as keyof typeof Status] : null
  }
  console.log('筛选后的searchForm:', searchForm.value)
  // 其他字段的筛选可以在这里添加
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
      <LogLoginTable
        :log-list="logList"
        :page-info="pageInfo"
        :search-form="searchForm"
        :loading="isLoading"
        @sort-change="handleSortChange"
        @filter="handleFilter"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </el-card>
  </div>
</template>

<style scoped>
</style>