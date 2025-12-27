import http from '../http';
import {
    UserVO,
    JwtVO,
    UpdateUserDTO,
    PermissionBkVO,
    ChangePassWordDTO,
    PageQueryDTO,
    PageResponse,
    GetUserListDTO,
    Role,
    AddUserDTO,
    ModifyUserDTO,
    RoleVO,
    RoleDTO,
    PermissionBkDTO,
    Preference,
    LogOperationDTO,
    LogOperationVO, LogLoginDTO, LogLoginVO, DateRangeType, BaseChartVO, NoticeVO
} from '@/services';
import { RolesType } from '@/services';

/**
 * 权限校验 API
 */
export const authApi = {
    /**
     * 用户登录
     * @param username 用户名
     * @param password 密码
     */
    login(username: string, password: string) {
        return http.post<JwtVO>('/auth/login', { data: { username, password }, showSuccess: true });
    },

    /**
     * 刷新令牌
     * @param refreshToken 刷新令牌
     */
    refresh(refreshToken: string) {
        return http.get<JwtVO>('/auth/refresh', { params: { refreshToken }, showError: false });
    },

    /**
     * 退出登录
     * @param refreshToken 刷新令牌
     * @param showSuccess 是否显示成功提示，可选参数
     */
    logout(refreshToken: string, showSuccess?: boolean) {
        return http.get('/auth/logout', { params: { refreshToken }, showSuccess });
    }
};

/**
 * 用户信息 API
 */
export const userApi = {
    /**
     * 获取用户信息
     * @returns 用户信息
     */
    getUser() {
        return http.get<UserVO>('/user/get');
    },

    /**
     * 添加用户
     * @param user 用户添加请求参数
     */
    addUser(user: AddUserDTO) {
        return http.post<void>('/user/add', { data: user, showSuccess: true });
    },

    /**
     * 更新用户信息(修改自己的个人信息)
     * @param userInfo 用户更新请求参数
     * @param showSuccess 是否显示成功提示，可选参数
     */
    updateUser(userInfo: UpdateUserDTO, showSuccess?: boolean) {
        return http.post<void>('/user/update', { data: userInfo, showSuccess });
    },

    /**
     * 修改用户信息(修改别的用户)
     * @param user 用户修改请求参数
     */
    modifyUser(user: ModifyUserDTO) {
        return http.post<void>('/user/modify', { data: user, showSuccess: true });
    },

    /**
     * 封禁用户
     * @param userIds 用户ID列表
     */
    banUser(userIds: number[]) {
        return http.post<void>('/user/ban', { data: userIds, showSuccess: true });
    },

    /**
     * 解封用户
     * @param userIds 用户ID列表
     */
    unbanUser(userIds: number[]) {
        return http.post<void>('/user/unban', { data: userIds, showSuccess: true });
    },

    /**
     * 密码修改
     * @param password 密码修改请求参数
     */
    changePassword(password: ChangePassWordDTO) {
        return http.post<void>('/user/change-password', { data: password, showSuccess: true });
    },

    /**
     * 分页查询用户列表
     * @param request 分页查询参数
     */
    getUserList(request: PageQueryDTO<GetUserListDTO>) {
        return http.post<PageResponse<UserVO>>('/user/list', { data: request });
    },

    /**
     * 获取用户偏好设置
     */
    getPreferences() {
        return http.get<Preference[]>('/user/preferences/get');
    },

    /**
     * 保存用户偏好设置
     * @param field 偏好设置字段
     * @param value 偏好设置值
     */
    savePreferences(field: string, value: string) {
        return http.get<void>('/user/preferences/save', { params: { field, value } });
    }
};

/**
 * 角色 API
 */
export const roleApi = {
    /**
     * 获取角色列表
     * @param type 列表类型
     * @returns 角色列表
     */
    getRoleList(type?: RolesType) {
        return http.get<Role[]>('/role/list', { params: { type } });
    },

    /**
     * 获取角色树
     * @returns 角色树
     */
    getRoleTree(type?: RolesType) {
        return http.get<RoleVO[]>('/role/tree', { params: { type } });
    },

    /**
     * 添加角色
     * @param role 角色添加请求参数
     */
    addRole(role: RoleDTO) {
        return http.post<void>('/role/add', { data: role, showSuccess: true });
    },

    /**
     * 添加全局角色
     * @param role 角色添加请求参数
     */
    addGlobalRole(role: RoleDTO) {
        return http.post<void>('/role/add/global', { data: role, showSuccess: true });
    },

    /**
     * 修改角色
     * @param role 角色修改请求参数
     */
    modifyRole(role: RoleDTO) {
        return http.post<void>('/role/modify', { data: role, showSuccess: true });
    },

    /**
     * 修改全局角色
     * @param role 角色修改请求参数
     */
    modifyGlobalRole(role: RoleDTO) {
        return http.post<void>('/role/modify/global', { data: role, showSuccess: true });
    },

    /**
     * 删除角色
     * @param roleId 角色ID列表
     */
    deleteRole(roleId: number) {
        return http.get<void>('/role/delete', { params: { roleId }, showSuccess: true });
    },

    /**
     * 删除全局角色
     * @param roleId 角色ID
     */
    deleteGlobalRole(roleId: number) {
        return http.get<void>('/role/delete/global', { params: { roleId }, showSuccess: true });
    },

    /**
     * 分配角色视图
     * @param roleId 角色ID
     * @param permissionIds 权限ID列表
     */
    assignPermission(roleId: number, permissionIds: number[]) {
        return http.post<void>('/role/assign/permission', { data: { roleId, viewIds: permissionIds }, showSuccess: true });
    },

    /**
     * 分配全局角色视图
     * @param roleId 角色ID
     * @param permissionIds 权限ID列表
     */
    assignGlobalPermission(roleId: number, permissionIds: number[]) {
        return http.post<void>('/role/assign/permission/global', { data: { roleId, viewIds: permissionIds }, showSuccess: true });
    },
}

