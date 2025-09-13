<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, Refresh } from '@element-plus/icons-vue'
import { settingApi } from '@/services/api/system'
import type { SettingVO } from '@/types/services/vo/system'

// 响应式数据
const settings = ref<SettingVO[]>([])
const loading = ref(false)
const saving = ref(false)

// 表单数据，用于编辑
const formData = ref<Record<string, any>>({})

// 获取设置数据
const loadSettings = async () => {
  try {
    loading.value = true
    // 调用 getSettingVOS 接口获取数据
    const response = await settingApi.getSettingVOS()
    settings.value = response
    
    // 初始化表单数据
    formData.value = {}
    settings.value.forEach(setting => {
      formData.value[setting.field] = setting.value
    })
  } catch (error) {
    console.error('加载设置失败:', error)
    ElMessage.error('加载设置失败')
  } finally {
    loading.value = false
  }
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
  try {
    await ElMessageBox.confirm(
      '确定要保存这些设置吗？',
      '确认保存',
      {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    saving.value = true
    
    // 这里等待后端保存接口完成
    // const updatePromises = settings.value.map(setting => {
    //   return settingApi.updateSetting(setting.field, formData.value[setting.field])
    // })
    // await Promise.all(updatePromises)
    
    // 模拟保存延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新本地数据
    settings.value.forEach(setting => {
      setting.value = formData.value[setting.field]
    })
    
    ElMessage.success('设置保存成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('保存设置失败:', error)
      ElMessage.error('保存设置失败')
    }
  } finally {
    saving.value = false
  }
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
    <el-card v-loading="loading">
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
           :loading="saving"
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
  padding: 16px 0;
}

.setting-info {
  flex: 1;
  margin-right: 24px;
}

.setting-label {
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.setting-description {
  font-size: 13px;
  color: var(--el-text-color-placeholder);
  line-height: 1.4;
  opacity: 0.8;
}

.setting-control {
  min-width: 200px;
}
</style>