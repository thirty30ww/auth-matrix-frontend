import { ViewType } from '@/types'

// 菜单类型对应的标签类型映射
export const VIEW_TYPE_TAG_MAP = {
    [ViewType.DIRECTORY]: 'warning',
    [ViewType.MENU]: 'success',
    [ViewType.PAGE]: 'primary'
}