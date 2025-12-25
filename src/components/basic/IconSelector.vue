<template>
  <el-select
    ref="selectRef"
    v-model="selectedIcon"
    :placeholder="placeholder"
    :disabled="disabled"
    filterable
    clearable
    :style="{ width: width || '100%' }"
    :filter-method="filterMethod"
    @change="handleChange"
    @clear="handleClear"
    popper-class="icon-selector-dropdown"
  >
    <template v-if="selectedIcon" #prefix>
      <el-icon class="selected-icon-prefix">
        <component :is="selectedIcon" />
      </el-icon>
    </template>
    
    <!-- 使用单个option包含所有图标 -->
    <el-option value="" disabled style="height: auto; padding: 0; max-height: none;">
      <div class="icon-grid-container" @click.stop>
        <!-- 图标网格 -->
        <div class="icon-grid">
          <el-tooltip
            v-for="iconName in filteredIconList"
            :key="iconName"
            :content="iconName"
            placement="top"
            :show-after="300"
            :hide-after="0"
            :offset="4"
          >
            <div
              class="icon-grid-item"
              :class="{ active: iconName === selectedIcon }"
              @click="handleIconSelect(iconName)"
            >
              <el-icon class="icon-grid-icon">
                <component :is="iconName" />
              </el-icon>
            </div>
          </el-tooltip>
        </div>
        
        <div v-if="filteredIconList.length === 0" class="no-icons">
          <el-empty description="未找到匹配的图标" :image-size="60" />
        </div>
      </div>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  width?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择图标',
  disabled: false
})

const emit = defineEmits<Emits>()

// 获取所有 Element Plus 图标名称
const iconList = ref<string[]>([])
const selectedIcon = ref('')
const searchKeyword = ref('')
const selectRef = ref()

// 初始化图标列表
onMounted(() => {
  iconList.value = Object.keys(ElementPlusIconsVue).sort()
  selectedIcon.value = props.modelValue || ''
})

// 过滤后的图标列表（基于搜索关键词）
const filteredIconList = computed(() => {
  if (!searchKeyword.value) {
    return iconList.value
  }
  return iconList.value.filter(iconName =>
    iconName.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 自定义过滤方法
const filterMethod = (query: string) => {
  searchKeyword.value = query
  return true // 始终返回true，因为我们用自己的过滤逻辑
}

// 图标选择处理
const handleIconSelect = (iconName: string) => {
  selectedIcon.value = iconName
  emit('update:modelValue', iconName)
  // 选中后关闭下拉框
  if (selectRef.value) {
    selectRef.value.blur()
  }
}

// 处理el-select的change事件
const handleChange = (value: string) => {
  emit('update:modelValue', value)
}

const handleClear = () => {
  emit('update:modelValue', '')
}

// 监听外部 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  selectedIcon.value = newValue || ''
}, { immediate: true })
</script>

<style scoped>
/* 输入框前缀中的已选图标样式 */
.selected-icon-prefix {
  color: var(--el-color-primary); /* 使用主色调突出显示已选图标 */
}

/* 图标网格容器的外层包装 */
.icon-grid-container {
  padding: var(--gap-size-md); /* 使用现有padding变量 */
  /* 移除高度限制，让Element Plus下拉框本身处理滚动 */
  cursor: default !important; /* 强制覆盖禁用光标，显示普通光标 */
}

/* 图标网格容器 */
.icon-grid {
  display: grid; /* 使用CSS Grid布局 */
  grid-template-columns: repeat(10, var(--width-size-icon-item)); /* 使用宽度变量设置10列 */
  gap: var(--gap-size-sm); /* 使用spacing变量设置间距 */
  justify-content: center; /* 网格整体居中 */
}

/* 单个图标项容器 */
.icon-grid-item {
  display: flex; /* 弹性布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  width: var(--width-size-icon-item); /* 使用宽度变量 */
  height: var(--height-size-icon-item); /* 使用高度变量 */
  border-radius: var(--radius-item); /* 使用菜单项圆角变量 */
  cursor: pointer; /* 鼠标悬停显示手型 */
  transition: all 0.2s; /* 所有属性变化的过渡动画 */
  border: 1px solid transparent; /* 透明边框，为悬停状态预留空间 */
}

/* 图标项悬停状态 */
.icon-grid-item:hover {
  background-color: var(--el-color-primary-light-9); /* 浅色主题背景 */
  border-color: var(--el-color-primary-light-5); /* 中等深度主题色边框 */
}

/* 图标项选中状态 */
.icon-grid-item.active {
  background-color: var(--el-color-primary-light-8); /* 比悬停状态稍深的背景 */
  border-color: var(--el-color-primary); /* 主题色边框突出显示 */
}

/* 图标元素样式 */
.icon-grid-icon {
  font-size: 16px; /* 图标大小 */
  color: var(--el-text-color-primary); /* 默认文本颜色 */
  transition: color 0.2s; /* 颜色变化过渡动画 */
}

/* 悬停时图标颜色变化 */
.icon-grid-item:hover .icon-grid-icon {
  color: var(--el-color-primary); /* 悬停时使用主题色 */
}

/* 选中时图标颜色变化 */
.icon-grid-item.active .icon-grid-icon {
  color: var(--el-color-primary); /* 选中时使用主题色 */
}

/* 无图标时的空状态容器 */
.no-icons {
  padding: var(--gap-size-xl); /* 使用现有的xl padding变量 */
  text-align: center; /* 文本居中 */
}
</style>

<!-- 全局样式，用于自定义下拉框样式 -->
<style>
.icon-selector-dropdown {
  /* 使用宽度变量设置下拉框宽度 */
  width: var(--width-size-icon-selector-dropdown) !important;
}

.icon-selector-dropdown .el-select-dropdown__wrap {
  /* 限制下拉框内容的最大高度，启用滚动 */
  max-height: var(--height-size-icon-selector-dropdown) !important;
}
</style>