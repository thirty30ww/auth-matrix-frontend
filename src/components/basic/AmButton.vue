<template>
  <el-button
    v-bind="filteredAttrs"
    :loading="computedLoading"
    :disabled="computedLoading || $attrs.disabled"
    @click="handleClick"
  >
    <slot />
  </el-button>
</template>

<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'

defineOptions({
  name: 'AmButton',
  inheritAttrs: false
})

interface Props {
  loading?: boolean
  autoLoading?: boolean  // 是否自动处理异步 loading，默认 false
}

const props = defineProps<Props>()

const attrs = useAttrs()

const internalLoading = ref(false)

const computedLoading = computed(() => props.loading || internalLoading.value)

// 过滤掉 onClick，避免重复触发
const filteredAttrs = computed(() => {
  const { onClick, ...rest } = attrs
  return rest
})

const handleClick = async (event: MouseEvent) => {
  if (computedLoading.value) return

  // 从 attrs 中获取 onClick 处理函数
  const onClick = attrs.onClick as ((event: MouseEvent) => any) | undefined
  
  if (!onClick) {
    return
  }

  // 执行 onClick 处理器
  const result = onClick(event)
  
  console.log('AmButton - autoLoading prop:', props.autoLoading, 'type:', typeof props.autoLoading, 'result is Promise:', result && typeof result.then === 'function')
  
  // 明确检查 autoLoading 是否为 true
  if (props.autoLoading === true && result && typeof result.then === 'function') {
    internalLoading.value = true
    try {
      await result
    } catch (error) {
      // 错误由调用方处理
      throw error
    } finally {
      internalLoading.value = false
    }
  }
}
</script>
