/**
 * 用户性别枚举类
 */
export enum UserSex {
    MAN = '男',
    WOMAN = '女',
    UNKNOWN = '未知'
}

/**
 * 角色列表类型枚举类
 */
export enum RoleListType {
    ALL = 0,
    CHILD = 1,
    CHILD_AND_GLOBAL = 2,
    GLOBAL = 3,
    CHILD_AND_SELF = 4,
}

/**
 * 视图类型枚举
 */
export enum ViewType {
    DIRECTORY = "目录",
    MENU = "菜单",
    PAGE = "页面"
}