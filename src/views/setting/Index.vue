<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {Check, Refresh} from '@element-plus/icons-vue'
import api from '@/services'
import {useSystemStore} from '@/stores/system'
import type {SettingVO} from '@/types/services/vo/system'
import type {SettingDTO} from '@/types/services/dto/system'

// 响应式数据
const settings = ref<SettingVO[]>([])
const systemStore = useSystemStore()

// 表单数据，用于编辑
const formData = ref<Record<string, any>>({})

// 获取设置数据
const loadSettings = async () => {
  // 调用 getSettingVOS 接口获取数据
  settings.value = await api.setting.getSettingVOS()

  // 初始化表单数据
  formData.value = {}
  settings.value.forEach(setting => {
    formData.value[setting.field] = setting.value
  })
}

// 判断设置值的类型
const getSettingType = (value: any): string => {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'string' && value.length > 50) return 'textarea'
  return 'string'
}

// 保存设置
const saveSettings = async () => {
  ElMessageBox.confirm(
      '确定要保存这些设置吗？',
      '确认保存',
      {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )

  // 准备修改的设置数据
  const modifiedSettings: SettingDTO[] = settings.value
    .filter(setting => formData.value[setting.field] !== setting.value)
    .map(setting => ({
      id: setting.id,
      value: formData.value[setting.field]
    }))

  // 如果有修改的设置，调用修改接口
  if (modifiedSettings.length > 0) {
    await api.setting.modifySettings(modifiedSettings)
  }

  // 重新加载设置数据以确保数据同步
  await loadSettings()

  // 刷新系统store中的项目标题
  await systemStore.fetchProjectTitle()
}

// 重置表单
const resetForm = () => {
  formData.value = {}
  settings.value.forEach(setting => {
    formData.value[setting.field] = setting.value
  })
  ElMessage.info('已重置到原始值')
}

// 检查是否有修改
const hasChanges = computed(() => {
  return settings.value.some(setting => 
    formData.value[setting.field] !== setting.value
  )
})

onMounted(() => {
  loadSettings()
})
</script>

<template>
  <div class="setting-container">
    <el-card>
       <div class="setting-actions">
         <el-button 
           :disabled="!hasChanges" 
           @click="resetForm"
         >
           <el-icon class="el-icon--left"><Refresh /></el-icon>
           重置
         </el-button>
         <el-button 
           type="primary" 
           :disabled="!hasChanges"
           @click="saveSettings"
         >
           <el-icon class="el-icon--left"><Check /></el-icon>
           保存
         </el-button>
       </div>

      <div class="setting-form">
        <div 
          v-for="setting in settings" 
          :key="setting.id"
          class="setting-item"
        >
          <div class="setting-info">
            <div class="setting-label">{{ setting.title }}</div>
            <div class="setting-description">{{ setting.description }}</div>
          </div>
          
          <div class="setting-control">
            <!-- 布尔值开关 -->
            <el-switch
              v-if="getSettingType(setting.value) === 'boolean'"
              v-model="formData[setting.field]"
              size="large"
            />
            
            <!-- 数字输入 -->
            <el-input-number
              v-else-if="getSettingType(setting.value) === 'number'"
              v-model="formData[setting.field]"
              :min="0"
              :max="999999"
              controls-position="right"
            />
            
            <!-- 多行文本 -->
            <el-input
              v-else-if="getSettingType(setting.value) === 'textarea'"
              v-model="formData[setting.field]"
              type="textarea"
              :rows="3"
            />
            
            <!-- 普通文本输入 -->
            <el-input
              v-else
              v-model="formData[setting.field]"
            />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.setting-actions {
  display: flex;
  justify-content: flex-end;
}

.setting-form {
  display: flex;
  flex-direction: column;
}

.setting-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--padding-size-lg) 0;
}

.setting-info {
  flex: 1;
}

.setting-label {
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: var(--margin-size-spacing-1);
}

.setting-description {
  font-size: var(--font-size-xs);
  color: var(--el-text-color-placeholder);
  line-height: 1.4;
  opacity: 0.8;
}

.setting-control {
  min-width: 200px;
}
</style>