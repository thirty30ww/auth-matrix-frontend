<template>
  <PaddedDialog
    v-model:visible="dialogVisible"
    :title="isEdit ? '编辑角色' : '添加角色'"
    width="500px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      label-position="right"
    >
      <el-form-item>
        <template #label>
          <RequiredLabel required>角色名称</RequiredLabel>
        </template>
        <el-input
          v-model="formData.name"
          placeholder="请输入角色名称"
          clearable
        />
      </el-form-item>
      
      <el-form-item>
        <template #label>
          <RequiredLabel required>角色描述</RequiredLabel>
        </template>
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入角色描述"
          clearable
        />
      </el-form-item>

      <el-form-item v-if="showParentSelect">
        <template #label>
          <RequiredLabel required>上级角色</RequiredLabel>
        </template>
        <el-select
          v-model="formData.parentNodeId"
          placeholder="请选择上级角色"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="role in parentRoleList"
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
import { type FormInstance } from 'element-plus'
import PaddedDialog from '@/components/basic/PaddedDialog.vue'
import RequiredLabel from '@/components/basic/RequiredLabel.vue'
import api from '@/services'
import { type Role, type RoleDTO, RoleListType } from '@/types'

// Props
interface Props {
  visible: boolean
  roleData?: Role | null
  parentNodeId?: number // 固定的父节点ID（用于行内添加）
  showParentSelect?: boolean // 是否显示父节点选择器
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  roleData: null,
  parentNodeId: undefined,
  showParentSelect: true
})

// Emits
interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const formRef = ref<FormInstance>()
const parentRoleList = ref<Role[]>([])

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 是否为编辑模式
const isEdit = computed(() => !!props.roleData && props.roleData.id > 0)

// 表单数据
const formData = reactive({
  name: '',
  description: '',
  parentNodeId: undefined as number | undefined
})

// 获取父角色列表
const getParentRoleList = async () => {
  if (props.showParentSelect) {
    parentRoleList.value = await api.role.getRoleList(RoleListType.CHILD_AND_SELF)
  }
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.description = ''
  formData.parentNodeId = props.parentNodeId
}

// 填充表单数据（编辑模式）
const fillFormData = (roleData: Role) => {
  formData.name = roleData.name
  formData.description = roleData.description
  formData.parentNodeId = roleData.parentNodeId
}

// 监听角色数据变化
watch(() => props.roleData, (newData) => {
  if (newData && isEdit.value) {
    fillFormData(newData)
  } else {
    resetForm()
  }
}, { immediate: true })

// 监听对话框显示状态
watch(() => props.visible, (visible) => {
  if (visible) {
    // 获取父角色列表
    getParentRoleList()
    
    if (props.roleData && isEdit.value) {
      fillFormData(props.roleData)
    } else {
      resetForm()
    }
  }
})

// 监听固定的父节点ID变化
watch(() => props.parentNodeId, (newParentNodeId) => {
  if (newParentNodeId !== undefined) {
    formData.parentNodeId = newParentNodeId
  }
})

// 关闭对话框
const handleClose = () => {
  emit('update:visible', false)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  if (isEdit.value) {
    const modifyData: RoleDTO = {
      id: props.roleData?.id, // 修改时必须传ID
      name: formData.name,
      description: formData.description,
      parentNodeId: formData.parentNodeId!
    }

    await api.role.updateRole(modifyData)
    emit('success')
    handleClose()
  } else {
    // 添加角色
    const roleData = {
      // 添加时不传ID
      name: formData.name,
      description: formData.description,
      ...(formData.parentNodeId !== undefined && { parentNodeId: formData.parentNodeId })
    }

    await api.role.addRole(roleData as RoleDTO)
    emit('success')
    handleClose()
  }
}
</script>

<style scoped>
</style>