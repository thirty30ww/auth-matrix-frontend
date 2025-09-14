/**
 * 主题相关常量
 */

// 偏好设置字段常量
export const PREFERENCE_FIELDS = {
    THEME_DARK: 'theme-dark',
    THEME_COLOR: 'theme-color',
    CUSTOM_THEME_COLOR: 'custom-theme-color',
    LOGO_POSITION: 'logo-position',
    // 新增统一主题配置存储key
    THEME_CONFIG: 'theme-config'
} as const

// 统一的主题配置接口
export interface ThemeConfig {
    isDark: boolean
    themeColor: string
    customColor: string
    logoPosition: LogoPosition
}

// 默认主题配置（需要在LOGO_POSITIONS定义后再定义）

// 主题色配置接口
export interface ThemeColor {
    id: string
    name: string
    color: string
}

// 预设主题色配置
export const THEME_COLORS: ThemeColor[] = [
    {
        id: 'stellar-purple',
        name: '星紫幻境',
        color: '#9266f9'
    },
    {
        id: 'ocean-blue',
        name: '海蓝秘境',
        color: '#32a2d4'
    },
    {
        id: 'golden-dawn',
        name: '金黄晨光',
        color: '#faad14'
    },
    {
        id: 'emerald-forest',
        name: '翡翠森林',
        color: '#27AE60'
    },
    {
        id: 'rose-bloom',
        name: '玫瑰花语',
        color: '#E74C3C'
    }
]

// Logo位置选项
export const LOGO_POSITIONS = {
    SIDEBAR: 'sidebar',
    HEADER: 'header'
} as const

export type LogoPosition = typeof LOGO_POSITIONS[keyof typeof LOGO_POSITIONS]

// 默认值
export const DEFAULT_THEME = {
    COLOR: 'stellar-purple',
    CUSTOM_COLOR: '#7B2CBF',
    LOGO_POSITION: LOGO_POSITIONS.SIDEBAR
} as const

// 默认主题配置
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
    isDark: false,
    themeColor: 'stellar-purple',
    customColor: '#7B2CBF',
    logoPosition: LOGO_POSITIONS.SIDEBAR
}