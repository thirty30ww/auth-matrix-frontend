<template>
  <span class="am-sort-header">
    <span>{{ label }}</span>
    <AmHeaderIcon 
      :active="isActive"
      @click="handleSort"
    >
      <CaretTop v-if="isActive && currentDirection === SortDirection.ASC" />
      <CaretBottom v-else-if="isActive && currentDirection === SortDirection.DESC" />
      <Sort v-else />
    </AmHeaderIcon>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CaretTop, CaretBottom, Sort } from '@element-plus/icons-vue'
import { SortDirection } from '@/services'
import type { SortDTO } from '@/services'
import AmHeaderIcon from './AmHeaderIcon.vue'

interface Props {
  label: string
  field: string
  sort?: SortDTO
}

const props = defineProps<Props>()

const emit = defineEmits<{
  change: [sort: SortDTO]
}>()

const isActive = computed(() => 
  props.sort?.field === props.field && props.sort?.direction !== SortDirection.NONE
)

const currentDirection = computed(() => props.sort?.direction || SortDirection.NONE)

const handleSort = () => {
  let newField = props.field
  let newDirection: string

  if (props.sort?.field === props.field) {
    // 循环切换: NONE -> ASC -> DESC -> NONE
    if (props.sort.direction === SortDirection.NONE) {
      newDirection = SortDirection.ASC
    } else if (props.sort.direction === SortDirection.ASC) {
      newDirection = SortDirection.DESC
    } else {
      newDirection = SortDirection.NONE
      newField = ''
    }
  } else {
    // 切换到新字段，默认升序
    newField = props.field
    newDirection = SortDirection.ASC
  }
  
  emit('change', { field: newField, direction: newDirection })
}
</script>

<style scoped>
.am-sort-header {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}
</style>
