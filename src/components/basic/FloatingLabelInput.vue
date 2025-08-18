<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const focused = ref(false)

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isFilled = computed(() => {
  return inputValue.value !== '' && inputValue.value !== null && inputValue.value !== undefined
})

const handleFocus = () => {
  focused.value = true
}

const handleBlur = () => {
  focused.value = false
}
</script>

<template>
  <div class="floating-form-control" :class="{ 'is-focused': focused, 'is-filled': isFilled }">
    <el-input
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <label>{{ label }}</label>
  </div>
</template>

<style scoped>
.floating-form-control {
  position: relative;
  margin: 15px 0 25px;
  width: 100%;
}

.floating-form-control :deep(.el-input__wrapper) {
  background-color: transparent;
  border: 0;
  border-radius: var(--radius-none);
  box-shadow: none;
  border-bottom: 2px var(--el-text-color-primary) solid;
  padding-left: 0;
  box-sizing: border-box;
  transition: border-bottom-color 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.floating-form-control :deep(.el-input__inner) {
  color: var(--el-text-color-primary);
  font-size: var(--font-size-input);
  padding: 12px 0 5px;
  height: auto;
  line-height: normal;
  vertical-align: baseline;
}

.floating-form-control.is-focused :deep(.el-input__wrapper),
.floating-form-control.is-filled :deep(.el-input__wrapper) {
  border-bottom-color: var(--el-color-primary);
}

.floating-form-control label {
  position: absolute;
  top: 12px;
  left: 0;
  pointer-events: none;
  font-size: var(--font-size-input);
  color: var(--el-text-color-primary);
  /* 只对transform和font-size应用过渡效果，不包括color */
  transition-property: transform, font-size;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.floating-form-control.is-focused label,
.floating-form-control.is-filled label {
  color: var(--el-color-primary);
  transform: translateY(-28px);
  font-size: var(--font-size-sm);
}
</style> 