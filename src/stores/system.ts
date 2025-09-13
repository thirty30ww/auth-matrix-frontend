import { defineStore } from 'pinia'
import api from '@/services'
import { SettingField } from '@/types'

export const useSystemStore = defineStore('system', {
    state: () => ({
        projectTitle: 'Prose Pulse' as string
    }),

    actions: {
        // 获取项目名称
        async fetchProjectTitle() {
            const title = await api.setting.getPublicSetting(SettingField.PROJECT_TITLE)

            this.projectTitle = title || 'Prose Pulse'

            // 更新文档标题
            document.title = this.projectTitle

            return this.projectTitle
        },

        // 设置项目名称（本地状态）
        setProjectTitle(title: string) {
            this.projectTitle = title
            document.title = title
        }
    }
})