/**
 * 全局指令注册
 */

import type { App } from 'vue'
import { loading } from './loading.ts'
import { permission } from './permission.ts'

export function setupDirectives(app: App) {
    // 注册表格加载指令
    app.directive('table-loading', loading)

    // 注册权限指令
    app.directive('permission', permission)
}

export { loading, permission }