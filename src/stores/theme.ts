import { defineStore } from 'pinia'
import { userApi } from '@/services/api/user'
import type { Preference } from '@/types'
import { PREFERENCE_FIELDS, DEFAULT_THEME_CONFIG, type LogoPosition } from '@/constant/theme'
import { getThemeConfig, generateThemeColorVariants, applyThemeColorsToCSS } from '@/utils/color.ts'
import { executeThemeTransition } from '@/assets/style/animations/theme-transition.ts'

// 重新导出类型和常量，保持向后兼容
export type { ThemeColor, LogoPosition } from '@/constant/theme'
export { LOGO_POSITIONS, THEME_COLORS } from '@/constant/theme'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        // 主题配置字段
        isDark: DEFAULT_THEME_CONFIG.isDark,
        themeColor: DEFAULT_THEME_CONFIG.themeColor,
        customColor: DEFAULT_THEME_CONFIG.customColor,
        logoPosition: DEFAULT_THEME_CONFIG.logoPosition
    }),

    getters: {
        // 暗色模式状态
        isDarkMode: (state) => state.isDark,

        // 当前主题色
        currentThemeColor: (state) => state.themeColor,

        // 获取当前主题色配置
        getCurrentTheme: (state) => {
            return getThemeConfig(state.themeColor, state.customColor)
        },

        // 获取当前主题色的色调变化（用于生成渐变色系）
        getThemeColorVariants: (state) => {
            return generateThemeColorVariants(
                state.themeColor,
                state.customColor,
                state.isDark
            )
        }
    },

    actions: {
        // 从后端初始化用户偏好设置
        async initializeFromBackend() {
            const preferences = await userApi.getPreferences() || []

            // 处理偏好设置数据
            preferences.forEach((pref: Preference) => {
                switch (pref.field) {
                    case PREFERENCE_FIELDS.THEME_DARK:
                        this.isDark = pref.value === 'true'
                        break
                    case PREFERENCE_FIELDS.THEME_COLOR:
                        this.themeColor = pref.value
                        break
                    case PREFERENCE_FIELDS.CUSTOM_THEME_COLOR:
                        this.customColor = pref.value
                        break
                    case PREFERENCE_FIELDS.LOGO_POSITION:
                        this.logoPosition = pref.value as LogoPosition
                        break
                }
            })

            // 应用主题设置
            this.applyThemeColors()
            this.applyDarkMode()
        },

        // 切换主题色
        setThemeColor(themeId: string) {
            this.themeColor = themeId
            this.applyThemeColors()
            // 异步同步到后端，不阻塞UI
            userApi.savePreferences(PREFERENCE_FIELDS.THEME_COLOR, themeId)
        },

        // 设置自定义颜色
        setCustomColor(color: string) {
            this.customColor = color
            if (this.themeColor === 'custom') {
                this.applyThemeColors()
            }
            // 异步同步到后端，不阻塞UI
            userApi.savePreferences(PREFERENCE_FIELDS.CUSTOM_THEME_COLOR, color)
        },

        // 设置Logo位置
        setLogoPosition(position: LogoPosition) {
            this.logoPosition = position
            // 异步同步到后端，不阻塞UI
            userApi.savePreferences(PREFERENCE_FIELDS.LOGO_POSITION, position)
        },

        // 切换暗色模式
        toggleDarkMode(event?: MouseEvent) {
            executeThemeTransition(() => {
                this.isDark = !this.isDark
                this.applyDarkMode()
                this.applyThemeColors()
                // 异步同步到后端，不阻塞动画
                userApi.savePreferences(PREFERENCE_FIELDS.THEME_DARK, this.isDark.toString())
            }, event)
        },

        // 应用暗色模式到DOM
        applyDarkMode() {
            const html = document.documentElement
            if (this.isDark) {
                html.classList.add('dark')
            } else {
                html.classList.remove('dark')
            }
        },

        // 应用主题色到 CSS 变量
        applyThemeColors() {
            const variants = this.getThemeColorVariants
            applyThemeColorsToCSS(variants)
        },

        // 初始化主题色
        initThemeColors() {
            this.applyThemeColors()
            this.applyDarkMode()
        }
    },

    // 使用 pinia 持久化插件
    persist: {
        storage: localStorage
    }
})