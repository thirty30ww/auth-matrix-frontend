<template>
  <div class="search-box">
    <el-autocomplete
      v-model="searchKeyword"
      :fetch-suggestions="querySearch"
      placeholder="搜索页面"
      clearable
      :trigger-on-focus="false"
      :popper-append-to-body="false"
      @select="handleSelect"
    >
      <template #prefix>
        <el-icon class="search-icon">
          <Search />
        </el-icon>
      </template>
      <template #default="{ item }">
        <div class="search-item">
          <el-icon v-if="item.node.icon" class="search-item-icon">
            <component :is="item.node.icon" />
          </el-icon>
          <span class="search-item-name">{{ item.node.name }}</span>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import type { PermissionVO } from '@/services'
import api from "@/services";

const router = useRouter()
const searchKeyword = ref('')

// 缓存上一次的搜索结果
let lastResults: PermissionVO[] = []
let currentQuery = ''

// el-autocomplete 的查询函数 - 静默更新搜索结果
const querySearch = async (queryString: string, cb: (results: PermissionVO[]) => void) => {
  if (!queryString.trim()) {
    lastResults = []
    cb([])
    return
  }

  // 如果是新的查询，清空上次结果
  if (currentQuery !== queryString) {
    cb([])
    lastResults = []
  }
  
  currentQuery = queryString

  const viewVOs = await api.permission.getViewList(queryString)
  if (currentQuery === queryString) {
    const newResults = viewVOs.slice(0, 6)
    lastResults = newResults
    cb(newResults)
  }
}

// 处理选择
const handleSelect = (item: PermissionVO) => {
  router.push(item.node.path)
  searchKeyword.value = ''
  // 清空缓存
  lastResults = []
  currentQuery = ''
}
</script>

<style scoped>
.search-box {
  width: 200px;
}

.search-icon {
  color: var(--el-text-color-placeholder);
}

.search-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-item-name {
  color: var(--el-text-color-primary);
}

/* 确保下拉菜单宽度与输入框一致 */
.search-box :deep(.el-autocomplete-suggestion) {
  min-width: 200px !important;
}
</style>