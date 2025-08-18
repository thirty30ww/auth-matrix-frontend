<template>
  <span class="required-label">
    <span v-if="required" class="required-dot">*</span>
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  required?: boolean;
}

withDefaults(defineProps<Props>(), {
  required: false
});
</script>

<style scoped>
.required-label {
  display: flex;
  align-items: center;
}

.required-dot {
  color: var(--el-color-danger);
  margin-right: 4px;
  font-weight: bold;
}
</style>