<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services'
import type { NoticeVO } from '@/services'
import { formatRelativeTime } from '@/utils/date'
import AmCard from '@/components/basic/AmCard.vue'

const notices = ref<NoticeVO[]>([])
const loading = ref(false)

const loadNotices = async () => {
  loading.value = true
  try {
    const response = await api.notice.getNotices({
      pageNum: 1,
      pageSize: 6,
      params: undefined
    })
    notices.value = response.records
  } finally {
    loading.value = false
  }
}

const goToNoticePage = () => {
  // TODO: 跳转到公告页面
  console.log('跳转到公告页面')
}

onMounted(() => {
  loadNotices()
})
</script>

<template>
  <AmCard shadow="never" class="notice-card">
    <template #header>
      <div class="card-header">
        <span class="card-title">系统公告</span>
        <el-icon class="more-icon" @click="goToNoticePage">
          <ArrowRight />
        </el-icon>
      </div>
    </template>

    <div v-if="loading" class="notice-loading">
      <el-skeleton :rows="5" animated />
    </div>
    <div v-else-if="notices.length === 0" class="notice-empty">
      <el-empty description="暂无公告" :image-size="100" />
    </div>
    <div v-else class="notice-list">
      <div v-for="notice in notices" :key="notice.id" class="notice-item">
        <div class="notice-item-header">
          <div class="notice-item-title">
            <el-icon v-if="notice.isTop" class="pin-icon"><Flag /></el-icon>
            <span class="title-text">{{ notice.title }}</span>
          </div>
          <span class="notice-time">{{ formatRelativeTime(notice.createTime) }}</span>
        </div>
        <div class="notice-content">{{ notice.content }}</div>
        <div class="notice-publisher">{{ notice.publisherName }}</div>
      </div>
    </div>
  </AmCard>
</template>

<style scoped>
.notice-card {
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: var(--font-size-md);
}

.notice-card :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.more-icon {
  cursor: pointer;
  font-size: var(--icon-size-sm);
  color: var(--el-text-color-secondary);
  transition: color 0.3s;
}

.more-icon:hover {
  color: var(--el-color-primary);
}

.notice-empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: var(--gap-size-md);
}

.notice-item {
  padding: var(--gap-size-lg);
  border-radius: var(--radius-md);
  background-color: var(--am-bg-color);
  cursor: pointer;
  transition: background-color 0.3s;
}

.notice-item:hover {
  background-color: var(--am-bg-color-medium);
}

.notice-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--gap-size-sm);
}

.notice-item-title {
  display: flex;
  align-items: center;
  gap: var(--gap-size-xs);
  flex: 1;
  min-width: 0;
}

.pin-icon {
  color: var(--am-golden-dawn-light-3);
  font-size: var(--icon-size-sm);
  flex-shrink: 0;
}

.title-text {
  font-size: var(--font-size-md);
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-time {
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.notice-content {
  color: var(--el-text-color-regular);
  line-height: 1.6;
  margin-bottom: var(--gap-size-sm);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.notice-publisher {
  color: var(--el-text-color-secondary);
  text-align: right;
}
</style>
