/**
 * 扩展字段配置接口 - 用于显示
 */
export interface ExtraField {
  /** 字段键名 */
  key: string
  /** 字段标签 */
  label: string
  /** 字段图标 */
  icon?: any
  /** 值格式化函数 */
  formatter?: (value: any) => string
}

/**
 * 表单扩展字段配置接口 - 用于表单输入
 */
export interface FormExtraField extends ExtraField {
  /** 是否必填 */
  required?: boolean
  /** 占位符文本 */
  placeholder?: string
}