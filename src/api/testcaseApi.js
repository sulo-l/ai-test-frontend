import axios from "axios";

/**
 * ===============================
 * ✅ API_BASE（上线态最终方案）
 *
 * 前端永远只请求当前域名
 * 由 Nginx 负责把 /api → 转发到后端 :8000
 *
 * 不再使用：
 * - window.__ENV__
 * - REACT_APP_API_BASE
 * - IP / 端口
 * ===============================
 */
const API_BASE = "/api";

/**
 * ===============================
 * axios（普通 HTTP）
 * ===============================
 */
const api = axios.create({
    baseURL: API_BASE,
    timeout: 600000, // 10 分钟，适配大模型
});

/* ======================================================
 * Workflow（普通 HTTP 接口）
 * ====================================================== */

export async function createWorkflow() {
    const res = await api.post("/workflow/create");
    return res.data;
}

export async function fetchWorkflowStatus(workflowId) {
    const res = await api.get(`/workflow/status/${workflowId}`);
    return res.data;
}

export async function uploadPdfToWorkflow(workflowId, file) {
    const formData = new FormData();
    formData.append("workflow_id", workflowId);
    formData.append("file", file);

    const res = await api.post("/workflow/upload-pdf", formData);
    return res.data;
}

export async function analyzeWorkflow(workflowId) {
    const res = await api.post("/workflow/analyze", {
        workflow_id: workflowId,
    });
    return res.data;
}

export async function resetWorkflow(workflowId) {
    const res = await api.post(`/workflow/reset/${workflowId}`);
    return res.data;
}

/* ======================================================
 * ✅ SSE：测试用例生成（EventSource）
 * ====================================================== */

/**
 * ✅ requirement 统一转 string
 * 防止出现 [object Object]
 */
function normalizeRequirement(requirement) {
    if (requirement === null || requirement === undefined) return "";
    if (typeof requirement === "string") return requirement;

    if (typeof requirement === "object") {
        try {
            return JSON.stringify(requirement, null, 2);
        } catch {
            return String(requirement);
        }
    }

    return String(requirement);
}

export function generateTestcasesStream({
                                            workflowId,
                                            requirement = "",
                                            onMeta,
                                            onCase,
                                            onDone,
                                            onError,
                                        }) {
    if (!workflowId) {
        throw new Error("workflowId required");
    }

    const safeRequirement = normalizeRequirement(requirement);

    /**
     * ⚠️ 注意：
     * EventSource 不能用 axios
     * 必须是「同源 + GET」
     */
    const url =
        `/api/workflow/generate/stream` +
        `?workflow_id=${encodeURIComponent(workflowId)}` +
        `&requirement=${encodeURIComponent(safeRequirement)}`;

    console.log("[SSE] connect:", url);

    const es = new EventSource(url);

    es.addEventListener("meta", (e) => {
        try {
            onMeta?.(JSON.parse(e.data));
        } catch (err) {
            console.warn("meta parse failed", err);
        }
    });

    es.addEventListener("case", (e) => {
        try {
            onCase?.(JSON.parse(e.data));
        } catch (err) {
            console.warn("case parse failed", err);
        }
    });

    es.addEventListener("done", (e) => {
        try {
            onDone?.(JSON.parse(e.data));
        } catch (err) {
            console.warn("done parse failed", err);
        } finally {
            es.close();
        }
    });

    es.onerror = (err) => {
        console.error("[SSE error]", err);
        es.close();
        onError?.(err);
    };

    // 给 hook 用的关闭函数
    return () => {
        console.log("[SSE] close");
        es.close();
    };
}

/* ======================================================
 * 下载 Excel
 * ====================================================== */
export function downloadExcel(downloadUrl) {
    return api.get(downloadUrl, { responseType: "blob" });
}
