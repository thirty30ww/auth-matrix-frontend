import {authApi, roleApi, userApi, permissionApi, logApi} from './api/user.ts';
import {fileApi, settingApi} from "./api/system.ts";

// 统一导出所有API
const api = {
    auth: authApi,
    user: userApi,
    role: roleApi,
    permission: permissionApi,
    file: fileApi,
    setting: settingApi,
    log: logApi,
};

export default api;

// 导出所有类型定义
export * from './type';