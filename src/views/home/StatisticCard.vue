<script setup lang="ts">
import { computed, watch } from 'vue'
import { ArrowUp, ArrowDown, User, Plus, Warning } from '@element-plus/icons-vue'
import AmAvatar from '@/components/basic/AmAvatar.vue'
import UserAvatar from '@/components/basic/UserAvatar.vue'
import ThemeIconBox from './ThemeIconBox.vue'
import { useCountUp } from '@/composables/useCountUp.ts'

interface Props {
  title: string
  icon: 'User' | 'Plus' | 'Warning'
  themeColor: 'stellar-purple' | 'ocean-blue' | 'golden-dawn' | 'emerald-forest' | 'rose-bloom'
  loading?: boolean
  type?: 'number' | 'compare' | 'avatars'
  mainValue?: number | string
  compareLabel?: string
  compareValue?: number
  compareTrend?: 'up' | 'down'
  avatars?: Array<{ id: number; avatarUrl: string; name?: string; [key: string]: any }>
  maxAvatars?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  type: 'number',
  mainValue: 0,
  compareLabel: '较昨日',
  compareValue: 0,
  compareTrend: 'up',
  avatars: () => [],
  maxAvatars: 5
})

// 图标映射
const iconMap = {
  User,
  Plus,
  Warning
}

// 格式化对比值
const formattedCompareValue = computed(() => {
  return Math.abs(props.compareValue).toFixed(1)
})

// 使用数字滚动动画
const { displayValue, animateToNumber } = useCountUp(800)

// 监听 mainValue 变化
watch(() => props.mainValue, (newVal) => {
  if (typeof newVal === 'number') {
    animateToNumber(newVal)
  }
}, { immediate: true })
</script>

<template>
  <el-card class="statistic-card" shadow="never">
    <div class="card-header">
      <span class="card-title">{{ title }}</span>
    </div>

    <div class="card-body">
      <div class="card-content">
        <!-- 数字类型 -->
        <template v-if="type === 'number'">
          <div class="main-number">{{ displayValue }}</div>
        </template>

        <!-- 对比类型 -->
        <template v-if="type === 'compare'">
          <div class="main-number">{{ displayValue }}</div>
          <div class="compare-info">
            <span class="compare-label">{{ compareLabel }}</span>
            <span :class="['compare-value', compareTrend]">
              <el-icon v-if="compareTrend === 'up'"><ArrowUp /></el-icon>
              <el-icon v-else><ArrowDown /></el-icon>
              {{ formattedCompareValue }}%
            </span>
          </div>
        </template>

        <!-- 头像列表类型 -->
        <template v-if="type === 'avatars'">
          <div class="main-number">{{ displayValue }}</div>
          <div class="avatar-container">
            <AmAvatar
              v-if="avatars.length > 0"
              mode="group"
              :avatars="avatars"
              :max="maxAvatars"
              :size="32"
              src-field="avatarUrl"
              alt-field="name"
              :animated="true"
              :animation-delay="0"
              class="avatar-info"
            >
              <template #avatar="{ avatar }">
                <UserAvatar :imageUrl="avatar.avatarUrl" :alt="avatar.name" />
              </template>
            </AmAvatar>
          </div>
        </template>
      </div>

      <div class="icon-container">
        <ThemeIconBox :theme-color="themeColor">
          <el-icon>
            <component :is="iconMap[icon]" />
          </el-icon>
        </ThemeIconBox>
      </div>
    </div>
  </el-card>
</template>

<style scoped>

.card-header {
  margin-bottom: var(--gap-size-md);
  font-size: var(--font-size-md);
}

.card-body {
  display: flex;
  gap: var(--gap-size-lg);
  align-items: center;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--gap-size-md);
}

.main-number {
  font-size: var(--font-size-3xl);
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.compare-info {
  height: var(--gap-size-xl);
  display: flex;
  align-items: center;
  gap: var(--gap-size-sm);
}

.compare-label {
  color: var(--el-text-color-secondary);
}

.compare-value {
  display: flex;
  align-items: center;
  gap: var(--gap-size-xs);
}

.compare-value.up {
  color: var(--am-rose-bloom);
}

.compare-value.down {
  color: var(--am-emerald-forest);
}

/* 头像容器 - 保持布局稳定 */
.avatar-container {
  height: var(--gap-size-xl);
  display: flex;
  align-items: center;
}

.avatar-info {
  display: flex;
  align-items: center;
}
</style>
