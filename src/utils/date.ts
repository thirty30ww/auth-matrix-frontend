import { DATE_TIME_FORMAT } from '@/constant'

/**
 * 格式化日期为中文格式
 * @param dateString - 日期字符串
 * @param options - 格式化选项
 * @returns 格式化后的日期字符串
 * 
 * @example
 * ```typescript
 * formatDate('2024-01-15') // "2024年1月15日"
 * formatDate('2024-01-15', { year: 'numeric', month: 'short', day: 'numeric' }) // "2024年1月15日"
 * formatDate(null) // "-"
 * formatDate(undefined) // "-"
 * ```
 */
export function formatDate(
    dateString?: string | null,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
): string {
    if (!dateString) return '-';

    try {
        const date = new Date(dateString);
        // 检查日期是否有效
        if (isNaN(date.getTime())) {
            return '-';
        }
        return date.toLocaleDateString('zh-CN', options);
    } catch (error) {
        console.warn('日期格式化失败:', error);
        return '-';
    }
}

/**
 * 格式化日期为简短格式 (YYYY-MM-DD)
 * @param dateString - 日期字符串
 * @returns 格式化后的日期字符串
 * 
 * @example
 * ```typescript
 * formatDateShort('2024-01-15') // "2024-01-15"
 * formatDateShort('2024-12-25T15:30:00') // "2024-12-25"
 * formatDateShort(null) // "-"
 * ```
 */
export function formatDateShort(dateString?: string | null): string {
    return formatDate(dateString, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

/**
 * 格式化日期时间
 * @param dateString - 日期字符串
 * @returns 格式化后的日期时间字符串
 * 
 * @example
 * ```typescript
 * formatDateTime('2024-01-15T10:30:00') // "2024年1月15日 10:30"
 * formatDateTime('2024-12-25T15:45:30') // "2024年12月25日 15:45"
 * formatDateTime(null) // "-"
 * ```
 */
export function formatDateTime(dateString?: string | null): string {
    return formatDate(dateString, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * 获取相对时间描述 (例如: 刚刚、5分钟前、2小时前、3天前等)
 * @param dateString - 日期字符串
 * @returns 相对时间描述
 * 
 * @example
 * ```typescript
 * // 假设现在是 2024-01-15 12:00:00
 * formatRelativeTime('2024-01-15T11:59:30') // "刚刚"
 * formatRelativeTime('2024-01-15T11:55:00') // "5分钟前"
 * formatRelativeTime('2024-01-15T10:00:00') // "2小时前"
 * formatRelativeTime('2024-01-14T12:00:00') // "1天前"
 * formatRelativeTime('2023-12-15T12:00:00') // "2023年12月15日" (超过30天显示具体日期)
 * formatRelativeTime(null) // "-"
 * ```
 */
export function formatRelativeTime(dateString?: string | null): string {
    if (!dateString) return '-';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '-';
        }

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) {
            return '刚刚';
        } else if (diffMinutes < 60) {
            return `${diffMinutes}分钟前`;
        } else if (diffHours < 24) {
            return `${diffHours}小时前`;
        } else if (diffDays < 30) {
            return `${diffDays}天前`;
        } else {
            // 超过30天显示具体日期
            return formatDate(dateString);
        }
    } catch (error) {
        console.warn('相对时间格式化失败:', error);
        return '-';
    }
}

/**
 * 将日期格式化为一天的开始时间 (yyyy-MM-dd 00:00:00)
 * @param dateString - 日期字符串 (yyyy-MM-dd 格式)
 * @returns 格式化后的日期时间字符串
 * 
 * @example
 * ```typescript
 * formatToStartOfDay('2024-01-15') // "2024-01-15 00:00:00"
 * formatToStartOfDay('') // ""
 * ```
 */
export function formatToStartOfDay(dateString: string): string {
    if (!dateString) return ''
    return `${dateString} ${DATE_TIME_FORMAT.START_OF_DAY}`
}

/**
 * 将日期格式化为一天的结束时间 (yyyy-MM-dd 23:59:59)
 * @param dateString - 日期字符串 (yyyy-MM-dd 格式)
 * @returns 格式化后的日期时间字符串
 * 
 * @example
 * ```typescript
 * formatToEndOfDay('2024-01-15') // "2024-01-15 23:59:59"
 * formatToEndOfDay('') // ""
 * ```
 */
export function formatToEndOfDay(dateString: string): string {
    if (!dateString) return ''
    return `${dateString} ${DATE_TIME_FORMAT.END_OF_DAY}`
}