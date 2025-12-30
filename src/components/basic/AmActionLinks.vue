<script setup lang="ts">
interface ActionLink {
  label: string
  onClick: () => void
  disabled?: boolean
  type?: 'default' | 'danger' | 'success'
}

interface Props {
  actions: ActionLink[]
}

defineProps<Props>()

const handleClick = (action: ActionLink, event: Event) => {
  // 阻止事件冒泡，避免触发父元素的点击事件
  event.stopPropagation()
  
  if (!action.disabled) {
    action.onClick()
  }
}
</script>

<template>
  <div class="action-links">
    <span
      v-for="(action, index) in actions"
      :key="index"
      :class="[
        'action-link',
        {
          'action-link-danger': action.type === 'danger',
          'action-link-success': action.type === 'success',
          'action-link-disabled': action.disabled
        }
      ]"
      @click="handleClick(action, $event)"
    >
      {{ action.label }}
    </span>
  </div>
</template>

<style scoped>
.action-links {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.action-link {
  color: var(--el-color-primary);
  cursor: pointer;
  font-size: 14px;
  padding: 0 8px;
  border-right: 1px solid var(--el-border-color-light);
  text-align: center;
}

.action-link:last-child {
  border-right: none;
}

.action-link:hover {
  color: var(--el-color-primary-light-3);
}

.action-link-danger {
  color: var(--el-color-danger);
}

.action-link-danger:hover {
  color: var(--el-color-danger-light-3);
}

.action-link-success {
  color: var(--el-color-success);
}

.action-link-success:hover {
  color: var(--el-color-success-light-3);
}

.action-link-disabled {
  color: var(--el-color-info-light-5);
  cursor: not-allowed;
  pointer-events: none;
}

.action-link-disabled:hover {
  color: var(--el-color-info-light-5);
}
</style>