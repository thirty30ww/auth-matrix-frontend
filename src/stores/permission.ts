import { defineStore } from 'pinia'
import type { PermissionVO } from '@/services'
import api from "@/services";

export const usePermissionStore = defineStore('view', {
    state: () => ({
        viewTree: [] as PermissionVO[],           // 用于路由生成的完整页面树
        menuTree: [] as PermissionVO[],           // 用于侧边栏显示的菜单树
        permissionCodes: [] as string[],    // 用户权限码列表
    }),

    getters: {
        hasViewTree: (state) => state.viewTree.length > 0,
        hasMenuTree: (state) => state.menuTree.length > 0,
        hasPermissionCodes: (state) => state.permissionCodes.length > 0,

        // 检查是否有指定权限
        hasPermission: (state) => (code: string) => {
            return state.permissionCodes.includes(code)
        },

        // 检查是否有任意一个权限
        hasAnyPermission: (state) => (codes: string[]) => {
            return codes.some(code => state.permissionCodes.includes(code))
        },

        // 检查是否拥有所有权限
        hasAllPermissions: (state) => (codes: string[]) => {
            return codes.every(code => state.permissionCodes.includes(code))
        }
    },

    actions: {
        // 获取页面树数据
        async getViewTree() {
            const data = await api.permission.getViewTree()
            if (data) {
                this.viewTree = data
            }
            return this.viewTree
        },

        // 获取菜单树数据（用于侧边栏显示）
        async getMenuTree() {
            const data = await api.permission.getMenuTree()
            if (data) {
                this.menuTree = data
            }
            return this.menuTree
        },

        // 获取用户权限码
        async getPermissionCodes() {
            const data = await api.permission.getPermissionCode()
            if (data) {
                this.permissionCodes = data
            }
            return this.permissionCodes
        },

        // 删除视图
        async deleteView(viewId: number) {
            return await api.permission.deletePermission(viewId)
        },

        // 清除所有视图数据
        clearViewData() {
            this.viewTree = []
            this.menuTree = []
            this.permissionCodes = []
        }
    }
})