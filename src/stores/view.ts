import { defineStore } from 'pinia'
import type { ViewVO } from '@/types'
import { viewApi } from '@/services/api/user'

export const useViewStore = defineStore('view', {
    state: () => ({
        viewTree: [] as ViewVO[]
    }),

    getters: {
        hasViewTree: (state) => state.viewTree.length > 0
    },

    actions: {
        // 获取页面树数据
        async getViewTree(onlyMenu?: boolean) {
            const data = await viewApi.getViewTree(onlyMenu)
            if (data) {
                this.viewTree = data
            }
            return this.viewTree
        }
    }
})