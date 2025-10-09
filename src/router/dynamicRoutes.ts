import type { Router } from 'vue-router';
import type { PermissionVO } from '@/types';
import { usePermissionStore } from '@/stores';

// 组件映射表
const viewsModules = import.meta.glob('@/views/**/*.vue');
// 全局路径格式化函数
let globalPathFormatter = (component: string) => `/src/views${component}.vue`;

let routesLoaded = false;
let routesLoading = false;
let loadingPromise: Promise<boolean> | null = null;

// 配置路径格式化函数
export function setPathFormatter(formatter: (component: string) => string) {
    globalPathFormatter = formatter;
}

// 确保路由已加载（如果未加载则加载）
export async function ensureRoutesLoaded(router: Router) {
    // 如果已经加载过，直接返回
    if (routesLoaded) {
        return true;
    }

    // 如果正在加载中，等待当前加载完成
    if (routesLoading && loadingPromise) {
        return await loadingPromise;
    }

    // 开始加载
    routesLoading = true;
    loadingPromise = loadRoutesFromBackend(router);

    try {
        const success = await loadingPromise;
        if (success) {
            routesLoaded = true;
        }
        return success;
    } catch (error) {
        console.error('加载动态路由失败：', error);
        return false;
    } finally {
        routesLoading = false;
        loadingPromise = null;
    }
}

// 重新加载路由（强制重新从后端获取）
export async function reloadRoutes(router: Router): Promise<boolean> {
    // 先清除已加载的动态路由
    clearDynamicRoutes(router);

    // 重置状态
    routesLoaded = false;
    routesLoading = false;
    loadingPromise = null;

    // 重新加载
    return await ensureRoutesLoaded(router);
}

// 重置路由加载状态（用于登出时）
export function resetRoutesLoadedState() {
    routesLoaded = false;
    routesLoading = false;
    loadingPromise = null;
}

// 检查路由是否已加载
export function isRoutesLoaded(): boolean {
    return routesLoaded;
}

// 清除已加载的动态路由
function clearDynamicRoutes(router: Router) {
    // 获取MainLayout路由的所有子路由
    const mainLayoutRoute = router.getRoutes().find(route => route.name === 'MainLayout');
    if (mainLayoutRoute && mainLayoutRoute.children) {
        // 移除所有动态添加的子路由
        mainLayoutRoute.children.forEach(childRoute => {
            if (childRoute.name) {
                router.removeRoute(childRoute.name);
            }
        });
    }
}


// 从后端加载路由
async function loadRoutesFromBackend(router: Router) {
    const permissionStore = usePermissionStore();
    const viewNodes = await permissionStore.getViewTree();

    if (viewNodes && viewNodes.length > 0) {
        // 将后端返回的路由数据转换为路由配置
        generateAndAddRoutes(viewNodes, router);
        return true;
    }
    return false;
}

/**
 * 生成并添加路由
 * @param viewNodes 视图节点列表
 * @param router 路由实例
 */
function generateAndAddRoutes(viewNodes: PermissionVO[], router: Router) {
    viewNodes.forEach(item => {
        // 创建路由对象
        const componentPath = globalPathFormatter(item.node.component);

        const route = {
            path: item.node.path,
            name: item.node.name,
            component: viewsModules[componentPath],
            meta: {
                icon: item.node.icon,
                title: item.node.name, // 使用name作为标签页标题
                hasPermission: item.hasPermission, // 保存权限信息
                isValid: item.node.isValid
            }
        };

        // 添加到主布局路由的子路由中
        router.addRoute('MainLayout', route);

        // 处理子路由
        if (item.children && item.children.length > 0) {
            generateAndAddRoutes(item.children, router);
        }
    });
}