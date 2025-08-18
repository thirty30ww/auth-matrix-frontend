import {defineStore} from 'pinia'
import api from '@/services'
import router from '@/router'
import {useUserStore} from "@/stores/user.ts";
import {useTabsStore} from "@/stores/tabs.ts";

// 使用函数形式延迟获取store
const getUserStore = () => useUserStore();
const getTabsStore = () => useTabsStore();

// 全局刷新状态管理
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: '',
        refreshToken: '',
    }),

    getters: {
        // 获取用户是否已登录
        userLoggedIn: (state) => !!state.accessToken
    },

    actions: {
        // 设置用户token
        setAuth(data: { accessToken: string, refreshToken: string }) {
            this.accessToken = data.accessToken
            this.refreshToken = data.refreshToken
        },

        // 用户登录
        async login(username: string, password: string) {
            try {
                const result = await api.auth.login(username, password)
                this.setAuth({
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken
                })
                // 登录成功后获取用户信息
                await getUserStore().getUserInfo();
                return true
            } catch (error) {
                return false
            }
        },

        // 刷新Token
        async refreshAuth() {
            // 如果已经在刷新中，等待当前刷新完成
            if (isRefreshing && refreshPromise) {
                return await refreshPromise;
            }

            // 设置刷新状态
            isRefreshing = true;

            // 创建刷新 Promise
            refreshPromise = this._performRefresh();

            try {
                return await refreshPromise;
            } finally {
                // 刷新完成，重置状态
                isRefreshing = false;
                refreshPromise = null;
            }
        },

        // 执行实际的刷新操作
        async _performRefresh() {
            try {
                const result = await api.auth.refresh(this.refreshToken)
                this.setAuth({
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken
                })
                return true
            } catch (error) {
                // 刷新失败，清除认证信息并退出登录
                await this.logout()
                return false
            }
        },

        // 退出登录
        async logout(showSuccess?: boolean) {
            try {
                await api.auth.logout(this.refreshToken, showSuccess)
            } finally {
                // 无论API调用成功与否，都清除本地认证信息
                this.clearAuth()
                // 清除用户信息
                getUserStore().clearUserInfo()
                // 清空所有标签页
                getTabsStore().clearAllTabs()
                // 跳转到登录页
                await router.push('/login')
            }
        },

        // 清除认证信息
        clearAuth() {
            this.accessToken = ''
            this.refreshToken = ''
            // 重置全局刷新状态
            isRefreshing = false
            refreshPromise = null
        }
    },

    persist: {
        storage: localStorage
    }
});