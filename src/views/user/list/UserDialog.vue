<template>
  <PaddedDialog
    v-model:visible="dialogVisible"
    :title="isEdit ? '编辑用户' : '添加用户'"
    width="500px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      label-width="80px"
      label-position="right"
    >
      <el-form-item>
        <template #label>
          <RequiredLabel required>用户名</RequiredLabel>
        </template>
        <el-input
          v-model="formData.username"
          placeholder="请输入用户名"
          :disabled="isEdit"
          clearable
        />
      </el-form-item>
      
      <el-form-item v-if="!isEdit">
        <template #label>
          <RequiredLabel required>密码</RequiredLabel>
        </template>
        <el-input
          v-model="formData.password"
          type="password"
          placeholder="请输入密码"
          show-password
          clearable
        />
      </el-form-item>

      <el-form-item>
        <template #label>
          <RequiredLabel required>姓名</RequiredLabel>
        </template>
        <el-input
          v-model="formData.name"
          placeholder="请输入姓名"
          clearable
        />
      </el-form-item>

      <!-- 扩展字段渲染 -->
      <template v-for="field in extraFields" :key="field.key">
        <el-form-item v-if="!isEdit">
          <template #label>
            <RequiredLabel :required="field.required">{{ field.label }}</RequiredLabel>
          </template>
          <el-input
            v-model="(formData as any)[field.key]"
            :placeholder="field.placeholder || `请输入${field.label}`"
            clearable
          />
        </el-form-item>
      </template>
      
      <el-form-item>
        <template #label>
          <RequiredLabel required>性别</RequiredLabel>
        </template>
        <el-select
          v-model="formData.sex"
          placeholder="请选择性别"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="option in sexOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item>
        <template #label>
          <RequiredLabel required>角色</RequiredLabel>
        </template>
        <el-tree-select
          v-model="formData.roleIds"
          :data="roleTreeData"
          :props="{ 
            value: 'id', 
            label: 'name', 
            children: 'children' 
          }"
          placeholder="请选择角色"
          multiple
          check-strictly
          :render-after-expand="false"
          default-expand-all
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">
        {{ isEdit ? '保存' : '添加' }}
      </el-button>
    </template>
  </PaddedDialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import PaddedDialog from '@/components/basic/PaddedDialog.vue'
import api from '@/services'
import {type UserVO, type RoleVO, type ModifyUserDTO, RolesType, SettingField} from '@/services'
import { UserSex } from '@/services'
import { getValues } from '@/utils'
import RequiredLabel from "@/components/basic/RequiredLabel.vue";
import type { FormExtraField } from '@/services';

// Props
interface Props {
  visible: boolean
  userData?: UserVO | null
  extraFields?: FormExtraField[]
  customAddUser?: (data: any) => Promise<void>
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  userData: null,
  extraFields: () => [],
  customAddUser: undefined
})

// Emits
interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const roleTreeData = ref<any[]>([])

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 是否为编辑模式
const isEdit = computed(() => !!props.userData && props.userData.id > 0)

// 动态创建表单数据，包含扩展字段
const createFormData = () => {
  const baseData: any = {
    username: '',
    name: '',
    password: '',
    sex: '' as UserSex,
    roleIds: [] as number[]
  }
  
  // 添加扩展字段的默认值
  props.extraFields?.forEach(field => {
    baseData[field.key] = ''
  })
  
  return baseData
}

// 表单数据
const formData = reactive(createFormData())

// 性别选项
const sexOptions = getValues(UserSex).map(value => ({
  label: value,
  value: value
}))

// 获取角色树数据
const getRoleTreeData = async () => {
  const data = await api.role.getRoleTree(RolesType.CHILD_AND_GLOBAL)
  if (data) {
    // 转换数据格式以适配tree-select
    const convertToTreeData = (roles: RoleVO[]): any[] => {
      return roles.map(role => ({
        id: role.node.id,
        name: role.node.name,
        description: role.node.description,
        children: convertToTreeData(role.children || [])
      }))
    }
    
    roleTreeData.value = convertToTreeData(data)
  }
}

// 获取默认角色
const getDefaultRoles = async (): Promise<number[]> => {
  const response = await api.setting.getSetting(SettingField.DEFAULT_ROLES)
  // API直接返回数组，不是包装在data字段中
  return Array.isArray(response) ? response : (response.data || [])
}

// 重置表单
const resetForm = async () => {
  Object.assign(formData, createFormData())
  
  // 如果是添加模式，填入默认角色
  if (!isEdit.value) {
    const defaultRoles = await getDefaultRoles()
    if (defaultRoles.length > 0) {
      formData.roleIds = [...defaultRoles]
    }
  }
}

// 填充表单数据（编辑模式）
const fillFormData = (userData: UserVO) => {
  formData.username = userData.username
  formData.name = userData.name
  formData.sex = userData.sex
  formData.roleIds = userData.roles.map(role => role.id)
  
  // 填充扩展字段数据
  props.extraFields?.forEach(field => {
    formData[field.key] = (userData as any)[field.key] || ''
  })
}

// 监听用户数据变化（移除immediate，避免重复触发）
watch(() => props.userData, (newData) => {
  if (newData && isEdit.value) {
    fillFormData(newData)
  }
})

// 监听对话框显示状态
watch(() => props.visible, async (visible) => {
  if (visible) {
    // 并行获取角色树数据和处理表单数据
    const roleTreePromise = getRoleTreeData()
    
    if (props.userData && isEdit.value) {
      fillFormData(props.userData)
    } else {
      // 立即设置默认角色，不等待角色树数据
      await resetForm()
    }
    
    // 等待角色树数据加载完成
    await roleTreePromise
  }
})

// 关闭对话框
const handleClose = () => {
  emit('update:visible', false)
}

// 移除组件挂载时的预加载，改为按需加载

// 提交表单
const handleSubmit = async () => {
  if (isEdit.value) {
    // 编辑用户逻辑
    if (!props.userData?.id) {
      ElMessage.error('用户ID不存在')
      return
    }

    const modifyData: ModifyUserDTO = {
      id: props.userData.id,
      name: formData.name,
      sex: formData.sex,
      roleIds: formData.roleIds
    }

    await api.user.modifyUser(modifyData)
    emit('success')
    handleClose()
  } else {
    // 添加用户
    const userData: any = {
      username: formData.username,
      name: formData.name,
      password: formData.password,
      sex: formData.sex,
      roleIds: formData.roleIds
    }
    
    // 添加扩展字段数据
    props.extraFields?.forEach(field => {
      userData[field.key] = formData[field.key]
    })

    // 使用默认的api.user.addUser，会自动使用覆盖的接口
    await api.user.addUser(userData as any)
    
    emit('success')
    handleClose()
  }
}
</script>

<style scoped>
</style>