<script setup lang="ts">
interface Props {
  themeColor: 'stellar-purple' | 'ocean-blue' | 'golden-dawn' | 'emerald-forest' | 'rose-bloom'
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 56
})
</script>

<template>
  <div 
    class="theme-icon-box" 
    :class="`theme-${themeColor}`"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <slot />
  </div>
</template>

<style scoped>
.theme-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
}

.theme-icon-box :deep(.el-icon) {
  font-size: calc(var(--icon-size-statistic) * 1.2);
}

.theme-icon-box :deep(.el-icon svg) {
  stroke-width: 4;
}

/* 星紫幻境 */
.theme-stellar-purple {
  background: linear-gradient(135deg, var(--am-stellar-purple-dark-2) 0%, var(--am-stellar-purple-light-9) 100%);
}

.theme-stellar-purple :deep(.el-icon) {
  color: var(--am-stellar-purple-dark-2);
}

/* 海蓝秘境 */
.theme-ocean-blue {
  background: linear-gradient(135deg, var(--am-ocean-blue-dark-2) 0%, var(--am-ocean-blue-light-9) 100%);
}

.theme-ocean-blue :deep(.el-icon) {
  color: var(--am-ocean-blue-dark-2);
}

/* 金黄晨光 */
.theme-golden-dawn {
  background: linear-gradient(135deg, var(--am-golden-dawn-dark-2) 0%, var(--am-golden-dawn-light-9) 100%);
}

.theme-golden-dawn :deep(.el-icon) {
  color: var(--am-golden-dawn-dark-2);
}

/* 翡翠森林 */
.theme-emerald-forest {
  background: linear-gradient(135deg, var(--am-emerald-forest-dark-2) 0%, var(--am-emerald-forest-light-9) 100%);
}

.theme-emerald-forest :deep(.el-icon) {
  color: var(--am-emerald-forest-dark-2);
}

/* 玫瑰花语 */
.theme-rose-bloom {
  background: linear-gradient(135deg, var(--am-rose-bloom-dark-2) 0%, var(--am-rose-bloom-light-9) 100%);
}

.theme-rose-bloom :deep(.el-icon) {
  color: var(--am-rose-bloom-dark-2);
}
</style>
