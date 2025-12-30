<template>
  <AmDialog
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
              v-model="formData.parentId"
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
        <el-button v-if="isEdit" @click="handleReset" :disabled="!isFormModified">重置</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ isEdit ? '保存' : '添加' }}
        </el-button>
      </template>
  </AmDialog>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { ElMessage } from 'element-plus'
import AmDialog from '@/components/basic/AmDialog.vue'
import RequiredLabel from '@/components/basic/RequiredLabel.vue'
import TypeSelector from '@/components/basic/TypeSelector.vue'
import IconSelector from '@/components/basic/IconSelector.vue'
import api from '@/services'
import { type PermissionBkVO, type PermissionBkDTO, PermissionType } from '@/services'
import { getValues } from '@/utils'
import { useDialog } from '@/composables/useDialog'

// Props
interface Props {
  visible: boolean
  menuData?: PermissionBkVO | null
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

// 创建默认表单数据
const createFormData = () => ({
  name: '',
  type: PermissionType.DIRECTORY,
  path: '',
  component: '',
  icon: '',
  permissionCode: '',
  parentId: 0,
  isValid: true
})

// 填充表单数据（编辑模式）
const fillFormData = (menuData: PermissionBkVO, formData: any) => {
  formData.name = menuData.node.name
  formData.type = menuData.node.type
  formData.path = menuData.node.path || ''
  formData.component = menuData.node.component || ''
  formData.icon = menuData.node.icon || ''
  formData.permissionCode = menuData.node.permissionCode || ''
  formData.parentId = menuData.node.parentId
  formData.isValid = menuData.node.isValid
}

// 递归获取节点及其所有子节点的ID
const getAllNodeIds = (node: PermissionBkVO): number[] => {
  const ids = [node.node.id]
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      ids.push(...getAllNodeIds(child))
    })
  }
  return ids
}

// 递归过滤节点，排除指定的ID列表
const filterNodes = (nodes: PermissionBkVO[], excludeIds: number[]): PermissionBkVO[] => {
  return nodes
    .filter(node => !excludeIds.includes(node.node.id))
    .map(node => ({
      ...node,
      children: node.children ? filterNodes(node.children, excludeIds) : []
    }))
}

// 动态类型选项（需要在 useDialog 之后定义，因为它依赖 formData）