/**
 * 页面 API
 */
export const permissionBkApi = {
    /**
     * 获取页面树
     */
    getViewTree() {
        return http.get<PermissionBkVO[]>('/permission/bk/tree');
    },

    /**
     * 获取菜单树
     */
    getMenuTree() {
        return http.get<PermissionBkVO[]>('/permission/bk/menu/tree');
    },

    /**
     * 获取菜单和按钮树
     * @param targetRoleId 目标角色ID
     */
    getMenuAndButtonTree(targetRoleId?: number) {
        return http.get<PermissionBkVO[]>('/permission/bk/menu/button/tree', { params: { targetRoleId } });
    },

    /**
     * 获取页面列表
     * @param keyword 搜索关键词，可选参数
     */
    getViewList(keyword: string) {
        return http.get<PermissionBkVO[]>('/permission/bk/list', { params: { keyword } });
    },

    /**
     * 获取权限码列表
     */
    getPermissionCode() {
        return http.get<string[]>('/permission/bk/code');
    },

    /**
     * 添加页面
     * @param permissionDTO 页面添加请求参数
     */
    addPermission(permissionDTO: PermissionBkDTO) {
        return http.post<void>('/permission/bk/add', { data: permissionDTO, showSuccess: true });
    },

    /**
     * 修改页面
     * @param permissionDTO 页面修改请求参数
     */
    modifyPermission(permissionDTO: PermissionBkDTO) {
        return http.post<void>('/permission/bk/modify', { data: permissionDTO, showSuccess: true });
    },

    /**
     * 删除页面
     * @param permissionId 页面ID
     */
    deletePermission(permissionId: number) {
        return http.get<void>('/permission/bk/delete', { params: { permissionId }, showSuccess: true });
    },

    /**
     * 移动页面
     * @param permissionId 页面ID
     * @param isUp 是否向上移动
     */
    movePermission(permissionId: number, isUp: boolean) {
        return http.get<void>('/permission/bk/move', { params: { permissionId, isUp } });
    }
}

/**
 * 日志 API
 */
export const logApi = {
    /**
     * 获取操作日志列表
     * @param request 日志查询参数
     */
    getLogOperationList(request: PageQueryDTO<LogOperationDTO>) {
        return http.post<PageResponse<LogOperationVO>>('/log/operation/list', { data: request });
    },

    /**
     * 获取操作日志详情
     * @param id 日志ID
     */
    getLogOperation(id: number) {
        return http.get<LogOperationVO>('/log/operation/get', { params: { id } });
    },

    /**
     * 获取操作日志状态码列表
     */
    getLogOperationCodes() {
        return http.get<number[]>('/log/operation/codes');
    },

    /**
     * 获取操作日志模块列表
     */
    getLogOperationModules() {
        return http.get<string[]>('/log/operation/modules');
    },

    /**
     * 获取登录日志列表
     * @param request 登录日志查询参数
     */
    getLogLoginList(request: PageQueryDTO<LogLoginDTO>) {
        return http.post<PageResponse<LogLoginVO>>('/log/login/list', { data: request });
    },

    /**
     * 获取登录日志浏览器列表
     */
    getLogLoginBrowsers() {
        return http.get<string[]>('/log/login/browsers');
    },

     /**
     * 获取登录日志操作系统列表
     */
    getLogLoginOperatingSystems() {
        return http.get<string[]>('/log/login/operating-systems');
    },
}

export const statisticApi = {
    /**
     * 获取在线用户列表
     */
    getOnlineUsers() {
        return http.get<UserVO[]>('/statistic/online-users');
    },

    /**
     * 获取创建用户数量
     * @param type 日期范围类型
     */
    getCreateUserCountChart(type: DateRangeType) {
        return http.get<BaseChartVO<number, number>>('/statistic/created-user-count-chart', { params: { type } });
    },

    /**
     * 获取最近2天创建用户数量
     * @returns 最近2天创建用户数量映射，键为today和yesterday，值为创建用户数量
     */
    getLastTwoDayCreatedUserCount() {
        return http.get<Map<string, number>>('/statistic/created-user-count/day');
    },

    /**
     * 获取最近2天异常操作次数
     * @returns 最近2天异常操作次数映射，键为today和yesterday，值为异常操作次数
     */
    getLastTwoDayAbnormalOperationCount() {
        return http.get<Map<string, number>>('/statistic/abnormal-operation-count/day');
    },
}

/**
 * 系统公告 API
 */
export const noticeApi = {
    /**
     * 获取系统公告列表
     */
    getNotices(dto: PageQueryDTO<void>) {
        return http.post<PageResponse<NoticeVO>>('/notice/list', { data: dto });
    },
}