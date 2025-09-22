import { defineStore } from 'pinia'
import type { TabItem } from "@/types";
import { HOME } from '@/constant';
import { usePageCacheStore } from './pageCache';

export const useTabsStore = defineStore('tabs', {
    state: () => ({
        tabs: [] as TabItem[],
        activeTab: ''
    }),

    getters: {
        getTabByPath: (state) => (path: string) => {
            return state.tabs.find(tab => tab.path === path)
        },
        hasTab: (state) => (path: string) => {
            return state.tabs.some(tab => tab.path === path)
        }
    },

    actions: {
        // 初始化 tabs（确保首页标签存在）
        initializeTabs() {
            this.ensureHomeTab()
        },

        // 确保首页标签存在
        ensureHomeTab() {
            const homeTab: TabItem = {
                path: HOME.PATH,
                title: HOME.TITLE,
                icon: HOME.ICON
            }

            if (!this.hasTab(HOME.PATH)) {
                this.tabs.unshift(homeTab)
            }
        },

        // 添加标签页
        addTab(tab: TabItem) {
            if (!this.hasTab(tab.path)) {
                this.tabs.push(tab)
            }
            this.setActiveTab(tab.path)
        },

        // 移除标签页
        removeTab(path: string): string | null {
            // 不允许关闭首页
            if (path === HOME.PATH) {
                return null
            }

            const targetIndex = this.tabs.findIndex(tab => tab.path === path)
            if (targetIndex === -1) {
                return null
            }

            // 如果关闭的是当前激活的标签，需要确定下一个激活的标签
            let nextActivePath: string | null = null
            if (path === this.activeTab) {
                // 如果关闭的是最后一个标签，跳转到前一个标签
                // 否则跳转到后一个标签
                if (targetIndex === this.tabs.length - 1) {
                    nextActivePath = this.tabs[targetIndex - 1]?.path || HOME.PATH
                } else {
                    nextActivePath = this.tabs[targetIndex + 1]?.path || HOME.PATH
                }
            }

            // 移除标签
            this.tabs.splice(targetIndex, 1)

            // 清除对应页面的缓存
            const pageCacheStore = usePageCacheStore()
            pageCacheStore.clearPageCache(path)

            return nextActivePath
        },

        // 设置激活标签
        setActiveTab(path: string) {
            this.activeTab = path
        },

        // 清空所有标签（保留首页）
        clearTabs() {
            // 获取要清除缓存的页面路径（除了首页）
            const pathsToCleanCache = this.tabs
                .filter(tab => tab.path !== HOME.PATH)
                .map(tab => tab.path)

            this.tabs = []
            this.activeTab = HOME.PATH
            this.ensureHomeTab()
            this.setActiveTab(HOME.PATH)

            // 清除对应页面的缓存
            if (pathsToCleanCache.length > 0) {
                const pageCacheStore = usePageCacheStore()
                pageCacheStore.clearMultiplePageCache(pathsToCleanCache)
            }
        },

        // 清空所有标签（不保留首页）
        clearAllTabs() {
            // 获取所有要清除缓存的页面路径
            const pathsToCleanCache = this.tabs.map(tab => tab.path)

            this.tabs = []
            this.activeTab = ''

            // 清除所有页面的缓存
            if (pathsToCleanCache.length > 0) {
                const pageCacheStore = usePageCacheStore()
                pageCacheStore.clearMultiplePageCache(pathsToCleanCache)
            }
        }
    }
})