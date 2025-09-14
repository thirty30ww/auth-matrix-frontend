/**
 * 表格加载相关常量
 */

// 延迟时间配置
export const LOADING_DELAY = {
    /** 延迟显示时间，超过此时间才显示loading（毫秒） */
    SHOW_DELAY: 100,
    /** 最小显示时长，防止闪烁（毫秒） */
    MIN_DURATION: 300,
    /** 隐藏动画延迟时间（毫秒） */
    HIDE_DELAY: 300
} as const

// 默认高度配置
export const LOADING_HEIGHT = {
    /** 表格容器最小高度（像素） */
    DEFAULT_MIN_HEIGHT: 300,
    /** 表格容器默认高度（像素） */
    DEFAULT_HEIGHT: 400
} as const

// CSS类名
export const LOADING_CLASS_NAMES = {
    /** 加载容器类名 */
    CONTAINER: 'loading-container',
    /** 加载遮罩类名 */
    OVERLAY: 'loading-overlay',
    /** 加载动画类名 */
    ANIMATION: 'bounce-box-loading',
    /** 加载文本类名 */
    TEXT: 'table-loading-text'
} as const

// 默认文本
export const LOADING_TEXT = {
    /** 默认加载文本 */
    DEFAULT: '加载中...'
} as const