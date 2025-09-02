import { nextTick } from 'vue'

/**
 * 树形表格展开/折叠工具函数
 */

/**
 * 递归操作树形表格的所有行
 * @param data 树形数据
 * @param tableRef 表格引用
 * @param expanded 是否展开，true为展开，false为折叠
 */
const toggleAllRows = (data: any[], tableRef: any, expanded: boolean) => {
    data.forEach(item => {
        if (item.children && item.children.length > 0) {
            tableRef.toggleRowExpansion(item, expanded)
            toggleAllRows(item.children, tableRef, expanded)
        }
    })
}

/**
 * 展开树形表格的所有行
 * @param tableRef 表格引用
 * @param data 树形数据
 */
export const expandAllTableRows = async (tableRef: any, data: any[]) => {
    await nextTick()

    if (tableRef && data.length > 0) {
        toggleAllRows(data, tableRef, true)
    }
}

/**
 * 折叠树形表格的所有行
 * @param tableRef 表格引用
 * @param data 树形数据
 */
export const collapseAllTableRows = async (tableRef: any, data: any[]) => {
    await nextTick()

    if (tableRef && data.length > 0) {
        toggleAllRows(data, tableRef, false)
    }
}

/**
 * 创建树形表格展开/折叠钩子函数
 * @param tableRef 表格引用
 * @param getData 获取数据的函数
 * @returns 包含展开和折叠方法的对象
 */
export const useTableExpandCollapse = (tableRef: any, getData: () => any[]) => {
    const expandAll = async () => {
        await expandAllTableRows(tableRef.value, getData())
    }

    const collapseAll = async () => {
        await collapseAllTableRows(tableRef.value, getData())
    }

    return {
        expandAll,
        collapseAll
    }
}