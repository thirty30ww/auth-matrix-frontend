import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePageCacheStore } from '@/stores/pageCache'
import { useTabsStore } from '@/stores/tabs'

/**
 * 页面缓存组合式函数
 * 提供页面级别的状态缓存功能，基于tab的生命周期
 * 
 * @param cacheKey - 可选的自定义缓存key，默认使用当前路由路径
 * @returns 缓存相关的方法和状态
 */
export function usePageCache<T extends Record<string, any>>(cacheKey?: string) {
    const route = useRoute()
    const pageCacheStore = usePageCacheStore()
    const tabsStore = useTabsStore()

    // 使用自定义key或当前路由路径作为缓存key
    const currentCacheKey = cacheKey || route.path

    // 缓存数据的响应式引用
    const cachedData = ref<T | null>(null)

    /**
     * 从缓存中恢复数据
     */
    const restoreFromCache = (): T | null => {
        const cached = pageCacheStore.getPageCache(currentCacheKey)
        if (cached) {
            cachedData.value = cached as T
            return cached as T
        }
        return null
    }

    /**
     * 保存数据到缓存
     * @param data - 要缓存的数据
     */
    const saveToCache = (data: T) => {
        // 只有当对应的tab存在时才缓存
        if (tabsStore.hasTab(currentCacheKey)) {
            pageCacheStore.setPageCache(currentCacheKey, data)
            cachedData.value = data
        }
    }

    /**
     * 更新缓存数据（部分更新）
     * @param data - 要更新的数据（部分）
     */
    const updateCache = (data: Partial<T>) => {
        // 只有当对应的tab存在时才更新缓存
        if (tabsStore.hasTab(currentCacheKey)) {
            pageCacheStore.updatePageCache(currentCacheKey, data)
            if (cachedData.value) {
                cachedData.value = { ...cachedData.value, ...data }
            }
        }
    }

    /**
     * 清除当前页面的缓存
     */
    const clearCache = () => {
        pageCacheStore.clearPageCache(currentCacheKey)
        cachedData.value = null
    }

    /**
     * 检查是否有缓存数据
     */
    const hasCache = (): boolean => {
        return pageCacheStore.hasPageCache(currentCacheKey)
    }

    /**
     * 创建一个响应式的缓存字段
     * 当字段值改变时自动更新缓存
     * @param initialValue - 初始值
     * @param fieldName - 字段名称
     */
    const createCachedField = <K extends keyof T>(fieldName: K, initialValue: T[K]) => {
        const fieldRef = ref(initialValue)

        // 监听字段变化，自动更新缓存
        watch(fieldRef, (newValue) => {
            updateCache({ [fieldName]: newValue } as Partial<T>)
        }, { deep: true })

        return fieldRef
    }

    /**
     * 批量创建缓存字段
     * @param fields - 字段定义对象
     */
    const createCachedFields = (fields: T) => {
        const refs: Record<keyof T, any> = {} as Record<keyof T, any>

        Object.keys(fields).forEach(key => {
            const typedKey = key as keyof T
            refs[typedKey] = createCachedField(typedKey, fields[typedKey])
        })

        return refs
    }

    // 初始化时尝试从缓存恢复数据
    restoreFromCache()

    // 组件卸载时不自动清除缓存，因为缓存的生命周期由tab控制

    return {
        // 数据
        cachedData,

        // 方法
        restoreFromCache,
        saveToCache,
        updateCache,
        clearCache,
        hasCache,
        createCachedField,
        createCachedFields,

        // 当前缓存key
        cacheKey: currentCacheKey
    }
}

/**
 * 用于特定数据结构的页面缓存hooks
 * 适用于列表页面的筛选条件和分页信息
 */
export interface ListPageCacheData {
    // 筛选条件
    searchForm?: Record<string, any>
    // 分页信息
    pageInfo?: {
        pageNum: number
        pageSize: number
        total?: number
        pages?: number
    }
    // 其他自定义数据
    [key: string]: any
}

/**
 * 列表页面专用的缓存hook
 * @param cacheKey - 可选的自定义缓存key
 */
export function useListPageCache(cacheKey?: string) {
    return usePageCache<ListPageCacheData>(cacheKey)
}

/**
 * 树型表格缓存数据结构
 */
export interface TreeTableCacheData {
    // 展开的行ID列表
    expandedKeys?: number[]
    // 其他自定义数据
    [key: string]: any
}

/**
 * 树型表格缓存组合函数
 * 专门用于管理树型表格的展开状态缓存
 * @param tableKey - 表格标识key（如 'role-table', 'menu-table'）
 */
export function useTreeTableCache(tableKey: string) {
    // 使用当前路由作为基础缓存key，确保tab存在检查能通过
    const cache = usePageCache<TreeTableCacheData>()

    // 为不同表格创建不同的字段名
    const expandedKeysField = `${tableKey}ExpandedKeys` as keyof TreeTableCacheData

    /**
     * 获取缓存的展开keys
     */
    const getExpandedKeys = (): number[] => {
        const cached = cache.restoreFromCache()
        const keys = cached?.[expandedKeysField] as number[] || []
        return keys
    }

    /**
     * 更新展开keys到缓存
     */
    const updateExpandedKeys = (keys: number[]) => {
        const updateData = { [expandedKeysField]: keys } as Partial<TreeTableCacheData>
        cache.updateCache(updateData)
    }

    /**
     * 检查是否有展开状态缓存
     */
    const hasExpandedCache = (): boolean => {
        const cached = cache.restoreFromCache()
        return cached !== null && cached?.[expandedKeysField] !== undefined
    }

    /**
     * 清除展开状态缓存
     */
    const clearExpandedCache = () => {
        const updateData = { [expandedKeysField]: [] } as Partial<TreeTableCacheData>
        cache.updateCache(updateData)
    }

    return {
        ...cache,
        getExpandedKeys,
        updateExpandedKeys,
        hasExpandedCache,
        clearExpandedCache
    }
}

/**
 * 角色页面缓存数据结构
 */
export interface RolePageCacheData {
    // 选中的角色
    selectedRole?: {
        id: number
        name: string
        description: string
    }
    // 其他自定义数据
    [key: string]: any
}

/**
 * 角色页面专用的缓存hook
 */
export function useRolePageCache() {
    return usePageCache<RolePageCacheData>()
}