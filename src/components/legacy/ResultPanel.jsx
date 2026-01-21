import { useTranslation } from "react-i18next";

export default function ResultPanel({
                                        cases = [],
                                        status = "idle",
                                        hasAnyOutput = false,
                                    }) {
    const { t } = useTranslation();

    // ===============================
    // 1️⃣ 尚未开始
    // ===============================
    if (status === "idle") {
        return (
            <div className="text-zinc-400 text-center mt-40">
                {t("result.idle", "暂无生成结果")}
            </div>
        );
    }

    // ===============================
    // 2️⃣ 生成中，且尚无任何结果
    // ===============================
    if (status === "running" && !hasAnyOutput) {
        return (
            <div className="mt-24 flex flex-col items-center text-zinc-500 gap-2">
                <div className="animate-pulse text-sm">
                    {t("result.running.title", "正在生成测试用例")}
                </div>
                <div className="text-xs text-zinc-400">
                    {t("result.running.subtitle", "请耐心等待，这可能需要几分钟")}
                </div>
            </div>
        );
    }

    // ===============================
    // 3️⃣ 已完成但无用例（兜底）
    // ===============================
    if (status === "done" && cases.length === 0) {
        return (
            <div className="mt-24 text-center text-red-400 text-sm">
                {t("result.empty", "未生成任何测试用例")}
            </div>
        );
    }

    // ===============================
    // 4️⃣ 正常展示（支持 running + partial）
    // ===============================
    return (
        <div className="space-y-4">
            {/* running 且已有结果时的提示 */}
            {status === "running" && hasAnyOutput && (
                <div className="text-xs text-zinc-400 mb-2">
                    {t("result.running.partial", "已生成部分用例，仍在继续…")}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cases.map((tc, idx) => {
                    const name = tc["用例名称"] || `测试用例 ${idx + 1}`;
                    const module = tc["所属模块"] || "-";
                    const tags = tc["标签"];
                    const pre = tc["前置条件"] || "-";
                    const steps = tc["步骤描述"] || "-";
                    const expected = tc["预期结果"] || "-";

                    return (
                        <div
                            key={`${name}-${idx}`}
                            className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm"
                        >
                            <div className="font-semibold mb-2">
                                {name}
                            </div>

                            <div className="text-xs text-zinc-500 mb-2">
                                {t("result.module", "模块")}：{module}
                                {" ｜ "}
                                {t("result.tags", "标签")}：
                                {Array.isArray(tags)
                                    ? tags.join("，")
                                    : tags || "-"}
                            </div>

                            <div className="text-sm space-y-2">
                                <div>
                  <span className="font-semibold">
                    {t("result.precondition", "前置条件")}：
                  </span>
                                    <span className="text-zinc-700">
                    {pre}
                  </span>
                                </div>

                                <div className="whitespace-pre-wrap">
                  <span className="font-semibold">
                    {t("result.steps", "步骤")}：
                  </span>
                                    <span className="text-zinc-700">
                    {steps}
                  </span>
                                </div>

                                <div className="whitespace-pre-wrap">
                  <span className="font-semibold text-emerald-700">
                    {t("result.expected", "预期结果")}：
                  </span>
                                    <span className="text-emerald-700">
                    {expected}
                  </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
