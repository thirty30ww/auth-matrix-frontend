import { PermissionType } from '@/services'
import { elType } from "@/constant/common";

// 菜单类型对应的标签类型映射
export const PERMISSION_TYPE_MAP = {
    [PermissionType.DIRECTORY]: elType.WARNING,
    [PermissionType.MENU]: elType.SUCCESS,
    [PermissionType.PAGE]: elType.PRIMARY,
    [PermissionType.BUTTON]: elType.INFO
}