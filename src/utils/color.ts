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
            color: customColor,
            description: '您的专属色彩'
        }
    }
    return THEME_COLORS.find(theme => theme.id === themeId) || THEME_COLORS[0]
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

    const baseColor = tinycolor(currentTheme)

    // 使用混合的方式生成自然过渡
    // light9 在亮色模式下接近白色，在暗色模式下接近黑色，但都保留一点点原色
    const white = tinycolor('#ffffff')
    const black = tinycolor('#000000')

    if (isDarkMode) {
        // 暗色模式：light9 应该接近黑色但保留原色
        return {
            primary: baseColor.toHexString(),
            light3: tinycolor.mix(baseColor, black, 15).toHexString(), // 稍微变亮
            light5: tinycolor.mix(baseColor, black, 30).toHexString(), // 轻微变亮
            light7: tinycolor.mix(baseColor, black, 50).toHexString(), // 混合15%黑色
            light8: tinycolor.mix(baseColor, black, 70).toHexString(), // 混合50%黑色
            light9: tinycolor.mix(baseColor, black, 80).toHexString(), // 混合85%黑色，接近黑色但保留原色
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

/**
 * 应用主题色到 CSS 变量
 * @param variants 主题色变体
 */
export function applyThemeColorsToCSS(variants: ThemeColorVariants): void {
    const root = document.documentElement

    // 更新 CSS 变量 - 使用 primary 命名与 CSS 保持一致
    root.style.setProperty('--am-primary', variants.primary)
    root.style.setProperty('--am-primary-light-3', variants.light3)
    root.style.setProperty('--am-primary-light-5', variants.light5)
    root.style.setProperty('--am-primary-light-7', variants.light7)
    root.style.setProperty('--am-primary-light-8', variants.light8)
    root.style.setProperty('--am-primary-light-9', variants.light9)
    root.style.setProperty('--am-primary-dark-2', variants.dark2)
}