/**
 * 通用映射工具函数
 */

/**
 * 安全地从映射对象中获取值
 * @param mapping 映射对象
 * @param key 键
 * @param defaultValue 默认值
 * @returns 对应的值或默认值
 */
export function getValueFromMapping<T extends Record<string | number, any>, K extends keyof T>(
    mapping: T,
    key: string | number,
    defaultValue: T[K] = '' as T[K]
): T[K] {
    return mapping[key as K] !== undefined ? mapping[key as K] : defaultValue
}

/**
 * 获取映射对象的所有键
 * @param mapping 映射对象
 * @returns 键数组
 */
export function getMappingKeys<T extends Record<string | number, any>>(
    mapping: T
): (keyof T)[] {
    return Object.keys(mapping)
}

/**
 * 获取映射对象的所有值
 * @param mapping 映射对象
 * @returns 值数组
 */
export function getMappingValues<T extends Record<string | number, any>>(
    mapping: T
): T[keyof T][] {
    return Object.values(mapping)
}

/**
 * 获取映射对象的键值对数组
 * @param mapping 映射对象
 * @returns 键值对数组 [{key, value}, ...]
 */
export function getMappingEntries<T extends Record<string | number, any>>(
    mapping: T
): Array<{ key: keyof T; value: T[keyof T] }> {
    return Object.entries(mapping).map(([key, value]) => ({ key, value }))
}