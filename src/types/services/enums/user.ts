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
export enum RolesType {
    ALL,
    CHILD,
    CHILD_AND_GLOBAL,
    GLOBAL,
    CHILD_AND_SELF,
    NOT_GLOBAL
}

/**
 * 视图类型枚举
 */
export enum ViewType {
    DIRECTORY = "目录",
    MENU = "菜单",
    PAGE = "页面",
    BUTTON = "按钮"
}