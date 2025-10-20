<template>
  <!-- 树形选择 -->
  <el-tree-select
    v-if="type === 'tree-select'"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :data="treeData"
    :props="{ label: 'name', value: 'id', children: 'children' }"
    :multiple="multiple"
    check-strictly
    :render-after-expand="false"
    default-expand-all
    :placeholder="placeholder"
    clearable
    style="width: 100%"
  />
  
  <!-- 普通下拉选择 -->
  <el-select
    v-else
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :placeholder="placeholder"
    clearable
    style="width: 100%"
  >
    <el-option
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<script setup lang="ts">

/**
 * 通用设置选择组件（支持普通选择和树形选择）
 */
interface Props {
  modelValue: any
  // 组件类型
  type: 'select' | 'tree-select'
  // 树形数据（用于tree-select类型）
  treeData?: any[]
  // 普通选项数据（用于select类型）
  options?: Array<{value: any, label: string}>
  // 是否多选（用于tree-select类型）
  multiple?: boolean
  // 占位符文本
  placeholder?: string
}

defineProps<Props>()
defineEmits<{
  'update:modelValue': [value: any]
}>()
</script>