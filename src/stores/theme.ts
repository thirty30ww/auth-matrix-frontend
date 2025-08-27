import { defineStore } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'
import { ref } from 'vue'
import tinycolor from 'tinycolor2'

// 使用 VueUse 的 useDark 来管理暗色模式
const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
    storageKey: 'theme-dark'
})

const toggleDark = useToggle(isDark)

// 主题色配置
export interface ThemeColor {
    id: string
    name: string
    color: string
    description: string
}

export const themeColors: ThemeColor[] = [
    {
        id: 'stellar-purple',
        name: '星紫幻境',
        color: '#7B2CBF',
        description: '神秘而优雅的紫色基调'
    },
    {
        id: 'ocean-blue',
        name: '海蓝秘境',
        color: '#2E86C1',
        description: '深邃如海的蓝色世界'
    },
    {
        id: 'golden-dawn',
        name: '金黄晨光',
        color: '#F39C12',
        description: '温暖如阳光的金色调'
    },
    {
        id: 'emerald-forest',
        name: '翡翠森林',
        color: '#27AE60',
        description: '清新自然的绿色气息'
    },
    {
        id: 'rose-bloom',
        name: '玫瑰花语',
        color: '#E74C3C',
        description: '浪漫温馨的粉红色彩'
    }
]

// 当前选中的主题色
const currentThemeColor = ref<string>(
    localStorage.getItem('theme-color') || 'stellar-purple'
)

// 自定义颜色
const customColor = ref<string>(
    localStorage.getItem('custom-theme-color') || '#7B2CBF'
)

export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDarkMode: isDark,
        currentThemeColor: currentThemeColor,
        customColor: customColor,
        themeColors: themeColors
    }),

    getters: {
        // 获取当前主题色配置
        getCurrentTheme: (state) => {
            if (state.currentThemeColor === 'custom') {
                return {
                    id: 'custom',
                    name: '自定义色彩',
                    color: state.customColor,
                    description: '您的专属色彩'
                }
            }
            return state.themeColors.find(theme => theme.id === state.currentThemeColor) || state.themeColors[0]
        },

        // 获取当前主题色的色调变化（用于生成渐变色系）
        getThemeColorVariants: (state) => {
            const currentTheme = state.currentThemeColor === 'custom'
                ? state.customColor
                : (state.themeColors.find(theme => theme.id === state.currentThemeColor)?.color || '#7B2CBF')

            const baseColor = tinycolor(currentTheme)
            const isDarkMode = state.isDarkMode

            // 使用混合的方式生成自然过渡
            // light9 在亮色模式下接近白色，在暗色模式下接近黑色，但都保留一点点原色
            const white = tinycolor('#ffffff')
            const black = tinycolor('#000000')

            if (isDarkMode) {
                // 暗色模式：light9 应该接近黑色但保留原色
                return {
                    primary: baseColor.toHexString(),
                    light3: baseColor.lighten(8).toHexString(), // 稍微变亮
                    light5: baseColor.lighten(5).toHexString(), // 轻微变亮
                    light7: tinycolor.mix(baseColor, black, 15).toHexString(), // 混合15%黑色
                    light8: tinycolor.mix(baseColor, black, 50).toHexString(), // 混合50%黑色
                    light9: tinycolor.mix(baseColor, black, 85).toHexString(), // 混合85%黑色，接近黑色但保留原色
                    dark2: baseColor.darken(5).toHexString()
                }
            } else {
                // 亮色模式：light9 接近白色但保留原色
                return {
                    primary: baseColor.toHexString(),
                    light3: tinycolor.mix(baseColor, white, 15).toHexString(), // 混合15%白色
                    light5: tinycolor.mix(baseColor, white, 30).toHexString(), // 混合30%白色
                    light7: tinycolor.mix(baseColor, white, 50).toHexString(), // 混合50%白色
                    light8: tinycolor.mix(baseColor, white, 70).toHexString(), // 混合70%白色
                    light9: tinycolor.mix(baseColor, white, 85).toHexString(), // 混合85%白色，接近白色但保留原色
                    dark2: baseColor.darken(5).toHexString()
                }
            }
        }
    },

    actions: {
        // 切换主题色
        setThemeColor(themeId: string) {
            this.currentThemeColor = themeId
            localStorage.setItem('theme-color', themeId)
            this.applyThemeColors()
        },

        // 设置自定义颜色
        setCustomColor(color: string) {
            this.customColor = color
            localStorage.setItem('custom-theme-color', color)
            if (this.currentThemeColor === 'custom') {
                this.applyThemeColors()
            }
        },

        // 应用主题色到 CSS 变量
        applyThemeColors() {
            const variants = this.getThemeColorVariants
            const root = document.documentElement

            // 更新 CSS 变量 - 使用 primary 命名与 CSS 保持一致
            root.style.setProperty('--pp-primary', variants.primary)
            root.style.setProperty('--pp-primary-light-3', variants.light3)
            root.style.setProperty('--pp-primary-light-5', variants.light5)
            root.style.setProperty('--pp-primary-light-7', variants.light7)
            root.style.setProperty('--pp-primary-light-8', variants.light8)
            root.style.setProperty('--pp-primary-light-9', variants.light9)
            root.style.setProperty('--pp-primary-dark-2', variants.dark2)
        },

        // 初始化主题色
        initThemeColors() {
            this.applyThemeColors()
        },

        // 主题切换（带动画） - 使用 View Transitions API
        toggleDarkMode(event?: MouseEvent) {
            // 如果没有传入事件（如程序化调用），直接切换
            if (!event) {
                toggleDark()
                this.applyThemeColors()
                return
            }

            const x = event.clientX
            const y = event.clientY

            // 计算从点击位置到屏幕边缘的最大距离
            const endRadius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
            )

            // 检查浏览器是否支持 View Transitions API
            if (!document.startViewTransition) {
                toggleDark()
                this.applyThemeColors()
                return
            }

            // 使用 View Transitions API 创建平滑动画
            const transition = document.startViewTransition(async () => {
                toggleDark()
                // 切换亮暗模式后，重新应用主题色以适配新模式
                this.applyThemeColors()
            })

            // 当转换准备就绪时，添加圆形扩散动画
            transition.ready.then(() => {
                const clipPath = [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`,
                ]

                document.documentElement.animate(
                    {
                        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
                    },
                    {
                        duration: 500,
                        easing: 'ease-out',
                        pseudoElement: isDark.value
                            ? '::view-transition-old(root)'
                            : '::view-transition-new(root)',
                    }
                )
            })
        }
    }
})