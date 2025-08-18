<template>
  <el-icon 
    class="header-icon" 
    :class="getIconClass()"
    @click="handleClick"
  >
    <slot />
  </el-icon>
</template>

<script setup lang="ts">

interface Props {
  active?: boolean
  clickable?: boolean
}

interface Emits {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  clickable: true
})

const emit = defineEmits<Emits>()

// 处理点击
const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}

// 获取图标的CSS类
const getIconClass = () => {
  return {
    'header-icon-active': props.active,
    'header-icon-inactive': !props.active,
    'header-icon-clickable': props.clickable
  }
}
</script>

<style scoped>
.header-icon {
  margin-left: 4px;
  font-size: var(--icon-size-xs);
  transition: all 0.2s;
  vertical-align: middle;
}

.header-icon-clickable {
  cursor: pointer;
}

.header-icon-clickable:hover {
  transform: scale(1.2);
  opacity: 1 !important;
  color: var(--el-color-primary);
}

.header-icon-active {
  color: var(--el-color-primary);
  opacity: 1;
}

.header-icon-inactive {
  color: var(--el-text-color-placeholder);
  opacity: 0.6;
}
</style>