import type { Router } from 'vue-router';
import { loadRoutesFromBackend } from './dynamicRoutes';
import { useAuthStore } from '@/stores/auth';

// 设置全局前置守卫
export function setupRouterGuards(router: Router) {
    router.beforeEach(async (to, _from, next) => {
        // 检查路由是否需要认证, 默认为true
        const requiresAuth = to.meta.requiresAuth !== false;

        // 检查用户是否已登录
        const authStore = useAuthStore();
        const isLoggedIn = authStore.userLoggedIn;

        if (requiresAuth && !isLoggedIn) {
            // 需要登录但未登录，重定向到登录页
            next({ path: '/login' });
        } else if (to.path === '/login' && isLoggedIn) {
            // 已登录用户尝试访问登录页，重定向到首页
            next({ path: '/home' });
        } else if (isLoggedIn && to.matched.length === 0) {
            // 如果已登录但没有匹配到路由，可能是路由还未加载
            await loadRoutesFromBackend(router);
            // 重新导航到目标路由
            next({ ...to, replace: true });
        } else {
            // 其他情况正常导航
            next();
        }
    });
}