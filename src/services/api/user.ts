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
    GetUserListDTO, Role, AddUserDTO, ModifyUserDTO, RoleVO
} from '@/types';

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
     * @param isChild 是否仅查询子角色，可选参数
     * @returns 角色列表
     */
    getRoleList(isChild?: boolean) {
        return http.get<Role[]>('/role/list', { params: { isChild } });
    },

    /**
     * 获取全局角色列表
     * @returns 全局角色列表
     */
    getGlobalList() {
        return http.get<Role[]>('/role/global/list');
    },

    /**
     * 获取角色树
     * @returns 角色树
     */
    getRoleTree() {
        return http.get<RoleVO[]>('/role/tree');
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
     * @param targetRoleId 目标角色ID，可选参数
     */
    getMenuTree(targetRoleId?: number){
        return http.get<ViewVO[]>('/view/menu/tree', { params: { targetRoleId } });
    },

    /**
     * 获取页面列表
     * @param keyword 搜索关键词，可选参数
     */
    getViewList(keyword: string) {
        return http.get<View[]>('/view/list', { params: { keyword } });
    }
}