import { computed, watch, ref, reactive, type Ref, type WritableComputedRef } from 'vue'

/**
 * Dialog通用逻辑的配置选项
 */
export interface UseDialogOptions<TData = any, TFormData = any> {
  /**
   * 对话框的visible状态
   */
  visible: Ref<boolean> | (() => boolean)
  
  /**
   * 设置visible状态的函数（用于emit('update:visible')）
   */
  setVisible: (value: boolean) => void
  
  /**
   * 传入的数据（用于判断编辑模式）
   */
  data?: Ref<TData | null | undefined> | (() => TData | null | undefined)
  
  /**
   * 判断是否为编辑模式的函数
   * 默认通过检查data是否有id字段来判断
   */
  isEditFn?: (data: TData | null | undefined) => boolean
  
  /**
   * 创建默认表单数据的函数
   */
  createDefaultFormData: () => TFormData
  
  /**
   * 从传入数据填充表单数据的函数（编辑模式）
   */
  fillFormData?: (data: TData, formData: TFormData) => void
  
  /**
   * 对话框打开时的额外处理（如加载数据）
   */
  onOpen?: () => void | Promise<void>
  
  /**
   * 对话框关闭时的额外处理
   */
  onClose?: () => void
  
  /**
   * 提交前的验证函数（可选）
   */
  beforeSubmit?: (formData: TFormData, isEdit: boolean) => boolean | Promise<boolean>
  
  /**
   * 提交函数
   */
  onSubmit: (formData: TFormData, isEdit: boolean) => void | Promise<void>
  
  /**
   * 提交成功后的回调
   */
  onSuccess?: () => void
  
  /**
   * 是否在对话框打开时自动重置表单
   * @default true
   */
  autoResetOnOpen?: boolean
  
  /**
   * 是否在对话框关闭时自动重置表单
   * @default false
   */
  autoResetOnClose?: boolean
}

/**
 * Dialog通用逻辑的返回值
 */
export interface UseDialogReturn<TFormData = any> {
  /**
   * 对话框显示状态（用于v-model:visible）
   */
  dialogVisible: WritableComputedRef<boolean>
  
  /**
   * 是否为编辑模式
   */
  isEdit: Ref<boolean>
  
  /**
   * 表单数据
   */
  formData: TFormData

  /**
   * 编辑模式下表单是否被修改
   */
  isFormModified: Ref<boolean>
  
  /**
   * 关闭对话框
   */
  handleClose: () => void
  
  /**
   * 重置表单
   */
  handleReset: () => void
  
  /**
   * 提交表单
   */
  handleSubmit: () => Promise<void>
}

/**
 * Dialog通用逻辑组合式函数
 * 封装了Dialog的打开、关闭、重置、提交等通用逻辑
 * 
 * @example
 * ```ts
 * const emit = defineEmits<{ (e: 'update:visible', value: boolean): void; (e: 'success'): void }>()
 * 
 * const {
 *   dialogVisible,
 *   isEdit,
 *   formData,
 *   handleClose,
 *   handleReset,
 *   handleSubmit
 * } = useDialog({
 *   visible: () => props.visible,
 *   setVisible: (value) => emit('update:visible', value),
 *   data: () => props.userData,
 *   createDefaultFormData: () => ({
 *     name: '',
 *     age: 0
 *   }),
 *   fillFormData: (data, formData) => {
 *     formData.name = data.name
 *     formData.age = data.age
 *   },
 *   onSubmit: async (formData, isEdit) => {
 *     if (isEdit) {
 *       await api.update(formData)
 *     } else {
 *       await api.create(formData)
 *     }
 *   },
 *   onSuccess: () => {
 *     emit('success')
 *   }
 * })
 * ```
 */
