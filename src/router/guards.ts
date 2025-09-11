import type { Router } from 'vue-router';
import { useAuthStore, useTabsStore } from '@/stores';
import { HOME } from '@/constant';

// 设置全局前置守卫
export function setupRouterGuards(router: Router) {
    router.beforeEach(async (to, _from, next) => {

        const authStore = useAuthStore();
        const tabsStore = useTabsStore();

        // 检查用户是否已登录
        const isLoggedIn = authStore.userLoggedIn;

        // 检查路由是否需要认证, 默认为true
        const requiresAuth = to.meta.requiresAuth !== false;

        if (requiresAuth && !isLoggedIn) {
            next({ path: '/login' });
        } else if (to.path === '/login' && isLoggedIn) {
            next({ path: HOME.PATH });
        } else if (to.path === '/' && isLoggedIn) {
            next({ path: HOME.PATH });
        } else if (to.meta.hasPermission === false && isLoggedIn) {
            tabsStore.removeTab(to.path);
            next({ path: '/403' });
        } else if (to.matched.length === 0 && isLoggedIn) {
            next({ path: '/404' });
        } else if (to.meta.isValid === false && isLoggedIn) {
            tabsStore.removeTab(to.path);
            next({ path: '/503' });
        } else {
            next();
        }
    });
}