import {authApi, roleApi, userApi, permissionBkApi, logApi} from './api/user';
import {fileApi, settingApi} from "./api/system";

// 统一导出所有API
const api = {
    auth: authApi,
    user: userApi,
    role: roleApi,
    permission_bk: permissionBkApi,
    file: fileApi,
    setting: settingApi,
    log: logApi,
};

export default api;

// 导出所有类型定义
export * from './type';