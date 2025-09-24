/**
 * 状态码类型映射
 */
export const StatusCodeType = {
    SUCCESS: 'success',  // 2xx
    WARNING: 'warning',  // 4xx
    DANGER: 'danger',    // 5xx
    INFO: 'info'         // 其他
} as const

/**
 * 操作类型颜色映射
 */
export const OperationTypeColor = {
    SELECT: 'primary',
    INSERT: 'success',
    UPDATE: 'warning',
    DELETE: 'danger',
    UPLOAD: 'info'
} as const

/**
 * 请求方法颜色映射
 */
export const MethodTypeColor = {
    GET: 'primary',
    POST: 'warning',
    PUT: 'success',
    DELETE: 'danger',
    PATCH: 'warning'
} as const

/**
 * 根据状态码获取类型
 */
export function getStatusCodeType(code: number): string {
    if (code >= 200 && code < 300) return StatusCodeType.SUCCESS
    if (code >= 400 && code < 500) return StatusCodeType.WARNING
    if (code >= 500) return StatusCodeType.DANGER
    return StatusCodeType.INFO
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