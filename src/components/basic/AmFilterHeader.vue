<template>
  <span class="am-filter-header">
    <span>{{ label }}</span>
    <el-dropdown 
      trigger="click"
      @command="handleFilter"
      placement="bottom-start"
    >
      <AmHeaderIcon :active="hasActiveFilter">
        <Filter />
      </AmHeaderIcon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            command=""
            :class="{ 'is-active': !modelValue }"
          >
            {{ allText }}
          </el-dropdown-item>
          <el-dropdown-item 
            v-for="option in options"
            :key="option.value"
            :command="option.value"
            :class="{ 'is-active': modelValue === option.value }"
          >
            {{ option.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Filter } from '@element-plus/icons-vue'
import AmHeaderIcon from './AmHeaderIcon.vue'

export interface FilterOption {
  label: string
  value: string | number | boolean
}

interface Props {
  label: string
  options: FilterOption[]
  modelValue?: string | number | boolean
  allText?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  allText: '全部'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  change: [value: string | number | boolean]
}>()

const hasActiveFilter = computed(() => props.modelValue !== '' && props.modelValue !== undefined)

const handleFilter = (value: string | number | boolean) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped>
.am-filter-header {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}

:deep(.el-dropdown-menu__item.is-active) {
  color: var(--el-color-primary);
  font-weight: bold;
}
</style>
