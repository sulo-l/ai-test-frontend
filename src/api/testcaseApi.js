import axios from "axios";

/**
 * API_BASE 读取优先级（从高到低）：
 * 1?? window.__ENV__.API_BASE   （Docker / 生产运行时）
 * 2?? import.meta.env.VITE_API_BASE（本地 / build 时）
 * 3?? 空字符串（走 nginx 反向代理 /api）
 */
const API_BASE =
    window.__ENV__?.API_BASE ||
    import.meta.env.VITE_API_BASE ||
    "";

/**
 * 统一 axios 实例
 */
const api = axios.create({
    baseURL: API_BASE,
    timeout: 600000, // 生成用例 + 解析 PDF 都可能比较慢
});

/**
 * 解析 PDF
 * POST /parse-pdf
 */
export function parsePdf(file) {
    const form = new FormData();
    form.append("file", file);

    return api.post("/parse-pdf", form, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

/**
 * 生成测试用例并下载 Excel
 * POST /generate-testcases
 */
export function generateTestcases(formData, onDownloadProgress) {
    return api.post("/generate-testcases", formData, {
        responseType: "blob",
        timeout: 180000,
        onDownloadProgress,
    });
}
