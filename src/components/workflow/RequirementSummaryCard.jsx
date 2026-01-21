import { useTranslation } from "react-i18next";

/**
 * ✅ 兼容后端真实返回结构的 Summary Card
 *
 * 后端结构：
 * {
 *   summary: { quality: number, comment: string },
 *   issues: string[],
 *   risks: string[]
 * }
 */
export default function RequirementSummaryCard({ result = {} }) {
    const { t } = useTranslation();

    const summary = result.summary || {};
    const issues = Array.isArray(result.issues) ? result.issues : [];
    const risks = Array.isArray(result.risks) ? result.risks : [];

    // ===============================
    // ✅ 需求质量评分
    // ===============================
    const score =
        typeof summary.quality === "number"
            ? summary.quality
            : null;

    // ===============================
    // ✅ 可测试性（前端派生）
    // ===============================
    const testability =
        issues.length === 0
            ? t("analysis.testability.high", "高")
            : issues.length <= 2
                ? t("analysis.testability.medium", "中")
                : t("analysis.testability.low", "低");

    // ===============================
    // ✅ 风险等级（前端派生）
    // ===============================
    const riskLevel =
        risks.length === 0
            ? t("analysis.risk.low", "低")
            : risks.length <= 2
                ? t("analysis.risk.medium", "中")
                : t("analysis.risk.high", "高");

    // ===============================
    // 🎨 颜色逻辑
    // ===============================
    const scoreColor =
        score === null
            ? "text-slate-400"
            : score >= 80
                ? "text-emerald-500"
                : score >= 60
                    ? "text-amber-500"
                    : "text-red-500";

    const riskColor =
        riskLevel.includes("高")
            ? "text-red-500"
            : riskLevel.includes("中")
                ? "text-amber-500"
                : "text-emerald-500";

    return (
        <div
            className="
        rounded-2xl
        p-5
        border
        bg-white
        border-slate-200
        dark:bg-[#020617]/60
        dark:border-cyan-400/20
      "
        >
            <h3 className="text-sm font-semibold mb-4 text-slate-900 dark:text-slate-100">
                {t("analysis.summary.title", "需求评审结论")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* ===== 需求质量 ===== */}
                <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        {t("analysis.summary.score", "需求质量")}
                    </div>
                    <div className={`text-2xl font-bold ${scoreColor}`}>
                        {score !== null ? score : "--"}
                        <span className="text-sm font-normal text-slate-400 ml-1">
                            /100
                        </span>
                    </div>
                </div>

                {/* ===== 可测试性 ===== */}
                <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        {t("analysis.summary.testability", "可测试性")}
                    </div>
                    <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        {testability}
                    </div>
                </div>

                {/* ===== 风险等级 ===== */}
                <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        {t("analysis.summary.risk", "风险等级")}
                    </div>
                    <div className={`text-lg font-semibold ${riskColor}`}>
                        {riskLevel}
                    </div>
                </div>
            </div>

            {/* ===== AI 评语（可选展示）===== */}
            {summary.comment && (
                <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                    {summary.comment}
                </div>
            )}
        </div>
    );
}