export function useDialog<TData = any, TFormData extends Record<string, any> = any>(
  options: UseDialogOptions<TData, TFormData>
): UseDialogReturn<TFormData> {
  const {
    visible,
    setVisible,
    data,
    isEditFn,
    createDefaultFormData,
    fillFormData,
    onOpen,
    onClose,
    beforeSubmit,
    onSubmit,
    onSuccess,
    autoResetOnOpen = true,
    autoResetOnClose = false
  } = options

  // 获取visible的值（支持Ref和函数）
  const getVisible = () => {
    return typeof visible === 'function' ? visible() : visible.value
  }

  // 获取data的值（支持Ref和函数）
  const getData = (): TData | null | undefined => {
    if (!data) return undefined
    return typeof data === 'function' ? data() : data.value
  }

  // 判断是否为编辑模式的函数
  const checkIsEdit = (): boolean => {
    const currentData = getData()
    if (isEditFn) {
      return isEditFn(currentData)
    }
    // 默认判断：检查data是否有id字段且id > 0
    if (currentData && typeof currentData === 'object') {
      const dataObj = currentData as any
      return (dataObj.id && dataObj.id > 0)
    }
    return false
  }

  // 是否为编辑模式
  const isEdit = computed(() => checkIsEdit())

  // 表单数据（保持响应式）
  const formData = reactive(createDefaultFormData()) as TFormData

  // 原始快照（用于判断修改状态，仅编辑态需要）
  const originalSnapshot = ref<TFormData | null>(null)

  // 记录当前表单的快照
  const captureSnapshot = () => {
    // 使用深拷贝存储当前表单状态
    originalSnapshot.value = JSON.parse(JSON.stringify(formData)) as TFormData
  }

  // 从快照恢复表单
  const restoreFromSnapshot = () => {
    if (originalSnapshot.value) {
      Object.assign(formData, originalSnapshot.value)
    }
  }

  // 重置表单
  const resetForm = () => {
    Object.assign(formData, createDefaultFormData())
  }

  // 填充表单数据（编辑模式）
  const fillForm = () => {
    const currentData = getData()
    if (currentData && fillFormData) {
      fillFormData(currentData, formData)
      captureSnapshot()
    }
  }

  // 对话框显示状态
  const dialogVisible = computed({
    get: () => getVisible(),
    set: (value: boolean) => {
      setVisible(value)
    }
  })

  // 关闭对话框
  const handleClose = () => {
    if (onClose) {
      onClose()
    }
    if (autoResetOnClose) {
      resetForm()
    }
    setVisible(false)
  }

  // 重置表单（对外暴露的方法）
  const handleReset = () => {
    if (isEdit.value) {
      // 编辑模式：恢复到原始数据
      if (originalSnapshot.value) {
        restoreFromSnapshot()
      } else {
        fillForm()
      }
    } else {
      // 添加模式：重置为默认值
      resetForm()
    }
  }

  // 编辑模式下，是否修改过表单
  const isFormModified = computed(() => {
    if (!isEdit.value) return false
    if (!originalSnapshot.value) return false
    return JSON.stringify(formData) !== JSON.stringify(originalSnapshot.value)
  })

  // 提交表单
  const handleSubmit = async () => {
    // 提交前验证
    if (beforeSubmit) {
      const canSubmit = await beforeSubmit(formData, isEdit.value)
      if (!canSubmit) {
        return
      }
    }

    // 执行提交
    await onSubmit(formData, isEdit.value)

    // 提交成功后处理
    if (onSuccess) {
      onSuccess()
    }
    handleClose()
  }

  // 监听对话框显示状态
  watch(
    () => getVisible(),
    async (visible) => {
      if (visible) {
        // 对话框打开时
        if (autoResetOnOpen) {
          resetForm()
        }

        // 执行打开时的额外处理
        if (onOpen) {
          await onOpen()
        }

        // 根据模式填充或重置表单
        if (isEdit.value) {
          fillForm()
        } else if (!autoResetOnOpen) {
          // 如果autoResetOnOpen为false，这里也不重置，让外部控制
          resetForm()
        }
      }
    }
  )

  // 监听数据变化（用于响应外部数据更新）
  if (data) {
    watch(
      () => getData(),
      (newData) => {
        if (newData && isEdit.value) {
          fillForm()
        } else if (!isEdit.value && newData) {
          // 添加模式但传入了数据（可能是预设数据）
          resetForm()
        } else {
          resetForm()
        }
      },
      { immediate: true }
    )
  }

  return {
    dialogVisible,
    isEdit,
    formData,
    isFormModified,
    handleClose,
    handleReset,
    handleSubmit
  }
}

