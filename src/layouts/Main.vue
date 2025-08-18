<template>
  <div class="main-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.main-container {
  padding: 20px 25px 50px 25px;
  height: calc(100% - 50px - 20px); /* 减去header高度 */
  overflow-y: auto;
}
</style> 