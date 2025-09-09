import http from '../http';
import type {
    UserVO,
    JwtVO,
    UpdateUserDTO,
    ViewVO,
    ChangePassWordDTO,
    View,
    PageQueryDTO,
    PageResponse,
    GetUserListDTO, Role, AddUserDTO, ModifyUserDTO, RoleVO, RoleDTO, ViewDTO
} from '@/types';
import { RolesType } from '@/types';

// 权限校验API
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
};

// 用户信息API
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
     * 退出登录
     * @param refreshToken 刷新令牌
     * @param showSuccess 是否显示成功提示，可选参数
     */
    logout(refreshToken: string, showSuccess?: boolean) {
        return http.get('/user/logout', { params: { refreshToken }, showSuccess });
    }
};

// 角色API
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
     * 修改角色
     * @param role 角色修改请求参数
     */
    updateRole(role: RoleDTO) {
        return http.post<void>('/role/update', { data: role, showSuccess: true });
    },

    /**
     * 删除角色
     * @param roleId 角色ID列表
     */
    deleteRole(roleId: number) {
        return http.get<void>('/role/delete', { params: { roleId }, showSuccess: true });
    },

    /**
     * 分配角色视图
     * @param roleId 角色ID
     * @param viewIds 视图ID列表
     */
    assignView(roleId: number, viewIds: number[]) {
        return http.post<void>('/role/assign/view', { data: { roleId, viewIds }, showSuccess: true });
    }
}

// 页面API
export const viewApi = {
    /**
     * 获取页面树
     */
    getViewTree() {
        return http.get<ViewVO[]>('/view/tree');
    },

    /**
     * 获取菜单树
     */
    getMenuTree() {
        return http.get<ViewVO[]>('/view/menu/tree');
    },

    /**
     * 获取菜单和按钮树
     * @param targetRoleId 目标角色ID
     */
    getMenuAndButtonTree(targetRoleId?: number) {
        return http.get<ViewVO[]>('/view/menu/button/tree', { params: { targetRoleId } });
    },

    /**
     * 获取目录树
     */
    getDirectoryTree() {
        return http.get<ViewVO[]>('/view/directory/tree');
    },

    /**
     * 获取页面列表
     * @param keyword 搜索关键词，可选参数
     */
    getViewList(keyword: string) {
        return http.get<View[]>('/view/list', { params: { keyword } });
    },

    /**
     * 获取权限码列表
     */
    getPermissionCode() {
        return http.get<string[]>('/view/permission/code');
    },

    /**
     * 添加页面
     * @param view 页面添加请求参数
     */
    addView(view: ViewDTO) {
        return http.post<void>('/view/add', { data: view, showSuccess: true });
    },

    /**
     * 修改页面
     * @param view 页面修改请求参数
     */
    modifyView(view: ViewDTO) {
        return http.post<void>('/view/modify', { data: view, showSuccess: true });
    },

    /**
     * 删除页面
     * @param viewId 页面ID
     */
    deleteView(viewId: number) {
        return http.get<void>('/view/delete', { params: { viewId }, showSuccess: true });
    },

    /**
     * 移动页面
     * @param viewId 页面ID
     * @param isUp 是否向上移动
     */
    moveView(viewId: number, isUp: boolean) {
        return http.get<void>('/view/move', { params: { viewId, isUp } });
    }
}