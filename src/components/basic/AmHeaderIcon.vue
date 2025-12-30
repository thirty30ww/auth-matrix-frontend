<template>
  <el-icon 
    class="am-header-icon" 
    :class="iconClass"
    @click="handleClick"
  >
    <slot />
  </el-icon>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  active?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  clickable: true
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}

const iconClass = computed(() => ({
  'am-header-icon--active': props.active,
  'am-header-icon--inactive': !props.active,
  'am-header-icon--clickable': props.clickable
}))
</script>

<style scoped>
.am-header-icon {
  margin-left: 4px;
  font-size: var(--icon-size-xs);
  transition: all 0.2s;
  vertical-align: middle;
}

.am-header-icon--clickable {
  cursor: pointer;
}

.am-header-icon--clickable:hover {
  transform: scale(1.2);
  opacity: 1 !important;
  color: var(--el-color-primary);
}

.am-header-icon--active {
  color: var(--el-color-primary);
  opacity: 1;
}

.am-header-icon--inactive {
  color: var(--el-text-color-placeholder);
  opacity: 0.6;
}
</style>
