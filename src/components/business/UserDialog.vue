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
        <el-select
          v-model="formData.roleIds"
          placeholder="请选择角色"
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="role in roleList"
            :key="role.id"
            :label="role.name"
            :value="role.id"
          />
        </el-select>
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
import type { UserVO, Role, AddUserDTO, ModifyUserDTO } from '@/types'
import { Sex } from '@/constant'
import { getMappingValues } from '@/utils'
import RequiredLabel from "@/components/basic/RequiredLabel.vue";

// Props
interface Props {
  visible: boolean
  userData?: UserVO | null
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  userData: null
})

// Emits
interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const roleList = ref<Role[]>([])

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 是否为编辑模式
const isEdit = computed(() => !!props.userData && props.userData.id > 0)

// 表单数据
const formData = reactive({
  username: '',
  name: '',
  password: '',
  sex: '',
  roleIds: [] as number[]
})

// 性别选项
const sexOptions = getMappingValues(Sex).map(value => ({
  label: value,
  value: value
}))

// 获取角色列表
const getRoleList = async () => {
  roleList.value = await api.role.getRoleList(true) // 传入 isChild: true
}

// 重置表单
const resetForm = () => {
  formData.username = ''
  formData.name = ''
  formData.password = ''
  formData.sex = ''
  formData.roleIds = []
}

// 填充表单数据（编辑模式）
const fillFormData = (userData: UserVO) => {
  formData.username = userData.username
  formData.name = userData.name
  formData.sex = userData.sex
  formData.roleIds = userData.roles.map(role => role.id)
}

// 监听用户数据变化
watch(() => props.userData, (newData) => {
  if (newData && isEdit.value) {
    fillFormData(newData)
  } else {
    resetForm()
  }
}, { immediate: true })

// 监听对话框显示状态
watch(() => props.visible, (visible) => {
  if (visible) {
    // 获取角色列表
    getRoleList()
    
    if (props.userData && isEdit.value) {
      fillFormData(props.userData)
    } else {
      resetForm()
    }
  }
})

// 关闭对话框
const handleClose = () => {
  emit('update:visible', false)
}

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
    const userData: AddUserDTO = {
      username: formData.username,
      name: formData.name,
      password: formData.password,
      sex: formData.sex,
      roleIds: formData.roleIds
    }

    await api.user.addUser(userData)
    emit('success')
    handleClose()
  }
}
</script>

<style scoped>
</style>