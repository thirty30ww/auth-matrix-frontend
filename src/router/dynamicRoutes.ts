import type { Router } from 'vue-router';
import type { ViewVO } from '@/types';
import { useViewStore } from '@/stores';

// 组件映射表
const viewsModules = import.meta.glob('@/views/**/*.vue');

// 从后端加载路由
export async function loadRoutesFromBackend(router: Router) {
    const viewStore = useViewStore();
    const viewNodes = await viewStore.getViewTree();

    if (viewNodes && viewNodes.length > 0) {
        // 将后端返回的路由数据转换为路由配置
        generateAndAddRoutes(viewNodes, router);
        return true;
    }
    return false;
}

// 生成并添加路由
function generateAndAddRoutes(viewNodes: ViewVO[], router: Router) {
    viewNodes.forEach(item => {
        // 创建路由对象
        const componentPath = `/src/views${item.node.component}.vue`;

        const route = {
            path: item.node.path,
            name: item.node.name,
            component: viewsModules[componentPath],
            meta: {
                icon: item.node.icon,
                title: item.node.name // 使用name作为标签页标题
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