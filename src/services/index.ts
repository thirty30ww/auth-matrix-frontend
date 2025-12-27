import {authApi, roleApi, userApi, permissionBkApi, logApi, statisticApi, noticeApi} from './api/user';
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
    statistic: statisticApi,
    notice: noticeApi,
};

export default api;

// 导出所有类型定义
export * from './type';