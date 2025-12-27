<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { DateRangeType } from '@/services'
import { useThemeStore } from '@/stores'
import AmCard from '@/components/basic/AmCard.vue'

interface Props {
  xData: (string | number)[]
  yData: number[]
}

const props = withDefaults(defineProps<Props>(), {
})

const themeStore = useThemeStore()
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

// 当前选择的类型
const currentType = ref<DateRangeType>(DateRangeType.THIS_WEEK)

// 类型选项
const typeOptions = [
  { label: '今日', value: DateRangeType.TODAY },
  { label: '本周', value: DateRangeType.THIS_WEEK },
  { label: '本月', value: DateRangeType.THIS_MONTH },
  { label: '本年', value: DateRangeType.THIS_YEAR }
]

// 发送类型变化事件
const emit = defineEmits<{
  typeChange: [type: DateRangeType]
}>()

// 监听类型变化
watch(currentType, (newType) => {
  emit('typeChange', newType)
})

// 获取主题色渐变
const getGradientColors = computed(() => {
  const variants = themeStore.getThemeColorVariants
  return {
    start: variants.light7,
    end: variants.dark2
  }
})

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) return

  const colors = getGradientColors.value
  const isDark = themeStore.isDark
  
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          type: 'dashed',
          color: isDark ? '#666' : '#999'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.xData,
      axisLine: {
        lineStyle: {
          color: isDark ? '#4a4a4a' : '#e0e0e0'
        }
      },
      axisLabel: {
        color: isDark ? '#a0a0a0' : '#666'
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: isDark ? '#a0a0a0' : '#666',
        formatter: '{value}'
      },
      splitLine: {
        lineStyle: {
          color: isDark ? '#3a3a3a' : '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '新增用户',
        type: 'bar',
        data: props.yData,
        barWidth: '40%',
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors.start },
            { offset: 1, color: colors.end }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors.start },
              { offset: 1, color: colors.start }
            ])
          }
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

// 监听数据变化
watch(() => [props.xData, props.yData], () => {
  updateChart()
}, { deep: true })

// 监听主题变化
watch(() => themeStore.getThemeColorVariants, () => {
  updateChart()
}, { deep: true })

// 监听暗色模式变化
watch(() => themeStore.isDark, () => {
  if (chartInstance) {
    chartInstance.dispose()
    initChart()
  }
})

// 窗口大小变化时重新调整图表
const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

// 组件卸载时清理
import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<template>
  <AmCard shadow="never" padding="10px 0" class="chart-card">
    <template #header>
      <div class="card-header">
        <span class="card-title">用户新增统计</span>
        <el-radio-group v-model="currentType" size="small">
          <el-radio-button
            v-for="option in typeOptions"
            :key="option.value"
            :label="option.value"
            size="default"
          >
            {{ option.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </template>
    <div class="chart-container">
      <div ref="chartRef" class="chart"></div>
    </div>
  </AmCard>
</template>

<style scoped>
.chart-card {
  height: 100%;
}

.card-header {
  font-size: var(--font-size-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 350px;
  min-height: 350px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
