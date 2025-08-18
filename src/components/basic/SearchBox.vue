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
          <el-icon v-if="item.icon" class="search-item-icon">
            <component :is="item.icon" />
          </el-icon>
          <span class="search-item-name">{{ item.name }}</span>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import type { View } from '@/types'
import api from "@/services";

const router = useRouter()
const searchKeyword = ref('')

// 缓存上一次的搜索结果
let lastResults: View[] = []
let currentQuery = ''

// el-autocomplete 的查询函数 - 静默更新搜索结果
const querySearch = async (queryString: string, cb: (results: View[]) => void) => {
  if (!queryString.trim()) {
    lastResults = []
    cb([])
    return
  }

  // 先返回上次的结果，保持弹出框不消失
  cb(lastResults)
  currentQuery = queryString

  const views = await api.view.getViewList(queryString)
  if (currentQuery === queryString) {
    const newResults = views.slice(0, 6)
    lastResults = newResults
    cb(newResults)
  }
}

// 处理选择
const handleSelect = (item: View) => {
  router.push(item.path)
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