import { ref, nextTick, type Ref } from 'vue'
import { useTreeTableCache } from '@/composables/usePageCache'

/**
 * 树型表格展开状态管理工具
 */
export function useTreeTableExpandState(tableKey: string) {
    // 缓存功能
    const treeCache = useTreeTableCache(tableKey)

    // 当前展开的行ID集合
    const currentExpandedRowIds = ref(new Set<number>())

    /**
     * 处理展开状态变化
     */
    const handleExpandChange = (row: any, expanded: boolean) => {
        const rowId = row.node.id
        if (expanded) {
            currentExpandedRowIds.value.add(rowId)
        } else {
            currentExpandedRowIds.value.delete(rowId)
        }

        // 更新缓存
        treeCache.updateExpandedKeys(Array.from(currentExpandedRowIds.value))
    }

    /**
     * 恢复展开状态
     */
    const restoreExpandedState = async (
        tableRef: Ref<any>,
        treeData: Ref<any[]> | any[],
        expandAllFn: () => void
    ) => {
        const dataArray = Array.isArray(treeData) ? treeData : treeData.value
        if (!tableRef.value || !dataArray.length) {
            return
        }

        await nextTick()

        // 检查是否有缓存的展开状态
        if (!treeCache.hasExpandedCache()) {
            // 没有缓存，默认全部展开
            expandAllFn()
            return
        }

        // 有缓存，恢复缓存的展开状态
        const cachedExpandedKeys = treeCache.getExpandedKeys()
        currentExpandedRowIds.value = new Set(cachedExpandedKeys)

        // 递归恢复展开状态
        const restoreRowExpansion = (data: any[]) => {
            data.forEach(item => {
                const shouldExpand = cachedExpandedKeys.includes(item.node.id)
                if (shouldExpand && item.children && item.children.length > 0) {
                    tableRef.value.toggleRowExpansion(item, true)
                }
                if (item.children && item.children.length > 0) {
                    restoreRowExpansion(item.children)
                }
            })
        }

        restoreRowExpansion(dataArray)
    }

    /**
     * 展开全部
     */
    const expandAll = async (tableRef: Ref<any>, treeData: Ref<any[]> | any[]) => {
        await nextTick()

        // 清空当前展开集合
        currentExpandedRowIds.value.clear()

        // 递归展开所有行并收集ID
        const expandAllRows = (data: any[], tableRefValue: any) => {
            data.forEach(item => {
                if (item.children && item.children.length > 0) {
                    tableRefValue.toggleRowExpansion(item, true)
                    currentExpandedRowIds.value.add(item.node.id)
                    expandAllRows(item.children, tableRefValue)
                }
            })
        }

        const dataArray = Array.isArray(treeData) ? treeData : treeData.value
        if (tableRef.value && dataArray.length > 0) {
            expandAllRows(dataArray, tableRef.value)
        }

        // 更新缓存
        treeCache.updateExpandedKeys(Array.from(currentExpandedRowIds.value))
    }

    /**
     * 折叠全部
     */
    const collapseAll = async (tableRef: Ref<any>, treeData: Ref<any[]> | any[]) => {
        await nextTick()

        // 清空当前展开集合
        currentExpandedRowIds.value.clear()

        // 递归折叠所有行
        const collapseAllRows = (data: any[], tableRefValue: any) => {
            data.forEach(item => {
                if (item.children && item.children.length > 0) {
                    tableRefValue.toggleRowExpansion(item, false)
                    collapseAllRows(item.children, tableRefValue)
                }
            })
        }

        const dataArray = Array.isArray(treeData) ? treeData : treeData.value
        if (tableRef.value && dataArray.length > 0) {
            collapseAllRows(dataArray, tableRef.value)
        }

        // 更新缓存
        treeCache.updateExpandedKeys([])
    }

    return {
        // 状态
        currentExpandedRowIds,

        // 方法
        handleExpandChange,
        restoreExpandedState,
        expandAll,
        collapseAll,

        // 缓存相关
        treeCache
    }
}