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
      <!-- 角色类型选择器 -->
      <el-form-item v-if="showRoleTypeSelect && !isEdit">
        <template #label>
          <RequiredLabel required>角色类型</RequiredLabel>
        </template>
        <TypeSelector
          v-model="roleType"
          :options="roleTypeOptions"
        />
      </el-form-item>
      
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

      <el-form-item v-if="shouldShowParentSelect">
        <template #label>
          <RequiredLabel required>上级角色</RequiredLabel>
        </template>
        <el-tree-select
          v-model="formData.parentNodeId"
          :data="roleTreeOptions"
          :props="{ 
            value: 'id', 
            label: 'name', 
            children: 'children' 
          }"
          placeholder="请选择上级角色"
          clearable
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
import {computed, reactive, ref, watch} from 'vue'
import {type FormInstance} from 'element-plus'
import PaddedDialog from '@/components/basic/PaddedDialog.vue'
import RequiredLabel from '@/components/basic/RequiredLabel.vue'
import TypeSelector from '@/components/basic/TypeSelector.vue'
import api from '@/services'
import {type Role, type RoleDTO, RolesType, type RoleVO} from '@/services'
import {RoleConstants, RoleTypeOptions, isGlobalRole, getRoleType} from '@/constant'

// Props
interface Props {
  visible: boolean
  roleData?: Role | null
  parentId?: number // 固定的父节点ID（用于行内添加）
  showParentSelect?: boolean // 是否显示父节点选择器
  showRoleTypeSelect?: boolean // 是否显示角色类型选择器（仅在顶部添加时显示）
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  roleData: null,
  parentId: undefined,
  showParentSelect: true,
  showRoleTypeSelect: false
})

// Emits
interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const formRef = ref<FormInstance>()
const roleTreeOptions = ref<any[]>([])

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 是否为编辑模式
const isEdit = computed(() => !!props.roleData && props.roleData.id > 0)

// 角色类型选项
const roleTypeOptions = RoleTypeOptions

// 角色类型
const roleType = ref<'normal' | 'global'>(RoleConstants.ROLE_TYPES.NORMAL)

// 是否为全局角色
const isGlobalRoleSelected = computed(() => roleType.value === RoleConstants.ROLE_TYPES.GLOBAL)

// 是否显示上级角色选择器（动态计算）
const shouldShowParentSelect = computed(() => {
  return props.showParentSelect && !isGlobalRoleSelected.value
})

// 表单数据
const formData = reactive({
  name: '',
  description: '',
  parentNodeId: undefined as number | undefined
})

// 递归获取节点及其所有子节点的ID
const getAllRoleIds = (role: RoleVO): number[] => {
  const ids = [role.node.id]
  if (role.children && role.children.length > 0) {
    role.children.forEach(child => {
      ids.push(...getAllRoleIds(child))
    })
  }
  return ids
}

// 递归过滤节点，排除指定的ID列表
const filterRoleNodes = (roles: RoleVO[], excludeIds: number[]): RoleVO[] => {
  return roles
    .filter(role => !excludeIds.includes(role.node.id))
    .map(role => ({
      ...role,
      children: role.children ? filterRoleNodes(role.children, excludeIds) : []
    }))
}

// 获取角色树数据
const getRoleTreeData = async () => {
  if (shouldShowParentSelect.value) {
    const data = await api.role.getRoleTree(RolesType.CHILD_AND_SELF)
    if (data) {
      let filteredData = data
      
      // 如果是编辑模式，需要过滤掉当前编辑的角色及其所有子角色
      if (isEdit.value && props.roleData) {
        // 在角色树中找到当前编辑的角色节点
        const findRoleInTree = (roles: RoleVO[], roleId: number): RoleVO | null => {
          for (const role of roles) {
            if (role.node.id === roleId) {
              return role
            }
            if (role.children && role.children.length > 0) {
              const found = findRoleInTree(role.children, roleId)
              if (found) return found
            }
          }
          return null
        }
        
        const currentRoleNode = findRoleInTree(data, props.roleData.id)
        if (currentRoleNode) {
          const excludeIds = getAllRoleIds(currentRoleNode)
          filteredData = filterRoleNodes(data, excludeIds)
        }
      }
      
      // 转换数据格式以适配tree-select
      const convertToTreeData = (roles: RoleVO[]): any[] => {
        return roles.map(role => ({
          id: role.node.id,
          name: role.node.name,
          description: role.node.description,
          children: convertToTreeData(role.children || [])
        }))
      }
      
      roleTreeOptions.value = convertToTreeData(filteredData)
    }
  }
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.description = ''
  formData.parentNodeId = props.parentNodeId
  roleType.value = RoleConstants.ROLE_TYPES.NORMAL
}

// 填充表单数据（编辑模式）
const fillFormData = (roleData: Role) => {
  formData.name = roleData.name
  formData.description = roleData.description
  formData.parentNodeId = roleData.parentNodeId
  // 根据level判断角色类型
  roleType.value = getRoleType(roleData.level)
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
    // 获取角色树数据
    getRoleTreeData()
    
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

// 监听角色类型变化，重新获取角色树数据
watch(() => roleType.value, () => {
  getRoleTreeData()
  // 如果切换到全局角色，清空parentNodeId
  if (isGlobalRoleSelected.value) {
    formData.parentNodeId = undefined
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
    // 编辑模式：根据原始角色的level判断类型，而不是根据当前选择的roleType
    const isEditingGlobalRole = props.roleData ? isGlobalRole(props.roleData.level) : false
    
    const modifyData: RoleDTO = {
      id: props.roleData?.id, // 修改时必须传ID
      name: formData.name,
      description: formData.description
    }
    
    // 只有普通角色才需要传递parentNodeId
    if (!isEditingGlobalRole && formData.parentNodeId !== undefined) {
      modifyData.parentNodeId = formData.parentNodeId
    }

    // 根据原始角色类型调用不同的修改API
    if (isEditingGlobalRole) {
      await api.role.modifyGlobalRole(modifyData)
    } else {
      await api.role.modifyRole(modifyData)
    }
    emit('success')
    handleClose()
  } else {
    // 添加角色
    const roleData: RoleDTO = {
      // 添加时不传ID
      name: formData.name,
      description: formData.description
    }
    
    // 只有普通角色才需要传递parentNodeId
    if (!isGlobalRoleSelected.value && formData.parentNodeId !== undefined) {
      roleData.parentNodeId = formData.parentNodeId
    }

    // 根据选择的角色类型调用不同的添加API
    if (isGlobalRoleSelected.value) {
      await api.role.addGlobalRole(roleData)
    } else {
      await api.role.addRole(roleData)
    }
    emit('success')
    handleClose()
  }
}
</script>

<style scoped>
</style>