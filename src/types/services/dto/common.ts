// 基础列表查询接口
import {SortDirection} from "@/types";

// 基础列表查询接口
export interface BaseListDTO {
    sort?: SortDTO
    filterTime?: FilterTimeDTO;
}

// 时间范围筛选接口
export interface FilterTimeDTO {
    field?: string;
    startTime?: string;
    endTime?: string;
}

// 排序请求接口
export interface SortDTO {
    field: string;
    direction: SortDirection;
}

// 分页查询接口
export interface PageQueryDTO<T = any> {
    pageNum?: number; // 页码，默认为1
    pageSize?: number; // 每页大小，默认为10
    params?: T; // 查询参数
}