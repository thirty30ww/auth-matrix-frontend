# AmSortHeader 排序表头组件

## 概述

`AmSortHeader` 是一个用于表格列头的排序组件，支持升序、降序和无排序三种状态的循环切换。

## 基础用法

```vue
<template>
  <el-table :data="tableData">
    <el-table-column prop="createTime" label="创建时间">
      <template #header="{ column }">
        <AmSortHeader 
          :label="column.label"
          field="createTime"
          :sort="sortInfo"
          @change="handleSortChange"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AmSortHeader from '@/components/basic/AmSortHeader.vue'
import type { SortDTO } from '@/services'

const sortInfo = ref<SortDTO>({
  field: '',
  direction: ''
})

const handleSortChange = (sort: SortDTO) => {
  sortInfo.value = sort
  // 重新加载数据
  loadData()
}
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| label | 列标题文本 | `string` | - |
| field | 排序字段名 | `string` | - |
| sort | 当前排序信息 | `SortDTO` | - |

### SortDTO 类型

```typescript
interface SortDTO {
  field: string      // 排序字段
  direction: string  // 排序方向: 'asc' | 'desc' | ''
}
```


## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 排序改变时触发 | `(sort: SortDTO)` |

## 排序逻辑

点击排序图标时，按以下顺序循环切换：

1. **无排序** → **升序** (ASC)
2. **升序** → **降序** (DESC)
3. **降序** → **无排序**

切换到其他字段时，自动重置为升序。

## 示例

### 多列排序

```vue
<template>
  <el-table :data="tableData">
    <el-table-column prop="createTime" label="创建时间">
      <template #header="{ column }">
        <AmSortHeader 
          :label="column.label"
          field="createTime"
          :sort="searchForm.sort"
          @change="handleSortChange"
        />
      </template>
    </el-table-column>
    
    <el-table-column prop="updateTime" label="更新时间">
      <template #header="{ column }">
        <AmSortHeader 
          :label="column.label"
          field="updateTime"
          :sort="searchForm.sort"
          @change="handleSortChange"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { SortDirection } from '@/services'

const searchForm = reactive({
  sort: {
    field: '',
    direction: SortDirection.NONE
  }
})

const handleSortChange = (sort: SortDTO) => {
  searchForm.sort = sort
  loadTableData()
}
</script>
```

## 特性

- 三种排序状态循环切换
- 图标根据排序状态自动变化（升序/降序/默认）
- 激活状态自动高亮显示
- 支持多列排序（同时只能一列生效）
- 悬停时图标放大效果
