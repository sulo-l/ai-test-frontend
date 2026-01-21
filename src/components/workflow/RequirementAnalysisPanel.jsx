import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import AIThinkingPanel from "./AIThinkingPanel";
import RequirementSummaryCard from "./RequirementSummaryCard";
import RequirementIssueList from "./RequirementIssueList";

/**
 * ✅ RequirementAnalysisPanel（职责收敛版）
 * - 只负责展示分析结果
 * - 只抛「用户意图事件」
 * - ❌ 不参与任何生成行为
 */
export default function RequirementAnalysisPanel({
                                                     file,
                                                     status = "idle",
                                                     result,

                                                     // ✅ 两个“纯意图事件”
                                                     onGenerate, // 用户明确点击「生成测试用例」
                                                     onSkip,     // 用户明确点击「跳过分析」

                                                     appendRequirementRef,
                                                 }) {
    const { t } = useTranslation();

    /* ===============================
     * 分析结果安全取值
     * =============================== */
    const issues = Array.isArray(result?.issues) ? result.issues : [];
    const risks = Array.isArray(result?.risks) ? result.risks : [];
    const suggestions = Array.isArray(result?.suggestions)
        ? result.suggestions
        : [];

    /* ===============================
     * AI 改进建议文本（只用于展示 / 手动补充）
     * =============================== */
    const appendableTexts = useMemo(() => {
        return suggestions
            .map((s) => {
                if (!s || typeof s !== "object") return "";
                const text = s.description || s.content || "";
                if (!text) return "";
                return `${s.category ? `【${s.category}】` : ""}${text}`;
            })
            .filter(Boolean);
    }, [suggestions]);

    /* ===============================
     * 一键补充（不触发生成）
     * =============================== */
    const handleAppendToGenerator = () => {
        if (!appendRequirementRef?.current) return;
        if (!appendableTexts.length) return;

        appendRequirementRef.current(appendableTexts.join("\n"));
    };

    return (
        <div className="relative rounded-3xl p-8 bg-white border border-slate-200 dark:bg-[#020617]/80 dark:border-cyan-400/20">
            {/* ===== Header ===== */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    {t("analysis.title", "AI智能体需求分析")}
                </h2>
                <p className="text-sm text-slate-500">
                    {t(
                        "analysis.subtitle",
                        "AI智能体正在理解需求结构、发现风险并生成测试关注点"
                    )}
                </p>
            </div>

            {/* 文件信息 */}
            {file && (
                <div className="mb-6 text-sm text-slate-600">
                    📄 当前分析文档：{file.name}
                </div>
            )}

            {/* ===== 内容区 ===== */}
            <div className="min-h-[300px]">
                {status === "running" && <AIThinkingPanel />}

                {status === "done" && result && (
                    <div className="space-y-6">
                        <RequirementSummaryCard result={result} />

                        {(issues.length > 0 ||
                            risks.length > 0 ||
                            suggestions.length > 0) && (
                            <RequirementIssueList
                                issues={issues}
                                risks={risks}
                                suggestions={suggestions}
                            />
                        )}

                        {appendableTexts.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold mb-2">
                                    AI 改进建议（可补充）
                                </h3>

                                <ul className="list-disc pl-5 text-sm space-y-1">
                                    {appendableTexts.map((text, i) => (
                                        <li key={i}>{text}</li>
                                    ))}
                                </ul>

                                {appendRequirementRef?.current && (
                                    <button
                                        onClick={handleAppendToGenerator}
                                        className="mt-2 text-xs text-cyan-500"
                                    >
                                        一键补充到生成配置
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {status === "idle" && (
                    <div className="text-center py-16 text-slate-400 text-sm">
                        等待开始需求分析
                    </div>
                )}
            </div>

            {/* ================= 操作区 ================= */}
            <div className="mt-10 flex gap-3">
                <button
                    onClick={() => onGenerate?.(result)}
                    disabled={status !== "done"}
                    className={`
            flex-1 h-12 rounded-xl font-semibold
            bg-gradient-to-r from-cyan-400 to-indigo-500
            ${
                        status !== "done"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }
          `}
                >
                    生成测试用例
                </button>

                {status !== "running" && (
                    <button
                        onClick={onSkip}
                        className="
              h-12 px-6 rounded-xl
              border border-slate-300
              text-slate-600
              hover:bg-slate-50
              transition
            "
                    >
                        跳过分析
                    </button>
                )}
            </div>
        </div>
    );
}
