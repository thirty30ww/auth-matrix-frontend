<template>
  <el-card v-bind="$attrs" :class="['am-card', { 'no-padding': noPadding }]" :style="cardStyle">
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <slot />
  </el-card>
</template>

<script setup lang="ts">
import {computed} from 'vue'

defineOptions({
  name: 'AmCard',
  inheritAttrs: false
})

interface Props {
  padding?: string | number       // 自定义 body 内边距，支持 '20px' 或 20
  headerPadding?: string | number // 自定义 header 内边距
  noPadding?: boolean             // 是否移除 body 所有内边距
}

const props = defineProps<Props>()

// 计算卡片样式
const cardStyle = computed(() => {
  const styles: Record<string, string> = {}
  
  // Body 内边距
  if (props.noPadding) {
    styles['--am-card-body-padding'] = '0'
  } else if (props.padding !== undefined) {
    styles['--am-card-body-padding'] = typeof props.padding === 'number'
        ? `${props.padding}px`
        : props.padding
  }
  
  // Header 内边距
  if (props.headerPadding !== undefined) {
    styles['--am-card-header-padding'] = typeof props.headerPadding === 'number'
        ? `${props.headerPadding}px`
        : props.headerPadding
  }
  
  return styles
})
</script>

<style scoped>
.am-card :deep(.el-card__body) {
  padding: var(--am-card-body-padding, 20px);
}

.am-card :deep(.el-card__header) {
  padding: var(--am-card-header-padding, 20px);
}
</style>
