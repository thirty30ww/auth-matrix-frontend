import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useAuthStore, useViewStore } from '@/stores';
import type { ApiResponse, BaseRequest } from '@/types';

// 创建axios实例
const http = axios.create({
    baseURL: '/api', // 使用相对路径，会被代理
    timeout: 10000,   // 请求超时时间
});

// 请求拦截器
http.interceptors.request.use(
    (config) => {
        // 获取token从持久化存储
        const authData = localStorage.getItem('auth');
        let token = '';

        if (authData) {
            const auth = JSON.parse(authData);
            token = auth.accessToken || '';
        } ``

        // 如果有token，添加到请求头
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
http.interceptors.response.use(
    async (response) => {
        // 获取响应数据
        const res = response.data as ApiResponse;
        // 获取自定义配置
        const config = response.config as any;
        // 是否显示错误信息，默认为true
        const showError = config.showError !== false;
        // 是否显示正确信息, 默认为false
        const showSuccess = config.showSuccess === true;

        // 如果请求成功
        if (res.code === 200) {
            // 显示正确信息
            if (showSuccess) {
                ElMessage.success(res.message || '操作成功');
            }
            return res.data; // 直接返回数据部分
        }
        // 如果是401错误（未授权），尝试刷新token
        else if (res.code === 401) {
            const authStore = useAuthStore();

            // 刷新token
            const refreshSuccess = await authStore.refreshAuth();

            // 只有刷新成功时才重新发送原始请求
            if (refreshSuccess) {
                const config = response.config;
                config.headers.Authorization = `Bearer ${authStore.accessToken}`;
                return http(config);
            } else {
                return Promise.reject(new Error(res.message || '登录已过期'));
            }
        // 如果是403错误（权限不足），尝试获取权限
        } else if (res.code === 403) {
            const viewStore = useViewStore();
            await viewStore.getPermissionCodes();
            if (showError) {
                ElMessage.error(res.message || '权限不足');
            }
        } else {
            // 显示错误信息
            if (showError) {
                ElMessage.error(res.message || '服务器错误');
            }
            return Promise.reject(new Error(res.message || '服务器错误'));
        }
    },
    (error) => {
        // 获取自定义配置
        const config = error.config || {};
        // 是否显示错误信息，默认为true
        const showError = config.showError !== false;

        // 显示错误信息
        if (showError) {
            ElMessage.error('服务器错误');
        }
        return Promise.reject(error);
    }
);

// 导出封装后的方法
export default {
    // GET请求
    get<T = any>(url: string, options: BaseRequest = {}) {
        return http.get<any, T>(url, { ...options });
    },

    // POST请求
    post<T = any>(url: string, options: BaseRequest = {}) {
        const { data, ...rest } = options;
        return http.post<any, T>(url, data, { ...rest });
    },

    // PUT请求
    put<T = any>(url: string, options: BaseRequest = {}) {
        const { data, ...rest } = options;
        return http.put<any, T>(url, data, { ...rest });
    },

    // DELETE请求
    delete<T = any>(url: string, options: BaseRequest = {}) {
        return http.delete<any, T>(url, { ...options });
    }
};