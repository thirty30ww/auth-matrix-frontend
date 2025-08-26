import { defineStore } from 'pinia'
import type { ViewVO } from '@/types'
import { viewApi } from '@/services/api/user'

export const useViewStore = defineStore('view', {
    state: () => ({
        viewTree: [] as ViewVO[], // 用于路由生成的完整页面树
        menuTree: [] as ViewVO[]  // 用于侧边栏显示的菜单树
    }),

    getters: {
        hasViewTree: (state) => state.viewTree.length > 0,
        hasMenuTree: (state) => state.menuTree.length > 0
    },

    actions: {
        // 获取页面树数据
        async getViewTree() {
            const data = await viewApi.getViewTree()
            if (data) {
                this.viewTree = data
            }
            return this.viewTree
        },

        // 获取菜单树数据（用于侧边栏显示）
        async getMenuTree() {
            const data = await viewApi.getMenuTree()
            if (data) {
                this.menuTree = data
            }
            return this.menuTree
        },

        // 清除所有视图数据
        clearViewData() {
            this.viewTree = []
            this.menuTree = []
        }
    }
})