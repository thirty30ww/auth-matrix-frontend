import { SettingField } from '@/types'
import api from '@/services'

/**
 * 设置项配置接口
 */
export interface SettingConfig {
    // 组件类型
    component: 'input' | 'number' | 'switch' | 'textarea' | 'select' | 'tree-select'
    // 获取选项数据的函数（用于select和tree-select类型）
    fetchOptions?: () => Promise<Array<{ value: any, label: string }>>
    // 获取树形数据的函数（用于tree-select类型）
    fetchTreeData?: () => Promise<any[]>
    // 是否多选（用于tree-select类型）
    multiple?: boolean
}

/**
 * 设置项配置映射
 * 添加新设置时，只需在这里添加对应的配置即可
 */
export const settingConfigs: Record<string, SettingConfig> = {
    // 项目标题 - 文本输入
    [SettingField.PROJECT_TITLE]: {
        component: 'input'
    },

    // 用户角色数量限制 - 数字输入
    [SettingField.USER_ROLE_NUMBER_LIMIT]: {
        component: 'number'
    },

    // 权限显示 - 开关
    [SettingField.PERMISSION_DISPLAY]: {
        component: 'switch'
    },

    // 默认角色 - 树形多选（从角色树API获取数据）
    [SettingField.DEFAULT_ROLES]: {
        component: 'tree-select',
        multiple: true,
        fetchTreeData: async () => {
            const roleTree = await api.role.getRoleTree()
            // 转换为树形选择器需要的格式
            const convertTree = (nodes: any[]): any[] => {
                return nodes.map(node => ({
                    id: node.node.id,
                    name: node.node.name,
                    children: node.children.length > 0 ? convertTree(node.children) : undefined
                }))
            }
            return convertTree(roleTree)
        }
    }
}

/**
 * 获取设置项配置
 * @param field 设置字段
 * @returns 设置配置，如果没有配置则返回默认的input配置
 */
export const getSettingConfig = (field: string): SettingConfig => {
    return settingConfigs[field] || { component: 'input' }
}