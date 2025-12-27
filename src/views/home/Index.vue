<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores'
import UserAvatar from '@/components/basic/UserAvatar.vue'
import StatisticCard from '@/views/home/StatisticCard.vue'
import UserStatisticsChart from '@/views/home/UserStatisticsChart.vue'
import NoticeBoard from '@/views/home/NoticeBoard.vue'
import api from '@/services'
import type { UserVO, BaseChartVO } from '@/services'
import { DateRangeType } from '@/services'
import { websocketService } from '@/services/websocket.ts'

const userStore = useUserStore()

// 计算属性，获取用户名称，如果没有则显示"用户"
const userName = computed(() => {
  return userStore.userInfo?.name || '用户'
})

// 计算属性，获取用户头像URL
const userAvatar = computed(() => {
  return userStore.userInfo?.avatarUrl || ''
})

// 统计数据
const onlineUsers = ref<UserVO[]>([])
const onlineUserCount = ref(0)
const todayNewUsers = ref(0)
const yesterdayNewUsers = ref(0)
const todayAbnormalLogs = ref(0)
const yesterdayAbnormalLogs = ref(0)

// 图表数据
const chartData = ref<BaseChartVO<number | string, number>>({
  x: [],
  y: []
})

// 加载状态
const loading = ref(true)

// 计算新增用户对比
const newUserCompare = computed(() => {
  if (yesterdayNewUsers.value === 0) {
    return todayNewUsers.value > 0 ? 100 : 0
  }
  return ((todayNewUsers.value - yesterdayNewUsers.value) / yesterdayNewUsers.value * 100)
})

const newUserTrend = computed(() => {
  return todayNewUsers.value >= yesterdayNewUsers.value ? 'up' : 'down'
})

// 计算异常日志对比
const abnormalLogCompare = computed(() => {
  if (yesterdayAbnormalLogs.value === 0) {
    return todayAbnormalLogs.value > 0 ? 100 : 0
  }
  return ((todayAbnormalLogs.value - yesterdayAbnormalLogs.value) / yesterdayAbnormalLogs.value * 100)
})

const abnormalLogTrend = computed(() => {
  return todayAbnormalLogs.value >= yesterdayAbnormalLogs.value ? 'up' : 'down'
})

// 加载统计数据
const loadStatistics = async () => {
  // 并行请求所有统计数据
  const [onlineUsersRes, newUsersRes, abnormalLogsRes] = await Promise.all([
    api.statistic.getOnlineUsers(),
    api.statistic.getLastTwoDayCreatedUserCount(),
    api.statistic.getLastTwoDayAbnormalOperationCount()
  ])

  // 在线用户
  onlineUsers.value = onlineUsersRes
  onlineUserCount.value = onlineUsersRes.length

  // 新增用户
  todayNewUsers.value = (newUsersRes as any).today || 0
  yesterdayNewUsers.value = (newUsersRes as any).yesterday || 0

  // 异常日志
  todayAbnormalLogs.value = (abnormalLogsRes as any).today || 0
  yesterdayAbnormalLogs.value = (abnormalLogsRes as any).yesterday || 0
}

// 加载图表数据
const loadChartData = async (type: DateRangeType) => {
  const data = await api.statistic.getCreateUserCountChart(type)
  chartData.value = data
}

// 处理图表类型变化
const handleChartTypeChange = (type: DateRangeType) => {
  loadChartData(type)
}

onMounted(async () => {
  loading.value = true
  
  // 等待 500ms 确保 WebSocket 连接成功
  await websocketService.waitForConnection(5000)
  
  // 加载统计数据和图表数据
  await Promise.all([
    loadStatistics(),
    loadChartData(DateRangeType.THIS_WEEK)
  ])
  
  loading.value = false
})
</script>

