<template>
  <el-tag 
    :type="type"
    :class="tagClasses"
    @click="handleClick"
  >
    <slot>{{ text }}</slot>
  </el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props接口定义
interface Props {
  /** 标签类型 */
  type?: 'success' | 'info' | 'warning' | 'danger' | ''
  /** 是否禁用 */
  disabled?: boolean
  /** 标签文本（当没有使用slot时） */
  text?: string
  /** 是否可点击（当不禁用时） */
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: '',
  disabled: false,
  text: '',
  clickable: true
})

// Emits定义
interface Emits {
  (e: 'click'): void
}

const emit = defineEmits<Emits>()

// 计算标签的CSS类
const tagClasses = computed(() => {
  const classes = ['clickable-tag']
  
  if (props.disabled) {
    classes.push('disabled')
  } else if (props.clickable) {
    classes.push('clickable')
  }
  
  return classes
})

// 处理点击事件
const handleClick = () => {
  if (!props.disabled && props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
/* 基础可点击标签样式 */
.clickable-tag {
  transition: all 0.3s ease;
  user-select: none;
}

/* 可点击状态 */
.clickable-tag.clickable {
  cursor: pointer;
}

.clickable-tag.clickable:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

/* 禁用状态 */
.clickable-tag.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.clickable-tag.disabled:hover {
  opacity: 0.6;
  transform: none;
}
</style>