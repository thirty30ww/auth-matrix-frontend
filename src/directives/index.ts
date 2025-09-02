/**
 * 全局指令注册
 */

import type { App } from 'vue'
import { loading } from './loading.ts'

export function setupDirectives(app: App) {
    // 注册表格加载指令
    app.directive('table-loading', loading)
}

export { loading }