<template>
  <div class="home-container">
    <el-card class="welcome-card" shadow="never">
      <div class="welcome-content">
        <div class="user-avatar">
          <el-avatar :size="80">
            <UserAvatar :imageUrl="userAvatar" />
          </el-avatar>
        </div>
        <div class="welcome-text">
          <p class="welcome-title">欢迎回来，{{ userName }}！</p>
          <p class="welcome-description">欢迎使用 Auth Matrix 企业级权限管理系统</p>
        </div>
      </div>
    </el-card>

    <!-- 主要内容区域 -->
    <div class="content-layout">
      <!-- 左侧：统计卡片和图表 -->
      <div class="left-section">
        <!-- 统计卡片区域 -->
        <div class="statistics-container">
          <!-- 在线用户卡片 -->
          <StatisticCard
            title="在线用户"
            icon="User"
            theme-color="emerald-forest"
            type="avatars"
            :loading="loading"
            :main-value="onlineUserCount"
            :avatars="onlineUsers"
            :max-avatars="5"
          />

          <!-- 今日新增用户卡片 -->
          <StatisticCard
            title="今日新增用户"
            icon="Plus"
            theme-color="ocean-blue"
            type="compare"
            :loading="loading"
            :main-value="todayNewUsers"
            compare-label="较昨日"
            :compare-value="newUserCompare"
            :compare-trend="newUserTrend"
          />

          <!-- 异常日志卡片 -->
          <StatisticCard
            title="今日异常日志"
            icon="Warning"
            theme-color="rose-bloom"
            type="compare"
            :loading="loading"
            :main-value="todayAbnormalLogs"
            compare-label="较昨日"
            :compare-value="abnormalLogCompare"
            :compare-trend="abnormalLogTrend"
          />
        </div>

        <!-- 用户统计图表 -->
        <div class="chart-container">
          <UserStatisticsChart
            :x-data="chartData.x"
            :y-data="chartData.y"
            @type-change="handleChartTypeChange"
          />
        </div>
      </div>

      <!-- 右侧：系统公告 -->
      <div class="right-section">
        <NoticeBoard />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
}

.welcome-card {
  width: 100%;
  margin-bottom: 20px;
}

.welcome-content {
  display: flex;
  align-items: center;
}

.user-avatar {
  margin-right: var(--gap-size-xl);
}

.welcome-text {
  flex: 1;
}

.welcome-title {
  font-size: var(--font-size-title);
  margin: 0 0 var(--gap-size-sm) 0;
  color: var(--el-text-color-primary);
}

.welcome-description {
  color: var(--el-text-color-regular);
  font-size: var(--font-size-sm);
  margin: 0;
}

/* 主要内容布局 */
.content-layout {
  display: flex;
  gap: var(--gap-size-xl);
}

/* 左侧区域 */
.left-section {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: var(--gap-size-xl);
}

/* 统计卡片样式 */
.statistics-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-size-xl);
}

/* 图表容器 */
.chart-container {
  min-height: 400px;
}

/* 右侧区域 */
.right-section {
  flex: 1;
  min-width: 280px;
  position: relative;
}

.right-section > :deep(*) {
  position: absolute;
  inset: 0;
}

/* 响应式布局 - 大屏幕 (< 1400px) */
@media screen and (max-width: 1400px) {
  .content-layout {
    flex-direction: column;
  }

  .left-section {
    flex: none;
    width: 100%;
  }

  .right-section {
    flex: none;
    width: 100%;
    min-height: 400px;
  }
}

/* 响应式布局 - 中等屏幕 (< 992px) */
@media screen and (max-width: 992px) {
  .statistics-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-container {
    min-height: 350px;
  }
}

/* 响应式布局 - 小屏幕 (< 768px) */
@media screen and (max-width: 768px) {
  .welcome-content {
    flex-direction: column;
    text-align: center;
  }

  .user-avatar {
    margin-right: 0;
    margin-bottom: var(--gap-size-md);
  }

  .statistics-container {
    grid-template-columns: 1fr;
  }

  .chart-container {
    min-height: 300px;
  }

  .right-section {
    min-height: 350px;
  }
}
</style>