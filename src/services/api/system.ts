import http from "@/services/http.ts";

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