import { useState } from "react";
import { analyzeWorkflow } from "../api/testcaseApi";

/**
 * =========================================
 * useRequirementAnalysis（Workflow 版 · 稳定成品）
 *
 * 原则：
 * 1️⃣ 严格保留后端原始结构（不拍平、不删字段）
 * 2️⃣ 仅在前端做「安全兜底 + 派生字段」
 * 3️⃣ UI 用结构化数据，生成用例用纯文本
 * =========================================
 */
export default function useRequirementAnalysis({ workflowId }) {
    const [status, setStatus] = useState("idle");   // idle | running | done | error
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    /**
     * ===============================
     * 开始需求分析
     * ===============================
     */
    const start = async () => {
        if (!workflowId) {
            console.warn("⚠️ analyze skipped: no workflowId");
            return;
        }

        setStatus("running");
        setResult(null);
        setError(null);

        try {
            /**
             * analyzeWorkflow 可能返回：
             * 1️⃣ axios 响应：{ data: {...} }
             * 2️⃣ 直接 JSON：{ summary, requirements, issues, risks, suggestions }
             */
            const resp = await analyzeWorkflow(workflowId);
            const data = resp?.data ?? resp ?? {};

            /* ===============================
             * 原始结构兜底（不造内容）
             * =============================== */
            const summary =
                data.summary && typeof data.summary === "object"
                    ? data.summary
                    : null;

            const requirements = Array.isArray(data.requirements)
                ? data.requirements
                : [];

            const issues = Array.isArray(data.issues)
                ? data.issues
                : [];

            const risks = Array.isArray(data.risks)
                ? data.risks
                : [];

            const rawSuggestions = Array.isArray(data.suggestions)
                ? data.suggestions
                : [];

            /**
             * ===============================
             * ⭐ 前端 UI 友好的 suggestions
             *
             * - 不删除原字段
             * - 仅补齐 title / description
             * =============================== */
            const suggestions = rawSuggestions.map((item, idx) => {
                if (typeof item === "string") {
                    return {
                        id: `SUGGESTION-${idx + 1}`,
                        title: "改进建议",
                        description: item,
                        content: item,
                    };
                }

                if (item && typeof item === "object") {
                    const description =
                        item.content ||
                        item.text ||
                        item.description ||
                        "";

                    return {
                        ...item, // 保留 id / type / content 等原字段
                        title: item.type || "改进建议",
                        description,
                    };
                }

                return null;
            }).filter(Boolean);

            /**
             * ===============================
             * ⭐ 派生字段（生成用例专用）
             *
             * - 纯文本
             * - 顺序稳定
             * =============================== */
            const suggestionText = suggestions
                .map((item) => {
                    if (!item) return null;
                    return `- ${item.description}`;
                })
                .filter(Boolean)
                .join("\n");

            const normalizedResult = {
                summary,
                requirements,
                issues,
                risks,
                suggestions,        // ✅ UI 直接可用
                suggestionText,     // ✅ 生成测试用例用
            };

            setResult(normalizedResult);
            setStatus("done");

            return normalizedResult;
        } catch (e) {
            console.error("❌ Requirement analysis failed:", e);
            setError(e?.message || String(e));
            setStatus("error");
            throw e;
        }
    };

    /**
     * ===============================
     * 重置
     * ===============================
     */
    const reset = () => {
        setStatus("idle");
        setResult(null);
        setError(null);
    };

    return {
        status,   // idle | running | done | error
        result,   // { summary, requirements, issues, risks, suggestions, suggestionText }
        error,

        start,
        reset,
    };
}
