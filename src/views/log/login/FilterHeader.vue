<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import api from '@/services'
import DateRangeFilter from '@/components/basic/DateRangeFilter.vue'

// 定义 props
interface Props {
  searchForm: {
    keyword: string
    browser: string
    operatingSystem: string
    createTimeStart: string
    createTimeEnd: string
  }
}

// 定义 emits
interface Emits {
  (e: 'search'): void
  (e: 'reset'): void
  (e: 'update:searchForm', value: Props['searchForm']): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式数据
const browserOptions = ref<string[]>([])
const operatingSystemOptions = ref<string[]>([])

// 计算属性，用于双向绑定
const localSearchForm = ref({ ...props.searchForm })


// 获取浏览器列表
const getBrowserOptions = async () => {
  const data = await api.log.getLogLoginBrowsers()
  if (data) {
    browserOptions.value = data
  }
}

// 获取操作系统列表
const getOperatingSystemOptions = async () => {
  const data = await api.log.getLogLoginOperatingSystems()
  if (data) {
    operatingSystemOptions.value = data
  }
}

// 处理重置
const handleReset = () => {
  localSearchForm.value = {
    keyword: '',
    browser: '',
    operatingSystem: '',
    createTimeStart: '',
    createTimeEnd: ''
  }
  emit('update:searchForm', { ...localSearchForm.value })
  emit('reset')
}

// 处理浏览器变化
const handleBrowserChange = () => {
  emit('update:searchForm', { ...localSearchForm.value })
  debouncedSearch()
}

// 处理操作系统变化
const handleOperatingSystemChange = () => {
  emit('update:searchForm', { ...localSearchForm.value })
  debouncedSearch()
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
  getBrowserOptions()
  getOperatingSystemOptions()
})
</script>

<template>
  <el-card class="search-card" shadow="never">
    <div class="search-form">
      <el-input
        v-model="localSearchForm.keyword"
        placeholder="请输入用户名"
        clearable
        style="width: 200px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select
        v-model="localSearchForm.browser"
        placeholder="请选择浏览器"
        clearable
        style="width: 200px"
        @change="handleBrowserChange"
      >
        <el-option
          v-for="browser in browserOptions"
          :key="browser"
          :label="browser"
          :value="browser"
        />
      </el-select>

      <el-select
        v-model="localSearchForm.operatingSystem"
        placeholder="请选择操作系统"
        clearable
        style="width: 200px"
        @change="handleOperatingSystemChange"
      >
        <el-option
          v-for="os in operatingSystemOptions"
          :key="os"
          :label="os"
          :value="os"
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