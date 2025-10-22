// 基础请求接口
export interface BaseRequest {
    showError?: boolean; // 是否显示错误信息
    showSuccess?: boolean; // 是否显示成功信息
    params?: any; // GET/DELETE请求参数
    data?: any; // POST/PUT请求数据
}

// 定义响应数据接口
export interface ApiResponse<T = any> {
    code: number;
    data: T;
    message: string;
}

// 分页响应接口
export interface PageResponse<T = any> {
    records: T[];
    total: number;
    size: number;
    current: number;
    pages: number;
}