import { ref, watch } from 'vue'

/**
 * 数字滚动动画 Hook
 * @param duration 动画时长（毫秒），默认 800ms
 * @returns displayValue 显示的数字，animateToNumber 触发动画的函数
 */
export function useCountUp(duration = 800) {
  const displayValue = ref(0)

  /**
   * 滚动到目标数字
   * @param target 目标数字
   */
  const animateToNumber = (target: number) => {
    const startTime = Date.now()
    const startValue = displayValue.value

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // 使用 easeOutCubic 缓动函数
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      displayValue.value = Math.round(startValue + (target - startValue) * easeProgress)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        displayValue.value = target
      }
    }

    requestAnimationFrame(animate)
  }

  /**
   * 监听值变化并自动触发动画
   * @param getValue 获取目标值的函数
   */
  const watchValue = (getValue: () => number | string) => {
    watch(getValue, (newVal) => {
      if (typeof newVal === 'number') {
        animateToNumber(newVal)
      }
    }, { immediate: true })
  }

  return {
    displayValue,
    animateToNumber,
    watchValue
  }
}
