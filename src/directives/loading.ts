/**
 * 表格加载指令 v-table-loading
 * 用法：
 * v-table-loading="isLoading"
 * v-table-loading="{ loading: isLoading, text: '加载中...' }"
 */

import type { Directive, DirectiveBinding } from 'vue'
import {
    LOADING_DELAY,
    LOADING_HEIGHT,
    LOADING_CLASS_NAMES,
    LOADING_TEXT
} from '@/constant'

interface LoadingOptions {
    loading: boolean
    text?: string
    minDuration?: number // 最小显示时长，防止闪烁
}

type LoadingValue = boolean | LoadingOptions

const LOADING_CLASS = LOADING_CLASS_NAMES.CONTAINER
const OVERLAY_CLASS = LOADING_CLASS_NAMES.OVERLAY

// 存储每个元素的加载状态和计时器
const loadingStates = new WeakMap<HTMLElement, {
    isLoading: boolean
    startTime: number
    hideTimer?: number
}>()

// 创建加载遮罩
function createLoadingOverlay(text: string = '加载中...'): HTMLElement {
    const overlay = document.createElement('div')
    overlay.className = OVERLAY_CLASS

    const content = document.createElement('div')
    content.style.cssText = 'display: flex; flex-direction: column; align-items: center;'

    const loading = document.createElement('div')
    loading.className = LOADING_CLASS_NAMES.ANIMATION

    const textEl = document.createElement('div')
    textEl.className = LOADING_CLASS_NAMES.TEXT
    textEl.textContent = text

    content.appendChild(loading)
    content.appendChild(textEl)
    overlay.appendChild(content)

    return overlay
}

// 显示加载状态
function showLoading(el: HTMLElement, text: string) {
    const state = loadingStates.get(el) || { isLoading: false, startTime: 0 }

    // 清除之前的隐藏计时器
    if (state.hideTimer) {
        clearTimeout(state.hideTimer)
        state.hideTimer = undefined
    }

    // 如果已经在加载中，只更新文本
    if (state.isLoading) {
        const textEl = el.querySelector(`.${LOADING_CLASS_NAMES.TEXT}`)
        if (textEl) {
            textEl.textContent = text
        }
        return
    }

    // 记录当前高度，保持容器高度稳定
    const currentHeight = el.offsetHeight
    if (currentHeight > 0) {
        el.style.minHeight = `${currentHeight}px`
    } else {
        // 如果没有内容，设置一个合理的最小高度
        el.style.minHeight = `${LOADING_HEIGHT.DEFAULT_MIN_HEIGHT}px`
    }

    // 记录开始时间和状态
    state.isLoading = true
    state.startTime = Date.now()
    loadingStates.set(el, state)

    // 添加容器类
    el.classList.add(LOADING_CLASS)

    // 移除旧的遮罩（如果存在）
    const existingOverlay = el.querySelector(`.${OVERLAY_CLASS}`)
    if (existingOverlay) {
        existingOverlay.remove()
    }

    // 添加新的遮罩
    const overlay = createLoadingOverlay(text)
    el.appendChild(overlay)
}

// 隐藏加载状态（带防闪烁）
function hideLoading(el: HTMLElement, minDuration: number = LOADING_DELAY.MIN_DURATION) {
    const state = loadingStates.get(el)
    if (!state || !state.isLoading) {
        return
    }

    const elapsed = Date.now() - state.startTime
    const remainingTime = Math.max(0, minDuration - elapsed)

    if (remainingTime > 0) {
        // 需要延迟隐藏，防止闪烁
        state.hideTimer = window.setTimeout(() => {
            doHideLoading(el)
        }, remainingTime)
    } else {
        // 可以立即隐藏
        doHideLoading(el)
    }
}

// 实际执行隐藏操作
function doHideLoading(el: HTMLElement) {
    const state = loadingStates.get(el)
    if (state) {
        state.isLoading = false
        if (state.hideTimer) {
            clearTimeout(state.hideTimer)
            state.hideTimer = undefined
        }
    }

    // 移除容器类
    el.classList.remove(LOADING_CLASS)

    // 移除遮罩
    const overlay = el.querySelector(`.${OVERLAY_CLASS}`)
    if (overlay) {
        overlay.remove()
    }

    // 恢复自动高度，让新内容自然展示
    if (!el.classList.contains(LOADING_CLASS)) {
        el.style.minHeight = ''
    }
}

// 解析指令值
function parseValue(value: LoadingValue): LoadingOptions {
    if (typeof value === 'boolean') {
        return { loading: value, minDuration: LOADING_DELAY.MIN_DURATION }
    }
    return { minDuration: LOADING_DELAY.MIN_DURATION, ...value }
}

// 更新加载状态
function updateLoading(el: HTMLElement, binding: DirectiveBinding<LoadingValue>) {
    const options = parseValue(binding.value)
    const { loading, text = LOADING_TEXT.DEFAULT, minDuration = LOADING_DELAY.MIN_DURATION } = options

    if (loading) {
        showLoading(el, text)
    } else {
        hideLoading(el, minDuration)
    }
}

export const loading: Directive<HTMLElement, LoadingValue> = {
    mounted(el, binding) {
        // 确保元素有相对定位
        const position = getComputedStyle(el).position
        if (position === 'static') {
            el.style.position = 'relative'
        }

        updateLoading(el, binding)
    },

    updated(el, binding) {
        updateLoading(el, binding)
    },

    beforeUnmount(el) {
        // 清理状态和计时器
        const state = loadingStates.get(el)
        if (state?.hideTimer) {
            clearTimeout(state.hideTimer)
        }
        loadingStates.delete(el)
        doHideLoading(el)
    }
}

export default loading