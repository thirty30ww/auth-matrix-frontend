<template>
  <PaddedDialog
    v-model:visible="dialogVisible"
    :title="isEdit ? '编辑菜单' : '添加菜单'"
    width="800px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      label-position="right"
    >
      <!-- 必填部分 -->
      <div class="form-section">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item>
              <template #label>
                <RequiredLabel required>名称</RequiredLabel>
              </template>
              <el-input
                v-model="formData.name"
                placeholder="请输入名称"
                clearable
              />
            </el-form-item>
            
            <el-form-item>
              <template #label>
                <RequiredLabel required>类型</RequiredLabel>
              </template>
              <TypeSelector
                v-model="formData.type"
                :options="typeOptions"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item>
              <template #label>
                <RequiredLabel required>父节点</RequiredLabel>
              </template>
            <el-tree-select
              v-model="formData.parentNodeId"
              :data="menuTreeOptions"
              :props="{ 
                value: 'id', 
                label: 'name', 
                children: 'children' 
              }"
              placeholder="请选择父节点"
              check-strictly
              :render-after-expand="false"
              default-expand-all
              style="width: 100%"
            />
            </el-form-item>
            
            <el-form-item>
              <template #label>
                <RequiredLabel required>是否有效</RequiredLabel>
              </template>
              <el-switch
                v-model="formData.isValid"
                :disabled="!canModifyValid"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      
      <!-- 可选配置部分 -->
      <div class="form-section with-divider">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item>
              <template #label>
                <RequiredLabel>路径</RequiredLabel>
              </template>
              <el-input
                v-model="formData.path"
                placeholder="请输入路径"
                :disabled="isDirectoryType || isButtonType"
                clearable
              />
            </el-form-item>
            
            <el-form-item>
              <template #label>
                <RequiredLabel>组件</RequiredLabel>
              </template>
              <el-input
                v-model="formData.component"
                placeholder="请输入组件路径"
                :disabled="isDirectoryType || isButtonType"
                clearable
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item>
              <template #label>
                <RequiredLabel>图标</RequiredLabel>
              </template>
              <IconSelector
                v-model="formData.icon"
                placeholder="请选择图标"
                :disabled="isButtonType"
              />
            </el-form-item>
            
            <el-form-item>
              <template #label>
                <RequiredLabel>权限码</RequiredLabel>
              </template>
              <el-input
                v-model="formData.permissionCode"
                placeholder="请输入权限码"
                :disabled="!isButtonType"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
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
import { reactive, computed, watch, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PaddedDialog from '@/components/basic/PaddedDialog.vue'
import RequiredLabel from '@/components/basic/RequiredLabel.vue'
import TypeSelector from '@/components/basic/TypeSelector.vue'
import IconSelector from '@/components/basic/IconSelector.vue'
import api from '@/services'
import { type PermissionVO, type PermissionDTO, PermissionType } from '@/types'
import { getValues } from '@/utils'

// Props
interface Props {
  visible: boolean
  menuData?: PermissionVO | null
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  menuData: null
})

// Emits
interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const menuTreeOptions = ref<any[]>([])

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 是否为编辑模式
const isEdit = computed(() => !!props.menuData && props.menuData.node.id > 0)

// 表单数据
const formData = reactive({
  name: '',
  type: PermissionType.DIRECTORY,
  path: '',
  component: '',
  icon: '',
  permissionCode: '',
  parentNodeId: 0,
  isValid: true
})

// 递归获取节点及其所有子节点的ID
const getAllNodeIds = (node: PermissionVO): number[] => {
  const ids = [node.node.id]
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      ids.push(...getAllNodeIds(child))
    })
  }
  return ids
}

// 递归过滤节点，排除指定的ID列表
const filterNodes = (nodes: PermissionVO[], excludeIds: number[]): PermissionVO[] => {
  return nodes
    .filter(node => !excludeIds.includes(node.node.id))
    .map(node => ({
      ...node,
      children: node.children ? filterNodes(node.children, excludeIds) : []
    }))
}

// 获取菜单树数据
const getMenuTreeData = async () => {
  const data = await api.permission.getMenuTree()
  if (data) {
    let filteredData = data
    
    // 如果是编辑模式，需要过滤掉当前编辑项及其所有子节点
    if (isEdit.value && props.menuData) {
      const excludeIds = getAllNodeIds(props.menuData)
      filteredData = filterNodes(data, excludeIds)
    }
    
    // 转换数据格式以适配tree-select，包含节点类型信息
    const convertToTreeData = (nodes: PermissionVO[]): any[] => {
      return nodes.map(node => ({
        id: node.node.id,
        name: node.node.name,
        type: node.node.type,
        children: convertToTreeData(node.children || [])
      }))
    }
    
    // 添加根节点选项
    menuTreeOptions.value = [
      {
        id: 0,
        name: '根节点',
        type: PermissionType.DIRECTORY,
        children: convertToTreeData(filteredData)
      }
    ]
  }
}

