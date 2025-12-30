<template>
  <el-dialog
    v-model="dialogVisible"
    v-bind="$attrs"
    :class="['am-dialog', { 'no-padding': noPadding }]"
    :style="dialogStyle"
    @close="handleClose"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    
    <slot />
    
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'AmDialog',
  inheritAttrs: false
})

interface Props {
  visible: boolean                // 对话框显示状态
  padding?: string | number       // 自定义 body 内边距，支持 '20px' 或 20
  headerPadding?: string | number // 自定义 header 内边距
  footerPadding?: string | number // 自定义 footer 内边距
  noPadding?: boolean             // 是否移除 body 所有内边距
  noHeaderPadding?: boolean       // 是否移除 header 所有内边距
  noFooterPadding?: boolean       // 是否移除 footer 所有内边距
}

const props = defineProps<Props>()

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
}

const emit = defineEmits<Emits>()

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 计算对话框样式
const dialogStyle = computed(() => {
  const styles: Record<string, string> = {}
  
  // Body 内边距
  if (props.noPadding) {
    styles['--am-dialog-body-padding'] = '0'
  } else if (props.padding !== undefined) {
    styles['--am-dialog-body-padding'] = typeof props.padding === 'number'
        ? `${props.padding}px`
        : props.padding
  }
  
  // Header 内边距
  if (props.noHeaderPadding) {
    styles['--am-dialog-header-padding'] = '0'
  } else if (props.headerPadding !== undefined) {
    styles['--am-dialog-header-padding'] = typeof props.headerPadding === 'number'
        ? `${props.headerPadding}px`
        : props.headerPadding
  }
  
  // Footer 内边距
  if (props.noFooterPadding) {
    styles['--am-dialog-footer-padding'] = '0'
  } else if (props.footerPadding !== undefined) {
    styles['--am-dialog-footer-padding'] = typeof props.footerPadding === 'number'
        ? `${props.footerPadding}px`
        : props.footerPadding
  }
  
  return styles
})

// 事件处理
const handleClose = () => {
  emit('close')
  emit('update:visible', false)
}
</script>

<style>
/* 使用非 scoped 样式，因为 el-dialog 会 teleport 到 body */
.am-dialog.el-dialog .el-dialog__body {
  padding: var(--am-dialog-body-padding) !important;
}

.am-dialog.el-dialog .el-dialog__header {
  padding: var(--am-dialog-header-padding) !important;
}

.am-dialog.el-dialog .el-dialog__footer {
  padding: var(--am-dialog-footer-padding) !important;
}
</style>
