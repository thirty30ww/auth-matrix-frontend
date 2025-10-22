import type { Router } from 'vue-router';
import type { PermissionVO } from '@/services';
import { usePermissionStore } from '@/stores';

// 基础项目的组件映射表（固定）
const baseProjectModules = import.meta.glob('@/views/**/*.vue'); // 基础项目的views

// 当前项目的组件映射表（动态配置）
let currentProjectModules: Record<string, any> = {};

// 配置当前项目的组件映射
export function setCurrentProjectModules(modules: Record<string, any>) {
    currentProjectModules = modules;
    // 重新合并模块，当前项目优先
    Object.assign(viewsModules, baseProjectModules, currentProjectModules);
}

// 合并模块，当前项目优先
const viewsModules = { ...baseProjectModules, ...currentProjectModules };

// 自定义路径格式化函数（可以外部覆盖）
let customPathFormatter: ((component: string) => string) = (component) => `/src/views${component}.vue`;

// 全局路径格式化函数 - 优先查找当前项目的组件
let globalPathFormatter = (component: string) => {
    // 遍历当前项目模块，查找匹配的组件
    for (const modulePath of Object.keys(currentProjectModules)) {
        if (modulePath.endsWith(`${component}.vue`)) {
            return modulePath;
        }
    }

    // 当前项目没有，使用自定义格式化函数（如果有的话）来覆盖基础路径
    // 没有自定义函数，回退到默认基础项目路径
    return customPathFormatter(component);
};

let routesLoaded = false;
let routesLoading = false;
let loadingPromise: Promise<boolean> | null = null;

// 配置路径格式化函数
export function setPathFormatter(formatter: (component: string) => string) {
    customPathFormatter = formatter;
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
                isValid: item.node.isValid,
                componentSource: currentProjectModules[componentPath] ? 'current' : 'base' // 标记组件来源
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