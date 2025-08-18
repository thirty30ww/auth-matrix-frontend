import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDarkMode: false
    }),

    getters: {
        // 这里可以添加getters如果需要
    },

    actions: {
        // 切换暗黑模式
        toggleDarkMode() {
            this.isDarkMode = !this.isDarkMode
            this.applyTheme()
        },

        // 应用主题到 DOM
        applyTheme() {
            if (this.isDarkMode) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        },

        // 初始化主题（从持久化数据恢复后调用）
        initializeTheme() {
            this.applyTheme()
        }
    },

    persist: {
        storage: localStorage
    }
})