<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import api from '@/services'
import type { LogOperationVO } from '@/services'
import { getStatusCodeType, getOperationTypeColor, getMethodTypeColor } from '@/constant'

// 定义 props
interface Props {
  visible: boolean
  logId: number | null
}

// 定义 emits
interface Emits {
  (e: 'update:visible', visible: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式数据
const logDetail = ref<LogOperationVO | null>(null)
const isLoading = ref(false)

// 计算属性
const drawerVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 监听侧边栏显示状态和logId变化
watch([() => props.visible, () => props.logId], async ([visible, logId]) => {
  if (visible && logId) {
    await getLogDetail(logId)
  } else if (!visible) {
    logDetail.value = null
  }
})

// 获取日志详情
const getLogDetail = async (id: number) => {
  isLoading.value = true
  
  const response = await api.log.getLogOperation(id)
  logDetail.value = response // HTTP服务已经解包了数据
  
  isLoading.value = false
}
</script>

<template>
  <el-drawer
    v-model="drawerVisible"
    title="操作日志详情"
    :size="600"
    direction="rtl"
  >
    <div v-if="logDetail">
        <!-- 基本信息 -->
        <div class="section">
          <h3 class="section-title">基本信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="日志ID">
              {{ logDetail.id }}
            </el-descriptions-item>
            <el-descriptions-item label="操作人">
              {{ logDetail.name || '未知' }}
            </el-descriptions-item>
            <el-descriptions-item label="模块">
              {{ logDetail.module }}
            </el-descriptions-item>
            <el-descriptions-item label="操作描述" :span="2">
              {{ logDetail.description || '无描述' }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 请求信息 -->
        <div class="section">
          <h3 class="section-title">请求信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="操作类型">
              <el-tag :type="getOperationTypeColor(logDetail.type)">
                {{ logDetail.type }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="请求方法">
              <el-tag :type="getMethodTypeColor(logDetail.method)">
                {{ logDetail.method }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="状态码">
              <el-tag :type="getStatusCodeType(logDetail.code)">
                {{ logDetail.code }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="IP地址">
              {{ logDetail.ip }}
            </el-descriptions-item>
            <el-descriptions-item label="请求路径" :span="2">
              <el-text type="primary">{{ logDetail.url }}</el-text>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 时间信息 -->
        <div class="section">
          <h3 class="section-title">时间信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="操作时间">
              {{ logDetail.operateTime }}ms
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ logDetail.createTime }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 请求参数 - 独立区域 -->
        <div v-if="logDetail.requestParam" class="param-section">
          <h4 class="param-title">请求参数</h4>
          <el-input
            v-model="logDetail.requestParam"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 15 }"
            readonly
            placeholder="无请求参数"
            class="param-textarea"
          />
        </div>

        <!-- 响应参数 - 独立区域 -->
        <div v-if="logDetail.responseParam" class="param-section">
          <h4 class="param-title">响应参数</h4>
          <el-input
            v-model="logDetail.responseParam"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 15 }"
            readonly
            placeholder="无响应参数"
            class="param-textarea"
          />
        </div>

        <!-- 错误信息 - 独立区域 -->
        <div v-if="logDetail.errorMessage" class="param-section">
          <h4 class="param-title">错误信息</h4>
          <div class="error-container">
            <el-input
              v-model="logDetail.errorMessage"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 15 }"
              readonly
              placeholder="无错误信息"
              class="error-textarea"
            />
          </div>
        </div>
    </div>
  </el-drawer>
</template>

<style scoped>
:deep(.el-descriptions__label) {
  width: 120px;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  border-left: 3px solid var(--el-color-primary);
  padding-left: 10px;
}

.param-section {
  margin-top: 20px;
}

.param-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  border-left: 3px solid var(--el-color-primary);
  padding-left: 10px;
}

.error-container {
  position: relative;
}

.error-textarea :deep(.el-textarea__inner) {
  background-color: var(--el-fill-color-light);
  border: 1px solid var(--el-color-error-light-7);
  color: var(--el-color-error);
  line-height: inherit;
  white-space: pre-wrap;
  word-break: break-all;
}

.error-textarea :deep(.el-textarea__inner):focus {
  border-color: var(--el-color-error);
  box-shadow: 0 0 0 2px var(--el-color-error-light-8);
}
</style>