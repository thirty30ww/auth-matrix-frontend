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
 * 用户级别标签类型映射（仅前3个级别有特殊类型）
 */
export const LevelTagType = {
    0: 'danger',   // level 0 - 红色
    1: 'warning',  // level 1 - 橙色
    2: 'success'   // level 2 - 绿色
}