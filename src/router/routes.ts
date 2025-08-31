import type { RouteRecordRaw } from "vue-router";

// 只保留登录路由，其他路由从后端加载
const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        name: 'MainLayout',
        component: () => import('@/layouts/MainLayout.vue')
    }
]

export default routes;