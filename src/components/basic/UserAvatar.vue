<template>
  <div class="user-avatar-wrapper">
    <img v-if="imageUrl" class="user-avatar-img" :src="imageUrl" :alt="alt" />
    <svg v-else class="user-avatar-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path d="M512 85.333333c117.824 0 213.333333 95.509333 213.333333 213.333334s-95.509333 213.333333-213.333333 213.333333-213.333333-95.509333-213.333333-213.333333S394.176 85.333333 512 85.333333z m0 85.333334a128 128 0 1 0 0 256 128 128 0 0 0 0-256zM746.666667 554.666667a170.666667 170.666667 0 1 1 0 341.333333H277.333333a170.666667 170.666667 0 1 1 0-341.333333h469.333334z m4.266666 85.44L746.666667 640H277.333333a85.333333 85.333333 0 0 0-4.266666 170.56L277.333333 810.666667h469.333334a85.333333 85.333333 0 0 0 4.266666-170.56z" />
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  imageUrl: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: '用户头像'
  }
})
</script>

<style scoped>
.user-avatar-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-half);
  overflow: hidden;
  background-color: var(--am-bg-color);
}

.user-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar-svg {
  width: 70%;
  height: 70%;
  fill: var(--el-color-primary);
}
</style> 