// 获取当前选择的父节点信息
const getSelectedParentNode = () => {
  if (formData.parentNodeId === 0) {
    return { type: PermissionType.DIRECTORY } // 根节点视为目录类型
  }
  
  // 递归查找节点
  const findNode = (nodes: any[], targetId: number): any => {
    for (const node of nodes) {
      if (node.id === targetId) {
        return node
      }
      if (node.children && node.children.length > 0) {
        const found = findNode(node.children, targetId)
        if (found) return found
      }
    }
    return null
  }
  
  return findNode(menuTreeOptions.value, formData.parentNodeId)
}

// 动态类型选项
const typeOptions = computed(() => {
  const selectedParent = getSelectedParentNode()
  
  // 如果没有选择父节点，不能选择任何类型
  if (!selectedParent) {
    return getValues(PermissionType)
      .filter(value => value !== PermissionType.PAGE)
      .map(value => ({
        label: value,
        value: value,
        disabled: true
      }))
  }
  
  const parentType = selectedParent.type
  
  return getValues(PermissionType)
    .filter(value => value !== PermissionType.PAGE)
    .map(value => {
      let disabled = false
      
      // 根据父节点类型限制子节点类型
      if (parentType === PermissionType.DIRECTORY) {
        // 目录只能添加菜单和目录
        disabled = !(value === PermissionType.MENU || value === PermissionType.DIRECTORY)
      } else if (parentType === PermissionType.MENU) {
        // 菜单只能添加按钮
        disabled = value !== PermissionType.BUTTON
      } else {
        // 按钮和页面不能有子节点
        disabled = true
      }
      
      return {
        label: value,
        value: value,
        disabled: disabled
      }
    })
})

// 计算属性：是否为目录类型
const isDirectoryType = computed(() => formData.type === PermissionType.DIRECTORY)

// 计算属性：是否为按钮类型
const isButtonType = computed(() => formData.type === PermissionType.BUTTON)

// 检查所有子级是否都有hasChange权限
const checkChildrenHasChange = (node: PermissionVO): boolean => {
  // 如果没有子节点，返回true（叶子节点不影响父节点的修改权限）
  if (!node.children || node.children.length === 0) {
    return true
  }
  
  // 检查所有直接子节点是否都有hasChange权限
  const allChildrenHaveChange = node.children.every(child => child.hasChange !== false)
  
  // 如果直接子节点都有权限，再递归检查所有子节点的子节点
  if (allChildrenHaveChange) {
    return node.children.every(child => checkChildrenHasChange(child))
  }
  
  return false
}

// 计算属性：当前菜单项是否可以修改isValid字段
const canModifyValid = computed(() => {
  // 如果是添加模式，允许修改
  if (!isEdit.value) {
    return true
  }
  
  // 如果是编辑模式，需要检查当前节点及其所有子节点的hasChange状态
  if (props.menuData) {
    // 首先检查当前节点自身的hasChange状态
    if (props.menuData.hasChange === false) {
      return false
    }
    
    // 然后检查所有子节点的hasChange状态
    return checkChildrenHasChange(props.menuData)
  }
  
  return true
})

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.type = PermissionType.DIRECTORY
  formData.path = ''
  formData.component = ''
  formData.icon = ''
  formData.permissionCode = ''
  formData.parentNodeId = 0
  formData.isValid = true
}

// 填充表单数据（编辑模式）
const fillFormData = (menuData: PermissionVO) => {
  formData.name = menuData.node.name
  formData.type = menuData.node.type
  formData.path = menuData.node.path || ''
  formData.component = menuData.node.component || ''
  formData.icon = menuData.node.icon || ''
  formData.permissionCode = menuData.node.permissionCode || ''
  formData.parentNodeId = menuData.node.parentNodeId
  formData.isValid = menuData.node.isValid
}

