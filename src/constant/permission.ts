import { PermissionType } from '@/types'
import {elType} from "@/constant/common.ts";

// 菜单类型对应的标签类型映射
export const VIEW_TYPE_TAG_MAP = {
    [PermissionType.DIRECTORY]: elType.WARNING,
    [PermissionType.MENU]: elType.SUCCESS,
    [PermissionType.PAGE]: elType.PRIMARY,
    [PermissionType.BUTTON]: elType.INFO
}