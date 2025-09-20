/**
 * 权限指令 v-permission
 * 用法：
 * v-permission="'user:add'"                                    // 单个权限
 * v-permission="['user:add', 'user:edit']"                     // 多个权限（默认any模式）
 * v-permission="{ codes: ['user:add', 'user:edit'], mode: 'all' }" // 指定检测模式
 */

import type { Directive, DirectiveBinding } from 'vue'
import { usePermissionStore } from '@/stores/permission.ts'

interface PermissionConfig {
    codes: string | string[]
    mode?: 'any' | 'all'  // any: 有任意一个权限即可, all: 需要所有权限
}

type PermissionValue = string | string[] | PermissionConfig

// 解析指令值
function parseValue(value: PermissionValue): PermissionConfig {
    if (typeof value === 'string') {
        return { codes: value, mode: 'any' }
    }
    if (Array.isArray(value)) {
        return { codes: value, mode: 'any' }  // 数组默认使用 any 模式
    }
    return { mode: 'any', ...value }
}

// 检查权限
function checkPermission(config: PermissionConfig): boolean {
    const viewStore = usePermissionStore()
    const { codes, mode = 'any' } = config

    if (typeof codes === 'string') {
        return viewStore.hasPermission(codes)
    }

    return mode === 'any'
        ? viewStore.hasAnyPermission(codes)
        : viewStore.hasAllPermissions(codes)
}

// 更新元素显示状态
function updateElementDisplay(el: HTMLElement, binding: DirectiveBinding<PermissionValue>) {
    const config = parseValue(binding.value)
    const hasPermission = checkPermission(config)

    if (hasPermission) {
        // 有权限，显示元素
        el.style.display = ''
        el.removeAttribute('disabled')
    } else {
        // 无权限，隐藏元素
        el.style.display = 'none'
    }
}

export const permission: Directive<HTMLElement, PermissionValue> = {
    mounted(el, binding) {
        updateElementDisplay(el, binding)
    },

    updated(el, binding) {
        updateElementDisplay(el, binding)
    }
}
