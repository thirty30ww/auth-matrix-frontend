import {authApi, roleApi, userApi, viewApi} from './api/user.ts';
import {fileApi, settingApi} from "@/services/api/system.ts";

// 统一导出所有API
const api = {
    auth: authApi,
    user: userApi,
    role: roleApi,
    view: viewApi,
    file: fileApi,
    setting: settingApi,
};

export default api;