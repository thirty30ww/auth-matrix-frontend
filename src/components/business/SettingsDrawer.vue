<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores'
import { LOGO_POSITIONS, THEME_COLORS, type LogoPosition } from '@/stores/theme'
import LayoutPreview from '@/components/basic/LayoutPreview.vue'

// 定义 props
interface Props {
  modelValue: boolean
}

// 定义 emits
interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const themeStore = useThemeStore()

// 双向绑定的计算属性
const drawerVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

// 处理主题色选择
const selectThemeColor = (colorId: string) => {
  themeStore.setThemeColor(colorId)
}

// 判断是否为当前主题
const isCurrentTheme = (colorId: string) => {
  return themeStore.currentThemeColor === colorId
}

// 处理logo位置选择
const selectLogoPosition = (position: LogoPosition) => {
  themeStore.setLogoPosition(position)
}

// Logo位置选项
const logoPositionOptions = [
  { 
    label: '侧边栏', 
    value: LOGO_POSITIONS.SIDEBAR
  },
  { 
    label: '顶栏', 
    value: LOGO_POSITIONS.HEADER
  }
]
</script>

<template>
  <el-drawer
    v-model="drawerVisible"
    title="偏好设置"
    direction="rtl"
    size="var(--width-size-drawer)"
  >
    <div>
      <!-- 主题色设置 -->
      <div class="setting-section">
        <div class="section-title">主题色彩</div>
        
        <div class="color-palette">
          <el-tooltip
            v-for="theme in THEME_COLORS"
            :key="theme.id"
            :content="theme.name"
            placement="bottom"
            effect="dark"
          >
            <div
              class="color-item"
              :class="{ active: isCurrentTheme(theme.id) }"
              :style="{ backgroundColor: theme.color }"
              @click="selectThemeColor(theme.id)"
            >
            </div>
          </el-tooltip>
        </div>
      </div>

      <!-- Logo位置设置 -->
      <div class="setting-section">
        <div class="section-title">Logo位置</div>
        
        <div class="layout-options">
          <div
            v-for="option in logoPositionOptions"
            :key="option.value"
            class="layout-option"
            :class="{ active: themeStore.logoPosition === option.value }"
            @click="selectLogoPosition(option.value)"
          >
            <LayoutPreview 
              :is-header-layout="option.value === LOGO_POSITIONS.HEADER" 
              :is-active="themeStore.logoPosition === option.value"
            />
            <div class="layout-option-label">{{ option.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>

.section-title {
  color: var(--el-text-color-secondary);
  margin-bottom: var(--margin-size-spacing-2);
}

.color-palette {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-item {
  width: var(--width-size-color-picker-item);
  height: var(--height-size-color-picker-item);
  border-radius: var(--radius-color-picker-item);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.color-item:hover {
  transform: scale(1.05);
  }

.color-item.active {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 5px var(--el-color-primary-light-8);
}

.setting-section {
  margin-bottom: var(--margin-size-spacing-4);
}

/* 布局选项样式 */
.layout-options {
  display: flex;
  gap: var(--margin-size-spacing-3);
}

.layout-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--margin-size-spacing-2);
  padding: var(--padding-size-spacing-3);
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: var(--radius-lg);
}


.layout-option-label {
  font-weight: 500;
  color: var(--el-text-color-primary);
  font-size: var(--font-size-sm);
  text-align: center;
}
</style>