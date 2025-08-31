<template>
  <span>{{ label }}</span>
  <TableHeaderIcon 
    :active="isActive"
    @click="handleSort"
  >
    <CaretTop v-if="isActive && currentDirection === SortDirection.ASC" />
    <CaretBottom v-else-if="isActive && currentDirection === SortDirection.DESC" />
    <Sort v-else />
  </TableHeaderIcon>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CaretTop, CaretBottom, Sort } from '@element-plus/icons-vue'
import { SortDirection } from '@/types'
import type { SortDTO as SortType } from '@/types'
import TableHeaderIcon from '@/components/basic/TableHeaderIcon.vue'

interface Props {
  label: string
  field: string
  currentSort: SortType
}

interface Emits {
  (e: 'sortChange', sortInfo: SortType): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 是否为当前排序字段且有排序方向
const isActive = computed(() => 
  props.currentSort.field === props.field && props.currentSort.direction !== SortDirection.NONE
)

// 当前排序方向
const currentDirection = computed(() => props.currentSort.direction)

// 处理排序点击
const handleSort = () => {
  let newField = props.field
  let newDirection: string

  if (props.currentSort.field === props.field) {
    // 如果点击的是当前排序字段，按照 '' -> 'asc' -> 'desc' -> '' 的顺序切换
    if (props.currentSort.direction === SortDirection.NONE) {
      newDirection = SortDirection.ASC
    } else if (props.currentSort.direction === SortDirection.ASC) {
      newDirection = SortDirection.DESC
    } else {
      newDirection = SortDirection.NONE
      newField = ''
    }
  } else {
    // 如果点击的是不同字段，切换到该字段并设置为升序
    newField = props.field
    newDirection = SortDirection.ASC
  }
  
  emit('sortChange', { field: newField, direction: newDirection })
}
</script>

<style scoped>

</style>