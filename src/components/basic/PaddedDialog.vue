<template>
  <el-dialog
    v-model="dialogVisible"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    @close="handleClose"
    v-bind="$attrs"
  >
    <div class="padded-dialog-content">
      <h3 v-if="title" class="dialog-title">{{ title }}</h3>
      
      <div class="dialog-body">
        <slot></slot>
      </div>
      
      <div v-if="$slots.footer || showDefaultFooter" class="dialog-footer">
        <slot name="footer">
          <el-button v-if="showDefaultFooter" @click="handleCancel">{{ cancelText }}</el-button>
          <el-button v-if="showDefaultFooter" type="primary" :loading="loading" @click="handleConfirm">
            {{ confirmText }}
          </el-button>
        </slot>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  visible: boolean
  title?: string
  width?: string
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  showDefaultFooter?: boolean
  cancelText?: string
  confirmText?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '',
  width: '500px',
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showClose: true,
  showDefaultFooter: false,
  cancelText: '取消',
  confirmText: '确定',
  loading: false
})

// Emits
interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
  (e: 'cancel'): void
  (e: 'confirm'): void
}

const emit = defineEmits<Emits>()

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 事件处理
const handleClose = () => {
  emit('close')
  emit('update:visible', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style scoped>
.padded-dialog-content {
  padding: var(--padding-size-dialog);
}

.dialog-title {
  margin: 0 0 var(--margin-size-lg) 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--pp-text-color-primary);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--margin-size-2xl);
}
</style>