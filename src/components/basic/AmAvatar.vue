<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
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
  // 动画相关
  animated?: boolean
  animationDelay?: number
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
  animated: false,
  animationDelay: 0,
  size: 'default',
  srcField: 'src',
  altField: 'alt'
})

const emit = defineEmits<{
  avatarClick: [avatar: AvatarItem, index: number]
  moreClick: [remainingCount: number]
}>()

// 控制头像显示
const visibleAvatars = ref<AvatarItem[]>([])

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

// 监听头像列表变化，触发动画
watch(() => props.avatars, async (newAvatars) => {
  if (props.animated && newAvatars.length > 0) {
    // 清空当前显示的头像
    visibleAvatars.value = []
    
    await nextTick()
    
    // 逐个添加头像
    const avatarsToShow = newAvatars.slice(0, props.max)
    for (let i = 0; i < avatarsToShow.length; i++) {
      setTimeout(() => {
        visibleAvatars.value.push(avatarsToShow[i])
      }, props.animationDelay + i * 50)
    }
  } else {
    // 不使用动画时直接显示所有头像
    visibleAvatars.value = newAvatars.slice(0, props.max)
  }
}, { immediate: true })
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
  <transition-group
    v-else
    name="avatar-fade"
    tag="div"
    class="am-avatar-group"
  >
    <el-avatar
      v-for="(avatar, index) in visibleAvatars"
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
        zIndex: visibleAvatars.length - index
      }"
      @click="handleAvatarClick(avatar, index)"
    >
      <slot name="avatar" :avatar="avatar" :index="index" />
    </el-avatar>

    <!-- 更多提示 -->
    <el-avatar
      v-if="showMore && remainingCount > 0 && visibleAvatars.length === displayedAvatars.length"
      key="more"
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
  </transition-group>
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

/* 头像渐入动画 */
.avatar-fade-enter-active {
  transition: all 0.4s ease-out;
}

.avatar-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.avatar-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.avatar-fade-move {
  transition: all 0.4s ease-out;
}
</style>
