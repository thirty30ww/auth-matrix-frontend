/**
 * 用户状态枚举类
 */
export const UserStatus = {
    VALID: '正常',
    INVALID: '封禁'
}

/**
 * 权限状态枚举类
 */
export const PermissionStatus = {
    YES: '有权限',
    NO: '无权限'
}

/**
 * 角色级别标签类型映射（仅前3个级别有特殊类型）
 */
export const LevelTagType = {
    0: 'danger',   // level 0 - 红色
    1: 'warning',  // level 1 - 橙色
    2: 'success'   // level 2 - 绿色
}

/**
 * 角色相关常量
 */
export const RoleConstants = {
    /** 全局角色的level值 */
    GLOBAL_ROLE_LEVEL: -1,
    /** 角色类型 */
    ROLE_TYPES: {
        NORMAL: 'normal',
        GLOBAL: 'global'
    } as const,
    /** 角色类型标签 */
    ROLE_TYPE_LABELS: {
        NORMAL: '普通角色',
        GLOBAL: '全局角色'
    } as const
} as const

/**
 * 角色类型选项
 */
export const RoleTypeOptions = [
    { label: RoleConstants.ROLE_TYPE_LABELS.NORMAL, value: RoleConstants.ROLE_TYPES.NORMAL },
    { label: RoleConstants.ROLE_TYPE_LABELS.GLOBAL, value: RoleConstants.ROLE_TYPES.GLOBAL }
]

/**
 * 判断是否为全局角色
 */
export function isGlobalRole(level: number): boolean {
    return level === RoleConstants.GLOBAL_ROLE_LEVEL
}

/**
 * 根据level获取角色类型
 */
export function getRoleType(level: number): 'normal' | 'global' {
    return isGlobalRole(level) ? RoleConstants.ROLE_TYPES.GLOBAL : RoleConstants.ROLE_TYPES.NORMAL
}

/**
 * 根据level获取角色类型标签
 */
export function getRoleTypeLabel(level: number): string {
    return isGlobalRole(level) ? RoleConstants.ROLE_TYPE_LABELS.GLOBAL : RoleConstants.ROLE_TYPE_LABELS.NORMAL
}