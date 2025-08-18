import { defineStore } from 'pinia'
import api from '@/services'
import type { UserVO, UpdateUserDTO } from '@/types/index.ts'

export const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: null as UserVO | null
    }),

    getters: {
        hasUserInfo: (state) => !!state.userInfo
    },

    actions: {
        // 获取用户信息
        async getUserInfo() {
            try {
                this.userInfo = await api.user.getUser()
                return true
            } catch (error) {
                return false
            }
        },

        // 更新用户信息
        async updateUserInfo(userInfo: UpdateUserDTO, showSuccess?: boolean) {
            try {
                await api.user.updateUser(userInfo, showSuccess)

                // 获取更新后的用户信息
                await this.getUserInfo()

                return true
            } catch (error) {
                return false
            }
        },

        // 清除用户信息
        clearUserInfo() {
            this.userInfo = null
        }
    }
});