<template>
  <div class="status-display">
    <span 
      class="status-dot" 
      :class="dotClass"
    ></span>
    <span class="status-text">{{ displayText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: boolean
  validText?: string
  invalidText?: string
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  validText: '正常',
  invalidText: '封禁',
  size: 'medium'
})

// 计算圆点的CSS类
const dotClass = computed(() => {
  const statusClass = props.status ? 'status-dot-valid' : 'status-dot-invalid'
  const sizeClass = `status-dot-${props.size}`
  return [statusClass, sizeClass]
})

// 计算显示文本
const displayText = computed(() => {
  return props.status ? props.validText : props.invalidText
})
</script>

<style scoped>
.status-display {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.status-dot {
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
}

.status-dot::before {
  content: '';
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  animation: pulse 2s infinite;
}

/* 大小变体 */
.status-dot-small {
  width: 6px;
  height: 6px;
}

.status-dot-small::before {
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
}

.status-dot-medium {
  width: 8px;
  height: 8px;
}

.status-dot-medium::before {
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
}

.status-dot-large {
  width: 10px;
  height: 10px;
}

.status-dot-large::before {
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
}

/* 状态颜色 */
.status-dot-valid {
  background-color: var(--el-color-success);
  box-shadow: 0 0 6px var(--el-color-success-light-5);
}

.status-dot-valid::before {
  background-color: var(--el-color-success);
}

.status-dot-invalid {
  background-color: var(--el-color-danger);
  box-shadow: 0 0 6px var(--el-color-danger-light-5);
}

.status-dot-invalid::before {
  background-color: var(--el-color-danger);
}

.status-text {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
}
</style>