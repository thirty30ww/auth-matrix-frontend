// 用户基础信息接口

// 角色接口
import { UserSex, PermissionType } from "@/types";

export interface Role {
    id: number;
    name: string;
    description: string;
    parentNodeId: number;
    level: number;
    createTime: string;
    updateTime: string;
}

// 角色树节点接口
export interface RoleVO {
    node: Role;
    hasPermission: boolean;
    children: RoleVO[];
}

// 用户接口
export interface UserVO {
    id: number;
    username: string;
    name: string;
    avatarUrl: string;
    sex: UserSex;
    signature?: string;
    hasPermission: boolean;
    roles: Role[];
    isValid: boolean;
    createTime: string;
    updateTime: string;
}

// 登录结果接口
export interface JwtVO {
    accessToken: string;
    refreshToken: string;
    username: string;
}

// 页面接口
export interface Permission {
    id: number;
    name: string;
    path: string;
    component: string;
    type: PermissionType;
    parentNodeId: number;
    frontNodeId: number;
    behindNodeId: number;
    icon: string;
    permissionCode?: string;
    isValid: boolean;
}

// 页面树节点接口
export interface PermissionVO {
    node: Permission;
    hasPermission?: boolean;
    hasChange?: boolean;
    children: PermissionVO[];
}

// 偏好设置接口
export interface Preference {
    id: number;
    field: string;
    value: string;
}