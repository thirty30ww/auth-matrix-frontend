<template>
  <div class="type-selector">
    <el-button 
      v-for="option in options"
      :key="option.value"
      :type="modelValue === option.value ? 'primary' : 'default'"
      :disabled="option.disabled"
      @click="handleSelect(option.value)"
      class="type-button"
      :class="{ 'disabled-button': option.disabled }"
    >
      {{ option.label }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
interface TypeOption {
  label: string
  value: any
  disabled?: boolean
}

interface Props {
  modelValue: any
  options: TypeOption[]
}

interface Emits {
  (e: 'update:modelValue', value: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleSelect = (value: any) => {
  // 找到对应的选项，检查是否被禁用
  const option = props.options.find(opt => opt.value === value)
  if (option?.disabled) {
    return
  }
  emit('update:modelValue', value)
}
</script>

<style scoped>
.type-selector {
  display: flex;
}

.type-button {
  flex: 1;
}

.disabled-button {
  color: var(--el-text-color-disabled) !important;
  background-color: var(--el-button-disabled-bg-color) !important;
  border-color: var(--el-button-disabled-border-color) !important;
}
</style>