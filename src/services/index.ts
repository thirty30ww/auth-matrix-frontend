import {authApi, userApi, viewApi} from './api/user.ts';
import {fileApi} from "@/services/api/common.ts";

// 统一导出所有API
const api = {
    auth: authApi,
    user: userApi,
    view: viewApi,
    file: fileApi,
};

export default api;