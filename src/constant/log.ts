import { elType } from "@/constant/common";

/**
 * 操作类型颜色映射
 */
export const OperationTypeColor = {
    SELECT: elType.PRIMARY,
    INSERT: elType.SUCCESS,
    SEND: elType.WARNING,
    UPDATE: elType.WARNING,
    DELETE: elType.DANGER,
    UPLOAD: elType.INFO
} as const

/**
 * 请求方法颜色映射
 */
export const MethodTypeColor = {
    GET: elType.PRIMARY,
    POST: elType.WARNING,
    PUT: elType.SUCCESS,
    DELETE: elType.DANGER,
    PATCH: elType.WARNING
} as const

/**
 * 根据状态码获取类型
 */
export function getStatusCodeType(code: number): string {
    if (code >= 200 && code < 300) return elType.SUCCESS
    if (code >= 400) return elType.DANGER
    return elType.INFO
}

/**
 * 根据操作类型获取颜色
 */
export function getOperationTypeColor(type: string): string {
    return OperationTypeColor[type as keyof typeof OperationTypeColor] || OperationTypeColor.SELECT
}

/**
 * 根据请求方法获取颜色
 */
export function getMethodTypeColor(method: string): string {
    return MethodTypeColor[method as keyof typeof MethodTypeColor] || MethodTypeColor.GET
}

/**
 * 登录类型颜色映射
 */
export const LoginTypeColor = {
    LOGIN: elType.SUCCESS,
    REGISTER: elType.WARNING,
    LOGOUT: elType.DANGER,
    REFRESH: elType.PRIMARY
} as const

/**
 * 状态颜色映射
 */
export const StatusColor = {
    SUCCESS: elType.SUCCESS,
    FAILED: elType.DANGER
} as const
