<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {Check, Refresh} from '@element-plus/icons-vue'
import AmButton from '@/components/basic/AmButton.vue'
import api from '@/services'
import {useSystemStore} from '@/stores/system'
import type {SettingVO} from '@/services/type/vo/system'
import type {SettingDTO} from '@/services/type/dto/system'
import {getSettingConfig} from './settingConfig'
import SettingSelect from './SettingSelect.vue'
import {SettingField} from '@/services'

// 响应式数据
const settings = ref<SettingVO[]>([])
const systemStore = useSystemStore()

// 表单数据，用于编辑
const formData = ref<Record<string, any>>({})

// 选项数据缓存（用于下拉选择等组件）
const optionsCache = ref<Record<string, Array<{value: any, label: string}>>>({})

// 树形数据缓存（用于树形选择组件）
const treeDataCache = ref<Record<string, any[]>>({})

/**
 * 加载选项数据（用于下拉选择等组件）
 * @param field 设置字段
 */
const loadOptions = async (field: string) => {
  const config = getSettingConfig(field)
  if (config.fetchOptions && !optionsCache.value[field]) {
    optionsCache.value[field] = await config.fetchOptions()
  }
}

/**
 * 加载树形数据（用于树形选择组件）
 * @param field 设置字段
 */
const loadTreeData = async (field: string) => {
  const config = getSettingConfig(field)
  if (config.fetchTreeData && !treeDataCache.value[field]) {
    treeDataCache.value[field] = await config.fetchTreeData()
  }
}

// 获取设置数据
const loadSettings = async () => {
  // 调用 getSettingVOS 接口获取数据
  settings.value = await api.setting.getSettingVOS()

  // 初始化表单数据
  formData.value = {}
  for (const setting of settings.value) {
    formData.value[setting.field] = setting.value
    // 加载需要的选项数据和树形数据
    await loadOptions(setting.field)
    await loadTreeData(setting.field)
  }
}


// 保存设置
const saveSettings = async () => {
  await ElMessageBox.confirm(
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
    .filter(setting => !deepEqual(formData.value[setting.field], setting.value))
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

/**
 * 深度比较两个值是否相等（支持数组和对象）
 * @param a 值A
 * @param b 值B
 * @returns 是否相等
 */
const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, index) => deepEqual(item, b[index]))
  }
  
  if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false
    return keysA.every(key => deepEqual(a[key], b[key]))
  }
  
  return false
}

/**
 * 获取树形选择的占位符文本
 * @param field 设置字段
 * @returns 占位符文本
 */
const getTreeSelectPlaceholder = (field: string): string => {
  // 可以根据不同的字段返回不同的占位符
  switch (field) {
    case SettingField.DEFAULT_ROLES:
      return '请选择默认角色'
    default:
      return '请选择'
  }
}

// 检查是否有修改
const hasChanges = computed(() => {
  return settings.value.some(setting => 
    !deepEqual(formData.value[setting.field], setting.value)
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
         <am-button 
           type="primary" 
           :disabled="!hasChanges"
           @click="saveSettings"
         >
           <el-icon class="el-icon--left"><Check /></el-icon>
           保存
         </am-button>
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
            <!-- 根据配置动态渲染不同的组件 -->
            
            <!-- 开关组件 -->
            <el-switch
              v-if="getSettingConfig(setting.field).component === 'switch'"
              v-model="formData[setting.field]"
              size="large"
            />
            
            <!-- 数字输入组件 -->
            <el-input-number
              v-else-if="getSettingConfig(setting.field).component === 'number'"
              v-model="formData[setting.field]"
              :min="0"
              :max="999999"
              controls-position="right"
            />
            
            <!-- 多行文本组件 -->
            <el-input
              v-else-if="getSettingConfig(setting.field).component === 'textarea'"
              v-model="formData[setting.field]"
              type="textarea"
              :rows="3"
            />
            
            <!-- 下拉选择组件 -->
            <SettingSelect
              v-else-if="getSettingConfig(setting.field).component === 'select'"
              v-model="formData[setting.field]"
              type="select"
              :options="optionsCache[setting.field] || []"
              placeholder="请选择"
            />
            
            <!-- 树形选择组件 -->
            <SettingSelect
              v-else-if="getSettingConfig(setting.field).component === 'tree-select'"
              v-model="formData[setting.field]"
              type="tree-select"
              :tree-data="treeDataCache[setting.field] || []"
              :multiple="getSettingConfig(setting.field).multiple"
              :placeholder="getTreeSelectPlaceholder(setting.field)"
            />
            
            <!-- 默认文本输入组件 -->
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