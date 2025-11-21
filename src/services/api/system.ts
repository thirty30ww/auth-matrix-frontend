import http from "../http";
import { SettingField } from "@/services";
import type { SettingVO } from "@/services/type/vo/system";
import type { SettingDTO } from "@/services/type/dto/system";

/**
 * 文件上传 API
 */
export const fileApi = {
    /**
     * 上传文件
     * @param file 要上传的文件
     */
    uploadImage(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return http.post<string>('/file/upload/image', { data: formData, showSuccess: true });
    }
}

/**
 * 系统设置 API
 */
export const settingApi = {
    /**
     * 获取系统设置 (类型映射)
     */
    getSetting(settingField: SettingField) {
        return http.get<any>('/setting/get', { params: { settingField } });
    },

    /**
     * 获取公共系统设置 (类型映射)
     */
    getPublicSetting(settingField: SettingField) {
        return http.get<any>('/setting/public/get', { params: { settingField } });
    },

    /**
     * 获取系统设置值对象列表
     */
    getSettingVOS() {
        return http.get<SettingVO[]>('/setting/values');
    },

    /**
     * 修改系统设置
     * @param settingDTOS 系统设置值对象
     */
    modifySettings(settingDTOS: SettingDTO[]) {
        return http.post<any>('/setting/modify', { data: settingDTOS, showSuccess: true });
    }
}