// 监听菜单数据变化
watch(() => props.menuData, (newData) => {
  if (newData && isEdit.value) {
    // 编辑模式：填充现有数据
    fillFormData(newData)
  } else if (newData && !isEdit.value) {
    // 添加子菜单模式：重置表单但保留预设的父节点ID和类型
    resetForm()
    formData.parentNodeId = newData.node.parentNodeId
    formData.type = newData.node.type // 使用传入的类型，不要重置为默认值
  } else {
    // 添加根菜单模式：完全重置
    resetForm()
  }
}, { immediate: true })

// 监听类型变化，清空禁用字段的内容
watch(() => formData.type, (newType, oldType) => {
  if (newType !== oldType) {
    // 当切换到目录或按钮时，清空路径和组件
    if (newType === PermissionType.DIRECTORY || newType === PermissionType.BUTTON) {
      formData.path = ''
      formData.component = ''
    }
    
    // 当切换到按钮时，清空图标
    if (newType === PermissionType.BUTTON) {
      formData.icon = ''
    }
    
    // 当切换到非按钮类型时，清空权限码
    if (newType !== PermissionType.BUTTON) {
      formData.permissionCode = ''
    }
  }
})

// 监听父节点变化，重置类型选择（仅在添加模式下）
watch(() => formData.parentNodeId, (newParentId, oldParentId) => {
  if (newParentId !== oldParentId && !isEdit.value) {
    // 只在添加模式下自动设置类型，编辑模式下保持用户选择的类型
    const selectedParent = getSelectedParentNode()
    
    if (selectedParent) {
      const parentType = selectedParent.type
      
      // 根据父节点类型自动设置合适的默认类型
      if (parentType === PermissionType.DIRECTORY) {
        // 目录节点下，默认选择目录类型
        formData.type = PermissionType.DIRECTORY
      } else if (parentType === PermissionType.MENU) {
        // 菜单节点下，默认选择按钮类型
        formData.type = PermissionType.BUTTON
      }
    }
  }
})

// 监听对话框显示状态
watch(() => props.visible, async (visible) => {
  if (visible) {
    // 对话框打开时先清空所有表单数据
    resetForm()
    
    // 获取菜单树数据
    await getMenuTreeData()
    
    if (props.menuData && isEdit.value) {
      // 编辑模式：填充现有数据
      fillFormData(props.menuData)
    } else if (props.menuData && !isEdit.value) {
      // 添加子菜单模式：保留预设的父节点ID和类型
      formData.parentNodeId = props.menuData.node.parentNodeId
      formData.type = props.menuData.node.type // 使用传入的类型
    }
    // 添加根菜单模式：已经在开头重置了，无需额外处理
  }
  // 关闭时不做任何处理，保持表单状态
})

// 关闭对话框
const handleClose = () => {
  emit('update:visible', false)
}

// 字段处理规则配置
const fieldRules = {
  // 路径和组件：只有菜单类型才需要
  path: (type: PermissionType) => type === PermissionType.MENU ? formData.path : '',
  component: (type: PermissionType) => type === PermissionType.MENU ? formData.component : '',
  // 图标：按钮类型不需要
  icon: (type: PermissionType) => type === PermissionType.BUTTON ? '' : (formData.icon || ''),
  // 权限码：只有按钮类型才需要
  permissionCode: (type: PermissionType) => type === PermissionType.BUTTON ? (formData.permissionCode || '') : ''
}

// 根据类型构建提交数据的辅助函数
const buildSubmitData = (baseData: Partial<PermissionDTO>): PermissionDTO => {
  const result = { ...baseData } as PermissionDTO
  
  // 使用配置规则处理字段
  result.path = fieldRules.path(formData.type)
  result.component = fieldRules.component(formData.type)
  result.icon = fieldRules.icon(formData.type)
  result.permissionCode = fieldRules.permissionCode(formData.type)
  
  return result
}

// 提交表单
const handleSubmit = async () => {
  const baseData = {
    name: formData.name,
    type: formData.type,
    parentNodeId: formData.parentNodeId,
    isValid: formData.isValid
  }

  if (isEdit.value) {
    // 编辑菜单逻辑
    if (!props.menuData?.node.id) {
      ElMessage.error('菜单ID不存在')
      return
    }

    const modifyData = buildSubmitData({
      ...baseData,
      id: props.menuData.node.id
    })

    await api.permission.modifyPermission(modifyData)
    emit('success')
    handleClose()
  } else {
    // 添加菜单
    const addData = buildSubmitData(baseData)

    await api.permission.addPermission(addData)
    emit('success')
    handleClose()
  }
}
</script>

<style scoped>
.form-section {
    margin-bottom: 7px;
}

.form-section.with-divider {
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 25px;
}

.form-section:last-child {
  margin-bottom: 0;
}
</style>