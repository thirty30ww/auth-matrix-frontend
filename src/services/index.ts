import {authApi, roleApi, userApi, permissionApi, logApi} from './api/user.ts';
import {fileApi, settingApi} from "@/services/api/system.ts";

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