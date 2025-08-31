import { createRouter, createWebHistory } from "vue-router";
import routes from './routes';
import { setupRouterGuards } from './guards';

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 设置路由守卫
setupRouterGuards(router);

export default router;