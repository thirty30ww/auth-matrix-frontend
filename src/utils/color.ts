import tinycolor from 'tinycolor2'
import type { ThemeColor } from '@/constant/theme'
import { THEME_COLORS, DEFAULT_THEME } from '@/constant/theme'

/**
 * 颜色变体接口
 */
export interface ThemeColorVariants {
    primary: string
    light3: string
    light5: string
    light7: string
    light8: string
    light9: string
    dark2: string
}

/**
 * 获取主题色配置
 * @param themeId 主题ID
 * @param customColor 自定义颜色
 * @returns 主题色配置
 */
export function getThemeConfig(themeId: string, customColor: string): ThemeColor {
    if (themeId === 'custom') {
        return {
            id: 'custom',
            name: '自定义色彩',
            color: customColor
        }
    }
    return THEME_COLORS.find(theme => theme.id === themeId) || THEME_COLORS[0]
}

/**
 * 生成颜色变体的核心逻辑
 * @param color 基础颜色
 * @param isDarkMode 是否为暗色模式
 * @returns 颜色变体
 */
function generateColorVariants(color: string, isDarkMode: boolean): ThemeColorVariants {
    const baseColor = tinycolor(color)
    const white = tinycolor('#ffffff')
    const black = tinycolor('#000000')

    if (isDarkMode) {
        return {
            primary: baseColor.toHexString(),
            light3: tinycolor.mix(baseColor, black, 15).toHexString(),
            light5: tinycolor.mix(baseColor, black, 30).toHexString(),
            light7: tinycolor.mix(baseColor, black, 50).toHexString(),
            light8: tinycolor.mix(baseColor, black, 70).toHexString(),
            light9: tinycolor.mix(baseColor, black, 80).toHexString(),
            dark2: baseColor.darken(5).toHexString()
        }
    } else {
        return {
            primary: baseColor.toHexString(),
            light3: tinycolor.mix(baseColor, white, 15).toHexString(),
            light5: tinycolor.mix(baseColor, white, 30).toHexString(),
            light7: tinycolor.mix(baseColor, white, 50).toHexString(),
            light8: tinycolor.mix(baseColor, white, 70).toHexString(),
            light9: tinycolor.mix(baseColor, white, 85).toHexString(),
            dark2: baseColor.darken(5).toHexString()
        }
    }
}

/**
 * 生成主题色的色调变化（用于生成渐变色系）
 * @param themeId 主题ID
 * @param customColor 自定义颜色
 * @param isDarkMode 是否为暗色模式
 * @returns 主题色变体
 */
export function generateThemeColorVariants(
    themeId: string,
    customColor: string,
    isDarkMode: boolean
): ThemeColorVariants {
    const currentTheme = themeId === 'custom'
        ? customColor
        : (THEME_COLORS.find(theme => theme.id === themeId)?.color || DEFAULT_THEME.CUSTOM_COLOR)

    return generateColorVariants(currentTheme, isDarkMode)
}

/**
 * 设置 CSS 变量的辅助函数
 * @param prefix 变量前缀
 * @param variants 颜色变体
 */
function setCSSVariants(prefix: string, variants: ThemeColorVariants): void {
    const root = document.documentElement
    root.style.setProperty(`${prefix}`, variants.primary)
    root.style.setProperty(`${prefix}-light-3`, variants.light3)
    root.style.setProperty(`${prefix}-light-5`, variants.light5)
    root.style.setProperty(`${prefix}-light-7`, variants.light7)
    root.style.setProperty(`${prefix}-light-8`, variants.light8)
    root.style.setProperty(`${prefix}-light-9`, variants.light9)
    root.style.setProperty(`${prefix}-dark-2`, variants.dark2)
}

/**
 * 应用主题色到 CSS 变量
 * @param variants 主题色变体
 */
export function applyThemeColorsToCSS(variants: ThemeColorVariants): void {
    setCSSVariants('--am-primary', variants)
}

/**
 * 为所有预设主题色生成 CSS 变量
 * @param isDarkMode 是否为暗色模式
 */
export function applyAllThemeColorsToCSS(isDarkMode: boolean): void {
    THEME_COLORS.forEach(theme => {
        const variants = generateColorVariants(theme.color, isDarkMode)
        setCSSVariants(`--am-${theme.id}`, variants)
    })
}