// 检查所有子级是否都有hasChange权限
const checkChildrenHasChange = (node: PermissionBkVO): boolean => {
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


// 根据类型构建提交数据的辅助函数
const buildSubmitData = (baseData: Partial<PermissionBkDTO>, formData: any): PermissionBkDTO => {
  const result = { ...baseData } as PermissionBkDTO
  
  // 字段处理规则：根据类型处理字段
  // 路径和组件：只有菜单类型才需要
  result.path = formData.type === PermissionType.MENU ? formData.path : ''
  result.component = formData.type === PermissionType.MENU ? formData.component : ''
  // 图标：按钮类型不需要
  result.icon = formData.type === PermissionType.BUTTON ? '' : (formData.icon || '')
  // 权限码：只有按钮类型才需要
  result.permissionCode = formData.type === PermissionType.BUTTON ? (formData.permissionCode || '') : ''
  
  return result
}

// 使用 useDialog composable
const {
  dialogVisible,
  isEdit,
  formData,
  isFormModified,
  handleClose,
  handleReset,
  handleSubmit
} = useDialog({
  visible: () => props.visible,
  setVisible: (value) => emit('update:visible', value),
  data: () => props.menuData,
  isEditFn: (data) => {
    const d = data as PermissionBkVO | null | undefined
    return !!(d && d.node && d.node.id > 0)
  },
  createDefaultFormData: createFormData,
  fillFormData: fillFormData,
  onOpen: async () => {
    // 获取菜单树数据
    await getMenuTreeData()
    
    if (props.menuData && !isEdit.value) {
      // 添加子菜单模式：保留预设的父节点ID和类型
      formData.parentId = props.menuData.node.parentId
      formData.type = props.menuData.node.type // 使用传入的类型
    }
    // 添加根菜单模式：已经在useDialog中重置了，无需额外处理
  },
  beforeSubmit: async (_formData, isEdit) => {
    if (isEdit && !props.menuData?.node.id) {
      ElMessage.error('菜单ID不存在')
      return false
    }
    return true
  },
  onSubmit: async (formData, isEdit) => {
    const baseData = {
      name: formData.name,
      type: formData.type,
      parentId: formData.parentId,
      isValid: formData.isValid
    }

    if (isEdit) {
      // 编辑菜单逻辑
      const modifyData = buildSubmitData({
        ...baseData,
        id: props.menuData!.node.id
      }, formData)

      await api.permission_bk.modifyPermission(modifyData)
    } else {
      // 添加菜单
      const addData = buildSubmitData(baseData, formData)

      await api.permission_bk.addPermission(addData)
    }
  },
  onSuccess: () => {
    emit('success')
  },
  autoResetOnOpen: true
})

// 计算属性：是否为目录类型
const isDirectoryType = computed(() => formData.type === PermissionType.DIRECTORY)

// 计算属性：是否为按钮类型
const isButtonType = computed(() => formData.type === PermissionType.BUTTON)

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

// 获取菜单树数据
const getMenuTreeData = async () => {
  const data = await api.permission_bk.getMenuTree()
  if (data) {
    let filteredData = data
    
    // 如果是编辑模式，需要过滤掉当前编辑项及其所有子节点
    if (isEdit.value && props.menuData) {
      const excludeIds = getAllNodeIds(props.menuData)
      filteredData = filterNodes(data, excludeIds)
    }
    
    // 转换数据格式以适配tree-select，包含节点类型信息
    const convertToTreeData = (nodes: PermissionBkVO[]): any[] => {
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
  if (formData.parentId === 0) {
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
  
  return findNode(menuTreeOptions.value, formData.parentId)
}

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

// 监听父节点变化，重置类型选择（仅在添加模式下）并验证类型与父节点的兼容性
watch(() => formData.parentId, (newParentId, oldParentId) => {
  if (newParentId !== oldParentId) {
    const selectedParent = getSelectedParentNode()
    
    if (selectedParent) {
      const parentType = selectedParent.type
      let needResetType = false
      let newType = formData.type
      
      // 检查当前类型是否与新父节点兼容
      if (parentType === PermissionType.DIRECTORY) {
        // 目录下只能是目录或菜单
        if (formData.type === PermissionType.BUTTON) {
          needResetType = true
          newType = PermissionType.DIRECTORY
        }
      } else if (parentType === PermissionType.MENU) {
        // 菜单下只能是按钮
        if (formData.type !== PermissionType.BUTTON) {
          needResetType = true
          newType = PermissionType.BUTTON
        }
      }
      
      // 如果类型需要重置，则清空相关字段并设置新类型
      if (needResetType) {
        // 清空旧类型相关的字段
        if (formData.type === PermissionType.BUTTON) {
          // 从按钮切换到其他类型，清空权限码
          formData.permissionCode = ''
        } else {
          // 从非按钮类型切换到按钮，清空路径、组件和图标
          formData.path = ''
          formData.component = ''
          formData.icon = ''
        }
        
        // 设置新类型
        formData.type = newType
      }
      
      // 在添加模式下，根据父节点类型设置默认类型
      if (!isEdit.value && !needResetType) {
        if (parentType === PermissionType.DIRECTORY) {
          formData.type = PermissionType.DIRECTORY
        } else if (parentType === PermissionType.MENU) {
          formData.type = PermissionType.BUTTON
        }
      }
    }
  }
})

// 监听菜单数据变化（用于处理添加子菜单的特殊情况）
watch(() => props.menuData, (newData) => {
  if (newData && !isEdit.value) {
    // 添加子菜单模式：保留预设的父节点ID和类型
    formData.parentId = newData.node.parentId
    formData.type = newData.node.type // 使用传入的类型，不要重置为默认值
  }
})

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