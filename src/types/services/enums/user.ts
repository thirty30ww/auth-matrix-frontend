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
export enum PermissionType {
    DIRECTORY = "目录",
    MENU = "菜单",
    PAGE = "页面",
    BUTTON = "按钮"
}

/**
 * 操作类型枚举
 */
export enum OperationType{
    SELECT = "SELECT",
    INSERT = "INSERT",
    DELETE = "DELETE",
    UPDATE = "UPDATE",
    UPLOAD = "UPLOAD"
}

/**
 * 方法类型枚举
 */
export enum MethodType {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH"
}

/**
 * 登录类型枚举
 */
export enum LoginType {
    LOGIN = "登录",
    REGISTER = "注册",
    LOGOUT = "退出登录",
    REFRESH = "刷新token"
}
