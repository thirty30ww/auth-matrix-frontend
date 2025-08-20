<script setup lang="ts">
import { computed } from 'vue'
import { formatToStartOfDay, formatToEndOfDay } from '@/utils/date'

// 定义 props
interface Props {
  startDate?: string
  endDate?: string
}

// 定义 emits
interface Emits {
  (e: 'change', startDate: string, endDate: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 内部日期范围
const dateRange = computed({
  get: () => {
    if (props.startDate && props.endDate) {
      // 从完整时间格式中提取日期部分用于显示
      const startDateOnly = props.startDate.split(' ')[0]
      const endDateOnly = props.endDate.split(' ')[0]
      return [startDateOnly, endDateOnly]
    }
    return []
  },
  set: (value: string[]) => {
    if (value && value.length === 2) {
      // 格式化为完整的时间范围
      const startDateTime = formatToStartOfDay(value[0])
      const endDateTime = formatToEndOfDay(value[1])
      emit('change', startDateTime, endDateTime)
    } else {
      emit('change', '', '')
    }
  }
})


</script>

<template>
  <el-date-picker
    v-model="dateRange"
    type="daterange"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    format="YYYY-MM-DD"
    value-format="YYYY-MM-DD"
    :clearable="true"
    :unlink-panels="true"
    class="date-range-filter"
  />
</template>

<style scoped>
/* 隐藏时间选择部分 */
:deep(.el-picker-panel__footer) {
  display: none;
}

/* 隐藏时间头部 */
:deep(.el-date-range-picker__time-header) {
  display: none;
}

/* 只显示日期表格部分 */
:deep(.el-picker-panel__content) {
  padding: 12px;
}

/* 启用独立的月份导航 */
:deep(.el-date-range-picker) {
  --el-datepicker-inner-border-color: var(--el-border-color-lighter);
}

/* 允许左右面板独立切换月份 */
:deep(.el-picker-panel__content .el-date-range-picker__content) {
  position: relative;
}

/* 确保月份切换按钮可用 */
:deep(.el-picker-panel__header) {
  position: relative;
}

:deep(.el-picker-panel__header .el-picker-panel__icon-btn) {
  pointer-events: auto;
}
</style>