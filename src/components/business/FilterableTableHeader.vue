<template>
  <div class="filterable-header">
    <span>{{ label }}</span>
    <el-dropdown 
      trigger="click"
      @command="handleFilter"
      placement="bottom-start"
    >
      <TableHeaderIcon 
        :active="hasActiveFilter"
      >
        <Filter />
      </TableHeaderIcon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            :command="''"
            :class="{ 'is-active': currentFilterValue === '' }"
          >
            全部
          </el-dropdown-item>
          <el-dropdown-item 
            v-for="option in options"
            :key="option.value"
            :command="option.value"
            :class="{ 'is-active': currentFilterValue === option.value }"
          >
            {{ option.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Filter } from '@element-plus/icons-vue'
import TableHeaderIcon from '@/components/basic/TableHeaderIcon.vue'

interface FilterOption {
  label: string
  value: string
}

interface Props {
  label: string
  field: string
  options: FilterOption[]
  currentFilterValue: string
}

interface Emits {
  (e: 'filter', field: string, value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 是否有激活的筛选
const hasActiveFilter = computed(() => props.currentFilterValue !== '')

// 处理筛选点击
const handleFilter = (value: string) => {
  emit('filter', props.field, value)
}
</script>

<style scoped>
.filterable-header {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}


:deep(.el-dropdown-menu__item.is-active) {
  color: var(--el-color-primary);
  font-weight: bold;
}
</style>