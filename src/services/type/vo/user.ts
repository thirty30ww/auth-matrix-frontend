// 用户基础信息接口
import { UserSex, PermissionType, MethodType, OperationType, Status, LoginType } from "@/services";

/**
 * 角色接口
 */
export interface Role {
    id: number;
    name: string;
    description: string;
    parentNodeId: number;
    level: number;
    createTime: string;
    updateTime: string;
}

/**
 * 角色树节点接口
 */
export interface RoleVO {
    node: Role;
    hasPermission: boolean;
    children: RoleVO[];
}

/**
 * 用户接口
 */
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

/**
 * 登录结果接口
 */
export interface JwtVO {
    accessToken: string;
    refreshToken: string;
    username: string;
}

/**
 * 权限接口
 */
export interface PermissionBk {
    id: number;
    name: string;
    path: string;
    component: string;
    type: PermissionType;
    parentId: number;
    order: number;
    icon: string;
    permissionCode?: string;
    isValid: boolean;
}

/**
 * 权限树节点接口
 */
export interface PermissionBkVO {
    node: PermissionBk;
    hasPermission?: boolean;
    hasChange?: boolean;
    children: PermissionBkVO[];
}

/**
 * 偏好设置接口
 */
export interface Preference {
    id: number;
    field: string;
    value: string;
}

/**
 * 日志操作接口
 */
export interface LogOperationVO {
    id: number;
    userId?: number;
    name?: string;
    module: string;
    description?: string;
    type: OperationType;
    method: MethodType;
    code: number;
    url: string;
    ip: string;
    requestParam?: string;
    responseParam?: string;
    errorMessage?: string;
    operateTime: number;
    createTime: string;
}

/**
 * 登录日志VO
 */
export interface LogLoginVO {
    id: number;
    name?: string;
    ip?: string;
    browser: string;
    operatingSystem: string;
    deviceModel: string;
    type: LoginType; // 后端返回的是 type 字段
    status: Status; // 必填，后端保证不为空
    errorMessage?: string;
    operateTime: number;
    createTime: string;
}

/**
 * 系统公告VO
 */
export interface NoticeVO {
    id: number;
    title: string;
    content: string;
    isTop: boolean;
    publisherId: number;
    publisherName: string;
    createTime: string;
    updateTime: string;
}
