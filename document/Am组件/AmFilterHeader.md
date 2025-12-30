# AmFilterHeader 筛选表头组件

## 概述

`AmFilterHeader` 是一个用于表格列头的筛选组件，提供下拉菜单式的筛选功能，支持 v-model 双向绑定。

## 基础用法

```vue
<template>
  <el-table :data="tableData">
    <el-table-column prop="status" label="状态">
      <template #header="{ column }">
        <AmFilterHeader 
          :label="column.label"
          :options="statusOptions"
          v-model="filterStatus"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AmFilterHeader from '@/components/basic/AmFilterHeader.vue'

const filterStatus = ref('')

const statusOptions = [
  { label: '正常', value: 'active' },
  { label: '禁用', value: 'inactive' }
]
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| label | 列标题文本 | `string` | - |
| options | 筛选选项列表 | `FilterOption[]` | - |
| modelValue | 当前筛选值（支持 v-model） | `string \| number \| boolean` | `''` |
| allText | "全部"选项的文本 | `string` | `'全部'` |

### FilterOption 类型

```typescript
interface FilterOption {
  label: string                      // 显示文本
  value: string | number | boolean   // 选项值
}
```

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 筛选值改变时触发 | `(value: string \| number \| boolean)` |
| change | 筛选值改变时触发 | `(value: string \| number \| boolean)` |

## 示例

### 基础筛选

```vue
<template>
  <el-table-column prop="sex" label="性别">
    <template #header="{ column }">
      <AmFilterHeader 
        :label="column.label"
        :options="sexOptions"
        v-model="searchForm.sex"
      />
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const searchForm = reactive({
  sex: ''
})

const sexOptions = [
  { label: '男', value: '男' },
  { label: '女', value: '女' }
]
</script>
```

### 监听筛选变化

```vue
<template>
  <el-table-column prop="type" label="类型">
    <template #header="{ column }">
      <AmFilterHeader 
        :label="column.label"
        :options="typeOptions"
        v-model="filterType"
        @change="handleFilterChange"
      />
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const filterType = ref('')

const typeOptions = [
  { label: '类型A', value: 'A' },
  { label: '类型B', value: 'B' }
]

const handleFilterChange = (value: string | number | boolean) => {
  console.log('筛选值改变:', value)
  // 重新加载数据
  loadData()
}
</script>
```

### 数字类型筛选

```vue
<template>
  <el-table-column prop="level" label="等级">
    <template #header="{ column }">
      <AmFilterHeader 
        :label="column.label"
        :options="levelOptions"
        v-model="filterLevel"
      />
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const filterLevel = ref<number | string>('')

const levelOptions = [
  { label: '初级', value: 1 },
  { label: '中级', value: 2 },
  { label: '高级', value: 3 }
]
</script>
```

### 布尔类型筛选

```vue
<template>
  <el-table-column prop="isValid" label="状态">
    <template #header="{ column }">
      <AmFilterHeader 
        :label="column.label"
        :options="statusOptions"
        v-model="filterStatus"
      />
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const filterStatus = ref<boolean | string>('')

const statusOptions = [
  { label: '正常', value: true },
  { label: '禁用', value: false }
]
</script>
```

### 自定义"全部"文本

```vue
<template>
  <AmFilterHeader 
    label="分类"
    :options="categoryOptions"
    v-model="filterCategory"
    all-text="所有分类"
  />
</template>
```

## 特性

- 支持 v-model 双向绑定
- 支持 string、number、boolean 类型的值
- 自动高亮当前选中项
- 可自定义"全部"选项文本
- 筛选图标根据是否有激活筛选自动变色
- 下拉菜单自动定位
