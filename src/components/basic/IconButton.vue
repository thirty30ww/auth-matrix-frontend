<template>
  <button
    class="icon-button"
    :class="{ disabled: disabled }"
    :type="type"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<style scoped>
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-half);
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
}

.icon-button:hover {
  background-color: var(--pp-bg-color-hover);
}

.icon-button:active {
  background-color: var(--pp-bg-color-active);
}

.icon-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon-button.disabled:hover,
.icon-button.disabled:active {
  background-color: transparent;
  transform: none;
}
</style> 