<script setup lang="ts">
import { computed } from 'vue'
import type { AvatarProps } from 'element-plus'

interface AvatarItem {
  id?: string | number
  src?: string
  icon?: any
  alt?: string
  [key: string]: any
}

interface Props {
  // 堆叠模式相关属性
  mode?: 'single' | 'group'
  avatars?: AvatarItem[]
  max?: number
  overlap?: number
  showMore?: boolean
  moreText?: string
  // 字段映射
  srcField?: string
  altField?: string
  // el-avatar 原生属性
  size?: number | 'large' | 'default' | 'small'
  shape?: 'circle' | 'square'
  icon?: any
  src?: string
  alt?: string
  srcSet?: string
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'single',
  avatars: () => [],
  max: 5,
  overlap: 8,
  showMore: true,
  moreText: '+{count}',
  size: 'default',
  srcField: 'src',
  altField: 'alt'
})

const emit = defineEmits<{
  avatarClick: [avatar: AvatarItem, index: number]
  moreClick: [remainingCount: number]
}>()

// 显示的头像列表
const displayedAvatars = computed(() => {
  if (props.mode === 'single') return []
  return props.avatars.slice(0, props.max)
})

// 剩余头像数量
const remainingCount = computed(() => {
  if (props.mode === 'single') return 0
  return Math.max(0, props.avatars.length - props.max)
})

// 格式化更多文本
const formattedMoreText = computed(() => {
  return props.moreText.replace('{count}', String(remainingCount.value))
})

// 获取头像 src
const getAvatarSrc = (avatar: AvatarItem) => {
  return avatar[props.srcField] || avatar.src
}

// 获取头像 alt
const getAvatarAlt = (avatar: AvatarItem) => {
  return avatar[props.altField] || avatar.alt
}

// 处理头像点击
const handleAvatarClick = (avatar: AvatarItem, index: number) => {
  emit('avatarClick', avatar, index)
}

// 处理更多按钮点击
const handleMoreClick = () => {
  emit('moreClick', remainingCount.value)
}
</script>

<template>
  <!-- 单个头像模式 -->
  <el-avatar
    v-if="mode === 'single'"
    v-bind="$attrs"
    :size="size"
    :shape="shape"
    :icon="icon"
    :src="src"
    :alt="alt"
    :src-set="srcSet"
    :fit="fit"
  >
    <slot />
  </el-avatar>

  <!-- 头像组模式 -->
  <div v-else class="am-avatar-group">
    <el-avatar
      v-for="(avatar, index) in displayedAvatars"
      :key="avatar.id || index"
      :size="size"
      :shape="shape"
      :icon="avatar.icon"
      :src="getAvatarSrc(avatar)"
      :alt="getAvatarAlt(avatar)"
      :fit="fit"
      class="am-avatar-item"
      :style="{
        marginLeft: index === 0 ? '0' : `-${overlap}px`,
        zIndex: displayedAvatars.length - index
      }"
      @click="handleAvatarClick(avatar, index)"
    >
      <slot name="avatar" :avatar="avatar" :index="index" />
    </el-avatar>

    <!-- 更多提示 -->
    <el-avatar
      v-if="showMore && remainingCount > 0"
      :size="size"
      :shape="shape"
      class="am-avatar-item am-avatar-more"
      :style="{
        marginLeft: `-${overlap}px`,
        zIndex: 0
      }"
      @click="handleMoreClick"
    >
      <slot name="more" :count="remainingCount">
        {{ formattedMoreText }}
      </slot>
    </el-avatar>
  </div>
</template>

<style scoped>
.am-avatar-group {
  display: inline-flex;
  align-items: center;
}

.am-avatar-item {
  border: 1px solid var(--el-bg-color);
  transition: all 0.3s ease;
  cursor: pointer;
  box-sizing: content-box;
}

.am-avatar-item:hover {
  transform: translateY(-4px);
  z-index: 999 !important;
}

.am-avatar-more {
  background-color: var(--el-color-info-light-7);
  color: var(--el-color-info);
  font-size: 12px;
  font-weight: 600;
}

.am-avatar-more:hover {
  background-color: var(--el-color-info-light-5);
}
</style>
