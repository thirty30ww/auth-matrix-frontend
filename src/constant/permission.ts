import { PermissionType } from '@/types'

// 菜单类型对应的标签类型映射
export const VIEW_TYPE_TAG_MAP = {
    [PermissionType.DIRECTORY]: 'warning',
    [PermissionType.MENU]: 'success',
    [PermissionType.PAGE]: 'primary',
    [PermissionType.BUTTON]: 'info'
}