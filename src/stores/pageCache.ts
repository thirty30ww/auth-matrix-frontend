import { defineStore } from 'pinia'

// 通用的页面缓存数据结构
export interface PageCacheData {
    [key: string]: any
}

// 页面缓存状态
interface PageCacheState {
    // 以页面路径为key，存储页面的缓存数据
    cacheMap: Record<string, PageCacheData>
}

export const usePageCacheStore = defineStore('pageCache', {
    state: (): PageCacheState => ({
        cacheMap: {}
    }),

    getters: {
        // 获取指定页面的缓存数据
        getPageCache: (state) => (path: string): PageCacheData | null => {
            return state.cacheMap[path] || null
        },

        // 检查页面是否有缓存
        hasPageCache: (state) => (path: string): boolean => {
            return !!state.cacheMap[path]
        }
    },

    actions: {
        // 设置页面缓存数据
        setPageCache(path: string, data: PageCacheData) {
            this.cacheMap[path] = { ...data }
        },

        // 更新页面缓存数据（合并更新）
        updatePageCache(path: string, data: Partial<PageCacheData>) {
            if (this.cacheMap[path]) {
                this.cacheMap[path] = { ...this.cacheMap[path], ...data }
            } else {
                this.cacheMap[path] = { ...data }
            }
        },

        // 清除指定页面的缓存
        clearPageCache(path: string) {
            delete this.cacheMap[path]
        },

        // 清除多个页面的缓存
        clearMultiplePageCache(paths: string[]) {
            paths.forEach(path => {
                delete this.cacheMap[path]
            })
        },

        // 清除所有页面缓存
        clearAllPageCache() {
            this.cacheMap = {}
        },

        // 获取所有已缓存的页面路径
        getCachedPagePaths(): string[] {
            return Object.keys(this.cacheMap)
        }
    },

    // 使用 sessionStorage 存储，刷新后会清空
    persist: {
        storage: sessionStorage,
        key: 'page-cache'
    }
})