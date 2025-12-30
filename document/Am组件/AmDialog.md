# AmDialog 对话框组件

## 概述

`AmDialog` 是一个增强的对话框组件，基于 Element Plus 的 `el-dialog`，提供灵活的内边距控制。

## 基础用法

```vue
<template>
  <AmButton @click="dialogVisible = true">打开对话框</AmButton>
  
  <AmDialog 
    v-model:visible="dialogVisible"
    title="对话框标题"
  >
    <p>这是对话框内容</p>
  </AmDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dialogVisible = ref(false)
</script>
```

## 自定义内边距

### 调整 Body 内边距

```vue
<template>
  <AmDialog 
    v-model:visible="visible"
    :padding="30"
  >
    <p>内边距为 30px</p>
  </AmDialog>
</template>
```

### 移除所有内边距

```vue
<template>
  <AmDialog 
    v-model:visible="visible"
    no-padding
  >
    <el-table :data="tableData">
      <!-- 表格内容 -->
    </el-table>
  </AmDialog>
</template>
```

### 分别控制各区域内边距

```vue
<template>
  <AmDialog 
    v-model:visible="visible"
    :header-padding="20"
    :padding="30"
    :footer-padding="15"
  >
    <template #header>
      <h3>自定义标题</h3>
    </template>
    
    <p>内容区域</p>
    
    <template #footer>
      <AmButton @click="visible = false">取消</AmButton>
      <AmButton type="primary">确定</AmButton>
    </template>
  </AmDialog>
</template>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| visible | 对话框显示状态（支持 v-model） | `boolean` | - |
| padding | 自定义 body 内边距 | `string \| number` | - |
| headerPadding | 自定义 header 内边距 | `string \| number` | - |
| footerPadding | 自定义 footer 内边距 | `string \| number` | - |
| noPadding | 是否移除 body 所有内边距 | `boolean` | `false` |
| noHeaderPadding | 是否移除 header 所有内边距 | `boolean` | `false` |
| noFooterPadding | 是否移除 footer 所有内边距 | `boolean` | `false` |

> 注意：`AmDialog` 继承 `el-dialog` 的所有 props，如 `title`、`width`、`modal` 等。

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:visible | 显示状态改变时触发 | `(value: boolean)` |
| close | 对话框关闭时触发 | - |

## Slots

| 插槽名 | 说明 |
|--------|------|
| default | 对话框内容 |
| header | 对话框头部 |
| footer | 对话框底部 |

## 示例

### 表单对话框

```vue
<template>
  <AmDialog 
    v-model:visible="formVisible"
    title="编辑用户"
    width="500px"
    :padding="20"
    @close="handleClose"
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <AmButton @click="formVisible = false">取消</AmButton>
      <AmButton type="primary" auto-loading @click="handleSubmit">
        提交
      </AmButton>
    </template>
  </AmDialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const formVisible = ref(false)
const form = reactive({
  username: '',
  email: ''
})

const handleSubmit = async () => {
  await api.updateUser(form)
  formVisible.value = false
}

const handleClose = () => {
  // 重置表单
  form.username = ''
  form.email = ''
}
</script>
```

### 无内边距对话框（适合表格）

```vue
<template>
  <AmDialog 
    v-model:visible="tableVisible"
    title="数据列表"
    width="80%"
    no-padding
    no-footer-padding
  >
    <el-table :data="tableData" height="400">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" />
    </el-table>
    
    <template #footer>
      <AmButton @click="tableVisible = false">关闭</AmButton>
    </template>
  </AmDialog>
</template>
```

### 自定义头部

```vue
<template>
  <AmDialog 
    v-model:visible="visible"
    :header-padding="15"
  >
    <template #header>
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 18px; font-weight: bold;">自定义标题</span>
        <el-tag type="success">新</el-tag>
      </div>
    </template>
    
    <p>对话框内容</p>
  </AmDialog>
</template>
```

## 特性

- 继承 Element Plus Dialog 的所有功能
- 灵活的内边距控制（支持数字和字符串）
- 可分别控制 header、body、footer 的内边距
- 支持完全移除各区域内边距
- 使用 v-model:visible 双向绑定
- 自动触发 close 事件
