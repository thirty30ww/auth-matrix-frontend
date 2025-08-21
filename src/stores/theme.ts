import { defineStore } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'

// 使用 VueUse 的 useDark 来管理暗色模式
const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
    storageKey: 'theme-dark'
})

const toggleDark = useToggle(isDark)

export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDarkMode: isDark
    }),

    actions: {
        // 主题切换（带动画） - 使用 View Transitions API
        toggleDarkMode(event?: MouseEvent) {
            // 如果没有传入事件（如程序化调用），直接切换
            if (!event) {
                toggleDark()
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
                return
            }

            // 使用 View Transitions API 创建平滑动画
            const transition = document.startViewTransition(async () => {
                toggleDark()
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