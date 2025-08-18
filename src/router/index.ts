import { createRouter, createWebHistory } from "vue-router";
import routes from './routes';
import { setupRouterGuards } from './guards';
import { loadRoutesFromBackend as loadRoutes } from './dynamicRoutes';

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 设置路由守卫
setupRouterGuards(router);

// 导出加载路由的函数
export const loadRoutesFromBackend = () => loadRoutes(router);

export default router;