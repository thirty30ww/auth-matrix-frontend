// 密码修改请求接口
import type { BaseListDTO } from "@/types";
import { UserSex, PermissionType } from "@/types";

export interface AddUserDTO {
    username: string;
    password: string;
    name: string;
    sex: UserSex;
    roleIds: number[];
}

export interface ChangePassWordDTO {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// 获取用户列表请求接口
export interface GetUserListDTO extends BaseListDTO {
    username?: string;
    name?: string;
    sex?: UserSex;
    roleIds?: number[];
    isValid?: boolean;
}

// 用户更新请求接口(修改自己的个人信息)
export interface UpdateUserDTO {
    id: number;
    name?: string;
    avatarUrl?: string;
    sex?: UserSex;
    signature?: string;
}

// 用户修改请求接口(修改别的用户)
export interface ModifyUserDTO {
    id: number;
    name: string;
    sex: UserSex;
    roleIds: number[];
}

// 角色DTO
export interface RoleDTO {
    id?: number;
    name: string;
    description: string;
    parentNodeId: number;
}

// 页面DTO
export interface PermissionDTO {
    id?: number;
    name: string;
    path?: string;
    component?: string;
    type: PermissionType;
    permissionCode?: string;
    parentNodeId: number;
    frontNodeId?: number;
    behindNodeId?: number;
    icon?: string;
    isValid: boolean;
}