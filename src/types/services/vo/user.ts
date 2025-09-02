// 用户基础信息接口

// 角色接口
import {UserSex, ViewType} from "@/types";

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
export interface View {
    id: number;
    name: string;
    path: string;
    component: string;
    type: ViewType;
    parentNodeId: number;
    frontNodeId: number;
    behindNodeId: number;
    icon: string;
    isValid: boolean;
}

// 页面树节点接口
export interface ViewVO {
    node: View;
    hasPermission?: boolean;
    children: ViewVO[];
}